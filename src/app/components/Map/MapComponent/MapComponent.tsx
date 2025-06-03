'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import type { LatLngExpression } from 'leaflet';
import Image from 'next/image';

// Configuração do ícone padrão do Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ícones personalizados por nível de risco
const getIconForRiskLevel = (nivel: 'Alto' | 'Médio' | 'Baixo') => {
  const icons = {
    'Alto': '/risco_alto.png',
    'Médio': '/risco_medio.png',
    'Baixo': '/risco_baixo.png'
  };
  
  return new L.Icon({
    iconUrl: icons[nivel],
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Definir interface para os alertas do INMET
interface AlertaINMET {
  id: number;
  data_inicio: string;
  data_fim: string;
  municipios: string;
  poligono: string;
  severidade: string;
  descricao: string;
}

// Interface para os pontos no mapa
interface PontoDeRisco {
  id: number;
  latitude: number;
  longitude: number;
  nivel: 'Alto' | 'Médio' | 'Baixo';
  descricao: string;
  inicio: string;
  fim: string;
  uf: string;
  municipio: string;
}

// Mapeamento de coordenadas por UF (fallback)
const UF_COORDENADAS: Record<string, [number, number]> = {
  'AC': [-8.77, -70.55],
  'AL': [-9.62, -36.82],
  'AP': [1.41, -51.77],
  'AM': [-3.47, -65.10],
  'BA': [-13.29, -41.71],
  'CE': [-5.20, -39.53],
  'DF': [-15.78, -47.93],
  'ES': [-19.19, -40.34],
  'GO': [-15.98, -49.86],
  'MA': [-5.42, -45.44],
  'MT': [-12.64, -55.42],
  'MS': [-20.51, -54.54],
  'MG': [-18.10, -44.38],
  'PA': [-3.79, -52.48],
  'PB': [-7.28, -36.72],
  'PR': [-24.89, -51.55],
  'PE': [-8.38, -37.86],
  'PI': [-6.60, -42.28],
  'RJ': [-22.25, -42.66],
  'RN': [-5.81, -36.59],
  'RS': [-30.17, -53.50],
  'RO': [-10.83, -63.34],
  'RR': [1.99, -61.33],
  'SC': [-27.45, -50.95],
  'SP': [-22.19, -48.79],
  'SE': [-10.57, -37.45],
  'TO': [-9.46, -48.26],
};

// Centro aproximado do Brasil
const center: LatLngExpression = [-15.788, -47.929];

// Função para extrair UF do campo municipios
const extrairUF = (municipios: string | undefined): string => {
  if (!municipios) return 'BR';
  const matches = municipios.match(/ - ([A-Z]{2})/g);
  return matches?.[0]?.replace(' - ', '') || 'BR';
};

// Função para extrair o primeiro município
const extrairPrimeiroMunicipio = (municipios: string | undefined): string => {
  if (!municipios) return 'Local não especificado';
  const primeiro = municipios.split(',')[0].trim();
  return primeiro.split(' - ')[0].trim();
};

// Função simplificada para calcular centroide
const calcularCentroide = (poligono: string | undefined): [number, number] | null => {
  if (!poligono) return null;
  
  try {
    const geoJson = JSON.parse(poligono);
    
    if (geoJson.type === 'Polygon' && geoJson.coordinates?.length > 0) {
      const coordenadas = geoJson.coordinates[0];
      const primeiroPonto = coordenadas[0];
      return [primeiroPonto[1], primeiroPonto[0]]; // [lat, lng]
    }
    
    if (geoJson.type === 'MultiPolygon' && geoJson.coordinates?.length > 0) {
      const primeiroAnel = geoJson.coordinates[0][0];
      const primeiroPonto = primeiroAnel[0];
      return [primeiroPonto[1], primeiroPonto[0]]; // [lat, lng]
    }
  } catch (e) {
    console.error('Erro ao processar polígono:', e);
  }
  return null;
};

const parseRSSItem = (item: Element): AlertaINMET => {
  const description = item.querySelector('description')?.textContent || '';
  const tableMatch = description.match(/<table[^>]*>([\s\S]*?)<\/table>/);
  const tableContent = tableMatch ? tableMatch[1] : '';
  
  // Extract data from table rows
  const getTableValue = (label: string): string => {
    const regex = new RegExp(`<tr>\\s*<th[^>]*>${label}<\/th>\\s*<td>([^<]*)<\/td>\\s*<\/tr>`);
    const match = tableContent.match(regex);
    return match ? match[1].trim() : '';
  };

  return {
    id: parseInt(item.querySelector('guid')?.textContent?.split('/').pop() || '0'),
    data_inicio: getTableValue('Início'),
    data_fim: getTableValue('Fim'),
    municipios: getTableValue('Área'),
    poligono: '', // RSS feed doesn't provide polygon data
    severidade: getTableValue('Severidade'),
    descricao: getTableValue('Descrição')
  };
};

export default function MapComponent() {
  const [mounted, setMounted] = useState(false);
  const [pontos, setPontos] = useState<PontoDeRisco[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(center);

  // Função para determinar nível de risco (simplificada)
  const getNivelRisco = (severidade: string): 'Alto' | 'Médio' | 'Baixo' => {
    if (!severidade) return 'Baixo';
    if (severidade.toLowerCase().includes('perigo')) return 'Alto';
    if (severidade.toLowerCase().includes('atenção')) return 'Médio';
    return 'Baixo';
  };

  useEffect(() => {
    setMounted(true);

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/inmet-alertas');
        
        if (!res.ok) {
          throw new Error(`Erro na API: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Dados recebidos:', data);
        
        const alertas: AlertaINMET[] = [
          ...(data[0]?.hoje || []),
          ...(data[0]?.futuro || [])
        ];
        console.log('Alertas recebidos:', alertas);
        console.log('Alertas encontrados:', alertas.length);
        
        const transformados: PontoDeRisco[] = [];
        
        // Add test point
        transformados.push({
          id: 999999,
          latitude: -23.5505,
          longitude: -46.6333,
          nivel: 'Alto',
          descricao: 'Teste manual SP',
          inicio: '2025-06-03 10:00',
          fim: '2025-06-04 10:00',
          uf: 'SP',
          municipio: 'São Paulo'
        });
        
        for (const alerta of alertas) {
          const uf = extrairUF(alerta.municipios);
          const municipio = extrairPrimeiroMunicipio(alerta.municipios);
          const centroide = calcularCentroide(alerta.poligono);
          
          if (centroide) {
            transformados.push({
              id: alerta.id,
              latitude: centroide[0],
              longitude: centroide[1],
              nivel: getNivelRisco(alerta.severidade),
              descricao: alerta.descricao || `Alerta para ${municipio} e região`,
              inicio: alerta.data_inicio,
              fim: alerta.data_fim,
              uf,
              municipio
            });
          } else if (UF_COORDENADAS[uf]) {
            transformados.push({
              id: alerta.id,
              latitude: UF_COORDENADAS[uf][0],
              longitude: UF_COORDENADAS[uf][1],
              nivel: getNivelRisco(alerta.severidade),
              descricao: alerta.descricao || `Alerta para ${municipio} e região`,
              inicio: alerta.data_inicio,
              fim: alerta.data_fim,
              uf,
              municipio
            });
          } else {
            console.warn(`Não foi possível obter coordenadas para alerta ${alerta.id || 'desconhecido'}`);
          }
        }
        
        console.log('Pontos transformados:', transformados);
        setPontos(transformados);
        
        // Se tivermos pontos, centralizar no primeiro
        if (transformados.length > 0) {
          setMapCenter([transformados[0].latitude, transformados[0].longitude]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Erro ao processar alertas:', err);
        setError('Falha ao carregar alertas meteorológicos');
        setPontos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Verificar se temos dados para mostrar
  useEffect(() => {
    if (pontos.length > 0) {
      console.log('Marcadores devem estar visíveis:', pontos);
    }
  }, [pontos]);

  if (!mounted) {
    return <div className="w-full h-full bg-gray-100 animate-pulse" />;
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-3 text-gray-600">Carregando alertas meteorológicos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50">
        <div className="text-center p-4 max-w-md">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-medium text-red-800">Erro ao carregar dados</h3>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer 
        center={mapCenter} 
        zoom={7} 
        style={{ height: '100%', width: '100%' }}
        minZoom={4}
        maxBounds={[[-35, -75], [5, -30]]}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {pontos.length === 0 ? (
          <div className="leaflet-top leaflet-left">
            <div className="leaflet-control leaflet-bar bg-white p-4 rounded shadow">
              <p className="text-gray-700">Nenhum alerta encontrado no momento</p>
            </div>
          </div>
        ) : (
          pontos.map((ponto) => (
            <Marker
              key={`${ponto.id}-${ponto.latitude}-${ponto.longitude}`}
              position={[ponto.latitude, ponto.longitude]}
              icon={getIconForRiskLevel(ponto.nivel)}
            >
              <Popup>
                <div className="min-w-[250px]">
                  <h3 className="font-bold text-lg text-gray-800">
                    {ponto.municipio} - {ponto.uf}
                  </h3>
                  <div className={`mt-1 px-2 py-1 inline-block rounded text-sm font-medium ${
                    ponto.nivel === 'Alto' ? 'bg-red-100 text-red-800' : 
                    ponto.nivel === 'Médio' ? 'bg-orange-100 text-orange-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    Risco: {ponto.nivel}
                  </div>
                  <p className="mt-2 text-gray-700">{ponto.descricao}</p>
                  
                  <div className="mt-3 grid grid-cols-2 gap-1 text-sm">
                    <span className="font-medium">Início:</span>
                    <span>{new Date(ponto.inicio).toLocaleString('pt-BR')}</span>
                    
                    <span className="font-medium">Fim:</span>
                    <span>{new Date(ponto.fim).toLocaleString('pt-BR')}</span>
                    
                    <span className="font-medium">Coordenadas:</span>
                    <span>{ponto.latitude.toFixed(4)}, {ponto.longitude.toFixed(4)}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>
      
      <div className="absolute bottom-4 left-4 z-[1000] bg-white p-3 rounded-lg shadow-md">
        <div className="flex items-center space-x-2 mb-2">
          <Image src="/risco_alto.png" alt="Alto risco" width={100} height={100} className="w-6 h-6" />
          <span>Perigo Potencial</span>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <Image src="/risco_medio.png" alt="Médio risco" width={100} height={100} className="w-6 h-6" />
          <span>Atenção</span>
        </div>
        <div className="flex items-center space-x-2">
          <Image src="/risco_baixo.png" alt="Baixo risco" width={100} height={100} className="w-6 h-6" />
          <span>Observação</span>
        </div>
      </div>
    </div>
  );
}
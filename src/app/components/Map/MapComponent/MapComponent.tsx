'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import type { LatLngExpression } from 'leaflet';

// Configuração do ícone padrão do Leaflet
const DefaultIcon = L.Icon.Default as unknown as {
  prototype: { _getIconUrl?: unknown };
  mergeOptions: (options: { iconUrl: string; shadowUrl: string }) => void;
};

delete DefaultIcon.prototype._getIconUrl;

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

// Interface para os dados da API
interface AlertaAPI {
  id: number;
  data_inicio: string;
  data_fim: string;
  municipios: string;
  poligono: string;
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
const extrairUF = (municipios: string): string => {
  const regex = / - ([A-Z]{2}) /;
  const match = municipios.match(regex);
  return match ? match[1] : 'BR';
};

// Função para extrair o primeiro município
const extrairPrimeiroMunicipio = (municipios: string): string => {
  const primeiro = municipios.split(',')[0].trim();
  return primeiro.split(' - ')[0].trim();
};

// Função para calcular centroide do polígono
const calcularCentroide = (poligono: string): [number, number] | null => {
  try {
    const geoJson = JSON.parse(poligono);
    
    if (geoJson.type === 'Polygon' && geoJson.coordinates?.length > 0) {
      const coordenadas = geoJson.coordinates[0];
      let latTotal = 0;
      let lngTotal = 0;
      
      for (const coord of coordenadas) {
        const [lng, lat] = coord;
        latTotal += lat;
        lngTotal += lng;
      }
      
      return [
        latTotal / coordenadas.length,
        lngTotal / coordenadas.length
      ];
    }
    
    // Tratar MultiPolygon se necessário
    if (geoJson.type === 'MultiPolygon' && geoJson.coordinates?.length > 0) {
      const todasCoordenadas = geoJson.coordinates.flat(1);
      const coordenadas = todasCoordenadas[0];
      let latTotal = 0;
      let lngTotal = 0;
      
      for (const coord of coordenadas) {
        const [lng, lat] = coord;
        latTotal += lat;
        lngTotal += lng;
      }
      
      return [
        latTotal / coordenadas.length,
        lngTotal / coordenadas.length
      ];
    }
  } catch (e) {
    console.error('Erro ao processar polígono:', e);
  }
  return null;
};

export default function MapComponent() {
  const [mounted, setMounted] = useState(false);
  const [pontos, setPontos] = useState<PontoDeRisco[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para determinar nível de risco
  const getNivelRisco = (): 'Alto' | 'Médio' | 'Baixo' => {
    // Implemente sua lógica real aqui quando tiver dados
    return 'Médio'; // Valor padrão
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
        const alertas: AlertaAPI[] = data.hoje || [];
        
        const transformados: PontoDeRisco[] = [];
        
        for (const alerta of alertas) {
          const uf = extrairUF(alerta.municipios);
          const municipio = extrairPrimeiroMunicipio(alerta.municipios);
          const centroide = calcularCentroide(alerta.poligono);
          
          if (centroide) {
            transformados.push({
              id: alerta.id,
              latitude: centroide[0],
              longitude: centroide[1],
              nivel: getNivelRisco(),
              descricao: `Alerta para ${municipio} e região`,
              inicio: alerta.data_inicio,
              fim: alerta.data_fim,
              uf,
              municipio
            });
          }
          // Fallback para coordenadas da UF
          else if (UF_COORDENADAS[uf]) {
            transformados.push({
              id: alerta.id,
              latitude: UF_COORDENADAS[uf][0],
              longitude: UF_COORDENADAS[uf][1],
              nivel: getNivelRisco(),
              descricao: `Alerta para ${municipio} e região`,
              inicio: alerta.data_inicio,
              fim: alerta.data_fim,
              uf,
              municipio
            });
          }
        }
        
        setPontos(transformados);
        setError(null);
      } catch (err) {
        console.error('Erro ao processar alertas:', err);
        setError('Falha ao carregar alertas meteorológicos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
        center={center} 
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
        minZoom={4}
        maxBounds={[[-35, -75], [5, -30]]}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {pontos.map((ponto) => (
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
                  <span>{new Date(ponto.inicio).toLocaleString()}</span>
                  
                  <span className="font-medium">Fim:</span>
                  <span>{new Date(ponto.fim).toLocaleString()}</span>
                  
                  <span className="font-medium">Coordenadas:</span>
                  <span>{ponto.latitude.toFixed(4)}, {ponto.longitude.toFixed(4)}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div className="absolute bottom-4 left-4 z-[1000] bg-white p-3 rounded-lg shadow-md">
        <div className="flex items-center space-x-2 mb-2">
          <img src="/risco_alto.png" alt="Alto risco" className="w-6 h-6" />
          <span>Perigo Potencial</span>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <img src="/risco_medio.png" alt="Médio risco" className="w-6 h-6" />
          <span>Atenção</span>
        </div>
        <div className="flex items-center space-x-2">
          <img src="/risco_baixo.png" alt="Baixo risco" className="w-6 h-6" />
          <span>Observação</span>
        </div>
      </div>
    </div>
  );
}
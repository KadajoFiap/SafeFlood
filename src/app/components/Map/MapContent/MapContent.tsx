'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useRef } from 'react';
import type { LatLngExpression } from 'leaflet';
import Image from 'next/image';
import { AlertaINMET, PontoDeRisco } from '@/app/utils/types';
import {
  center,
  configureDefaultIcon,
  getIconForRiskLevel,
  extrairUF,
  extrairPrimeiroMunicipio,
  calcularCentroide,
  getNivelRisco,
  UF_COORDENADAS
} from '@/app/utils/mapUtils';

// Corrige o ícone padrão do marker para funcionar no Next.js usando imagens da public
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

interface AlertaLocal {
  id: number;
  titulo: string;
  descricao: string;
  nivelRisco: 'Alto' | 'Médio' | 'Baixo';
  dataInicio: string;
  dataFim: string;
  latitude: number;
  longitude: number;
  uf: string;
  municipio: string;
  usuario: {
    id: number;
    nomeUsuario: string;
    email: string;
    tipoUsuario: string;
  };
}

// Função utilitária para retornar o ícone conforme o nível de risco
export function getRiscoIcon(nivelRisco: string) {
  let iconUrl = '/risco_baixo.png';
  if (nivelRisco === 'ALTO') iconUrl = '/risco_alto.png';
  else if (nivelRisco === 'MEDIO') iconUrl = '/risco_medio.png';
  return new L.Icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowUrl: undefined,
  });
}

export default function MapComponent() {
  const [mounted, setMounted] = useState(false);
  const [pontosINMET, setPontosINMET] = useState<PontoDeRisco[]>([]);
  const [alertasLocais, setAlertasLocais] = useState<AlertaLocal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(center);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchINMETData = async () => {
      try {
        const res = await fetch('/api/inmet-alertas');

        if (!res.ok) {
          throw new Error(`Erro na API INMET: ${res.status}`);
        }

        const data = await res.json();
        console.log('Dados INMET recebidos:', data);

        const alertas: AlertaINMET[] = [
          ...(data[0]?.hoje || []),
          ...(data[0]?.futuro || [])
        ];

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
          }
        }

        setPontosINMET(transformados);
        setError(null);
      } catch (err) {
        console.error('Erro ao processar alertas INMET:', err);
        setError('Falha ao carregar alertas meteorológicos');
        setPontosINMET([]);
      }
    };

    const fetchLocalData = async () => {
      try {
        const response = await fetch('/api/alertas', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('idToken')}`
          }
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar alertas locais');
        }

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
          // Limpa as referências circulares
          const cleanData = data.map((alerta: any) => ({
            id: alerta.id,
            titulo: alerta.titulo,
            descricao: alerta.descricao,
            nivelRisco: alerta.nivelRisco,
            dataInicio: alerta.dataInicio,
            dataFim: alerta.dataFim,
            latitude: alerta.latitude,
            longitude: alerta.longitude,
            uf: alerta.uf,
            municipio: alerta.municipio,
            usuario: {
              id: alerta.usuario?.id,
              nomeUsuario: alerta.usuario?.nomeUsuario,
              email: alerta.usuario?.email,
              tipoUsuario: alerta.usuario?.tipoUsuario
            }
          }));
          console.log('Alertas locais carregados:', cleanData);
          setAlertasLocais(cleanData);
        } catch (parseError) {
          console.error('Erro ao fazer parse do JSON:', text);
          throw new Error('Resposta inválida do servidor');
        }
      } catch (err) {
        console.error('Erro ao carregar alertas locais:', err);
        setError('Falha ao carregar alertas locais');
        setAlertasLocais([]);
      }
    };

    const fetchAllData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchINMETData(), fetchLocalData()]);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Falha ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    const interval = setInterval(fetchAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [mounted]);

  // Efeito para atualizar o centro do mapa quando os pontos mudarem
  useEffect(() => {
    const totalPontos = [...pontosINMET, ...alertasLocais];
    if (totalPontos.length > 0) {
      setMapCenter([totalPontos[0].latitude, totalPontos[0].longitude]);
    }
  }, [pontosINMET, alertasLocais]);

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-3 text-gray-600">Carregando alertas...</p>
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

  const totalPontos = [...pontosINMET, ...alertasLocais];

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        minZoom={4}
        maxBounds={[[-35, -75], [5, -30]]}
        attributionControl={false}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {totalPontos.length === 0 ? (
          <div className="leaflet-top leaflet-left">
            <div className="leaflet-control leaflet-bar bg-white p-4 rounded shadow">
              <p className="text-gray-700">Nenhum alerta encontrado no momento</p>
            </div>
          </div>
        ) : (
          <>
            {/* Marcadores INMET */}
            {pontosINMET.map((ponto, idx) => (
              <Marker
                key={`inmet-${ponto.id}-${idx}`}
                position={[ponto.latitude, ponto.longitude]}
                icon={getIconForRiskLevel(ponto.nivel)}
              >
                <Popup>
                  <div className="min-w-[250px]">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium mb-2">
                      Alerta INMET
                    </div>
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
            ))}

            {/* Marcadores Locais */}
            {alertasLocais.map((alerta, idx) => (
              <Marker
                key={`local-${alerta.id}-${idx}`}
                position={[alerta.latitude, alerta.longitude]}
                icon={getRiscoIcon(alerta.nivelRisco)}
              >
                <Popup>
                  <div className="min-w-[250px]">
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium mb-2">
                      Alerta Local
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {alerta.municipio} - {alerta.uf}
                    </h3>
                    <div className={`mt-1 px-2 py-1 inline-block rounded text-sm font-medium ${
                      alerta.nivelRisco === 'Alto' ? 'bg-red-100 text-red-800' :
                      alerta.nivelRisco === 'Médio' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      Risco: {alerta.nivelRisco}
                    </div>
                    <p className="mt-2 text-gray-700">{alerta.descricao}</p>

                    <div className="mt-3 grid grid-cols-2 gap-1 text-sm">
                      <span className="font-medium">Início:</span>
                      <span>{new Date(alerta.dataInicio).toLocaleString('pt-BR')}</span>

                      <span className="font-medium">Fim:</span>
                      <span>{new Date(alerta.dataFim).toLocaleString('pt-BR')}</span>

                      <span className="font-medium">Coordenadas:</span>
                      <span>{alerta.latitude.toFixed(4)}, {alerta.longitude.toFixed(4)}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </>
        )}
      </MapContainer>

      <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
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
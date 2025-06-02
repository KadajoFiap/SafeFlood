'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import type { LatLngExpression } from 'leaflet';

// Corrige os ícones padrão
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

interface PontoDeRisco {
  id: number;
  latitude: number;
  longitude: number;
  nivel: 'Alto' | 'Médio' | 'Baixo';
}

const pontosDeRisco: PontoDeRisco[] = [
  { id: 1, latitude: -23.5505, longitude: -46.6333, nivel: 'Alto' },
  { id: 2, latitude: -23.5499, longitude: -46.6388, nivel: 'Médio' },
  { id: 3, latitude: -23.5512, longitude: -46.6301, nivel: 'Baixo' },
];

const center: LatLngExpression = [-23.5505, -46.6333];

export default function MapComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Protege o mapa do SSR
  if (!mounted) {
    return <div style={{ width: '100%', height: '100%' }} />;
  }

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%', zIndex: 1, position: 'relative' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pontosDeRisco.map((ponto) => (
        <Marker
          key={ponto.id}
          position={[ponto.latitude, ponto.longitude]}
        >
          <Popup>Risco: {ponto.nivel}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

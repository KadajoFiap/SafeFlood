'use client';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapContent/MapContent'), {
  ssr: false,
  loading: () => <div style={{ height: '500px', width: '100%', background: '#f0f0f0' }}>Carregando mapa...</div>
});

export default function Map() {
  return <MapComponent />;
}
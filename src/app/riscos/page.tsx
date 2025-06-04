'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map/MapComponent/MapComponent'), {
    ssr: false,
    loading: () => <p>Carregando mapa...</p>
});

export default function Riscos() {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-[#132536]">
            <div
                className="relative z-10 rounded-lg shadow-lg border-2 border-[#F5FAFF] overflow-hidden"
                style={{ width: '90vw', maxWidth: 1200, height: 600, background: '#fff' }}
            >
                <div style={{ width: '100%', height: '100%' }}>
                    <Map />
                </div>
            </div>
        </div>
    )
}

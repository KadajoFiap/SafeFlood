'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../Map/Map'), {
    ssr: false,
    loading: () => <p>Carregando mapa...</p>
});


export default function MapHomepage() {
    return (
        <div className="w-full min-h-screen bg-[#132536] pt-24 pb-8 flex flex-col items-center px-8 md:px-4">
            <h1 className="text-4xl font-bold text-[#F5FAFF] mb-20 text-center">
                Mapa de Riscos de Enchentes
            </h1>
            <div
                className="relative z-10 rounded-lg shadow-lg border-2 border-[#F5FAFF] overflow-hidden"
                style={{ width: '90vw', maxWidth: 1200, height: 600, background: '#fff' }}
            >
                <Map />
            </div>
        </div>
    );
} 
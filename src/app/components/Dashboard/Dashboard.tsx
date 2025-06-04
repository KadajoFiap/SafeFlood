'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { transformarAlertas, PontoDeRisco } from '@/app/utils/transformarAlertas';

const Map = dynamic(() => import('../Map/MapContent/MapContent'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-3 text-gray-600">Carregando mapa...</p>
            </div>
        </div>
    )
});

import DashboardContent from "./DashboardContent/DashboardContent";

export default function Dashboard() {
    const [mounted, setMounted] = useState(false);
    const [pontos, setPontos] = useState<PontoDeRisco[]>([]);

    useEffect(() => {
        setMounted(true);
        async function fetchData() {
            const res = await fetch('/api/inmet-alertas');
            const data = await res.json();
            setPontos(transformarAlertas(data));
        }
        fetchData();
    }, []);

    if (!mounted) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-3 text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-start justify-center w-full h-full p-4">
            <div className="flex gap-4 w-full max-w-[1200px]">
                {/* Mapa */}
                <div className="flex-1">
                    <div
                        className="relative z-10 rounded-lg shadow-lg border-2 border-[#F5FAFF] overflow-hidden"
                        style={{ height: 'calc(100vh - 15rem)', background: '#fff' }}
                    >
                        <div style={{ width: '100%', height: '100%' }}>
                            {mounted && <Map />}
                        </div>
                    </div>
                </div>

                {/* Dashboard Sidebar */}
                <div className="w-[350px] overflow-y-auto" style={{ height: 'calc(100vh - 15rem)' }}>
                    <DashboardContent pontos={pontos} />
                </div>
            </div>
        </div>
    )
}
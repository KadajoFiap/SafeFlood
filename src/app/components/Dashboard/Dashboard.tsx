'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { transformarAlertas, PontoDeRisco } from '@/app/utils/transformarAlertas';
import AddAlerta from '../Map/AddAlerta/AddAlerta';

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
}

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
    const [pontosINMET, setPontosINMET] = useState<PontoDeRisco[]>([]);
    const [alertasLocais, setAlertasLocais] = useState<AlertaLocal[]>([]);

    useEffect(() => {
        setMounted(true);
        async function fetchData() {
            try {
                // Busca alertas INMET
                const inmetRes = await fetch('/api/inmet-alertas');
                const inmetData = await inmetRes.json();
                setPontosINMET(transformarAlertas(inmetData));

                // Busca alertas locais
                const localRes = await fetch('https://safeflood-api-java.onrender.com/alertas', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('idToken')}`
                    }
                });
                if (localRes.ok) {
                    const localData = await localRes.json();
                    setAlertasLocais(localData);
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
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
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-[1200px]">
                {/* Dashboard Sidebar */}
                <div className="w-full md:w-[350px] order-1 md:order-2 overflow-y-auto" style={{ height: 'calc(100vh - 15rem)' }}>
                    <DashboardContent pontos={[...pontosINMET, ...alertasLocais]} />
                </div>
                {/* Mapa */}
                <div className="flex-1 order-2 md:order-1">
                    <div
                        className="relative z-10 rounded-lg shadow-lg border-2 border-[#F5FAFF] overflow-hidden"
                        style={{ height: 'calc(100vh - 15rem)', background: '#fff' }}
                    >
                        <div style={{ width: '100%', height: '100%' }}>
                            {mounted && <Map />}
                        </div>
                        <div className="absolute top-4 right-4 z-[1000]">
                            <AddAlerta />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
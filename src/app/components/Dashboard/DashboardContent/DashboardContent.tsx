'use client';
import { useState } from 'react';
import { PontoDeRisco, AlertaINMET } from '@/app/utils/types';

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

type Alerta = PontoDeRisco | AlertaLocal | AlertaINMET;

interface DashboardContentProps {
    pontos: Alerta[];
}

export default function DashboardContent({ pontos }: DashboardContentProps) {
    const [filtroNivel, setFiltroNivel] = useState<'Todos' | 'Alto' | 'Médio' | 'Baixo'>('Todos');
    const [filtroPeriodo, setFiltroPeriodo] = useState<'Ativos' | 'Passados' | 'Todos'>('Ativos');

    const agora = new Date();

    const getDataInicio = (ponto: Alerta): Date => {
        if ('inicio' in ponto) return new Date(ponto.inicio);
        if ('dataInicio' in ponto) return new Date(ponto.dataInicio);
        return new Date(ponto.data_inicio);
    };

    const getDataFim = (ponto: Alerta): Date => {
        if ('fim' in ponto) return new Date(ponto.fim);
        if ('dataFim' in ponto) return new Date(ponto.dataFim);
        return new Date(ponto.data_fim);
    };

    const getNivel = (ponto: Alerta): string => {
        if ('nivel' in ponto) return ponto.nivel;
        if ('nivelRisco' in ponto) return ponto.nivelRisco;
        if ('severidade' in ponto) return ponto.severidade;
        return '';
    };

    const pontosFiltrados = pontos.filter(ponto => {
        const dataInicio = getDataInicio(ponto);
        const dataFim = getDataFim(ponto);
        const nivel = getNivel(ponto);
        
        const periodoCorreto = 
            filtroPeriodo === 'Todos' ||
            (filtroPeriodo === 'Ativos' && dataInicio <= agora && dataFim >= agora) ||
            (filtroPeriodo === 'Passados' && dataFim < agora);

        const nivelCorreto = 
            filtroNivel === 'Todos' ||
            (filtroNivel === 'Alto' && (nivel === 'Alto' || nivel === 'Perigo Potencial')) ||
            (filtroNivel === 'Médio' && (nivel === 'Médio' || nivel === 'Atenção')) ||
            (filtroNivel === 'Baixo' && (nivel === 'Baixo' || nivel === 'Observação'));

        return periodoCorreto && nivelCorreto;
    });

    const estatisticas = {
        total: pontos.length,
        ativos: pontos.filter(p => {
            const dataInicio = getDataInicio(p);
            const dataFim = getDataFim(p);
            return dataInicio <= agora && dataFim >= agora;
        }).length,
        alto: pontos.filter(p => {
            const nivel = getNivel(p);
            return nivel === 'Alto' || nivel === 'Perigo Potencial';
        }).length,
        medio: pontos.filter(p => {
            const nivel = getNivel(p);
            return nivel === 'Médio' || nivel === 'Atenção';
        }).length,
        baixo: pontos.filter(p => {
            const nivel = getNivel(p);
            return nivel === 'Baixo' || nivel === 'Observação';
        }).length,
        inmet: pontos.filter(p => 'severidade' in p).length,
        locais: pontos.filter(p => 'nivelRisco' in p).length
    };

    return (
        <div className="space-y-4 lg:pr-4">
            {/* Estatísticas */}
            <div className="bg-white rounded-lg shadow-lg p-4">
                <h2 className="text-xl font-semibold mb-4">Estatísticas de Alertas</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                        <h3 className="text-red-800 font-medium">Alto Risco</h3>
                        <p className="text-2xl font-bold text-red-600">{estatisticas.alto}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                        <h3 className="text-orange-800 font-medium">Médio Risco</h3>
                        <p className="text-2xl font-bold text-orange-600">{estatisticas.medio}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-green-800 font-medium">Baixo Risco</h3>
                        <p className="text-2xl font-bold text-green-600">{estatisticas.baixo}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-blue-800 font-medium">Total</h3>
                        <p className="text-2xl font-bold text-blue-600">{estatisticas.total}</p>
                    </div>
                </div>
            </div>

            {/* Distribuição por Fonte */}
            <div className="bg-white rounded-lg shadow-lg p-4">
                <h2 className="text-xl font-semibold mb-4">Distribuição por Fonte</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-blue-800 font-medium">Alertas INMET</h3>
                        <p className="text-2xl font-bold text-blue-600">{estatisticas.inmet}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-green-800 font-medium">Alertas dos Usuários</h3>
                        <p className="text-2xl font-bold text-green-600">{estatisticas.locais}</p>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-lg p-4">
                <h2 className="text-xl font-semibold mb-4">Filtros</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Risco</label>
                        <select
                            value={filtroNivel}
                            onChange={(e) => setFiltroNivel(e.target.value as 'Todos' | 'Alto' | 'Médio' | 'Baixo')}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="Todos">Todos</option>
                            <option value="Alto">Alto</option>
                            <option value="Médio">Médio</option>
                            <option value="Baixo">Baixo</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                        <select
                            value={filtroPeriodo}
                            onChange={(e) => setFiltroPeriodo(e.target.value as 'Ativos' | 'Passados' | 'Todos')}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="Todos">Todos</option>
                            <option value="Ativos">Ativos</option>
                            <option value="Passados">Passados</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Lista de Alertas */}
            <div className="bg-white rounded-lg shadow-lg p-4">
                <h2 className="text-xl font-semibold mb-4">Alertas ({pontosFiltrados.length})</h2>
                <div className="space-y-4">
                    {pontosFiltrados.map((ponto, index) => {
                        const nivel = getNivel(ponto);
                        const descricao = 'descricao' in ponto ? ponto.descricao : 
                                        ('titulo' in ponto) ? (ponto as AlertaLocal).titulo : '';
                        const dataInicio = getDataInicio(ponto);
                        const dataFim = getDataFim(ponto);
                        const isAtivo = dataInicio <= agora && dataFim >= agora;
                        const municipio = 'municipio' in ponto ? ponto.municipio : 
                                        'municipios' in ponto ? ponto.municipios.split(' - ')[0] : '';
                        const uf = 'uf' in ponto ? ponto.uf : 
                                 'municipios' in ponto ? ponto.municipios.split(' - ')[1] : '';

                        return (
                            <div key={index} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">{descricao}</h3>
                                        <p className="text-sm text-gray-500">
                                            {municipio} - {uf}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        nivel === 'Alto' || nivel === 'Perigo Potencial' ? 'bg-red-100 text-red-800' :
                                        nivel === 'Médio' || nivel === 'Atenção' ? 'bg-orange-100 text-orange-800' :
                                        'bg-green-100 text-green-800'
                                    }`}>
                                        {nivel}
                                    </span>
                                </div>
                                <div className="mt-2 text-sm text-gray-600">
                                    <p>Início: {dataInicio.toLocaleDateString('pt-BR')}</p>
                                    <p>Fim: {dataFim.toLocaleDateString('pt-BR')}</p>
                                    <p className={`mt-1 ${
                                        isAtivo ? 'text-green-600' : 'text-gray-500'
                                    }`}>
                                        {isAtivo ? 'Ativo' : 'Expirado'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
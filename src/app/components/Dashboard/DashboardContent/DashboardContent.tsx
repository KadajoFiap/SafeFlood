'use client';
import { useState } from 'react';
import { PontoDeRisco } from '@/app/utils/types';

const getNivelRiscoCor = (nivel: 'Alto' | 'Médio' | 'Baixo') => {
  switch (nivel) {
    case 'Alto': return 'bg-red-100 text-red-800';
    case 'Médio': return 'bg-orange-100 text-orange-800';
    case 'Baixo': return 'bg-green-100 text-green-800';
  }
};

interface DashboardContentProps {
    pontos: (PontoDeRisco | any)[];
}

export default function DashboardContent({ pontos }: DashboardContentProps) {
    const [filtroNivel, setFiltroNivel] = useState<'Todos' | 'Alto' | 'Médio' | 'Baixo'>('Todos');
    const [filtroPeriodo, setFiltroPeriodo] = useState<'Ativos' | 'Passados' | 'Todos'>('Ativos');

    const agora = new Date();

    const pontosFiltrados = pontos.filter(ponto => {
        const dataInicio = new Date(ponto.inicio || ponto.dataInicio);
        const dataFim = new Date(ponto.fim || ponto.dataFim);
        const nivel = ponto.nivel || ponto.nivelRisco || ponto.severidade;
        
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
            const dataInicio = new Date(p.inicio || p.dataInicio);
            const dataFim = new Date(p.fim || p.dataFim);
            return dataInicio <= agora && dataFim >= agora;
        }).length,
        alto: pontos.filter(p => 
            (p.nivel === 'Alto' || p.nivelRisco === 'Alto') || 
            (p.severidade === 'Perigo Potencial')
        ).length,
        medio: pontos.filter(p => 
            (p.nivel === 'Médio' || p.nivelRisco === 'Médio') || 
            (p.severidade === 'Atenção')
        ).length,
        baixo: pontos.filter(p => 
            (p.nivel === 'Baixo' || p.nivelRisco === 'Baixo') || 
            (p.severidade === 'Observação')
        ).length,
        inmet: pontos.filter(p => p.severidade).length,
        locais: pontos.filter(p => p.nivelRisco).length
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
                            onChange={(e) => setFiltroNivel(e.target.value as any)}
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
                            onChange={(e) => setFiltroPeriodo(e.target.value as any)}
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
                        const nivel = ponto.nivel || ponto.nivelRisco || ponto.severidade;
                        const descricao = ponto.descricao || ponto.titulo;
                        const dataInicio = new Date(ponto.inicio || ponto.dataInicio);
                        const dataFim = new Date(ponto.fim || ponto.dataFim);
                        const isAtivo = dataInicio <= agora && dataFim >= agora;

                        return (
                            <div key={index} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">{descricao}</h3>
                                        <p className="text-sm text-gray-500">
                                            {ponto.municipio} - {ponto.uf}
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
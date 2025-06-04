'use client';
import { useState } from 'react';
import Image from 'next/image';
import { PontoDeRisco } from '@/app/utils/transformarAlertas';

const getNivelRiscoCor = (nivel: 'Alto' | 'Médio' | 'Baixo') => {
  switch (nivel) {
    case 'Alto': return 'bg-red-100 text-red-800';
    case 'Médio': return 'bg-orange-100 text-orange-800';
    case 'Baixo': return 'bg-green-100 text-green-800';
  }
};

export default function DashboardContent({ pontos }: { pontos: PontoDeRisco[] }) {
  const [filtroNivel, setFiltroNivel] = useState<'Todos' | 'Alto' | 'Médio' | 'Baixo'>('Todos');
  const [filtroPeriodo, setFiltroPeriodo] = useState<'Ativos' | 'Passados' | 'Todos'>('Ativos');

  const agora = new Date();
  const pontosFiltrados = pontos.filter(ponto => {
    const inicio = new Date(ponto.inicio);
    const fim = new Date(ponto.fim);
    const estaAtivo = inicio <= agora && fim >= agora;
    const nivelCorreto = filtroNivel === 'Todos' || ponto.nivel === filtroNivel;
    const periodoCorreto = filtroPeriodo === 'Todos' ||
      (filtroPeriodo === 'Ativos' && estaAtivo) ||
      (filtroPeriodo === 'Passados' && !estaAtivo);
    return nivelCorreto && periodoCorreto;
  });

  const estatisticas = {
    total: pontos.length,
    ativos: pontos.filter(p => new Date(p.inicio) <= agora && new Date(p.fim) >= agora).length,
    alto: pontos.filter(p => p.nivel === 'Alto').length,
    medio: pontos.filter(p => p.nivel === 'Médio').length,
    baixo: pontos.filter(p => p.nivel === 'Baixo').length
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-lg border-2 border-[#F5FAFF] flex flex-col">
      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-xs font-medium text-gray-500">Total de Alertas</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{estatisticas.total}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-xs font-medium text-gray-500">Alertas Ativos</h3>
            <p className="mt-1 text-2xl font-semibold text-blue-600">{estatisticas.ativos}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-xs font-medium text-gray-500">Risco Alto</h3>
            <p className="mt-1 text-2xl font-semibold text-red-600">{estatisticas.alto}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-xs font-medium text-gray-500">Risco Médio</h3>
            <p className="mt-1 text-2xl font-semibold text-orange-600">{estatisticas.medio}</p>
          </div>
        </div>
        {/* Filtros */}
        <div className="bg-gray-50 p-3 rounded-lg space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nível de Risco</label>
            <select
              value={filtroNivel}
              onChange={(e) => setFiltroNivel(e.target.value as 'Todos' | 'Alto' | 'Médio' | 'Baixo')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            >
              <option value="Todos">Todos</option>
              <option value="Alto">Alto</option>
              <option value="Médio">Médio</option>
              <option value="Baixo">Baixo</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Período</label>
            <select
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value as 'Todos' | 'Ativos' | 'Passados')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            >
              <option value="Todos">Todos</option>
              <option value="Ativos">Ativos</option>
              <option value="Passados">Passados</option>
            </select>
          </div>
        </div>
        {/* Lista de Alertas */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-900 px-1">
            Alertas Meteorológicos
          </h3>
          <div className="space-y-2">
            {pontosFiltrados.length === 0 ? (
              <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                Nenhum alerta encontrado com os filtros selecionados
              </div>
            ) : (
              pontosFiltrados.map((ponto: PontoDeRisco, idx: number) => (
                <div key={`${ponto.id}-${ponto.latitude}-${ponto.longitude}-${idx}`} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start gap-2">
                    <Image
                      src={`/risco_${ponto.nivel.toLowerCase()}.png`}
                      alt={`Risco ${ponto.nivel}`}
                      width={24}
                      height={24}
                      className="w-6 h-6 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {ponto.municipio} - {ponto.uf}
                        </h4>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getNivelRiscoCor(ponto.nivel)} flex-shrink-0`}>
                          {ponto.nivel}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-600 line-clamp-2">{ponto.descricao}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        <span>Início: {new Date(ponto.inicio).toLocaleString('pt-BR')}</span>
                        <span className="mx-1">•</span>
                        <span>Fim: {new Date(ponto.fim).toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
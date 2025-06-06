/* eslint-disable */
'use client'

import { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

interface AlertaManual {
    id: string;
    titulo: string;
    descricao: string;
    nivel: 'Alto' | 'Médio' | 'Baixo';
    data_inicio: string;
    data_fim: string;
    criado_por: {
        username: string;
        email: string;
    };
    criado_em: string;
    status: 'Ativo' | 'Expirado' | 'Cancelado';
    localizacao: {
        latitude: number;
        longitude: number;
        municipio: string;
        uf: string;
    };
}

export default function Painel() {
    const { user, isAdmin } = useAuth();
    const [alertas, setAlertas] = useState<AlertaManual[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filtroStatus, setFiltroStatus] = useState<'Todos' | 'Ativo' | 'Expirado' | 'Cancelado'>('Todos');
    const [filtroNivel, setFiltroNivel] = useState<'Todos' | 'Alto' | 'Médio' | 'Baixo'>('Todos');

    useEffect(() => {
        // TODO: Implement API call to fetch manual alerts
        const fetchAlertas = async () => {
            try {
                setLoading(true);
                // const response = await fetch('/api/alertas-manuais');
                // const data = await response.json();
                // setAlertas(data);
                
                // Temporary mock data
                setAlertas([
                    {
                        id: '1',
                        titulo: 'Alerta de Enchente',
                        descricao: 'Risco de enchente na região central',
                        nivel: 'Alto',
                        data_inicio: '2024-03-20T10:00:00',
                        data_fim: '2024-03-21T10:00:00',
                        criado_por: {
                            username: 'admin',
                            email: 'admin@example.com'
                        },
                        criado_em: '2024-03-20T09:00:00',
                        status: 'Ativo',
                        localizacao: {
                            latitude: -23.5505,
                            longitude: -46.6333,
                            municipio: 'São Paulo',
                            uf: 'SP'
                        }
                    }
                ]);
            } catch (err) {
                setError('Erro ao carregar alertas');
                console.error('Erro:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAlertas();
    }, []);

    const alertasFiltrados = alertas.filter(alerta => {
        const statusCorreto = filtroStatus === 'Todos' || alerta.status === filtroStatus;
        const nivelCorreto = filtroNivel === 'Todos' || alerta.nivel === filtroNivel;
        return statusCorreto && nivelCorreto;
    });

    const estatisticas = {
        total: alertas.length,
        ativos: alertas.filter(a => a.status === 'Ativo').length,
        expirados: alertas.filter(a => a.status === 'Expirado').length,
        cancelados: alertas.filter(a => a.status === 'Cancelado').length,
        alto: alertas.filter(a => a.nivel === 'Alto').length,
        medio: alertas.filter(a => a.nivel === 'Médio').length,
        baixo: alertas.filter(a => a.nivel === 'Baixo').length
    };

    if (loading) {
        return (
            <ProtectedRoute requireAdmin={true}>
                <div className="min-h-screen bg-[#132536] pt-10 px-4">
                    <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            <p className="mt-3 text-white">Carregando painel administrativo...</p>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute requireAdmin={true}>
            <div className="min-h-screen bg-[#132536] pt-10 px-4 md:px-10 lg:px-20 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl md:text-3xl font-semibold text-[#F5FAFF]">
                            Painel Administrativo
                        </h1>
                        <div className="text-[#F5FAFF]">
                            Logado como: {user?.username}
                        </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-lg p-4 shadow-lg">
                            <h3 className="text-sm font-medium text-gray-500">Total de Alertas</h3>
                            <p className="mt-1 text-2xl font-semibold text-gray-900">{estatisticas.total}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-lg">
                            <h3 className="text-sm font-medium text-gray-500">Alertas Ativos</h3>
                            <p className="mt-1 text-2xl font-semibold text-blue-600">{estatisticas.ativos}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-lg">
                            <h3 className="text-sm font-medium text-gray-500">Alertas Expirados</h3>
                            <p className="mt-1 text-2xl font-semibold text-orange-600">{estatisticas.expirados}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-lg">
                            <h3 className="text-sm font-medium text-gray-500">Alertas Cancelados</h3>
                            <p className="mt-1 text-2xl font-semibold text-red-600">{estatisticas.cancelados}</p>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="bg-white rounded-lg p-4 shadow-lg mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={filtroStatus}
                                    onChange={(e) => setFiltroStatus(e.target.value as any)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="Todos">Todos</option>
                                    <option value="Ativo">Ativos</option>
                                    <option value="Expirado">Expirados</option>
                                    <option value="Cancelado">Cancelados</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Risco</label>
                                <select
                                    value={filtroNivel}
                                    onChange={(e) => setFiltroNivel(e.target.value as any)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="Todos">Todos</option>
                                    <option value="Alto">Alto</option>
                                    <option value="Médio">Médio</option>
                                    <option value="Baixo">Baixo</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Alertas */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nível</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localização</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado por</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {alertasFiltrados.map((alerta) => (
                                        <tr key={alerta.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{alerta.titulo}</div>
                                                <div className="text-sm text-gray-500">{alerta.descricao}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    alerta.nivel === 'Alto' ? 'bg-red-100 text-red-800' :
                                                    alerta.nivel === 'Médio' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {alerta.nivel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    alerta.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                                                    alerta.status === 'Expirado' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {alerta.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{alerta.localizacao.municipio} - {alerta.localizacao.uf}</div>
                                                <div className="text-sm text-gray-500">
                                                    {alerta.localizacao.latitude.toFixed(4)}, {alerta.localizacao.longitude.toFixed(4)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{alerta.criado_por.username}</div>
                                                <div className="text-sm text-gray-500">{alerta.criado_por.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(alerta.data_inicio).toLocaleString('pt-BR')}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    até {new Date(alerta.data_fim).toLocaleString('pt-BR')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                                                <button className="text-red-600 hover:text-red-900">Excluir</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

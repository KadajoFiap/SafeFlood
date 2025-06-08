'use client'

import { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

interface Alerta {
    id: number;
    titulo: string;
    descricao: string;
    nivelRisco: 'Alto' | 'Médio' | 'Baixo';
    dataInicio: string;
    dataFim: string;
    alertaCriadoEm: string;
    latitude: number;
    longitude: number;
    uf: string;
    municipio: string;
    usuario: {
        id: number;
        nomeUsuario: string;
        email: string;
        tipoUsuario: string;
    };
}

type StatusFilter = 'Todos' | 'Ativo' | 'Expirado' | 'Cancelado';
type NivelFilter = 'Todos' | 'Alto' | 'Médio' | 'Baixo';

export default function Painel() {
    const { user } = useAuth();
    const [alertas, setAlertas] = useState<Alerta[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroStatus, setFiltroStatus] = useState<StatusFilter>('Todos');
    const [filtroNivel, setFiltroNivel] = useState<NivelFilter>('Todos');
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja excluir este alerta?')) {
            return;
        }

        try {
            setIsDeleting(true);
            const response = await fetch(`https://safeflood-api-java.onrender.com/alertas/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('idToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir alerta');
            }

            // Atualiza a lista de alertas removendo o alerta excluído
            setAlertas(alertas.filter(alerta => alerta.id !== id));
        } catch (err) {
            console.error('Erro ao excluir alerta:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        const fetchAlertas = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://safeflood-api-java.onrender.com/alertas', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('idToken')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Erro ao carregar alertas');
                }

                const data = await response.json();
                console.log('Alertas carregados (detalhado):', JSON.stringify(data, null, 2));
                setAlertas(data);
            } catch (err) {
                console.error('Erro:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAlertas();
    }, []);

    const alertasFiltrados = alertas.filter(alerta => {
        const hoje = new Date();
        const dataFim = new Date(alerta.dataFim);
        const status = dataFim < hoje ? 'Expirado' : 'Ativo';
        const statusCorreto = filtroStatus === 'Todos' || status === filtroStatus;
        const nivelCorreto = filtroNivel === 'Todos' || alerta.nivelRisco === filtroNivel;
        return statusCorreto && nivelCorreto;
    });

    const estatisticas = {
        total: alertas.length,
        ativos: alertas.filter(a => new Date(a.dataFim) >= new Date()).length,
        expirados: alertas.filter(a => new Date(a.dataFim) < new Date()).length,
        alto: alertas.filter(a => a.nivelRisco === 'Alto').length,
        medio: alertas.filter(a => a.nivelRisco === 'Médio').length,
        baixo: alertas.filter(a => a.nivelRisco === 'Baixo').length
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
                            <h3 className="text-sm font-medium text-gray-500">Nível Alto</h3>
                            <p className="mt-1 text-2xl font-semibold text-red-600">{estatisticas.alto}</p>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="bg-white rounded-lg p-4 shadow-lg mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={filtroStatus}
                                    onChange={(e) => setFiltroStatus(e.target.value as StatusFilter)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="Todos">Todos</option>
                                    <option value="Ativo">Ativos</option>
                                    <option value="Expirado">Expirados</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Risco</label>
                                <select
                                    value={filtroNivel}
                                    onChange={(e) => setFiltroNivel(e.target.value as NivelFilter)}
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
                                    {alertasFiltrados.map((alerta) => {
                                        const hoje = new Date();
                                        const dataFim = new Date(alerta.dataFim);
                                        const status = dataFim < hoje ? 'Expirado' : 'Ativo';

                                        return (
                                            <tr key={alerta.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{alerta.titulo}</div>
                                                    <div className="text-sm text-gray-500">{alerta.descricao}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        alerta.nivelRisco === 'Alto' ? 'bg-red-100 text-red-800' :
                                                        alerta.nivelRisco === 'Médio' ? 'bg-orange-100 text-orange-800' :
                                                        'bg-green-100 text-green-800'
                                                    }`}>
                                                        {alerta.nivelRisco}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {alerta.municipio} - {alerta.uf}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {alerta.usuario.nomeUsuario}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(alerta.dataInicio).toLocaleDateString('pt-BR')} até {new Date(alerta.dataFim).toLocaleDateString('pt-BR')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleDelete(alerta.id)}
                                                        disabled={isDeleting}
                                                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                    >
                                                        {isDeleting ? 'Excluindo...' : 'Excluir'}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

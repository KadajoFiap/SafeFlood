'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Sobre() {
    return (
        <div className="min-h-screen bg-[#132536] pt-10 px-4 md:px-10 lg:px-20 pb-20">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-[#F5FAFF] mb-8">
                    Sobre o SafeFlood
                </h1>

                {/* Previsão de Enchentes */}
                <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-full md:w-1/2 relative aspect-[3/2]">
                            <Image
                                src="/homem-feature.jpg"
                                alt="Previsão de Enchentes"
                                fill
                                quality={100}
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="rounded-lg shadow-md object-cover"
                            />
                        </div>
                        <div className="w-full md:w-1/2">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Previsão de Enchentes com IA
                            </h2>
                            <p className="text-gray-600 mb-4">
                                O SafeFlood utiliza dados do INMET (Instituto Nacional de Meteorologia) para fornecer previsões precisas sobre riscos de enchentes. Nossa plataforma processa informações meteorológicas em tempo real, incluindo:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                                <li>Precipitação acumulada</li>
                                <li>Níveis dos rios</li>
                                <li>Condições meteorológicas</li>
                                <li>Histórico de eventos</li>
                            </ul>
                            <p className="text-gray-600">
                                Com base nesses dados, nosso sistema classifica o risco de enchente em três níveis:
                            </p>
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                <div className="bg-red-50 p-3 rounded-lg">
                                    <h3 className="font-medium text-red-800">Alto Risco</h3>
                                    <p className="text-sm text-red-600">Perigo Potencial</p>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-lg">
                                    <h3 className="font-medium text-orange-800">Médio Risco</h3>
                                    <p className="text-sm text-orange-600">Atenção</p>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <h3 className="font-medium text-green-800">Baixo Risco</h3>
                                    <p className="text-sm text-green-600">Observação</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sistema de Alertas */}
                <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                    <div className="flex flex-col md:flex-row-reverse gap-8">
                        <div className="w-full md:w-1/2 relative aspect-[3/2]">
                            <Image
                                src="/alerta-feature.jpg"
                                alt="Sistema de Alertas"
                                fill
                                quality={100}
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="rounded-lg shadow-md object-cover"
                            />
                        </div>
                        <div className="w-full md:w-1/2">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Sistema de Alertas em Tempo Real
                            </h2>
                            <p className="text-gray-600 mb-4">
                                O SafeFlood oferece um sistema completo de alertas que combina dados automáticos e relatórios manuais para garantir a máxima cobertura e precisão:
                            </p>
                            
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">Alertas Automáticos</h3>
                                    <p className="text-gray-600">
                                        Integrados com o INMET, nossos alertas automáticos são gerados quando:
                                    </p>
                                    <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                                        <li>Há previsão de chuvas intensas</li>
                                        <li>Níveis dos rios ultrapassam limites seguros</li>
                                        <li>Condições meteorológicas indicam risco</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">Alertas Manuais</h3>
                                    <p className="text-gray-600">
                                        Nossa comunidade de usuários pode reportar situações de risco através de:
                                    </p>
                                    <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                                        <li>Registro de alertas com localização precisa</li>
                                        <li>Classificação do nível de risco</li>
                                        <li>Descrição detalhada da situação</li>
                                        <li>Fotos e informações complementares</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">Notificações</h3>
                                    <p className="text-gray-600">
                                        Os alertas são distribuídos através de múltiplos canais:
                                    </p>
                                    <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                                        <li>Notificações no aplicativo</li>
                                        <li>Alertas SMS</li>
                                        <li>Mapa interativo com localização</li>
                                        <li>Rotas de fuga sugeridas</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-12 text-center">
                    <h2 className="text-2xl font-semibold text-[#F5FAFF] mb-4">
                        Faça Parte da Nossa Comunidade
                    </h2>
                    <p className="text-[#F5FAFF] mb-6 max-w-2xl mx-auto">
                        Junte-se a nós na missão de tornar nossas cidades mais seguras contra enchentes. 
                        Seja um usuário ativo, reporte situações de risco e ajude a proteger sua comunidade.
                    </p>
                    <Link
                        href="/register"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Cadastre-se Agora
                    </Link>
                </div>
            </div>
        </div>
    );
} 
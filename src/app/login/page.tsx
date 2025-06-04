'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Formulario, { FormField } from '../components/Formulario/Formulario';
import type { LoginData } from '../utils/types';

const LoginPage = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const fields: FormField[] = [
        {
            name: 'email',
            label: 'E-mail',
            type: 'email',
            required: true,
            placeholder: 'Digite seu e-mail',
            validation: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Digite um e-mail válido'
            }
        },
        {
            name: 'password',
            label: 'Senha',
            type: 'password',
            required: true,
            placeholder: 'Digite sua senha'
        }
    ];

    const handleSubmit = async (data: Record<string, string>) => {
        // Temporarily disabled - API integration pending
        setError('Funcionalidade em desenvolvimento. Aguarde a integração com a API.');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#132536] py-12">
            <div className="w-full max-w-md px-4">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Login</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Entre com suas credenciais para acessar o sistema
                        </p>
                        <div className="mt-4 p-4 bg-yellow-50 text-yellow-700 rounded-md">
                            <p className="text-sm font-medium">Funcionalidade em desenvolvimento</p>
                            <p className="text-xs mt-1">A integração com a API está em andamento.</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    <Formulario
                        fields={fields}
                        onSubmit={handleSubmit}
                        submitLabel="Entrar"
                        className="space-y-6"
                    />

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Não tem uma conta?{' '}
                            <Link href="/register" className="text-blue-600 hover:text-blue-500">
                                Registre-se
                            </Link>
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                            <Link href="/confirm-email" className="text-blue-600 hover:text-blue-500">
                                Confirmar e-mail
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default dynamic(() => Promise.resolve(LoginPage), { ssr: false }); 
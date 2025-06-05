'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import Formulario, { FormField } from '../components/Formulario/Formulario';
import { useState } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (data: Record<string, string>) => {
        setIsLoading(true);
        setError('');
        try {
            await login(data.username, data.password);
            router.push('/');
        } catch (err) {
            setError('Usuário ou senha inválidos.');
            console.error('Erro no login:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fields: FormField[] = [
        {
            name: 'username',
            label: 'Usuário',
            type: 'text',
            placeholder: 'Digite seu usuário',
            required: true
        },
        {
            name: 'password',
            label: 'Senha',
            type: 'password',
            placeholder: 'Digite sua senha',
            required: true
        }
    ];

    return (
        
            <div
                className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80')",
                }}
            >
                <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="cursor-pointer absolute top-6 left-6 text-white font-semibold bg-transparent rounded px-4 py-1 hover:bg-white hover:text-[#132536] transition-colors z-10"
                >
                    ← Voltar
                </button>
                <div className="w-full max-w-md bg-white bg-opacity-95 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
                    <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
                        Entre na sua conta
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-800 mb-4">
                        Faça login para acessar recursos adicionais
                    </p>
                    <Formulario
                        fields={fields}
                        onSubmit={handleSubmit}
                        submitLabel={isLoading ? 'Entrando...' : 'Entrar'}
                        className="space-y-6 w-full"
                    >
                        {error && (
                            <div className="text-red-600 text-center text-sm font-semibold mb-2">{error}</div>
                        )}
                        <div className="flex flex-col items-center space-y-2">
                            <Link
                                href="/register"
                                className="text-sm text-indigo-500 hover:text-indigo-700"
                            >
                                Não tem uma conta? Registre-se
                            </Link>
                        </div>
                    </Formulario>
                </div>
            </div>
        
    );
} 
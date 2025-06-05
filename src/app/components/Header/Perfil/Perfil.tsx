'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../Button/Button';

export default function Perfil() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            setIsMenuOpen(false);
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-gray-800 hover:bg-gray-700 transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
            </button>

            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
                    {isAuthenticated ? (
                        <>
                            <div className="px-4 py-3 text-sm text-gray-700 border-b flex flex-col gap-1">
                                <span className="font-semibold">Usuário:</span>
                                <span className="text-gray-900">{user?.username || 'Usuário'}</span>
                                {user?.email && (
                                    <>
                                        <span className="font-semibold mt-2">Email:</span>
                                        <span className="text-gray-900">{user.email}</span>
                                    </>
                                )}
                            </div>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="cursor-pointer border-none block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                                Sair
                            </Button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="cursor-pointer block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Fazer login
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
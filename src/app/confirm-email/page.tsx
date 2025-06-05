'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import Formulario, { FormField } from '../components/Formulario/Formulario';

export default function ConfirmEmailPage() {
  const router = useRouter();
  const { confirm } = useAuth();

  const handleSubmit = async (data: Record<string, string>) => {
    try {
      await confirm(data.username, data.code);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      console.error('Confirmation error:', err);
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
      name: 'code',
      label: 'Código de Confirmação',
      type: 'text',
      placeholder: 'Digite o código recebido por email',
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
        className="cursor-pointer absolute top-6 left-6 text-amber-300 font-semibold bg-transparent rounded px-4 py-1 hover:bg-white hover:text-[#132536] transition-colors z-10"
      >
        ← Voltar
      </button>
      <div className="w-full max-w-md bg-white bg-opacity-95 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
          Confirme seu email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-800 mb-4">
          Digite o código de confirmação enviado para seu email
        </p>
        <Formulario
          fields={fields}
          onSubmit={handleSubmit}
          submitLabel="Confirmar"
          className="space-y-6 w-full"
        >
          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-indigo-500 hover:text-indigo-700"
            >
              Voltar para o login
            </Link>
          </div>
        </Formulario>
      </div>
    </div>
  );
} 
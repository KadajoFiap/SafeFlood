'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import Formulario, { FormField } from '../components/Formulario/Formulario';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();

  const passwordRequirements = {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
    message: 'A senha deve ter pelo menos 8 caracteres, uma maiúscula, uma minúscula, um número e um caractere especial.'
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
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Digite seu email',
      required: true,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Digite um email válido'
      }
    },
    {
      name: 'password',
      label: 'Senha',
      type: 'password',
      placeholder: 'Digite sua senha',
      required: true,
      validation: passwordRequirements
    },
    {
      name: 'confirmPassword',
      label: 'Confirmar Senha',
      type: 'password',
      placeholder: 'Confirme sua senha',
      required: true,
    },
  ];

  const handleSubmit = async (data: Record<string, string>) => {
    if (data.password !== data.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }
    try {
      console.log('[Registro] Iniciando registro com dados:', { username: data.username, email: data.email });
      await register(data.username, data.email, data.password);
      console.log('[Registro] Registro bem-sucedido, redirecionando para confirmação de email.');
      router.push('/confirm-email');
    } catch (err) {
      console.error('[Registro] Erro ao registrar:', err);
      const errorMsg = (typeof err === 'object' && err && 'message' in err && typeof (err as { message?: string }).message === 'string')
        ? (err as { message: string }).message
        : String(err);
      alert('Erro ao registrar: ' + errorMsg);
    }
  };

  return (
      <div
        className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: 'url(\'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80\')',
        }}
      >
        <button
          type="button"
          onClick={() => router.push('/')}
          className="cursor-pointer absolute top-6 left-6 text-white font-semibold bg-transparent rounded px-4 py-1 hover:bg-white hover:text-[#132536] transition-colors z-10"
        >
          ← Voltar
        </button>
        <div className="w-full max-w-md bg-white bg-opacity-95 rounded-2xl shadow-2xl p-8 flex flex-col items-center mx-4 md:mx-0">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
            Criar uma conta
          </h2>
          <Formulario
            fields={fields}
            onSubmit={handleSubmit}
            submitLabel="Registrar"
            className="w-full"
            compact={true}
          >
            <div className="w-full bg-blue-50 rounded-lg p-4 mb-2 flex items-start gap-2 mt-6">
              <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
              <ul className="list-disc list-inside mt-1 text-sm text-blue-700">
                <li>Mínimo de 8 caracteres</li>
                <li>Pelo menos uma letra maiúscula</li>
                <li>Pelo menos uma letra minúscula</li>
                <li>Pelo menos um número</li>
                <li>Pelo menos um caractere especial <span className="font-mono">(@$!%*?&)</span></li>
              </ul>
            </div>
            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-indigo-500 hover:text-indigo-700"
              >
                Já tem uma conta? Faça login
              </Link>
            </div>
          </Formulario>
        </div>
      </div>
  );
} 
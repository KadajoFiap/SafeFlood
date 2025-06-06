'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/Button/Button';
import Formulario, { FormField } from '@/app/components/Formulario/Formulario';

export default function AddAlerta() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAddAlerta = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Record<string, string>) => {
    setIsSubmitting(true);
    setError('');
    try {
      // TODO: Implement API call to add alert
      console.log('Dados do alerta:', data);
      setIsModalOpen(false);
    } catch (err) {
      setError('Erro ao adicionar alerta. Tente novamente.');
      console.error('Erro ao adicionar alerta:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields: FormField[] = [
    {
      name: 'titulo',
      label: 'Título',
      type: 'text',
      placeholder: 'Digite o título do alerta',
      required: true
    },
    {
      name: 'descricao',
      label: 'Descrição',
      type: 'textarea',
      placeholder: 'Digite a descrição do alerta',
      required: true
    },
    {
      name: 'nivel',
      label: 'Nível de Risco',
      type: 'select',
      options: [
        { value: 'baixo', label: 'Baixo' },
        { value: 'medio', label: 'Médio' },
        { value: 'alto', label: 'Alto' }
      ],
      required: true
    },
    {
      name: 'data_inicio',
      label: 'Data de Início',
      type: 'date',
      required: true
    },
    {
      name: 'data_fim',
      label: 'Data de Fim',
      type: 'date',
      required: true
    }
  ];

  return (
    <>
      <Button
        onClick={handleAddAlerta}
        variant="primary"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Adicionar Alerta
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Adicionar Novo Alerta</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <Formulario
              fields={fields}
              onSubmit={handleSubmit}
              submitLabel={isSubmitting ? 'Adicionando...' : 'Adicionar Alerta'}
              className="w-full"
            />
          </div>
        </div>
      )}
    </>
  );
}

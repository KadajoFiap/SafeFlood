'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/Button/Button';
import Formulario, { FormField } from '@/app/components/Formulario/Formulario';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { findByEmail, createUser } from '@/app/services/userService';
import { createAlerta } from '@/app/services/alertaService';
import 'leaflet/dist/leaflet.css';

interface LocationMarkerProps {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}

function LocationMarker({ position, setPosition }: LocationMarkerProps) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function AddAlerta() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [position, setPosition] = useState<[number, number] | null>(null);

  const handleAddAlerta = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Record<string, string>) => {
    if (!position) {
      setError('Por favor, selecione uma localização no mapa.');
      return;
    }

    const idToken = localStorage.getItem('idToken');
    if (!idToken) {
      setError('Usuário não autenticado. Por favor, faça login.');
      return;
    }

    try {
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      const username = payload['cognito:username'];
      const userEmail = payload.email;
      const userRole = payload['custom:role'] || 'user';

      if (!username || !userEmail) {
        setError('Token inválido. Por favor, faça login novamente.');
        return;
      }

      setIsSubmitting(true);
      setError('');

      // Busca usuário no banco pelo email
      let usuario = null;
      try {
        usuario = await findByEmail(userEmail);
      } catch (error: unknown) {
        const err = error as Record<string, unknown>;
        if (
          error &&
          typeof error === 'object' &&
          'isAxiosError' in error &&
          err.isAxiosError === true &&
          typeof err.response === 'object' &&
          err.response &&
          'status' in err.response &&
          (err.response as Record<string, unknown>).status !== 404
        ) {
          throw error;
        }
      }

      // Se não existe, cadastra o usuário
      if (!usuario) {
        try {
          usuario = await createUser({
            nomeUsuario: username,
            email: userEmail,
            tipoUsuario: userRole
          });
        } catch (error: unknown) {
          const err = error as Record<string, unknown>;
          if (
            error &&
            typeof error === 'object' &&
            'isAxiosError' in error &&
            err.isAxiosError === true &&
            typeof err.response === 'object' &&
            err.response &&
            'data' in err.response &&
            (err.response as Record<string, unknown>).data &&
            typeof (err.response as Record<string, unknown>).data === 'object' &&
            'message' in ((err.response as Record<string, unknown>).data as Record<string, unknown>)
          ) {
            throw new Error(
              ((err.response as Record<string, unknown>).data as { message: string }).message
            );
          }
          throw new Error('Erro ao criar usuário. Por favor, tente novamente.');
        }
      }

      if (!usuario || !usuario.id) {
        setError('Não foi possível identificar o usuário.');
        return;
      }

      const now = new Date();
      const endDate = new Date(now.getTime() + (4 * 60 * 60 * 1000)); // 4 horas depois

      const alertaData = {
        titulo: data.titulo,
        descricao: data.descricao,
        nivelRisco: data.nivel_risco,
        dataInicio: now.toISOString(),
        dataFim: endDate.toISOString(),
        latitude: position[0],
        longitude: position[1],
        uf: data.uf.toUpperCase(),
        municipio: data.municipio,
        usuario: { id: usuario.id }
      };

      console.log('Payload enviado para createAlerta:', alertaData);

      await createAlerta(alertaData);
      setIsModalOpen(false);
      setPosition(null);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar alerta. Por favor, tente novamente.');
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
      required: true,
      validation: {
        pattern: /^.{1,100}$/,
        message: 'O título deve ter no máximo 100 caracteres'
      }
    },
    {
      name: 'descricao',
      label: 'Descrição',
      type: 'textarea',
      placeholder: 'Digite a descrição do alerta',
      required: true,
      validation: {
        pattern: /^.{1,500}$/,
        message: 'A descrição deve ter no máximo 500 caracteres'
      }
    },
    {
      name: 'nivel_risco',
      label: 'Nível de Risco',
      type: 'select',
      options: [
        { value: 'ALTO', label: 'Alto' },
        { value: 'MEDIO', label: 'Médio' },
        { value: 'BAIXO', label: 'Baixo' }
      ],
      required: true
    },
    {
      name: 'uf',
      label: 'UF',
      type: 'text',
      placeholder: 'Ex: SP',
      required: true,
      validation: {
        pattern: /^[A-Z]{2}$/,
        message: 'A UF deve ter 2 caracteres maiúsculos'
      }
    },
    {
      name: 'municipio',
      label: 'Município',
      type: 'text',
      placeholder: 'Digite o nome do município',
      required: true,
      validation: {
        pattern: /^.{1,100}$/,
        message: 'O nome do município deve ter no máximo 100 caracteres'
      }
    }
  ];

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('add-alerta-modal-open');
    } else {
      document.body.classList.remove('add-alerta-modal-open');
    }
    return () => {
      document.body.classList.remove('add-alerta-modal-open');
    };
  }, [isModalOpen]);

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
        <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-start md:items-center justify-center z-[2000] px-6 py-10 md:p-0 overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 mt-10 md:mt-0 md:p-6 w-full max-w-4xl mb-10 md:mb-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-semibold">Adicionar Novo Alerta</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 md:h-6 md:w-6"
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
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm md:text-base">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="h-[300px] md:h-[400px] rounded-lg overflow-hidden">
                <MapContainer
                  center={[-15.7801, -47.9292]}
                  zoom={4}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
              </div>

              <div className="mt-4 md:mt-0">
                <Formulario
                  fields={fields}
                  onSubmit={handleSubmit}
                  submitLabel={isSubmitting ? 'Adicionando...' : 'Adicionar Alerta'}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

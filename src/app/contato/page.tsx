'use client'

import Formulario, { FormField } from '../components/Formulario/Formulario';

export default function Contato() {
    const fields: FormField[] = [
        {
            name: 'nome',
            label: 'Nome Completo',
            type: 'text',
            required: true,
            placeholder: 'Digite seu nome completo',
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            placeholder: 'Digite seu email',
        },
        {
            name: 'telefone',
            label: 'Telefone',
            type: 'tel',
            required: true,
            placeholder: '(00) 00000-0000',
        },
        {
            name: 'mensagem',
            label: 'Mensagem',
            type: 'textarea',
            required: true,
            placeholder: 'Digite sua mensagem...',
        },
    ];

    const handleSubmit = (data: Record<string, string>) => {
        console.log(data);
    };

    return (
        <div className="flex  justify-center min-h-screen bg-[#132536] py-12">
            <div className="w-full max-w-3xl px-4">
                <div className="flex flex-col justify-center mb-8">
                    <h1 className="text-white text-4xl font-bold">Entre em contato</h1>
                </div>
                <div className="bg-white items-center rounded-lg shadow-xl p-8">
                    <Formulario
                        fields={fields}
                        onSubmit={handleSubmit}
                        submitLabel="Enviar Mensagem"
                        className="space-y-6"
                    />
                </div>
            </div>
        </div>

    )
}

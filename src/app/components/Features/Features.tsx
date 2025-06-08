import Item from './Item/Item';

export default function Features() {
    const listas = [
        {
            imageSrc: '/previsao.jpg',
            title: 'Previsão de Enchentes com IA',
            description: 'Antecipe riscos com nosso modelo de machine learning treinado em dados meteorológicos e hidrológicos. A plataforma classifica o risco de enchente como alto, médio ou baixo nas próximas 24 horas, ajudando no planejamento e prevenção.',
            linkText: 'Ver mais sobre o modelo de IA',
            linkHref: '/sobre'
        },
        {
            imageSrc: '/mapa.jpg',
            title: 'Alerta Geolocalizado em Tempo Real',
            description: 'Envie e visualize alertas automáticos baseados na localização dos sensores IoT espalhados pela cidade. A população é notificada imediatamente via app ou SMS, com rotas de fuga e recomendações de segurança.',
            linkText: 'Saiba como os alertas funcionam',
            linkHref: '/sobre'
        },
        {
            imageSrc: '/dashboard.png',
            title: 'Dashboard Interativo para Gestão de Ocorrências',
            description: 'Acompanhe, em tempo real, todas as ocorrências reportadas. Consulte áreas mais críticas, tempo médio de resposta e regiões com maior volume de relatos. A ferramenta ideal para tomada de decisão rápida.',   
            linkText: 'Acesse o dashboard de gestão',
            linkHref: '/riscos'
        }
    ]

    return (
        <>
            <div className="bg-[#132536]">
                <div className="py-25 items-center justify-center">
                    <div className="pb-10 text-center">
                        <h1 className="text-[#F5FAFF] text-4xl">Funcionalidades</h1>
                    </div>
                    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-10 px-8 md:px-4">
                        {listas.map((lista, index) => (
                            <Item
                                key={index}
                                imageSrc={lista.imageSrc}
                                title={lista.title}
                                description={lista.description}
                                linkText={lista.linkText}
                                linkHref={lista.linkHref}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
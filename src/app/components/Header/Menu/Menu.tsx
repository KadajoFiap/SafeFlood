import Link from "next/link";

export default function Menu() {

    const rotas = [

        {
            nome: "Riscos e rotas de fuga",
            href: "/riscos",
        }, {
            nome: "Entre em contato",
            href: "/contato",
        }, {
            nome: "Integrantes",
            href: "/integrantes",
        }
    ]
    return (
        <>
            <nav>
                <ul >
                    <div className="flex gap-10">
                        {rotas.map((rota, index) => (
                            <li key={index} className="text-[#F5FAFF]">
                                <Link
                                    href={rota.href}
                                    className="text-white"
                                >   
                                    {rota.nome}
                                </Link>
                            </li>
                        ))}
                    </div>
                </ul>
            </nav>
        </>
    );
}
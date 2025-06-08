import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";

export default function Menu() {
    const [open, setOpen] = useState(false);
    const { isAdmin } = useAuth();

    const rotas = [
        { nome: "Riscos e rotas de fuga", href: "/riscos" },
        { nome: "Sobre", href: "/sobre" },
        { nome: "Integrantes", href: "/integrantes" },
        ...(isAdmin ? [{ nome: "Painel", href: "/painel" }] : [])
    ];

    return (
        <>
            {/* Menu normal (desktop/tablet) */}
            <nav className="hidden sm:block">
                <ul>
                    <div className="flex gap-10">
                        {rotas.map((rota, index) => (
                            <li key={index} className="text-[#F5FAFF]">
                                <Link href={rota.href} className="text-white font-semibold">
                                    {rota.nome}
                                </Link>
                            </li>
                        ))}
                    </div>
                </ul>
            </nav>

            {/* Botão hamburguer (mobile) */}
            <button
                className="flex sm:hidden flex-col justify-center items-center w-10 h-10 z-[1003]"
                onClick={() => setOpen(!open)}
                aria-label={open ? "Fechar menu" : "Abrir menu"}
            >
                <span
                    className={`block w-8 h-1 bg-white rounded transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`}
                ></span>
                <span
                    className={`block w-8 h-1 bg-white rounded transition-all duration-300 my-1 ${open ? "opacity-0" : ""}`}
                ></span>
                <span
                    className={`block w-8 h-1 bg-white rounded transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`}
                ></span>
            </button>

            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-40 z-[1001] transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={() => setOpen(false)}
            />

            {/* Drawer menu mobile ocupando a tela toda */}
            <div
                className={`fixed inset-0 bg-[#132536] z-[1002] shadow-lg transform transition-transform duration-300 flex flex-col gap-10 pt-32 px-8 sm:hidden
                ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                {rotas.map((rota, index) => (
                    <Link
                        key={index}
                        href={rota.href}
                        className="text-white font-semibold text-2xl"
                        onClick={() => setOpen(false)}
                    >
                        {rota.nome}
                    </Link>
                ))}
            </div>
        </>
    );
}
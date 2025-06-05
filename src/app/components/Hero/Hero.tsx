'use client';

import { useRouter } from "next/navigation";
import Button from "../Button/Button";

export default function Hero() {
    const router = useRouter();

    return (
        <div className="bg-[#132536] h-screen">
            <div
                className="flex flex-col justify-center h-screen"
                style={{
                    backgroundImage: "url('/homem_na_chuva.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "60% center",
                }}
            >
                <div className="px-8 md:px-4 md:pl-60 md:pr-16 w-full md:w-2/5 text-white text-3xl md:text-5xl font-bold">
                    <h1>
                        Enchentes não podem mais te pegar de surpresa
                    </h1>
                    <span className="text-white text-base md:text-3xl font-medium">
                        SafeFlood antecipa riscos, protege vidas e conecta sua cidade em tempo real.
                    </span>
                    <div className="flex flex-col md:flex-row gap-4 pt-4">
                        <Button className="w-full bg-white"
                            onClick={() => {
                                router.push('/riscos');
                            }}>
                            Conheça o SafeFlood
                        </Button>
                        <Button
                            className="w-full"
                            onClick={() => {
                                router.push('/riscos');
                            }}>
                            Ver alertas
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

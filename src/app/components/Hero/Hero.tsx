import Button from "../Button/Button";

export default function Hero() {
    return (
        <div className="bg-[#132536] h-screen">
            <div 
                className="flex flex-col justify-center h-screen"
                style={{
                    backgroundImage: "url('/homem_na_chuva.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="pl-60 w-1/3 text-white text-5xl font-bold">
                    <h1>
                        Enchentes não podem mais te pegar de surpresa
                    </h1>
                    <span className="text-white text-3xl font-medium">
                        SafeFlood antecipa riscos, protege vidas e conecta sua cidade em tempo real.
                    </span>
                    <Button className="w-full">
                        Começar agora
                    </Button>
                </div>
            </div>
        </div>
    );
}

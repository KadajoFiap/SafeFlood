import Image from "next/image";

export default function Membro() {

    const membros = [
        {
            "name": "Kaue Samartino",
            "photo": "/kaue.jpg",
            "rm": "559317",
            "alt": "foto de Kaue Samartino"
        }, 
        {
            "name": "Davi Praxedes",
            "photo": "/xeds.jpg",
            "rm": "560719",
            "alt": "foto de Davi Praxedes"
        }, 
        {
            "name": "João dos Santos",
            "photo": "/foto_joao.jpg",
            "rm": "560400",
            "alt": "foto de João"
        }, 
        
        
    ]
    return (
        <div className="pt-30 lg:pt-20 2xl:pt-40 lg:flex md:flex md:justify-center md:gap-14 lg:gap-40">
            {membros.map((integrante, index) => (
                <div key={index} className="pb-20">
                    <div className="flex justify-center">
                        <Image className='rounded-[10rem] border-4 border-amber-300'
                            src={integrante.photo}
                            alt={integrante.alt}
                            width={255}
                            height={0}
                            priority
                        />
                    </div>

                    <div className="md:content-center">
                        <h1 className='text-[24px] text-[#F5FAFF] font-semibold pt-5'>{integrante.name}</h1>
                        <span className='text-[18px] text-amber-300'>{integrante.rm}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}
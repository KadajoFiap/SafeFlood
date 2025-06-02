import Link from "next/link";
import { Poly } from "next/font/google";

const poly = Poly({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function Logo() {
    return (
        <>
            <div className={`text-[#F5FAFF] text-3xl font-bold ${poly.className}`}>
                <Link href="/">
                    Safe<span className="text-amber-300">Flood</span>
                </Link>
            </div>
        </>
    );
}
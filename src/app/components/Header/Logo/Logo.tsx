import Link from "next/link";

export default function Logo() {
    return (
        <>
            <div className="text-white text-2xl font-bold">
                <Link href="/">
                    SafeFlood
                </Link>
            </div>
        </>
    );
}
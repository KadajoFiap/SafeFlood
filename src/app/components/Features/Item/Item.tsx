import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

export default function Item({
    imageSrc,
    title,
    description,
    linkText,
    linkHref,
}: {
    imageSrc: string;
    title: string;
    description: string;
    linkText: string;
    linkHref: string;
}) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <Image 
                src={imageSrc} 
                alt={title} 
                width={300} 
                height={200} 
                className="w-full h-40 object-cover rounded-md mb-4" 
            />
            <h2 className="text-xl font-semibold text-[#132536] mb-2">{title}</h2>
            <p className="text-gray-600 mb-4">{description}</p>
            <Link href={linkHref} className="text-[#0078D4] hover:underline flex items-center">
                {linkText}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </Link>
        </div>
    );
}
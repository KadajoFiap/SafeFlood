import { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    className = '',
    type = 'button',
    disabled = false
}: ButtonProps) {
    const baseStyles = "font-bold rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variants = {
        primary: "bg-amber-300 text-[#132536] hover:bg-amber-400 focus:ring-amber-300",
        secondary: "bg-[#132536] text-amber-300 border-2 border-amber-300 hover:bg-amber-300 hover:text-[#132536] focus:ring-amber-300",
        outline: "bg-transparent text-amber-300 border-2 border-amber-300 hover:bg-amber-300 hover:text-[#132536] focus:ring-amber-300"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };

    const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                ${baseStyles}
                ${variants[variant]}
                ${sizes[size]}
                ${disabledStyles}
                ${className}
            `}
        >
            {children}
        </button>
    );
}
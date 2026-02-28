import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
}

export default function Button({
    variant = "primary",
    className,
    disabled,
    children,
    ...props
}: ButtonProps) {
    const baseClasses = "rounded-xl text-sm font-semibold transition-all focus:outline-none cursor-pointer";

    const variantClasses = clsx({
        "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50": variant === "primary",
        "text-slate-500 hover:text-slate-700": variant === "secondary",
    });

    const sizeClasses = clsx({
        "px-8 py-2": variant === "primary",
        "px-6 py-2": variant === "secondary",
    });

    return (
        <button
            className={clsx(baseClasses, variantClasses, sizeClasses, className)}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
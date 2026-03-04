import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Button = ({ children, variant = 'primary', loading, disabled, className, ...props }) => {
    const variants = {
        primary: "bg-primary text-black hover:bg-white shadow-neon-lime hover:shadow-white/20",
        secondary: "bg-transparent border border-white/10 text-white hover:bg-white/5",
        outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-black",
    };

    return (
        <button
            disabled={disabled || loading}
            className={cn(
                "relative flex items-center justify-center px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none overflow-hidden group",
                variants[variant],
                className
            )}
            {...props}
        >
            <span className={cn("transition-opacity", loading ? "opacity-0" : "opacity-100")}>
                {children}
            </span>

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Glitch/Shine Effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
        </button>
    );
};

export default Button;

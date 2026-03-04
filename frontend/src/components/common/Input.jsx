import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Input = ({ label, error, icon: Icon, className, ...props }) => {
    return (
        <div className="w-full mb-4">
            {label && (
                <label className="block text-xs font-black uppercase tracking-widest text-neutral-500 mb-2 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={cn(
                        "w-full bg-neutral-900/50 border border-white/5 rounded-2xl py-3 px-4 text-sm transition-all outline-none focus:border-primary/50 focus:bg-neutral-800 placeholder:text-neutral-600",
                        Icon && "pl-12",
                        error && "border-red-500/50 focus:border-red-500",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-tight mt-1 ml-4 block">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;

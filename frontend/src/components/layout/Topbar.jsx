import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Topbar = ({ userRole = 'scout', onMenuToggle }) => {
    const { user } = useAuth();

    return (
        <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-[70px] bg-background/80 backdrop-blur-md border-b border-white/5 z-30 px-5 md:px-10 flex items-center justify-between">

            {/* Left: Menu + Search */}
            <div className="flex items-center gap-4 flex-1 max-w-xl">
                {/* Hamburger Menu - Mobile only */}
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
                >
                    <Menu size={20} />
                </button>

                {/* Search */}
                <div className="flex-1 relative group hidden sm:block">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors"
                    />
                    <input
                        type="text"
                        placeholder="Search athletes, scouts, or metrics..."
                        className="w-full bg-neutral-900/50 border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:bg-neutral-800 transition-all placeholder:text-neutral-600"
                    />
                </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4 md:gap-8">
                <button className="relative p-2 text-neutral-400 hover:text-white transition-colors">
                    <Bell size={20} />
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-background" />
                </button>

                <div className="flex items-center gap-3 md:gap-4 border-l border-white/10 pl-4 md:pl-8">
                    <div className="text-right flex flex-col items-end hidden sm:flex">
                        <span className="text-sm font-bold tracking-wide">{user?.name || 'User'}</span>
                        <span
                            className={cn(
                                "text-[10px] uppercase font-black px-2 py-0.5 rounded-full tracking-widest",
                                userRole === 'athlete' ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                            )}
                        >
                            {userRole}
                        </span>
                    </div>

                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-neutral-800 border border-white/10 flex items-center justify-center p-0.5 overflow-hidden group hover:neon-border cursor-pointer transition-all">
                        <div className="w-full h-full rounded-[14px] bg-neutral-700 flex items-center justify-center">
                            <User size={20} className="text-neutral-400" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;

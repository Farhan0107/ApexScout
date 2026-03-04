import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, ShoppingBag, Bookmark, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const NavItem = ({ to, icon: Icon, label, roleRequirement, userRole, onClick }) => {
    if (roleRequirement && userRole !== roleRequirement) return null;

    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                cn(
                    "flex items-center gap-3 px-6 py-4 text-neutral-400 transition-all duration-300 border-l-4 border-transparent hover:bg-white/5 hover:text-white group",
                    isActive && "bg-primary/5 text-primary border-primary drop-shadow-[0_0_8px_rgba(226,255,102,0.2)]"
                )
            }
        >
            <Icon size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-semibold tracking-wide uppercase text-xs">{label}</span>
            <div className="ml-auto w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </NavLink>
    );
};

const Sidebar = ({ userRole = 'athlete', onClose }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleNavClick = () => {
        // Close sidebar on mobile when a nav item is clicked
        if (onClose) onClose();
    };

    return (
        <aside className="h-[100dvh] w-full bg-[#111] border-r border-white/5 flex flex-col fixed inset-y-0 left-0">
            <div className="p-8 pb-12 flex items-center justify-between shrink-0">
                <h1 className="text-2xl font-black text-primary uppercase tracking-tighter flex items-center gap-2">
                    Apex<span className="text-white">Scout</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                </h1>

                {/* Mobile close button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <nav className="flex-1 flex flex-col overflow-y-auto">
                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={handleNavClick} />

                {/* Athlete specific */}
                <NavItem
                    to="/profile/me"
                    icon={User}
                    label="My Profile"
                    roleRequirement="athlete"
                    userRole={userRole}
                    onClick={handleNavClick}
                />

                {/* Scout specific */}
                <NavItem
                    to="/marketplace"
                    icon={ShoppingBag}
                    label="Marketplace"
                    roleRequirement="scout"
                    userRole={userRole}
                    onClick={handleNavClick}
                />
                <NavItem
                    to="/watchlist"
                    icon={Bookmark}
                    label="Watchlist"
                    roleRequirement="scout"
                    userRole={userRole}
                    onClick={handleNavClick}
                />
            </nav>

            <div className="p-6 border-t border-white/5 mt-auto shrink-0">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-neutral-400 hover:text-red-400 hover:bg-red-400/5 transition-all text-sm font-bold uppercase tracking-widest"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

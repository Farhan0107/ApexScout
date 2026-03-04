import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Menu, X } from 'lucide-react';

const MainLayout = ({ userRole = 'scout' }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background relative overflow-x-hidden">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - hidden on mobile unless toggled */}
            <div className={`
                fixed left-0 top-0 bottom-0 w-[260px] z-50
                transition-transform duration-300 ease-in-out
                lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <Sidebar userRole={userRole} onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Primary Wrapper */}
            <div className="flex flex-col flex-1 lg:pl-[260px]">
                {/* Fixed Topbar */}
                <Topbar userRole={userRole} onMenuToggle={() => setSidebarOpen(true)} />

                {/* Dynamic Content Area */}
                <motion.main
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="mt-[70px] p-5 md:p-10 min-h-[calc(100vh-70px)] bg-transparent relative z-10"
                >
                    <Outlet />
                </motion.main>
            </div>

            {/* Premium Ambient Glowss with Animation */}
            <div className="fixed -top-1/4 -right-1/4 w-[50vw] h-[50vw] bg-radial-gradient from-primary/10 to-transparent rounded-full blur-[100px] mix-blend-screen pointer-events-none z-0 animate-float" />
            <div className="fixed -bottom-1/4 -left-1/4 w-[50vw] h-[50vw] bg-radial-gradient from-accent/10 to-transparent rounded-full blur-[100px] mix-blend-screen pointer-events-none z-0 animate-float-delayed" />
        </div>
    );
};

export default MainLayout;

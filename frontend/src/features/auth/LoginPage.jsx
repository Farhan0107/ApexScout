import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        const root = document.documentElement;
        let frame;

        const handleMouseMove = (e) => {
            if (frame) cancelAnimationFrame(frame);

            frame = requestAnimationFrame(() => {
                const x = e.clientX / window.innerWidth;
                const y = e.clientY / window.innerHeight;

                root.style.setProperty('--mouse-x', x);
                root.style.setProperty('--mouse-y', y);
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="auth-hero-wrapper min-h-screen flex items-center justify-center p-6 pb-28 bg-black">
            {/* 1. Layered Background System */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/60 via-[#0a0a0c] to-black z-0 pointer-events-none" />

            {/* Soft animated glow blobs */}
            <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-float opacity-20 pointer-events-none z-0" />
            <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-float opacity-10 pointer-events-none z-0" style={{ animationDelay: '2s', animationDuration: '15s' }} />

            {/* Cinematic Background Athlete Elements with Sweep */}
            <div className="athlete-layer athlete-runner" />
            <div className="athlete-layer athlete-football" />
            <div className="athlete-layer athlete-basketball" />
            <div className="light-sweep-layer" />

            {/* 5. Subtle Entrance Animation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo/Brand Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 mb-6 group hover:neon-border transition-all">
                        <Zap size={32} className="text-primary group-hover:drop-shadow-[0_0_8px_rgba(226,255,102,0.8)] transition-all" />
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">
                        Apex<span className="text-primary">scout</span>
                    </h1>
                    <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mt-2">
                        Performance Intelligence Portal
                    </p>
                </div>

                {/* 4. Glassmorphism Auth Card Upgrade */}
                <div className="bg-white/[0.02] border border-white/10 backdrop-blur-2xl rounded-[28px] p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.02)] relative overflow-hidden transition-transform duration-500 hover:-translate-y-[3px]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                    <form onSubmit={handleSubmit} className="space-y-2">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold p-4 rounded-2xl mb-6 text-center italic">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="name@athlete.net"
                            icon={Mail}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Access Password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            icon={Lock}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <div className="pt-4">
                            <Button type="submit" loading={loading} className="w-full">
                                Authenticate Session
                            </Button>
                        </div>
                    </form>

                    <p className="text-center mt-8 text-sm text-neutral-500 font-medium">
                        New operative?{' '}
                        <Link to="/register" className="text-primary font-bold hover:underline underline-offset-4">
                            Create Account
                        </Link>
                    </p>
                </div>
            </motion.div>

            {/* Trademark Footer */}
            <div className="absolute bottom-6 left-0 w-full text-center pointer-events-none z-10">
                <p className="text-neutral-600 font-bold uppercase tracking-[0.2em] text-[10px] drop-shadow-md">
                    &copy; {new Date().getFullYear()} ApexScout Intelligence LLC
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

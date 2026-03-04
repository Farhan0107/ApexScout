import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, ShieldCheck, Trophy, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { clsx } from 'clsx';

const RegisterPage = () => {
    const location = useLocation();

    // Read optional role parameter from URL
    const getInitialRole = () => {
        const params = new URLSearchParams(location.search);
        const roleParam = params.get('role');
        return (roleParam === 'athlete' || roleParam === 'scout') ? roleParam : 'athlete';
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: getInitialRole()
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const setRole = (role) => {
        setFormData({ ...formData, role });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await register(formData);

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
                className="w-full max-w-md relative z-10 py-10"
            >
                {/* Logo/Brand Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">
                        Join the <span className="text-primary underline decoration-4 underline-offset-8">Apex</span>
                    </h1>
                    <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mt-4">
                        Initialize your performance profile
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

                        {/* Role Selector */}
                        <div className="mb-6">
                            <label className="block text-xs font-black uppercase tracking-widest text-neutral-500 mb-3 ml-1">
                                Establish Role
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole('athlete')}
                                    className={clsx(
                                        "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all group",
                                        formData.role === 'athlete'
                                            ? "bg-accent/10 border-accent text-accent shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                                            : "bg-neutral-900/50 border-white/5 text-neutral-500 grayscale hover:grayscale-0 hover:border-accent/40"
                                    )}
                                >
                                    <Trophy size={20} className={formData.role === 'athlete' ? "animate-bounce" : ""} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Athlete</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('scout')}
                                    className={clsx(
                                        "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all group",
                                        formData.role === 'scout'
                                            ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(226,255,102,0.2)]"
                                            : "bg-neutral-900/50 border-white/5 text-neutral-500 grayscale hover:grayscale-0 hover:border-primary/40"
                                    )}
                                >
                                    <Target size={20} className={formData.role === 'scout' ? "animate-pulse" : ""} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Scout</span>
                                </button>
                            </div>
                        </div>

                        <Input
                            label="Full Name"
                            name="name"
                            type="text"
                            placeholder="Arjun Sharma"
                            icon={User}
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="arjun@nextgen.com"
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
                                Initialize Account
                            </Button>
                        </div>
                    </form>

                    <p className="text-center mt-8 text-sm text-neutral-500 font-medium">
                        Already established?{' '}
                        <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">
                            Authenticate
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;

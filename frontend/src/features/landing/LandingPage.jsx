import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, TrendingUp, Users, ArrowRight, Activity, Target, Eye, ChevronDown } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#0F0F12] text-white overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 transition-all duration-500"
                style={{
                    backgroundColor: scrollY > 50 ? 'rgba(15, 15, 18, 0.9)' : 'transparent',
                    backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
                    borderBottom: scrollY > 50 ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
                }}
            >
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-black text-[#E2FF66] uppercase tracking-tighter">
                            Apex<span className="text-white">Scout</span>
                        </h1>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E2FF66] animate-pulse" />
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-6 py-2.5 bg-[#E2FF66] text-[#0F0F12] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#CCFF00] transition-all hover:shadow-[0_0_30px_rgba(226,255,102,0.3)]"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-6">
                {/* Ambient Orbs */}
                <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#E2FF66]/5 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-[#22D3EE]/5 rounded-full blur-[150px] pointer-events-none" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }}
                />

                <div className="relative text-center max-w-5xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-8">
                        <div className="w-2 h-2 rounded-full bg-[#E2FF66] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                            Performance Intelligence Platform
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
                        Where <span className="text-[#E2FF66] italic">Elite</span>
                        <br />
                        Talent Meets
                        <br />
                        <span className="text-neutral-600">Opportunity</span>
                    </h1>

                    <p className="text-neutral-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                        The premier platform connecting top-tier athletes with professional scouts.
                        Real metrics. Real insights. Real results.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/register?role=athlete')}
                            className="group flex items-center gap-3 px-8 py-4 bg-[#E2FF66] text-[#0F0F12] rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#CCFF00] transition-all hover:shadow-[0_0_40px_rgba(226,255,102,0.3)]"
                        >
                            Join as Athlete
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/register?role=scout')}
                            className="group flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all"
                        >
                            <Eye size={18} />
                            Scout Talent
                        </button>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-600 animate-bounce">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">Explore</span>
                        <ChevronDown size={16} />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 text-[#22D3EE] mb-4">
                            <Activity size={16} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Platform Features</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
                            Built for <span className="text-[#E2FF66] italic">Champions</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: TrendingUp,
                                title: 'Performance Radar',
                                description: 'Multi-dimensional analysis with real-time normalized radar charts. Visualize speed, power, stamina, and more.',
                                color: '#E2FF66',
                            },
                            {
                                icon: Shield,
                                title: 'Scout Verification',
                                description: 'Verified badge system where professional scouts can audit and validate athlete performance data.',
                                color: '#22D3EE',
                            },
                            {
                                icon: Users,
                                title: 'Talent Marketplace',
                                description: 'Advanced filtering and sorting engine to discover athletes by sport, metrics, and verification status.',
                                color: '#E2FF66',
                            },
                            {
                                icon: Target,
                                title: 'Head-to-Head Compare',
                                description: 'Side-by-side athlete comparison with metric-level breakdowns, win counts, and Apex Score calculations.',
                                color: '#22D3EE',
                            },
                            {
                                icon: Eye,
                                title: 'Watchlist Tracking',
                                description: 'Build your personal watchlist of athletes. Stay informed as they update their performance data.',
                                color: '#E2FF66',
                            },
                            {
                                icon: Zap,
                                title: 'Instant Normalization',
                                description: 'Real-time preview mode lets athletes see their normalized metrics update as they input raw data.',
                                color: '#22D3EE',
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="group bg-white/[0.02] border border-white/5 rounded-[28px] p-8 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500"
                            >
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500 group-hover:scale-110"
                                    style={{
                                        backgroundColor: `${feature.color}10`,
                                        borderColor: `${feature.color}20`,
                                        color: feature.color,
                                    }}
                                >
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-white font-black uppercase tracking-tight text-lg mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-neutral-500 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 px-6 border-y border-white/5">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { value: '500+', label: 'Athletes', color: '#E2FF66' },
                        { value: '50+', label: 'Scouts', color: '#22D3EE' },
                        { value: '6', label: 'Sports', color: '#E2FF66' },
                        { value: '24/7', label: 'Live Data', color: '#22D3EE' },
                    ].map((stat, i) => (
                        <div key={i}>
                            <div className="text-4xl md:text-5xl font-black tabular-nums mb-2" style={{ color: stat.color }}>
                                {stat.value}
                            </div>
                            <p className="text-[10px] font-black uppercase text-neutral-500 tracking-[0.2em]">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6">
                <div className="max-w-4xl mx-auto text-center relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#E2FF66]/5 via-transparent to-[#22D3EE]/5 rounded-[48px] blur-xl" />

                    <div className="relative bg-white/[0.02] border border-white/5 rounded-[48px] p-16 md:p-20">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                            Ready to <span className="text-[#E2FF66] italic">Dominate</span>?
                        </h2>
                        <p className="text-neutral-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                            Join the platform where performance speaks louder than promises.
                        </p>
                        <button
                            onClick={() => navigate('/register')}
                            className="group inline-flex items-center gap-3 px-10 py-5 bg-[#E2FF66] text-[#0F0F12] rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#CCFF00] transition-all hover:shadow-[0_0_50px_rgba(226,255,102,0.3)]"
                        >
                            Create Your Profile
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-10 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[#E2FF66] uppercase tracking-tighter">
                            Apex<span className="text-white">Scout</span>
                        </span>
                        <div className="w-1 h-1 rounded-full bg-[#E2FF66]" />
                    </div>
                    <p className="text-neutral-600 text-xs font-medium">
                        © 2026 ApexScout. Performance Intelligence Platform.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

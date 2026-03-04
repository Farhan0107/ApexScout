import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, Bookmark, TrendingUp, ArrowRight, Shield, Zap, Eye, Target } from 'lucide-react';
import { getAthletes, getWatchlist } from '../../services/scoutService';

const StatCard = ({ icon: Icon, label, value, color = 'primary', onClick }) => (
    <button
        onClick={onClick}
        className="bg-neutral-800/30 border border-white/5 rounded-[28px] p-6 text-left hover:border-primary/10 hover:shadow-lg transition-all duration-500 group w-full"
    >
        <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-2xl bg-${color}/10 flex items-center justify-center text-${color} border border-${color}/20`}>
                <Icon size={22} />
            </div>
            <ArrowRight size={16} className="text-neutral-700 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
        <div className="text-3xl font-black text-white tabular-nums mb-1">{value}</div>
        <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">{label}</p>
    </button>
);

const ScoutDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalAthletes: 0, watchlistCount: 0, verifiedCount: 0 });
    const [recentAthletes, setRecentAthletes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const [athleteRes, watchlistRes, verifiedRes] = await Promise.all([
                getAthletes({ page: 1, limit: 5 }),
                getWatchlist(),
                getAthletes({ isVerified: 'true', limit: 1 }),
            ]);

            setStats({
                totalAthletes: athleteRes.success ? athleteRes.count : 0,
                watchlistCount: watchlistRes.success ? (watchlistRes.data?.length || 0) : 0,
                verifiedCount: verifiedRes.success ? verifiedRes.count : 0,
            });

            if (athleteRes.success) {
                setRecentAthletes(athleteRes.data || []);
            }

            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 animate-pulse-slow text-accent mb-2 drop-shadow-md">
                    <Activity size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Command Center</span>
                </div>
                <h1 className="text-5xl font-black text-white uppercase tracking-tighter drop-shadow-xl">
                    Scout <span className="text-neutral-500 italic drop-shadow-none cursor-default">Dashboard</span>
                </h1>
                <p className="text-neutral-500 text-sm font-medium mt-2">
                    Welcome back. Here's your scouting overview.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    icon={Users}
                    label="Total Athletes"
                    value={stats.totalAthletes}
                    color="accent"
                    onClick={() => navigate('/marketplace')}
                />
                <StatCard
                    icon={Bookmark}
                    label="Watchlisted"
                    value={stats.watchlistCount}
                    color="primary"
                    onClick={() => navigate('/watchlist')}
                />
                <StatCard
                    icon={Shield}
                    label="Verified"
                    value={stats.verifiedCount}
                    color="emerald-400"
                    onClick={() => navigate('/marketplace')}
                />
                <StatCard
                    icon={Target}
                    label="Conversion"
                    value={stats.totalAthletes > 0 ? `${Math.round((stats.watchlistCount / stats.totalAthletes) * 100)}%` : '0%'}
                    color="amber-400"
                    onClick={() => navigate('/watchlist')}
                />
            </div>

            {/* Recent Athletes */}
            <div className="glass-panel overflow-hidden transition-all duration-300">
                <div className="p-8 pb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight drop-shadow-md">
                            Recent <span className="text-accent italic drop-shadow-none">Talent</span>
                        </h2>
                        <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                            Latest athletes on the platform
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/marketplace')}
                        className="flex items-center gap-2 text-accent text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors group"
                    >
                        View All
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {recentAthletes.length === 0 ? (
                    <div className="p-8 text-center text-neutral-500 text-sm">No athletes on the platform yet.</div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {recentAthletes.map((athlete, index) => {
                            const user = athlete.userId || {};
                            const metrics = athlete.normalizedMetrics || {};
                            const vals = Object.values(metrics).filter(v => typeof v === 'number');
                            const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;

                            return (
                                <div key={athlete._id || index} className="flex items-center gap-4 px-8 py-5 hover:bg-white/[0.04] transition-all duration-300 hover:px-10 cursor-pointer" onClick={() => navigate('/marketplace')}>
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center text-accent font-black text-sm border border-accent/10 flex-shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white text-sm font-bold flex items-center gap-2 truncate drop-shadow-sm">
                                            {user.name || 'Unknown'}
                                            {athlete.isVerified && <Shield size={12} className="text-primary flex-shrink-0" fill="currentColor" />}
                                        </h4>
                                        <p className="text-neutral-600 text-[10px] font-bold uppercase tracking-widest truncate">
                                            {athlete.sportType || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className={`text-lg font-black tabular-nums drop-shadow-md ${avg >= 70 ? 'text-primary' : avg >= 40 ? 'text-accent' : 'text-neutral-500'}`}>
                                            {avg}
                                        </div>
                                        <span className="text-[8px] font-black uppercase text-neutral-600 tracking-widest">APEX</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <button
                    onClick={() => navigate('/marketplace')}
                    className="group glass-panel border border-accent/20 hover:border-accent p-8 text-left hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:-translate-y-2 transition-all duration-500 will-change-transform"
                >
                    <div className="flex items-center justify-between mb-4">
                        <Users size={28} className="text-accent drop-shadow-md" />
                        <ArrowRight size={18} className="text-accent/40 group-hover:text-accent group-hover:translate-x-2 transition-all duration-300" />
                    </div>
                    <h3 className="text-white font-black uppercase text-lg tracking-tight mb-1 group-hover:text-accent transition-colors drop-shadow-sm">Browse Marketplace</h3>
                    <p className="text-neutral-500 text-xs">Discover new athletic talent with advanced filters</p>
                </button>

                <button
                    onClick={() => navigate('/watchlist')}
                    className="group glass-panel border border-primary/20 hover:border-primary p-8 text-left hover:shadow-[0_0_30px_rgba(226,255,102,0.2)] hover:-translate-y-2 transition-all duration-500 will-change-transform"
                >
                    <div className="flex items-center justify-between mb-4">
                        <Bookmark size={28} className="text-primary drop-shadow-md" />
                        <ArrowRight size={18} className="text-primary/40 group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                    </div>
                    <h3 className="text-white font-black uppercase text-lg tracking-tight mb-1 group-hover:text-primary transition-colors drop-shadow-sm">My Watchlist</h3>
                    <p className="text-neutral-500 text-xs">Review and manage your tracked athletes</p>
                </button>
            </div>
        </div>
    );
};

export default ScoutDashboard;

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity, Users, Bookmark, TrendingUp, ArrowRight, Shield,
    Zap, Eye, Target, Briefcase, Users2, Star, CheckCircle2
} from 'lucide-react';
import { getAthletes } from '../../services/scoutService';
import ScoutAnalyticsCard from './ScoutAnalyticsCard';
import { useAuth } from '../../context/AuthContext';
import { useAnalytics } from '../../context/AnalyticsContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ScoutDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { analytics, fetchAnalytics, loading: analyticsLoading } = useAnalytics();
    const [recentAthletes, setRecentAthletes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user || user.role !== 'scout') {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Fetch analytics (global) and recent athletes (local)
                await Promise.all([
                    fetchAnalytics(),
                    (async () => {
                        const res = await getAthletes({ page: 1, limit: 5 });
                        if (res.success) {
                            setRecentAthletes(res.data?.data || res.data || []);
                        }
                    })()
                ]);
            } catch (error) {
                console.error("Dashboard component fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, fetchAnalytics]);

    const stats = analytics;

    const chartData = useMemo(() => {
        if (!stats) return null;
        const dist = stats.pipelineDistribution || {};
        return {
            labels: ['Prospects', 'Shortlisted', 'Contacted', 'Signed', 'Pass'],
            datasets: [
                {
                    label: 'Athlete Volume',
                    data: [dist.Prospect || 0, dist.Shortlisted || 0, dist.Contacted || 0, dist.Signed || 0, dist.Pass || 0],
                    backgroundColor: [
                        'rgba(115, 115, 115, 0.2)', // Gray
                        'rgba(34, 211, 238, 0.2)',  // Cyan
                        'rgba(251, 191, 36, 0.2)',  // Amber
                        'rgba(226, 255, 102, 0.2)', // Lime
                        'rgba(239, 68, 68, 0.2)',   // Red
                    ],
                    borderColor: [
                        '#737373',
                        '#22D3EE',
                        '#FBBF24',
                        '#E2FF66',
                        '#EF4444',
                    ],
                    borderWidth: 1,
                    borderRadius: 12,
                },
            ],
        };
    }, [stats]);

    const chartOptions = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1C1C21',
                padding: 12,
                cornerRadius: 12,
                titleFont: { size: 10, weight: 'bold', family: 'Inter' }
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.03)' },
                ticks: { color: '#555', font: { size: 9, weight: 'bold' } }
            },
            y: {
                grid: { display: false },
                ticks: { color: '#aaa', font: { size: 10, weight: 'black', family: 'Inter' } }
            }
        },
        maintainAspectRatio: false
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Default stats if none found
    const dStats = stats || {
        totalProspects: 0,
        contacted: 0,
        signed: 0,
        averageRating: 0,
        pipelineDistribution: {}
    };

    const conversionRate = dStats.contacted > 0
        ? Math.round((dStats.signed / dStats.contacted) * 100)
        : 0;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 animate-pulse-slow text-accent mb-2 drop-shadow-md">
                        <Activity size={18} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Command Center v2.0</span>
                    </div>
                    <h1 className="text-5xl font-black text-white uppercase tracking-tighter drop-shadow-xl">
                        Performance <span className="text-neutral-500 italic drop-shadow-none cursor-default text-3xl md:text-5xl">Analytics</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4 bg-black/40 p-4 rounded-3xl border border-white/5 backdrop-blur-md">
                    <div className="text-right">
                        <div className="text-3xl font-black text-primary drop-shadow-neon-lime">{conversionRate}%</div>
                        <div className="text-[8px] font-black uppercase text-neutral-600 tracking-widest">Global conversion</div>
                    </div>
                    <div className="w-px h-10 bg-white/5 mx-2" />
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Target size={20} />
                    </div>
                </div>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ScoutAnalyticsCard
                    title="Active Prospects"
                    value={dStats.totalProspects}
                    subtext="Available in pipeline"
                    icon={Users2}
                    color="neutral-500"
                />
                <ScoutAnalyticsCard
                    title="In Engagement"
                    value={dStats.contacted}
                    subtext="Outreach initiated"
                    icon={Zap}
                    color="accent"
                    trend="+4% v/m"
                />
                <ScoutAnalyticsCard
                    title="Contracts Signed"
                    value={dStats.signed}
                    subtext="Successful onboarding"
                    icon={CheckCircle2}
                    color="primary"
                />
                <ScoutAnalyticsCard
                    title="Average Rating"
                    value={dStats.averageRating}
                    subtext="Your evaluation precision"
                    icon={Star}
                    color="amber-400"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full items-stretch">
                {/* Pipeline Bar Chart */}
                <div className="xl:col-span-8 bg-surface border border-white/5 rounded-[40px] p-8 lg:p-10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight italic">Status Distribution</h2>
                            <p className="text-neutral-500 text-[9px] font-black uppercase tracking-widest mt-1 italic opacity-50">Volume breakdown by pipeline stage</p>
                        </div>
                        <div className="bg-white/5 p-2 rounded-xl group-hover:bg-white/10 transition-colors">
                            <TrendingUp size={16} className="text-accent" />
                        </div>
                    </div>

                    <div className="h-[280px] w-full relative">
                        {chartData ? <Bar data={chartData} options={chartOptions} /> : null}
                    </div>
                </div>

                {/* Top Rated Spotlight */}
                <div className="xl:col-span-4 space-y-8 flex flex-col justify-stretch">
                    <div className="bg-surface border border-white/5 rounded-[40px] p-8 flex-1 relative overflow-hidden group/top hover:shadow-[0_0_50px_rgba(226,255,102,0.1)] transition-all">
                        <div className="flex items-center gap-3 mb-8">
                            <Star size={16} className="text-amber-400" fill="currentColor" />
                            <h2 className="text-xs font-black text-white uppercase tracking-[0.2em]">Top Rated Discover</h2>
                        </div>

                        {dStats.topRatedAthlete ? (
                            <div className="text-center py-6">
                                <div className="w-20 h-20 mx-auto rounded-3xl bg-neutral-900 border border-amber-400/20 flex items-center justify-center text-3xl font-black text-amber-400/30 mb-6 group-hover/top:scale-110 transition-transform duration-500 shadow-inner italic">
                                    {dStats.topRatedAthlete.name?.charAt(0)}
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-1">
                                    {dStats.topRatedAthlete.name}
                                </h3>
                                <div className="flex items-center justify-center gap-2 mb-8">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star
                                            key={s}
                                            size={12}
                                            fill={dStats.topRatedAthlete.rating >= s ? 'currentColor' : 'none'}
                                            className={dStats.topRatedAthlete.rating >= s ? 'text-amber-400' : 'text-neutral-800'}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={() => navigate(`/athlete/${dStats.topRatedAthlete.id}`)}
                                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white hover:bg-white/10 transition-all group-hover/top:border-amber-400/30"
                                >
                                    Deep Dive Profile
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-20 text-neutral-500 text-[10px] uppercase font-black tracking-widest italic opacity-40">
                                No evaluations logged
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Navigation Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <button
                    onClick={() => navigate('/marketplace')}
                    className="group glass-panel border border-accent/20 hover:border-accent p-8 text-left hover:shadow-[0_0_40px_rgba(34,211,238,0.1)] hover:-translate-y-2 transition-all duration-700 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users size={80} />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <Users size={28} className="text-accent drop-shadow-md" />
                        <ArrowRight size={18} className="text-accent/40 group-hover:text-accent group-hover:translate-x-2 transition-all duration-300" />
                    </div>
                    <h3 className="text-white font-black uppercase text-lg tracking-tight mb-1 group-hover:text-accent transition-colors">Expand Pipeline</h3>
                    <p className="text-neutral-500 text-xs font-medium">Head to the marketplace to discover elite athletic talent.</p>
                </button>

                <button
                    onClick={() => navigate('/watchlist')}
                    className="group glass-panel border border-primary/20 hover:border-primary p-8 text-left hover:shadow-[0_0_40px_rgba(226,255,102,0.1)] hover:-translate-y-2 transition-all duration-700 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Bookmark size={80} />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <Bookmark size={28} className="text-primary drop-shadow-md" />
                        <ArrowRight size={18} className="text-primary/40 group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                    </div>
                    <h3 className="text-white font-black uppercase text-lg tracking-tight mb-1 group-hover:text-primary transition-colors">Manage Pipeline</h3>
                    <p className="text-neutral-500 text-xs font-medium">Refine your active watchlist and transition prospects.</p>
                </button>
            </div>
        </div>
    );
};

export default ScoutDashboard;

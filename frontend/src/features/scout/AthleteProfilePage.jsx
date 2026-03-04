import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Shield,
    Star,
    Clock,
    CheckCircle2,
    TrendingUp,
    Activity,
    Edit3,
    ArrowUpRight,
    Video,
    Play,
    Image as ImageIcon,
    ExternalLink
} from 'lucide-react';
import {
    updateAthleteMeta
} from '../../services/scoutService';
import { useAnalytics } from '../../context/AnalyticsContext';
import { getAthleteMedia } from '../../services/mediaService';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const AthleteProfilePage = () => {
    const { athleteId } = useParams();
    const navigate = useNavigate();
    const { fetchAnalytics } = useAnalytics();

    const [athlete, setAthlete] = useState(null);
    const [meta, setMeta] = useState({ rating: 1, status: 'None', notes: '' });
    const [media, setMedia] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedNotice, setSavedNotice] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [athleteRes, metaRes, mediaRes] = await Promise.all([
                    getAthleteById(athleteId),
                    getAthleteMeta(athleteId),
                    getAthleteMedia(athleteId)
                ]);

                if (athleteRes.success) {
                    setAthlete(athleteRes.data);
                }
                if (metaRes.success && metaRes.data) {
                    setMeta({
                        rating: metaRes.data.rating || 1,
                        status: metaRes.data.status || 'None',
                        notes: metaRes.data.notes || ''
                    });
                }
                if (mediaRes.success) {
                    setMedia(mediaRes.data);
                }
            } catch (err) {
                console.error("AthleteProfilePage fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [athleteId]);

    const handleUpdateMeta = async (updates) => {
        const newMeta = { ...meta, ...updates };
        setMeta(newMeta);
    };

    const handleCommitMeta = async () => {
        setSaving(true);
        const res = await updateAthleteMeta(athleteId, meta);
        setSaving(false);
        if (res.success) {
            fetchAnalytics(); // Sync global dashboard with new status/rating
            setSavedNotice(true);
            setTimeout(() => setSavedNotice(false), 2000);
        }
    };

    const radarData = useMemo(() => {
        if (!athlete) return null;
        const metrics = athlete.normalizedMetrics || {};
        return {
            labels: ['Speed', 'Vertical', 'Points', 'Assists', 'Stamina', 'Wingspan'],
            datasets: [{
                label: 'Performance Profile',
                data: [
                    metrics.speed || 0,
                    metrics.verticalLeap || 0,
                    metrics.pointsPerGame || 0,
                    metrics.assists || 0,
                    metrics.stamina || 0,
                    metrics.wingspan || 0
                ],
                backgroundColor: 'rgba(226, 255, 102, 0.2)',
                borderColor: '#E2FF66',
                borderWidth: 2,
                pointBackgroundColor: '#E2FF66',
                pointBorderColor: '#fff',
            }]
        };
    }, [athlete]);

    const radarOptions = {
        scales: {
            r: {
                angleLines: { color: 'rgba(255, 255, 255, 0.05)' },
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                pointLabels: {
                    color: '#888',
                    font: { family: 'Inter', size: 10, weight: 'bold' }
                },
                ticks: { display: false, max: 100, stepSize: 20 },
                suggestedMin: 0,
                suggestedMax: 100
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1C1C21',
                padding: 12,
                cornerRadius: 12,
            }
        },
        maintainAspectRatio: false
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!athlete) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Athlete Profile Unavailable</h2>
                <button onClick={() => navigate(-1)} className="mt-4 text-primary font-bold uppercase text-xs tracking-widest hover:underline">
                    Return to Terminal
                </button>
            </div>
        );
    }

    const { userId: user, rawMetrics: raw, normalizedMetrics: norm } = athlete;

    // Calculate Apex Score
    const normValues = Object.values(norm || {}).filter(v => typeof v === 'number');
    const apexScore = normValues.length > 0 ? Math.round(normValues.reduce((a, b) => a + b, 0) / normValues.length) : 0;

    return (
        <div className="pb-20 animate-in fade-in duration-700">
            {/* Header Nav */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-neutral-500 hover:text-white transition-all group mb-8"
            >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <ChevronLeft size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Marketplace</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Intelligence (70%) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Athlete Identity */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface border border-white/5 rounded-[32px] p-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-transparent opacity-50" />

                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-3xl bg-neutral-900 border border-white/5 flex items-center justify-center text-3xl font-black text-white/20 shadow-inner relative overflow-hidden group">
                                {user.name?.charAt(0).toUpperCase()}
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">
                                        {user.name}
                                    </h1>
                                    {athlete.isVerified && (
                                        <div className="bg-primary/10 text-primary p-1.5 rounded-lg border border-primary/20 shadow-[0_0_15px_rgba(226,255,102,0.1)]">
                                            <Shield size={16} fill="currentColor" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-neutral-500">
                                    <span className="text-[10px] font-black uppercase tracking-widest">{athlete.sportType}</span>
                                    <div className="w-1 h-1 rounded-full bg-neutral-700" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{user.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 px-6 py-4 bg-black/40 rounded-2xl border border-white/5 backdrop-blur-md">
                            <div className="text-center">
                                <div className="text-3xl font-black text-primary drop-shadow-neon-lime">{apexScore}</div>
                                <div className="text-[9px] font-black uppercase text-neutral-500 tracking-widest">Apex Ratio</div>
                            </div>
                            <div className="w-px h-8 bg-white/5" />
                            <div className="text-center">
                                <div className="text-3xl font-black text-white opacity-40 italic">#PRO</div>
                                <div className="text-[9px] font-black uppercase text-neutral-500 tracking-widest">Tier</div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Visuals */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Radar Chart */}
                        <div className="bg-surface border border-white/5 rounded-[32px] p-8 flex flex-col items-center justify-center min-h-[450px]">
                            <div className="flex items-center gap-3 mb-8 w-full">
                                <Activity size={16} className="text-accent" />
                                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Intelligence Overlay</h3>
                            </div>
                            <div className="w-full h-[300px] relative">
                                <Radar data={radarData} options={radarOptions} />
                            </div>
                        </div>

                        {/* Metric Breakdown */}
                        <div className="bg-surface border border-white/5 rounded-[32px] p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <TrendingUp size={16} className="text-primary" />
                                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Performance Audit</h3>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { label: 'Speed', raw: raw.speed, norm: norm.speed, unit: 'mph', color: 'bg-primary' },
                                    { label: 'Vertical', raw: raw.verticalLeap, norm: norm.verticalLeap, unit: 'in', color: 'bg-accent' },
                                    { label: 'Assists', raw: raw.assists, norm: norm.assists, unit: 'avg', color: 'bg-amber-400' },
                                    { label: 'Points', raw: raw.pointsPerGame, norm: norm.pointsPerGame, unit: 'ppg', color: 'bg-emerald-400' },
                                    { label: 'Stamina', raw: raw.stamina, norm: norm.stamina, unit: '%', color: 'bg-rose-400' },
                                    { label: 'Wingspan', raw: raw.wingspan, norm: norm.wingspan, unit: 'in', color: 'bg-violet-400' },
                                ].map((stat) => (
                                    <div key={stat.label} className="group/stat">
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <span className="text-[10px] font-black uppercase text-neutral-500 tracking-widest block mb-0.5">{stat.label}</span>
                                                <span className="text-xl font-black text-white tabular-nums">{stat.raw} <span className="text-[10px] text-neutral-500 italic lowercase font-medium">{stat.unit}</span></span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[9px] font-black text-neutral-600 block uppercase">Percentile</span>
                                                <span className="text-xs font-black text-primary">{stat.norm}%</span>
                                            </div>
                                        </div>
                                        <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                                            <div
                                                className={`h-full ${stat.color} transition-all duration-1000 ease-out`}
                                                style={{ width: `${stat.norm}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Highlights & Media System - NEW SECTION */}
                    {(media?.videoUrl || (media?.images && media.images.length > 0)) ? (
                        <div className="bg-surface border border-white/5 rounded-[32px] p-8 lg:p-10 space-y-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Highlight <span className="text-primary">Media</span></h3>
                                    <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-1">Direct performance archives</p>
                                </div>
                                <div className="p-3 rounded-2xl bg-primary/5 text-primary border border-primary/20">
                                    <Video size={20} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Video Player / Link */}
                                {media.videoUrl && (
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                                            <Play size={12} className="text-primary" />
                                            Primary Highlight Reel
                                        </div>
                                        <div className="aspect-video w-full rounded-[24px] bg-black/40 border border-white/5 flex items-center justify-center group overflow-hidden relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="z-10 text-center">
                                                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30 mb-4 group-hover:scale-110 transition-transform">
                                                    <Play size={24} fill="currentColor" />
                                                </div>
                                                <a
                                                    href={media.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors flex items-center gap-2 justify-center"
                                                >
                                                    Open In External Terminal <ExternalLink size={12} />
                                                </a>
                                            </div>
                                        </div>
                                        {media.performanceClipUrl && (
                                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-accent/30 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <Activity size={16} className="text-accent" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300">Performance Clip Available</span>
                                                </div>
                                                <ArrowUpRight size={14} className="text-neutral-600 group-hover:text-accent transition-colors" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Image Gallery Mini */}
                                {media.images && media.images.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                                            <ImageIcon size={12} className="text-primary" />
                                            Action Capture Gallery
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {media.images.slice(0, 4).map((img, idx) => (
                                                <div key={idx} className="aspect-square rounded-[20px] bg-black/20 border border-white/5 overflow-hidden group/img relative">
                                                    <img
                                                        src={img.url}
                                                        alt={img.title || 'Athlete Highlight'}
                                                        className="w-full h-full object-cover opacity-60 group-hover/img:opacity-100 group-hover/img:scale-110 transition-all duration-700"
                                                    />
                                                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                        <p className="text-[9px] font-bold text-white uppercase tracking-widest truncate">{img.title || 'Highlight'}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Right: Scout Private Panel (30%) */}
                <div className="lg:col-span-4 space-y-8 sticky top-8">
                    <div className="bg-surface border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group/meta">
                        <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-5 group-hover/meta:opacity-10 transition-opacity">
                            <Activity size={120} />
                        </div>

                        <div className="flex items-center gap-3 mb-8">
                            <Edit3 size={16} className="text-primary" />
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Scout Evaluation</h3>
                        </div>

                        <div className="space-y-8">
                            {/* Rating */}
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-4 block">Performance Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            onClick={() => handleUpdateMeta({ rating: star })}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                size={24}
                                                fill={meta.rating >= star ? 'currentColor' : 'none'}
                                                className={`transition-colors duration-300 ${meta.rating >= star ? 'text-primary drop-shadow-[0_0_8px_rgba(226,255,102,0.4)]' : 'text-neutral-800'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-4 block">Pipeline Status</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {['Prospect', 'Shortlisted', 'Contacted', 'Signed', 'Pass'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => handleUpdateMeta({ status: s })}
                                            className={`py-3 px-5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all text-left flex items-center justify-between ${meta.status === s
                                                ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(226,255,102,0.1)]'
                                                : 'bg-white/5 border-white/5 text-neutral-500 hover:text-white hover:bg-white/10'
                                                }`}
                                        >
                                            {s}
                                            {meta.status === s && <CheckCircle2 size={14} />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-4 block underline decoration-primary/30 underline-offset-4">Evaluation Observations</label>
                                <textarea
                                    value={meta.notes}
                                    onChange={(e) => handleUpdateMeta({ notes: e.target.value })}
                                    placeholder="Add private clinical or performance notes..."
                                    className="w-full h-40 bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-neutral-300 focus:outline-none focus:border-primary/30 transition-colors resize-none placeholder:text-neutral-700 placeholder:italic font-medium"
                                />
                            </div>

                            {/* Save Button */}
                            <div className="pt-2">
                                <button
                                    onClick={handleCommitMeta}
                                    disabled={saving}
                                    className="w-full py-4 bg-primary text-black font-black uppercase text-xs tracking-[0.3em] rounded-2xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(226,255,102,0.2)] disabled:opacity-50"
                                >
                                    {saving ? 'Syncing...' : 'Commit Evaluation'}
                                    <ArrowUpRight size={16} />
                                </button>

                                {savedNotice && (
                                    <div className="mt-4 flex items-center justify-center gap-2 text-primary animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <CheckCircle2 size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Metadata Securely Stored</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-400/5 border border-amber-400/10 rounded-[32px] p-6">
                        <div className="flex items-center gap-3 mb-2 text-amber-400">
                            <Clock size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Confidentiality</span>
                        </div>
                        <p className="text-[10px] text-neutral-500 font-medium leading-relaxed">
                            Evaluations and notes are exclusive to your terminal. Other scouts and athletes cannot view this intelligence.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AthleteProfilePage;

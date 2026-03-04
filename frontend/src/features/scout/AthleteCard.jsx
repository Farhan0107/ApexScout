import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Shield, TrendingUp, Zap, GitCompare, Star, Edit3, X } from 'lucide-react';
import { getAthleteMeta, updateAthleteMeta } from '../../services/scoutService';

const AthleteCard = ({ athlete, isWatchlisted, onToggleWatchlist, onCompareSelect, isCompareSelected }) => {
    const user = athlete.userId || {};
    const metrics = athlete.normalizedMetrics || {};

    // Calculate a simple "overall" score from normalized metrics
    const metricValues = Object.values(metrics).filter(v => typeof v === 'number');
    const avgScore = metricValues.length > 0
        ? Math.round(metricValues.reduce((a, b) => a + b, 0) / metricValues.length)
        : 0;

    const getScoreColor = (score) => {
        if (score >= 75) return 'text-primary';
        if (score >= 50) return 'text-accent';
        if (score >= 25) return 'text-amber-400';
        return 'text-red-400';
    };

    const statusColors = {
        Interested: 'text-[#E2FF66]', // Lime
        Monitoring: 'text-[#22D3EE]', // Cyan
        Pass: 'text-red-500',         // Red
        None: 'text-neutral-500'
    };

    const [meta, setMeta] = useState({ rating: 1, status: 'None', notes: '' });
    const [isNotesModalOpen, setNotesModalOpen] = useState(false);
    const [tempNotes, setTempNotes] = useState('');

    useEffect(() => {
        const fetchMeta = async () => {
            if (!athlete._id) return;
            const res = await getAthleteMeta(athlete._id);
            if (res.success && res.data) {
                setMeta({
                    rating: res.data.rating || 1,
                    status: res.data.status || 'None',
                    notes: res.data.notes || ''
                });
            }
        };
        fetchMeta();
    }, [athlete._id]);

    const handleUpdateMeta = async (updates) => {
        const newMeta = { ...meta, ...updates };
        setMeta(newMeta);
        await updateAthleteMeta(athlete._id, newMeta);
    };

    const handleNotesOpen = () => {
        setTempNotes(meta.notes);
        setNotesModalOpen(true);
    };

    const handleNotesSave = () => {
        handleUpdateMeta({ notes: tempNotes });
        setNotesModalOpen(false);
    };

    return (
        <div className={`group relative bg-surface border backdrop-blur-xl rounded-[28px] overflow-hidden transition-all duration-500 hover:-translate-y-2 focus-within:-translate-y-2 hover:shadow-[0_12px_40px_-12px_rgba(226,255,102,0.15)] focus-within:shadow-[0_12px_40px_-12px_rgba(226,255,102,0.15)] group-hover:border-primary/20 ${isCompareSelected ? 'border-accent/50 shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'border-white/5'}`}>
            {isNotesModalOpen && (
                <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 flex-col">
                    <div className="w-full flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black tracking-widest uppercase text-primary">Private Eval Notes</span>
                        <button onClick={() => setNotesModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                    <textarea
                        autoFocus
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        placeholder="Draft private scout observations..."
                        className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white resize-none focus:border-primary/50 focus:outline-none transition-colors mb-4 placeholder:text-neutral-600 font-medium"
                    />
                    <button
                        onClick={handleNotesSave}
                        className="w-full py-3 bg-primary text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_15px_rgba(226,255,102,0.4)]"
                    >
                        Commit Log
                    </button>
                </div>
            )}

            {/* Top accent bar */}
            <div className={`h-1 w-full transition-all duration-500 ${athlete.isVerified ? 'bg-gradient-to-r from-primary to-accent' : 'bg-gradient-to-r from-neutral-700 to-neutral-600'}`} />

            <div className="relative p-6 shrink-0 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                        onClick={() => onToggleWatchlist(athlete)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${isWatchlisted
                            ? 'bg-primary/20 text-primary shadow-[0_0_15px_rgba(226,255,102,0.3)]'
                            : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/10'
                            }`}
                    >
                        <Bookmark size={16} fill={isWatchlisted ? 'currentColor' : 'none'} />
                    </button>
                    <button
                        onClick={() => onCompareSelect(athlete)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${isCompareSelected
                            ? 'bg-accent/20 text-accent shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                            : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/10'
                            }`}
                    >
                        <GitCompare size={16} />
                    </button>
                </div>

                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-neutral-800 border border-white/10 flex items-center justify-center shrink-0 shadow-lg group-hover:border-primary/50 transition-colors duration-500 overflow-hidden relative">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000" />
                        <span className="text-xl font-black text-white/50 group-hover:text-primary transition-colors">
                            {user.name?.charAt(0)?.toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2 group-hover:text-primary transition-all duration-300 drop-shadow-md">
                            {user.name || 'Unknown'}
                            {athlete.isVerified && (
                                <Shield size={14} className="text-primary" fill="currentColor" />
                            )}
                        </h3>
                        <p className="text-[10px] font-black uppercase text-neutral-500 tracking-[0.2em] mt-1">
                            {athlete.sportType}
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Advanced Quick Layout Grid */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black tracking-widest text-neutral-500 mb-1">Apex Ratio</span>
                        <div className={`text-3xl font-black tabular-nums tracking-tighter ${getScoreColor(avgScore)} drop-shadow-lg`}>
                            {avgScore}
                        </div>
                    </div>
                    <ActivityIcon score={avgScore} />
                </div>

                {/* Mini stat bars */}
                <div className="space-y-3 mb-6">
                    {[
                        { label: 'SPD', value: metrics.speed, color: 'bg-primary shadow-[0_0_10px_rgba(226,255,102,0.5)]' },
                        { label: 'PWR', value: metrics.verticalLeap, color: 'bg-accent shadow-[0_0_10px_rgba(34,211,238,0.5)]' },
                        { label: 'PPG', value: metrics.pointsPerGame, color: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' },
                        { label: 'STM', value: metrics.stamina, color: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' },
                    ].map(stat => (
                        <div key={stat.label} className="flex items-center gap-3 group/stat">
                            <span className="text-[9px] font-black text-neutral-500 uppercase w-8 tracking-wider group-hover/stat:text-white transition-colors">{stat.label}</span>
                            <div className="flex-1 h-2 bg-neutral-800/50 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className={`h-full rounded-full ${stat.color} transition-all duration-1000 will-change-transform delay-100`}
                                    style={{ width: `${stat.value || 0}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-bold text-neutral-400 tabular-nums w-8 text-right">
                                {stat.value || 0}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Quick actions handled up-top! */}
            </div>

            {/* Scout Meta Strip */}
            <div className="border-t border-white/5 bg-black/20 p-4 flex items-center justify-between gap-2">
                {/* 1-5 Star Rating */}
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            onClick={() => handleUpdateMeta({ rating: star })}
                            className="hover:scale-110 transition-transform focus:outline-none"
                        >
                            <Star
                                size={14}
                                fill={meta.rating >= star ? 'currentColor' : 'none'}
                                className={`transition-colors duration-300 ${meta.rating >= star ? 'text-[#E2FF66] drop-shadow-[0_0_5px_rgba(226,255,102,0.5)]' : 'text-neutral-700'}`}
                            />
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    {/* Status Dropdown */}
                    <div className="relative group/status flex items-center">
                        <select
                            value={meta.status || 'None'}
                            onChange={(e) => handleUpdateMeta({ status: e.target.value })}
                            className={`appearance-none bg-transparent ${statusColors[meta.status] || statusColors.None} font-black text-[9px] uppercase tracking-widest outline-none cursor-pointer hover:brightness-125 transition-all text-right pr-4`}
                        >
                            <option value="None" className="bg-neutral-900 text-neutral-500">Log Status...</option>
                            <option value="Interested" className="bg-neutral-900 text-[#E2FF66]">Interested</option>
                            <option value="Monitoring" className="bg-neutral-900 text-[#22D3EE]">Monitoring</option>
                            <option value="Pass" className="bg-neutral-900 text-red-500">Pass</option>
                        </select>
                        <div className={`absolute right-0 w-2 h-2 rounded-full ${statusColors[meta.status] && meta.status !== 'None' ? statusColors[meta.status].replace('text-', 'bg-') : 'bg-transparent'} pointer-events-none drop-shadow-[0_0_5px_currentColor] opacity-70`} />
                    </div>

                    {/* Notes Trigger */}
                    <button
                        onClick={handleNotesOpen}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all bg-white/5 border border-white/5 hover:bg-white/10 ${meta.notes ? 'text-primary border-primary/30 shadow-[0_0_10px_rgba(226,255,102,0.2)]' : 'text-neutral-500 hover:text-white'}`}
                        title="Evaluation Notes"
                    >
                        <Edit3 size={13} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Extracted internal to clear logic
const ActivityIcon = ({ score }) => {
    if (score >= 75) return <Zap size={24} className="text-primary opacity-20" fill="currentColor" />
    if (score >= 50) return <TrendingUp size={24} className="text-accent opacity-20" />
    return null;
}

export default AthleteCard;

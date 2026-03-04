import React, { useState, useEffect, useCallback } from 'react';
import { Bookmark, Trash2, ExternalLink, Shield, TrendingUp, Activity, Clock, Eye, Loader2, Star } from 'lucide-react';
import { getWatchlist, removeFromWatchlist, getAthleteMeta } from '../../services/scoutService';

const WatchlistPage = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchWatchlist = useCallback(async () => {
        setLoading(true);
        const result = await getWatchlist();
        if (result.success && result.data) {
            const watchlistWithMeta = await Promise.all(
                result.data.map(async (item) => {
                    const athleteId = item.athleteId?._id || item.athleteId;
                    const metaRes = await getAthleteMeta(athleteId);
                    const meta = metaRes.success && metaRes.data ? metaRes.data : { rating: 1, status: 'None', notes: '' };
                    return { ...item, meta };
                })
            );

            // Sort by Rating (descending default)
            watchlistWithMeta.sort((a, b) => (b.meta?.rating || 1) - (a.meta?.rating || 1));
            setWatchlist(watchlistWithMeta);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchWatchlist();
    }, [fetchWatchlist]);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleRemove = async (athleteId) => {
        setRemovingId(athleteId);
        const result = await removeFromWatchlist(athleteId);
        if (result.success) {
            setWatchlist(prev => prev.filter(item => {
                const id = item.athleteId?._id || item.athleteId;
                return id !== athleteId;
            }));
            showMessage('success', 'Athlete removed from watchlist');
        } else {
            showMessage('error', result.message);
        }
        setRemovingId(null);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 text-primary mb-2">
                        <Bookmark size={18} fill="currentColor" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Scout Intelligence</span>
                    </div>
                    <h1 className="text-5xl font-black text-white uppercase tracking-tighter">
                        Watch<span className="text-neutral-500 italic">list</span>
                    </h1>
                    <p className="text-neutral-500 text-sm font-medium mt-2">
                        Athletes you're tracking · {watchlist.length} active
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-neutral-800/50 p-4 rounded-3xl border border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Eye size={24} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">Tracking</div>
                        <div className="text-2xl font-black text-white tabular-nums">
                            {watchlist.length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {message.text && (
                <div className={`p-4 rounded-2xl border text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300 ${message.type === 'success'
                    ? 'bg-primary/5 border-primary/20 text-primary'
                    : 'bg-red-500/5 border-red-500/20 text-red-500'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : watchlist.length === 0 ? (
                <div className="bg-neutral-800/30 border border-white/5 rounded-[32px] p-20 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-800 flex items-center justify-center border border-white/5">
                        <Bookmark size={32} className="text-neutral-700" />
                    </div>
                    <h3 className="text-white font-black text-xl uppercase tracking-tight mb-3">No Athletes Tracked</h3>
                    <p className="text-neutral-500 text-sm max-w-md mx-auto leading-relaxed">
                        Head to the <span className="text-primary font-bold">Marketplace</span> to discover and start tracking athletic talent.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Table Header */}
                    <div className="hidden lg:grid grid-cols-12 gap-4 px-8 py-3 text-[9px] font-black uppercase text-neutral-600 tracking-[0.2em]">
                        <div className="col-span-3">Athlete</div>
                        <div className="col-span-2">Rating</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-3">Notes</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {/* Watchlist Items */}
                    {watchlist.map((item, index) => {
                        const athlete = item.athleteId || {};
                        const athleteId = athlete._id || item.athleteId;
                        const meta = item.meta || { rating: 1, status: 'None', notes: '' };

                        const statusColors = {
                            Interested: 'text-[#E2FF66]',
                            Monitoring: 'text-[#22D3EE]',
                            Pass: 'text-red-500',
                            None: 'text-neutral-500'
                        };

                        return (
                            <div
                                key={item._id || index}
                                className="group bg-neutral-800/30 border border-white/5 rounded-[24px] overflow-hidden hover:border-primary/10 hover:shadow-lg transition-all duration-500"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-6 lg:px-8">
                                    {/* Athlete Info */}
                                    <div className="col-span-3 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center text-primary font-black text-lg border border-primary/10 flex-shrink-0">
                                            {athlete.name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-sm flex items-center gap-2">
                                                {athlete.name || 'Unknown Athlete'}
                                            </h3>
                                            <p className="text-neutral-500 text-[10px] uppercase tracking-widest mt-1">{athlete.sportType || 'General'}</p>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="col-span-2 flex gap-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star
                                                key={star}
                                                size={14}
                                                fill={meta.rating >= star ? 'currentColor' : 'none'}
                                                className={meta.rating >= star ? 'text-[#E2FF66]' : 'text-neutral-800'}
                                            />
                                        ))}
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-2">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${statusColors[meta.status] || statusColors.None}`}>
                                            {meta.status}
                                        </span>
                                        {meta.updatedAt && (
                                            <div className="text-[9px] text-neutral-600 mt-1 uppercase tracking-widest font-black">
                                                {formatDate(meta.updatedAt)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Notes Preview */}
                                    <div className="col-span-3">
                                        <p className="text-[11px] text-neutral-400 italic line-clamp-2 pr-4 leading-relaxed font-medium">
                                            {meta.notes ? (meta.notes.length > 80 ? meta.notes.slice(0, 80) + '...' : meta.notes) : 'No evaluation notes logged.'}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-2 flex items-center gap-2 justify-end">
                                        <button
                                            onClick={() => handleRemove(athleteId)}
                                            disabled={removingId === athleteId}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                                        >
                                            {removingId === athleteId ? (
                                                <Loader2 size={13} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={13} />
                                            )}
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default WatchlistPage;

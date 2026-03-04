import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Eye, Loader2, GitCompare } from 'lucide-react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { getWatchlist, removeFromWatchlist, updateAthleteMeta } from '../../services/scoutService';
import { KanbanColumn, DraggableAthleteCard } from './KanbanColumn';

const STATUSES = ['Prospect', 'Shortlisted', 'Contacted', 'Signed', 'Pass'];

const WatchlistPage = () => {
    const navigate = useNavigate();
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [activeItem, setActiveItem] = useState(null); // For DragOverlay

    const fetchWatchlist = useCallback(async () => {
        setLoading(true);
        const result = await getWatchlist();
        if (result.success && result.data) {
            // Watchlist already has some athlete details from populate
            // We need to ensure we have the scout meta status/rating
            // The service naturally populates basic details, but meta comes from separate table or is computed
            // Since we updated the backend earlier, let's just use what's returned and ensure status is present
            const watchlistWithMeta = result.data.map(item => ({
                ...item,
                meta: item.meta || { status: 'Prospect', rating: 1, notes: '' }
            }));
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
            showMessage('success', 'Athlete removed from terminal track');
        } else {
            showMessage('error', result.message);
        }
        setRemovingId(null);
    };

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveItem(active.data.current.athlete);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveItem(null);

        if (!over) return;

        const athleteId = active.id;
        const newStatus = over.id;

        const item = watchlist.find(i => (i.athleteId?._id || i.athleteId) === athleteId);
        if (!item || item.meta.status === newStatus) return;

        // Optimistic update
        setWatchlist(prev => prev.map(i => {
            const id = i.athleteId?._id || i.athleteId;
            if (id === athleteId) {
                return { ...i, meta: { ...i.meta, status: newStatus } };
            }
            return i;
        }));

        const result = await updateAthleteMeta(athleteId, { status: newStatus });
        if (!result.success) {
            fetchWatchlist(); // Revert on failure
            showMessage('error', 'Status sync failure');
        } else {
            showMessage('success', `Moved to ${newStatus}`);
        }
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 text-primary mb-2">
                        <Bookmark size={18} fill="currentColor" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Athlete Tracking Protocol</span>
                    </div>
                    <h1 className="text-5xl font-black text-white uppercase tracking-tighter">
                        Scout <span className="text-neutral-500 italic">Pipeline</span>
                    </h1>
                    <p className="text-neutral-500 text-sm font-medium mt-2">
                        Real-time athlete funnel tracking · {watchlist.length} in orbit
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-neutral-800/50 p-4 rounded-3xl border border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                        <GitCompare size={24} />
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
                <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success'
                    ? 'bg-black/90 backdrop-blur-xl border-primary/20 text-primary shadow-[0_0_30px_rgba(226,255,102,0.2)]'
                    : 'bg-red-500/90 backdrop-blur-xl border-red-500/20 text-white'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="min-h-[500px] flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
            ) : watchlist.length === 0 ? (
                <div className="bg-neutral-800/30 border border-white/5 rounded-[32px] p-20 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-800 flex items-center justify-center border border-white/5">
                        <Bookmark size={32} className="text-neutral-700" />
                    </div>
                    <h3 className="text-white font-black text-xl uppercase tracking-tight mb-3">No Active Pipeline</h3>
                    <p className="text-neutral-500 text-sm max-w-md mx-auto leading-relaxed">
                        Head to the <span className="text-primary font-bold underline cursor-pointer" onClick={() => navigate('/marketplace')}>Marketplace</span> to initiate tracking.
                    </p>
                </div>
            ) : (
                <DndContext
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 h-full items-start">
                        {STATUSES.map(status => {
                            const filtered = watchlist.filter(item => {
                                const s = item.meta?.status || 'Prospect';
                                return s.toLowerCase() === status.toLowerCase();
                            });
                            return (
                                <KanbanColumn key={status} status={status} count={filtered.length}>
                                    {filtered.map((item, idx) => (
                                        <DraggableAthleteCard
                                            key={item._id || idx}
                                            item={item}
                                            onRemove={handleRemove}
                                            removingId={removingId}
                                        />
                                    ))}
                                </KanbanColumn>
                            );
                        })}
                    </div>

                    <DragOverlay>
                        {activeItem ? (
                            <DraggableAthleteCard
                                item={activeItem}
                                onRemove={() => { }}
                                isOverlay
                            />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}
        </div>
    );
};

export default WatchlistPage;

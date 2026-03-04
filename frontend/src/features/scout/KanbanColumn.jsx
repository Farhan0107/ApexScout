import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { Star, Shield, Trash2, Loader2, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DraggableAthleteCard = ({ item, onRemove, removingId }) => {
    const athlete = item.athleteId || {};
    const athleteId = athlete._id || item.athleteId;
    const meta = item.meta || { rating: 1, status: 'None', notes: '' };
    const navigate = useNavigate();

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: athleteId,
        data: {
            athlete: item
        }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 50 : 1,
        opacity: isDragging ? 0.3 : 1
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group bg-surface border border-white/5 rounded-2xl p-4 transition-all duration-300 hover:border-primary/20 hover:shadow-[0_8px_30px_-12px_rgba(226,255,102,0.1)] relative ${isDragging ? 'shadow-2xl ring-1 ring-primary/50' : ''}`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center text-primary font-black text-sm">
                        {athlete.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-xs truncate max-w-[100px]">{athlete.name}</h4>
                        <p className="text-[9px] text-neutral-500 uppercase font-black tracking-widest">{athlete.sportType}</p>
                    </div>
                </div>
                <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing p-1 text-neutral-600 hover:text-neutral-400">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M5 4h2v2H5V4zm4 0h2v2H9V4zM5 7h2v2H5V7zm4 0h2v2H9V7zm-4 3h2v2H5v-2zm4 0h2v2H9v-2z" /></svg>
                </div>
            </div>

            <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map(star => (
                    <Star
                        key={star}
                        size={10}
                        fill={meta.rating >= star ? 'currentColor' : 'none'}
                        className={meta.rating >= star ? 'text-primary' : 'text-neutral-800'}
                    />
                ))}
            </div>

            <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-white/5">
                <button
                    onClick={() => navigate(`/athlete/${athleteId}`)}
                    className="p-1.5 rounded-lg bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
                    title="View Deep Dive"
                >
                    <ArrowUpRight size={12} />
                </button>
                <button
                    onClick={() => onRemove(athleteId)}
                    disabled={removingId === athleteId}
                    className="p-1.5 rounded-lg bg-red-500/5 text-red-500/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                    {removingId === athleteId ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                </button>
            </div>
        </div>
    );
};

const KanbanColumn = ({ status, count, children }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: status,
    });

    const statusColors = {
        Prospect: 'border-neutral-500 text-neutral-500 bg-neutral-500/5',
        Shortlisted: 'border-accent text-accent bg-accent/5',
        Contacted: 'border-amber-400 text-amber-400 bg-amber-400/5',
        Signed: 'border-primary text-primary bg-primary/5',
        Pass: 'border-red-500 text-red-500 bg-red-500/5',
    };

    return (
        <div
            ref={setNodeRef}
            className={`flex flex-col gap-4 p-4 rounded-[28px] border transition-all duration-300 min-h-[600px] ${isOver ? 'bg-white/5 border-primary/30' : 'bg-black/20 border-white/5'}`}
        >
            <div className={`flex items-center justify-between px-2 mb-2`}>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${statusColors[status].split(' ')[1].replace('text-', 'bg-')}`} />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{status}</h3>
                </div>
                <span className="text-[10px] font-black tabular-nums bg-white/10 text-neutral-400 px-2 py-0.5 rounded-full">
                    {count}
                </span>
            </div>

            <div className="flex flex-col gap-3">
                {children}
            </div>
        </div>
    );
};

export { KanbanColumn, DraggableAthleteCard };

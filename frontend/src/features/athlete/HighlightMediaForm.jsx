import React, { useState, useEffect } from 'react';
import { Video, Image as ImageIcon, Save, Trash2, Plus, Play, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';
import { getAthleteMedia, updateAthleteMedia } from '../../services/mediaService';

const HighlightMediaForm = ({ athleteId }) => {
    const [media, setMedia] = useState({ videoUrl: '', images: [], performanceClipUrl: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchMedia = async () => {
            if (!athleteId) return;
            setLoading(true);
            const res = await getAthleteMedia(athleteId);
            if (res.success) {
                setMedia(res.data);
            }
            setLoading(false);
        };
        fetchMedia();
    }, [athleteId]);

    const handleSave = async () => {
        setSaving(true);
        const res = await updateAthleteMedia(media);
        if (res.success) {
            setMessage({ type: 'success', text: 'Highlights synchronized' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } else {
            setMessage({ type: 'error', text: res.message });
        }
        setSaving(false);
    };

    const addImage = () => {
        setMedia(prev => ({
            ...prev,
            images: [...prev.images, { url: '', title: '' }]
        }));
    };

    const removeImage = (index) => {
        setMedia(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const updateImage = (index, field, value) => {
        const newImages = [...media.images];
        newImages[index][field] = value;
        setMedia(prev => ({ ...prev, images: newImages }));
    };

    if (loading) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 mt-10 p-10 bg-neutral-900/40 border border-white/5 rounded-[32px] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Media <span className="text-primary">Highlights</span></h3>
                    <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-1 italic">YouTube Links · Gallery · Performance Clips</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <Video size={18} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Video Links */}
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-3 block">Main Highlight Reel (YouTube/Vimeo)</label>
                        <div className="relative group">
                            <input
                                value={media.videoUrl}
                                onChange={(e) => setMedia({ ...media, videoUrl: e.target.value })}
                                placeholder="https://youtube.com/watch?v=..."
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 text-sm text-white focus:outline-none focus:border-primary/40 transition-all font-medium italic"
                            />
                            <Play className="absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-40 group-focus-within:opacity-100 transition-opacity" size={16} />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-3 block italic">Secondary Performance Clip</label>
                        <div className="relative group">
                            <input
                                value={media.performanceClipUrl}
                                onChange={(e) => setMedia({ ...media, performanceClipUrl: e.target.value })}
                                placeholder="Vertical leap clip / Drill reel"
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-medium italic"
                            />
                            <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 text-accent opacity-40 group-focus-within:opacity-100 transition-opacity" size={16} />
                        </div>
                    </div>
                </div>

                {/* Image Gallery */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Image Gallery</label>
                        <button
                            onClick={addImage}
                            className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                        >
                            <Plus size={14} />
                            Add Slot
                        </button>
                    </div>

                    <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {media.images.length === 0 ? (
                            <div className="py-10 border border-dashed border-white/10 rounded-2xl text-center text-[10px] text-neutral-600 font-black uppercase tracking-widest">
                                No images in terminal track
                            </div>
                        ) : (
                            media.images.map((img, idx) => (
                                <div key={idx} className="flex gap-3 animate-in slide-in-from-right-2 fade-in">
                                    <input
                                        value={img.url}
                                        onChange={(e) => updateImage(idx, 'url', e.target.value)}
                                        placeholder="Direct image URL"
                                        className="flex-1 bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-[11px] text-neutral-300 focus:outline-none focus:border-white/20 transition-all italic font-medium"
                                    />
                                    <button
                                        onClick={() => removeImage(idx)}
                                        className="w-10 h-10 rounded-xl bg-red-500/5 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-all border border-red-500/10"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                {message.text ? (
                    <div className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${message.type === 'success' ? 'text-primary' : 'text-red-500'}`}>
                        <CheckCircle2 size={12} />
                        {message.text}
                    </div>
                ) : <div />}

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="py-4 px-10 bg-primary/10 border border-primary/30 text-primary font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:bg-primary hover:text-black transition-all shadow-[0_0_20px_rgba(226,255,102,0.1)] hover:shadow-[0_0_30px_rgba(226,255,102,0.4)] disabled:opacity-50 flex items-center gap-3"
                >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Sync Multi-Media
                </button>
            </div>
        </div>
    );
};

export default HighlightMediaForm;

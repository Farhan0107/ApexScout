import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, TrendingUp, Info, Eye } from 'lucide-react';
import AthleteProfileForm from './AthleteProfileForm';
import RadarChartCard from '../../components/charts/RadarChartCard';
import { getMyProfile, upsertProfile } from '../../services/profileService';
import { normalizePreview } from '../../utils/normalizePreview';
import HighlightMediaForm from './HighlightMediaForm';
import { useAuth } from '../../context/AuthContext';

const AthleteDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [previewMetrics, setPreviewMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const { user } = useAuth();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        const result = await getMyProfile();
        if (result.success) {
            setProfile(result.data);
            setPreviewMetrics(null); // Clear preview on fresh fetch
        }
        setLoading(false);
    };

    const handlePreviewChange = (rawMetrics) => {
        const normalized = normalizePreview(rawMetrics);
        setPreviewMetrics(normalized);
    };

    const handleSaveProfile = async (formData) => {
        setSaveLoading(true);
        setMessage({ type: '', text: '' });

        const result = await upsertProfile(formData, !!profile);

        if (result.success) {
            setProfile(result.data);
            setPreviewMetrics(null); // Clear preview after successful sync
            setMessage({ type: 'success', text: 'Data synchronized with Apex Core' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } else {
            setMessage({ type: 'error', text: result.message });
        }
        setSaveLoading(false);
    };

    // Memoize the metrics to pass to the chart to avoid jitter
    const displayMetrics = useMemo(() => {
        return previewMetrics || profile?.normalizedMetrics;
    }, [previewMetrics, profile]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-10"
        >
            {/* Apex Performance Hero Strip */}
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-surface to-background border border-white/5 p-8 md:p-12 mb-10 group shadow-lg flex items-center justify-between">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50 transition-opacity duration-1000" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
                    <div>
                        <div className="flex items-center gap-3 text-primary mb-2 origin-left scale-90 md:scale-100">
                            <Zap size={20} fill="currentColor" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] drop-shadow-[0_0_10px_rgba(226,255,102,0.3)]">Athlete Terminal</span>
                        </div>
                        <h1 className="text-5xl font-black text-white uppercase tracking-tighter drop-shadow-md">
                            Performance <span className="text-neutral-500 italic drop-shadow-none">Command</span>
                        </h1>
                        <p className="text-primary text-[11px] font-black uppercase tracking-widest mt-2 bg-primary/10 w-max px-3 py-1 rounded-full border border-primary/20">
                            Elite Performance Identified
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-neutral-900/80 p-5 rounded-[24px] border border-white/5 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(226,255,102,0.1)] hover:border-primary/20 hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-[18px] bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_15px_rgba(226,255,102,0.2)]">
                            <TrendingUp size={28} />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-0.5">Apex Score</div>
                            <div className="text-3xl font-black text-white tabular-nums drop-shadow-lg tracking-tighter">
                                {previewMetrics ? 'SIMULATING' : 'READY'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification/Alert Area */}
            {message.text && (
                <div className={`p-4 rounded-2xl border text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300 ${message.type === 'success'
                    ? 'bg-primary/5 border-primary/20 text-primary'
                    : 'bg-red-500/5 border-red-500/20 text-red-500'
                    }`}>
                    {message.type === 'success' ? <Shield size={16} /> : <Info size={16} />}
                    {message.text}
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Left: Input Form */}
                <div className="xl:col-span-7 bg-neutral-800/40 border border-white/5 backdrop-blur-xl p-10 rounded-[24px] shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] hover:shadow-[0_0_20px_rgba(226,255,102,0.15)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group [&_button[type=submit]]:transition-all [&_button[type=submit]]:duration-300 [&_button[type=submit]]:hover:drop-shadow-[0_0_15px_rgba(226,255,102,0.6)] [&_button[type=submit]]:active:scale-[0.97]">
                    <AthleteProfileForm
                        initialData={profile}
                        onSubmit={handleSaveProfile}
                        onPreviewChange={handlePreviewChange}
                        loading={saveLoading}
                    />
                </div>

                {/* Right: Analytics Visualization */}
                <div className="xl:col-span-5 space-y-8">
                    <div className="bg-neutral-800/40 border border-white/5 backdrop-blur-xl p-10 rounded-[24px] shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">

                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">Apex <span className="text-primary italic">Radar</span></h3>
                                <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-1">Normalized Intelligence</p>
                            </div>

                            {/* Mode Label */}
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-500 ${previewMetrics
                                ? 'bg-accent/10 border-accent/30 text-accent animate-pulse'
                                : 'bg-primary/5 border-primary/20 text-primary opacity-60'
                                }`}>
                                {previewMetrics ? (
                                    <>
                                        <Eye size={12} />
                                        <span>Preview Mode</span>
                                    </>
                                ) : (
                                    <>
                                        <Shield size={12} />
                                        <span>Official Metrics</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <RadarChartCard metrics={displayMetrics} />

                        {!profile && !previewMetrics && (
                            <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-12 text-center">
                                <p className="text-neutral-300 text-sm font-bold uppercase tracking-widest leading-relaxed">
                                    Establish your profile to unlock <span className="text-primary">Apex Analytics</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats/Badge Card */}
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-white/5 p-8 rounded-[40px] flex items-center justify-between">
                        <div>
                            <h4 className="text-white font-black uppercase tracking-tighter text-lg">Verification Status</h4>
                            <p className="text-neutral-400 text-xs font-medium">
                                {profile?.isVerified ? 'Officially Audited by Scout' : 'Connect with scouts to verify your metrics'}
                            </p>
                        </div>
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${profile?.isVerified ? 'bg-primary/20 border-primary text-primary' : 'bg-background border-white/10 text-neutral-600'
                            }`}>
                            <Shield size={24} fill={profile?.isVerified ? 'currentColor' : 'none'} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Media Highlights Section */}
            <HighlightMediaForm athleteId={user?.userId} />
        </motion.div>
    );
};

export default AthleteDashboard;

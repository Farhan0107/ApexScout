import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, Users, GitCompare, X, ChevronLeft, ChevronRight, Shield, Loader2 } from 'lucide-react';
import AthleteCard from './AthleteCard';
import CompareModal from './CompareModal';
import { getAthletes, addToWatchlist, removeFromWatchlist, getWatchlist, compareAthletes } from '../../services/scoutService';
import { useAnalytics } from '../../context/AnalyticsContext';

const SPORT_TYPES = ['All', 'Basketball', 'Football', 'Soccer', 'Track & Field', 'Swimming', 'Tennis', 'Baseball', 'MMA'];

const MarketplacePage = () => {
    const { fetchAnalytics } = useAnalytics();
    const [athletes, setAthletes] = useState([]);
    const [watchlistedIds, setWatchlistedIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Search and Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSport, setSelectedSport] = useState('All');
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [sortBy, setSortBy] = useState('-createdAt');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Performance Filters
    const [minSpeed, setMinSpeed] = useState(0);
    const [minVertical, setMinVertical] = useState(0);
    const [minPoints, setMinPoints] = useState(0);
    const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

    // Compare
    const [compareSelection, setCompareSelection] = useState([]);
    const [compareData, setCompareData] = useState(null);
    const [compareLoading, setCompareLoading] = useState(false);

    // Fetch athletes
    const fetchAthletes = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 12,
                sortBy,
                search: searchQuery || undefined,
                minSpeed: minSpeed > 0 ? minSpeed : undefined,
                minVerticalLeap: minVertical > 0 ? minVertical : undefined,
                minPointsPerGame: minPoints > 0 ? minPoints : undefined
            };
            if (selectedSport !== 'All') params.sportType = selectedSport;
            if (verifiedOnly) params.isVerified = 'true';

            const result = await getAthletes(params);

            if (result.success) {
                const athletesData = result.data?.data || result.data || [];
                setAthletes(Array.isArray(athletesData) ? athletesData : []);
                setTotalPages(result.totalPages || result.data?.totalPages || 1);
                setTotalCount(result.count || result.data?.count || 0);
            } else {
                setAthletes([]);
                setTotalCount(0);
                showMessage('error', result.message || 'Failed to fetch tracking data');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setAthletes([]);
            showMessage('error', 'Network error fetching tracking data');
        } finally {
            setLoading(false);
        }
    }, [currentPage, selectedSport, verifiedOnly, sortBy, searchQuery, minSpeed, minVertical, minPoints]);

    // Fetch watchlist IDs
    const fetchWatchlist = useCallback(async () => {
        const result = await getWatchlist();
        if (result.success && result.data) {
            const ids = new Set(result.data.map(item => item.athleteId?._id || item.athleteId));
            setWatchlistedIds(ids);
        }
    }, []);

    useEffect(() => {
        fetchAthletes();
    }, [fetchAthletes]);

    useEffect(() => {
        fetchWatchlist();
    }, [fetchWatchlist]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedSport, verifiedOnly, sortBy, searchQuery, minSpeed, minVertical, minPoints]);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleToggleWatchlist = async (athlete, selectedStatus) => {
        const athleteUserId = athlete.userId?._id || athlete.userId;
        const isCurrentlyWatchlisted = watchlistedIds.has(athleteUserId);

        if (isCurrentlyWatchlisted) {
            const result = await removeFromWatchlist(athleteUserId);
            if (result.success) {
                setWatchlistedIds(prev => {
                    const next = new Set(prev);
                    next.delete(athleteUserId);
                    return next;
                });
                fetchAnalytics(); // Sync global dashboard
                showMessage('success', 'Removed from watchlist');
            } else {
                showMessage('error', result.message);
            }
        } else {
            // Include status if provided, otherwise defaults to Prospect in backend
            const result = await addToWatchlist(athleteUserId, selectedStatus);
            if (result.success) {
                setWatchlistedIds(prev => new Set(prev).add(athleteUserId));
                fetchAnalytics(); // Sync global dashboard
                showMessage('success', `Added to ${selectedStatus || 'Watchlist'}`);
            } else {
                showMessage('error', result.message);
            }
        }
    };

    const handleCompareSelect = (athlete) => {
        setCompareSelection(prev => {
            const id = athlete.userId?._id || athlete.userId;
            const exists = prev.find(a => (a.userId?._id || a.userId) === id);
            if (exists) return prev.filter(a => (a.userId?._id || a.userId) !== id);
            if (prev.length >= 2) return [prev[1], athlete]; // Replace oldest
            return [...prev, athlete];
        });
    };

    const handleCompare = async () => {
        if (compareSelection.length < 2) return;
        setCompareLoading(true);
        const id1 = compareSelection[0].userId?._id || compareSelection[0].userId;
        const id2 = compareSelection[1].userId?._id || compareSelection[1].userId;

        const result = await compareAthletes(id1, id2);
        if (result.success) {
            setCompareData(result.data);
        } else {
            showMessage('error', result.message);
        }
        setCompareLoading(false);
    };

    const isCompareSelected = (athlete) => {
        const id = athlete.userId?._id || athlete.userId;
        return compareSelection.some(a => (a.userId?._id || a.userId) === id);
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 text-accent mb-2">
                        <Users size={18} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Scout Terminal</span>
                    </div>
                    <h1 className="text-5xl font-black text-white uppercase tracking-tighter">
                        Athlete <span className="text-neutral-500 italic">Marketplace</span>
                    </h1>
                    <p className="text-neutral-500 text-sm font-medium mt-2">
                        Discover and track top-tier athletic talent
                    </p>
                </div>

                {/* Compare Bar */}
                {compareSelection.length > 0 && (
                    <div className="flex items-center gap-3 bg-accent/5 border border-accent/20 px-5 py-3 rounded-2xl animate-in slide-in-from-right duration-300">
                        <GitCompare size={16} className="text-accent" />
                        <span className="text-xs font-bold text-neutral-300">
                            {compareSelection.length}/2 selected
                        </span>
                        {compareSelection.length === 2 && (
                            <button
                                onClick={handleCompare}
                                disabled={compareLoading}
                                className="bg-accent text-neutral-900 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent/90 transition-all disabled:opacity-50"
                            >
                                {compareLoading ? <Loader2 size={12} className="animate-spin" /> : 'Compare'}
                            </button>
                        )}
                        <button
                            onClick={() => setCompareSelection([])}
                            className="text-neutral-500 hover:text-white transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* Toast Message */}
            {message.text && (
                <div className={`p-4 rounded-2xl border text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300 ${message.type === 'success'
                    ? 'bg-primary/5 border-primary/20 text-primary'
                    : 'bg-red-500/5 border-red-500/20 text-red-500'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Filters Bar */}
            <div className="bg-neutral-800/30 border border-white/5 backdrop-blur-xl rounded-[28px] p-5">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Search athletes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-neutral-800/60 border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-primary/30 transition-colors"
                        />
                    </div>

                    {/* Sport Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {SPORT_TYPES.map(sport => (
                            <button
                                key={sport}
                                onClick={() => setSelectedSport(sport)}
                                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${selectedSport === sport
                                    ? 'bg-primary text-neutral-900 shadow-neon-lime'
                                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                                    }`}
                            >
                                {sport}
                            </button>
                        ))}
                    </div>

                    {/* Additional Filters */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setAdvancedFiltersOpen(!advancedFiltersOpen)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${advancedFiltersOpen
                                ? 'bg-accent/10 text-accent border border-accent/20'
                                : 'bg-white/5 text-neutral-400 border border-white/5 hover:text-white'
                                }`}
                        >
                            <SlidersHorizontal size={13} />
                            Metrics
                        </button>

                        <button
                            onClick={() => setVerifiedOnly(!verifiedOnly)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${verifiedOnly
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'bg-white/5 text-neutral-400 border border-white/5 hover:text-white'
                                }`}
                        >
                            <Shield size={13} />
                            Verified
                        </button>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-neutral-800/60 border border-white/5 rounded-xl px-3 py-2.5 text-[10px] font-bold uppercase text-neutral-400 focus:outline-none focus:border-primary/30 cursor-pointer"
                        >
                            <option value="-createdAt">Newest</option>
                            <option value="normalizedMetrics.speed">Top Speed</option>
                            <option value="normalizedMetrics.verticalLeap">Top Vertical</option>
                            <option value="normalizedMetrics.pointsPerGame">Top Points</option>
                        </select>
                    </div>
                </div>

                {/* Performance Sliders Panel */}
                {advancedFiltersOpen && (
                    <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-top-4 duration-300">
                        {[
                            { label: 'Min Speed (%)', value: minSpeed, setter: setMinSpeed, color: 'accent' },
                            { label: 'Min Vertical (%)', value: minVertical, setter: setMinVertical, color: 'primary' },
                            { label: 'Min Points (%)', value: minPoints, setter: setMinPoints, color: 'amber-400' },
                        ].map(f => (
                            <div key={f.label} className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{f.label}</span>
                                    <span className={`text-xs font-black text-${f.color}`}>{f.value}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={f.value}
                                    onChange={(e) => f.setter(parseInt(e.target.value))}
                                    className={`w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-${f.color}`}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">
                    {totalCount} athlete{totalCount !== 1 ? 's' : ''} found
                </p>
            </div>

            {/* Athletes Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
            ) : athletes.length === 0 ? (
                <div className="bg-neutral-800/30 border border-white/5 rounded-[28px] p-16 text-center">
                    <Users size={40} className="mx-auto mb-4 text-neutral-700" />
                    <h3 className="text-white font-bold text-lg mb-2">No Athletes Found</h3>
                    <p className="text-neutral-500 text-sm">
                        Try adjusting your filters or check back later for new talent.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {athletes.map(athlete => (
                        <AthleteCard
                            key={athlete._id}
                            athlete={athlete}
                            isWatchlisted={watchlistedIds.has(athlete.userId?._id || athlete.userId)}
                            onToggleWatchlist={handleToggleWatchlist}
                            onCompareSelect={handleCompareSelect}
                            isCompareSelected={isCompareSelected(athlete)}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let page;
                        if (totalPages <= 5) {
                            page = i + 1;
                        } else if (currentPage <= 3) {
                            page = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                        } else {
                            page = currentPage - 2 + i;
                        }
                        return (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${page === currentPage
                                    ? 'bg-primary text-neutral-900 shadow-neon-lime'
                                    : 'bg-white/5 text-neutral-400 border border-white/5 hover:text-white'
                                    }`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* Compare Modal */}
            {compareData && (
                <CompareModal
                    athletes={compareData}
                    onClose={() => {
                        setCompareData(null);
                        setCompareSelection([]);
                    }}
                />
            )}
        </div>
    );
};

export default MarketplacePage;

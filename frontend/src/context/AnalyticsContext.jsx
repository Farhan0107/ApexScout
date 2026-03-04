import { createContext, useContext, useState, useCallback } from 'react';
import { getAnalytics } from '../services/scoutService';
import { useAuth } from './AuthContext';

const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState({
        totalProspects: 0,
        contacted: 0,
        signed: 0,
        averageRating: 0,
        pipelineDistribution: {}
    });
    const [loading, setLoading] = useState(false);
    const [lastFetched, setLastFetched] = useState(0);

    const fetchAnalytics = useCallback(async (force = false) => {
        if (!user || user.role !== 'scout') return;

        // Prevent excessive redundant fetches
        const now = Date.now();
        if (!force && lastFetched && now - lastFetched < 2000) return;

        setLoading(true);
        try {
            const result = await getAnalytics();
            if (result.success && result.data) {
                setAnalytics(result.data);
                setLastFetched(now);
            }
        } catch (error) {
            console.error('Context analytics fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, [user, lastFetched]);

    return (
        <AnalyticsContext.Provider value={{ analytics, loading, fetchAnalytics }}>
            {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (!context) {
        throw new Error('useAnalytics must be used within an AnalyticsProvider');
    }
    return context;
};

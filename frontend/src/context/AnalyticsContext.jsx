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

    const fetchAnalytics = useCallback(async () => {
        if (!user || user.role !== 'scout') return;

        setLoading(true);
        try {
            const result = await getAnalytics();
            if (result.success) {
                setAnalytics(result.data);
            }
        } catch (error) {
            console.error('Context analytics fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

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

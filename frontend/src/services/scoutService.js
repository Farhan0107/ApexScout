import api from './api';

/**
 * Browse athletes with filters
 */
export const getAthletes = async (params = {}) => {
    try {
        const response = await api.get('/scout/athletes', { params });
        return { success: true, ...response.data.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch athletes',
        };
    }
};

/**
 * Get single athlete detail
 */
export const getAthleteById = async (id) => {
    try {
        const response = await api.get(`/scout/athletes/${id}`);
        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch athlete profile',
        };
    }
};

/**
 * Get scout performance analytics
 */
export const getAnalytics = async () => {
    try {
        const response = await api.get('/scout/analytics');
        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch analytics',
        };
    }
};

/**
 * Compare two athletes side by side
 */
export const compareAthletes = async (id1, id2) => {
    try {
        const response = await api.get('/scout/compare', { params: { id1, id2 } });
        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Comparison failed',
        };
    }
};

/**
 * Add athlete to watchlist
 */
export const addToWatchlist = async (athleteId) => {
    try {
        const response = await api.post(`/scout/watchlist/${athleteId}`);
        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to add to watchlist',
        };
    }
};

/**
 * Remove athlete from watchlist
 */
export const removeFromWatchlist = async (athleteId) => {
    try {
        await api.delete(`/scout/watchlist/${athleteId}`);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to remove from watchlist',
        };
    }
};

/**
 * Get scout's watchlist
 */
export const getWatchlist = async () => {
    try {
        const response = await api.get('/scout/watchlist');
        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch watchlist',
        };
    }
};

/**
 * Get scout's meta data for an athlete
 */
export const getAthleteMeta = async (athleteId) => {
    try {
        const response = await api.get(`/meta/${athleteId}`);
        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch meta',
        };
    }
};

/**
 * Update scout's meta data for an athlete
 */
export const updateAthleteMeta = async (athleteId, metaData) => {
    try {
        const response = await api.put(`/meta/${athleteId}`, metaData);
        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update meta',
        };
    }
};

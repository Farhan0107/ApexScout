import api from './api';

/**
 * Get athlete media by athleteId
 */
export const getAthleteMedia = async (athleteId) => {
    try {
        const response = await api.get(`/media/${athleteId}`);
        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch media highlights',
        };
    }
};

/**
 * Create or update athlete media (for the authenticated athlete)
 */
export const updateAthleteMedia = async (mediaData) => {
    try {
        const response = await api.post('/media', mediaData);
        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to sync highlight media',
        };
    }
};

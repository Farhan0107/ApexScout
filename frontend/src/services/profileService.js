import api from './api';

/**
 * Get current user's profile
 */
export const getMyProfile = async () => {
    try {
        const response = await api.get('/profile/me');
        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch profile'
        };
    }
};

/**
 * Create or Update profile
 */
export const upsertProfile = async (profileData, isUpdate = false) => {
    try {
        const method = isUpdate ? 'put' : 'post';
        const response = await api[method]('/profile', profileData);
        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to save profile'
        };
    }
};

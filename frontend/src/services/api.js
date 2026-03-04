import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for API calls
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response } = error;

        // Auto-retry once for common cold-start or transient network errors
        if (!config._retry && (!response || response.status >= 500)) {
            config._retry = true;
            // Delay slightly before retrying (backoff)
            await new Promise(resolve => setTimeout(resolve, 1500));
            return api(config);
        }

        if (response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Avoid infinite redirects
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

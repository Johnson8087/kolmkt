import axios from 'axios';

// Force HTTPS for all API calls
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4001';  // Updated to local development URL

// Helper function for auth headers
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = axios.create({
    baseURL: 'https://api.punketech.com/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    timeout: 30000
});

// Combined request interceptor
api.interceptors.request.use(
    (config) => {
        // Ensure baseURL is HTTPS
        config.baseURL = API_URL;
        if (config.url) {
            const url = new URL(config.url, API_URL);
            url.protocol = 'https:';
            config.url = url.toString();
        }

        // Add auth header
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request for debugging
        console.log('Making request:', {
            baseURL: config.baseURL,
            url: config.url,
            method: config.method,
            headers: config.headers
        });

        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Combined response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return Promise.reject(error);
        }

        // Retry failed requests once
        if (error.code === 'ECONNABORTED' && !originalRequest._retry) {
            originalRequest._retry = true;
            return api(originalRequest);
        }

        return Promise.reject(error);
    }
);

// API methods
// Correct the login function definition within apiMethods
const apiMethods = {
    getProfiles: async () => {
        try {
            console.log('Attempting to fetch profiles...');
            const response = await api.get('/api/profiles', {
                timeout: 10000,
                validateStatus: (status) => status >= 200 && status < 300
            });
            console.log('Profile response:', response);
            return response;
        } catch (error) {
            console.error('Profile fetch error:', error);
            throw error;
        }
    },
    getUsers: () => api.get('/api/users', {
        headers: getAuthHeader()
    }),
    getProfile: (id) => api.get(`/api/profiles/${id}`),
    updateProfile: (id, data) => api.put(`/api/profiles/${id}`, data),
    deleteProfile: (id) => api.delete(`/api/profiles/${id}`),
    login: async (username, password) => {  // Remove 'export' keyword here
        try {
            console.log('Making login request to:', `${API_URL}/api/users/login`);
            const response = await api.post('/api/users/login', { username, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response;
        } catch (error) {
            console.error('Login request failed:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        }
    },
    getProxyImageUrl: (originalUrl) => {
        if (!originalUrl) return '/default-profile.png';
        const encodedUrl = encodeURIComponent(originalUrl);
        return `${API_URL}/api/profiles/image-proxy/${encodedUrl}`;
    }
};

// Export methods from apiMethods object
export const { getProfiles, getUsers, getProfile, updateProfile, deleteProfile, login, getProxyImageUrl } = apiMethods;
export default api;
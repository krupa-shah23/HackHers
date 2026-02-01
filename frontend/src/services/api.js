import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("Attaching token to request:", token.substring(0, 10) + "...");
        } else {
            console.warn("No token found in localStorage!");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a medication
export const addMedication = async (medicationData) => {
    try {
        const isFormData = medicationData instanceof FormData;
        const config = {};
        if (isFormData) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }
        
        const response = await api.post('/medications', medicationData, config);
        return response.data;
    } catch (error) {
        console.error('Error adding medication:', error);
        throw error;
    }
};

export const updateUser = async (userData) => {
    try {
        const response = await api.patch('/users/me', userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const getDueMedications = async () => {
    try {
        const response = await api.get('/medications/due-soon');
        return response.data;
    } catch (error) {
        // Quietly fail for polling
        return [];
    }
};

export default api;

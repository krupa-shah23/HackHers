import api from './axios';

// Get all refills for a care profile
export const getRefillsByCareProfile = async (careProfileId) => {
    const response = await api.get(`/refills/care-profile/${careProfileId}`);
    return response.data;
};

// Create a refill request
export const createRefill = async (refillData) => {
    const response = await api.post('/refills', refillData);
    return response.data;
};

// Update refill status
export const updateRefill = async (id, refillData) => {
    const response = await api.put(`/refills/${id}`, refillData);
    return response.data;
};

// Get upcoming refills (for dashboard widget)
export const getUpcomingRefills = async () => {
    const response = await api.get('/refills/upcoming');
    return response.data;
};

export default {
    getRefillsByCareProfile,
    createRefill,
    updateRefill,
    getUpcomingRefills
};

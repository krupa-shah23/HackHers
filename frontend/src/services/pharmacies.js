import api from './api';

// Get nearby pharmacies
export const getNearbyPharmacies = async (params) => {
    const response = await api.get('/pharmacies/nearby', { params });
    return response.data;
};

// Request a refill
export const requestRefill = async (medicationId, deliveryMethod) => {
    const response = await api.post('/pharmacies/request', { medicationId, deliveryMethod });
    return response.data;
};

// Toggle auto-refill
export const toggleAutoRefill = async (medicationId, autoRefill) => {
    const response = await api.put(`/pharmacies/auto-refill/${medicationId}`, { autoRefill });
    return response.data;
};

export default {
    getNearbyPharmacies,
    requestRefill,
    toggleAutoRefill
};

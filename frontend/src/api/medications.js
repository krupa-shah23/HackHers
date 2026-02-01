import api from '../services/api';

export const getMedicationsByCareProfile = async (careProfileId) => {
    const response = await api.get(`/medications/care-profile/${careProfileId}`);
    return response.data;
};

export const createMedication = async (data) => {
    // Check if data is FormData
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await api.post('/medications', data, config);
    return response.data;
};

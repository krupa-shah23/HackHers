import api from './api';

// Get medications by care profile
export const getMedicationsByCareProfile = async (careProfileId) => {
    const response = await api.get(`/medications/care-profile/${careProfileId}`);
    return response.data;
};

// Create medication
export const createMedication = async (data) => {
    // Check if data is FormData
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await api.post('/medications', data, config);
    return response.data;
};

export default {
    getMedicationsByCareProfile,
    createMedication
};

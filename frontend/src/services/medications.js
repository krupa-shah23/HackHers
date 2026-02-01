import api from './api';

// Get medications by care profile
export const getMedicationsByCareProfile = async (careProfileId) => {
    const response = await api.get(`/medications/care-profile/${careProfileId}`);
    return response.data;
};

// Create medication
export const createMedication = async (data) => {
    // Let Axios handle Content-Type for FormData (it will add the boundary)
    const response = await api.post('/medications', data);
    return response.data;
};

export default {
    getMedicationsByCareProfile,
    createMedication
};

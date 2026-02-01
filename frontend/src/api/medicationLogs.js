import api from '../services/api';

export const getLogsByCareProfile = async (careProfileId) => {
    const response = await api.get(`/medication-logs/care-profile/${careProfileId}`);
    return response.data;
};

export const createMedicationLog = async (data) => {
    const response = await api.post('/medication-logs', data);
    return response.data;
};

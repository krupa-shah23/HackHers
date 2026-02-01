import api from '../services/api';

export const getRecentCheckIns = async (careProfileId) => {
    const response = await api.get(`/daily-checkins/care-profile/${careProfileId}`);
    return response.data;
};

export const createCheckIn = async (data) => {
    const response = await api.post('/daily-checkins', data);
    return response.data;
};

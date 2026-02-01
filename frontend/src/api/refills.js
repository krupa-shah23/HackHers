import api from '../services/api';

export const getUpcomingRefills = async () => {
    const response = await api.get('/refills/upcoming');
    return response.data;
};

export const requestRefill = async (data) => {
    const response = await api.post('/refills', data);
    return response.data;
};

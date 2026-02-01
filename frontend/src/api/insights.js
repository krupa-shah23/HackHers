import api from '../services/api';

export const getInsights = async (userId) => {
    const response = await api.get(`/insights/${userId}`);
    return response.data;
};

export const acceptInsight = async (insightId) => {
    const response = await api.put(`/insights/${insightId}/accept`);
    return response.data;
};

export const dismissInsight = async (insightId) => {
    const response = await api.put(`/insights/${insightId}/dismiss`);
    return response.data;
};

export const getRiskScore = async (userId) => {
    const response = await api.get(`/insights/risk/${userId}`);
    return response.data;
};

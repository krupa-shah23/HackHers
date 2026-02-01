import api from './axios';

// Get pending insights for a user
export const getInsights = async (userId) => {
    const response = await api.get(`/insights/${userId}`);
    return response.data;
};

// Accept a suggestion
export const acceptInsight = async (insightId) => {
    const response = await api.post(`/insights/accept/${insightId}`);
    return response.data;
};

// Dismiss an insight
export const dismissInsight = async (insightId) => {
    const response = await api.post(`/insights/dismiss/${insightId}`);
    return response.data;
};

// Trigger pattern analysis
export const analyzePatterns = async (userId) => {
    const response = await api.post(`/insights/analyze/${userId}`);
    return response.data;
};

// Get Risk Score (ML)
export const getRiskScore = async (userId) => {
    const response = await api.get(`/insights/risk-score/${userId}`);
    return response.data;
};

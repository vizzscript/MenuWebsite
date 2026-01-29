import api from './api';

export const getLiquors = async (params) => {
    const response = await api.get('/liquors', { params });
    return response.data;
};

export const getLiquorById = async (id) => {
    const response = await api.get(`/liquors/${id}`);
    return response.data;
};

export const loginUser = async (mobileNumber, name) => {
    const response = await api.post('/auth/login', { mobileNumber, name });
    return response.data;
};

export const loginAdmin = async (password) => {
    const response = await api.post('/auth/admin/login', { password });
    return response.data;
};

// --- Order / Notification APIs ---
export const createOrder = async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
};

export const getOrders = async () => {
    const response = await api.get('/orders');
    return response.data;
};

export const updateOrderStatus = async (id, status) => {
    const response = await api.put(`/orders/${id}`, { status });
    return response.data;
}

// --- Admin Liquor APIs ---
export const createLiquor = async (liquorData) => {
    const response = await api.post('/liquors', liquorData);
    return response.data;
};

export const updateLiquor = async (id, liquorData) => {
    const response = await api.put(`/liquors/${id}`, liquorData);
    return response.data;
};

export const deleteLiquor = async (id) => {
    const response = await api.delete(`/liquors/${id}`);
    return response.data;
};

import api from '@/lib/axios';

// Login user/admin
export const loginUser = (payload) => api.post('/user/auth/login', payload);
export const registerUser = (payload) => api.post('/user/auth/register', payload);
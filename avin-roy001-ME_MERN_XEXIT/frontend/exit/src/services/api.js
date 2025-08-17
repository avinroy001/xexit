import axios from 'axios';

const API_BASE = 'https://xexit-ejyv.onrender.com/api';

export const register = (data) => axios.post(`${API_BASE}/auth/register`, data);
export const login = (data) => axios.post(`${API_BASE}/auth/login`, data);

// Employee
export const submitResignation = (data, token) =>
  axios.post(`${API_BASE}/user/resign`, data, {
    headers: { Authorization: `Bearer ${token}` } // ✅ Fixed: Added 'Bearer '
  });

export const submitExitResponses = (data, token) =>
  axios.post(`${API_BASE}/user/responses`, data, {
    headers: { Authorization: `Bearer ${token}` } // ✅ Fixed
  });

// Admin
export const getAllResignations = (token) =>
  axios.get(`${API_BASE}/admin/resignations`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const concludeResignation = (data, token) =>
  axios.put(`${API_BASE}/admin/conclude_resignation`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const getExitResponses = (token) =>
  axios.get(`${API_BASE}/admin/exit_responses`, {
    headers: { Authorization: `Bearer ${token}` }
  });
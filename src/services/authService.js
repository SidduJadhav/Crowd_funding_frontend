import apiClient from './api';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Authentication Service - API calls related to authentication
 */

// Register new user
export const register = async (userData) => {
  const { username, email, password, confirmPassword } = userData;
  const response = await apiClient.post('/auth/register', {
    username,
    email,
    password,
    confirmPassword,
  });
  return response.data;
};

// Login user
export const login = async (credentials) => {
  const { username, password } = credentials;
  const response = await apiClient.post('/auth/login', {
    username,
    password,
  });
  
  // Store token and user data
  if (response.data.accessToken) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.accessToken);
  }
  if (response.data.user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Refresh token
export const refreshToken = async (token) => {
  const response = await apiClient.post('/auth/refresh', null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (response.data.accessToken) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.accessToken);
  }
  
  return response.data;
};

// Logout user
export const logout = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage regardless of API response
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

// Validate token
export const validateToken = async () => {
  const response = await apiClient.get('/auth/validate');
  return response.data;
};

// Get current user from storage
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Get auth token from storage
export const getAuthToken = () => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

export default {
  register,
  login,
  refreshToken,
  logout,
  validateToken,
  getCurrentUser,
  getAuthToken,
  isAuthenticated,
};
import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../services/api';
import { STORAGE_KEYS } from '../utils/constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Only for initial load
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    console.log('[AuthContext] Initializing - checking for stored user');
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      
      console.log('[AuthContext] Stored user found:', !!storedUser);
      console.log('[AuthContext] Token found:', !!token);
      
      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser);
        console.log('[AuthContext] Setting user from storage:', parsedUser);
        setUser(parsedUser);
        
        // Set auth header for subsequent requests
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('[AuthContext] Authorization header set for API client');
      }
    } catch (err) {
      console.error('[AuthContext] Error during initialization:', err);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } finally {
      console.log('[AuthContext] Initialization complete, setting loading to false');
      setLoading(false);
    }
  }, []);

 const login = async (username, password) => {
  console.log('[AuthContext.login] Starting login for username:', username);
  setError(null);

  try {
    console.log('[AuthContext.login] Calling API endpoint: /auth/login');
    const response = await apiClient.post('/auth/login', { username, password });

    console.log('[AuthContext.login] API response received:', response.status);
    console.log('[AuthContext.login] Full response data:', JSON.stringify(response.data, null, 2));
    console.log('[AuthContext.login] Response data keys:', Object.keys(response.data));

    // Backend returns snake_case: access_token, refresh_token, user_id, etc.
    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;
    const userId = response.data.user_id;
    const apiUsername = response.data.username; // ✅ renamed to avoid shadowing
    const role = response.data.role;

    console.log('[AuthContext.login] Extracted access_token:', !!accessToken);
    console.log('[AuthContext.login] Extracted user_id:', userId);
    console.log('[AuthContext.login] Extracted username:', apiUsername);

    // Basic validation
    if (!accessToken) {
      console.error('[AuthContext.login] Missing access_token in response');
      console.log('[AuthContext.login] Full response:', response.data);
      throw new Error('Invalid response from server - missing token');
    }

    if (!userId || !apiUsername) {
      console.error('[AuthContext.login] Missing or invalid user data in response');
      console.log('[AuthContext.login] Full response:', response.data);
      throw new Error('Invalid response from server - missing user data');
    }

    // Create user object to store in state and localStorage
    const userData = {
      id: userId,
      username: apiUsername,
      role,
    };

    console.log('[AuthContext.login] Storing auth token in localStorage');
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);

    console.log('[AuthContext.login] Setting Authorization header for API client');
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    console.log('[AuthContext.login] Storing user data in localStorage');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

    console.log('[AuthContext.login] Setting user in state:', userData);
    setUser(userData);

    console.log('[AuthContext.login] ✅ Login successful for user:', userData.username);
    return { success: true };

  } catch (err) {
    console.error('[AuthContext.login] ❌ Login error caught:', err);
    console.error('[AuthContext.login] Error type:', err.constructor.name);
    console.error('[AuthContext.login] Error message:', err.message);

    if (err.response) {
      console.error('[AuthContext.login] API error status:', err.response.status);
      console.error('[AuthContext.login] API error data:', err.response.data);
    } else if (err.request) {
      console.error('[AuthContext.login] No response received from server');
      console.error('[AuthContext.login] Request:', err.request);
    } else {
      console.error('[AuthContext.login] Error setting up request:', err.message);
    }

    const message = err.response?.data?.message || err.message || 'Login failed';
    console.log('[AuthContext.login] Error message to return:', message);

    setError(message);
    return { success: false, error: message };

  } finally {
    console.log('[AuthContext.login] Login process complete');
  }
};


  const signup = async (username, email, password, confirmPassword) => {
    console.log('[AuthContext.signup] 🟢 Signup initiated:', { username, email });
    setError(null);

    try {
      console.log('[AuthContext.signup] Calling API endpoint: /auth/register');
      const response = await apiClient.post('/auth/register', {
        username,
        email,
        password,
        confirmPassword,
      });

      console.log('[AuthContext.signup] ✅ Signup successful:', response.data);
      return { success: true };
      
    } catch (err) {
      console.error('[AuthContext.signup] ❌ Signup error:', err);
      console.error('[AuthContext.signup] Error response details:', err.response);
      console.error('[AuthContext.signup] Status:', err.response?.status);
      console.error('[AuthContext.signup] Data:', err.response?.data);

      const message = err.response?.data?.message || err.message || 'Signup failed';
      console.log('[AuthContext.signup] Error message to return:', message);
      
      setError(message);
      return { success: false, error: message };
      
    } finally {
      console.log('[AuthContext.signup] 🟡 Signup process finished');
    }
  };

  const logout = () => {
    console.log('[AuthContext.logout] Logging out user');
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    setError(null);
    console.log('[AuthContext.logout] Logout complete');
  };

  console.log('[AuthContext] Current state - user:', user?.username, 'loading:', loading, 'error:', error);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
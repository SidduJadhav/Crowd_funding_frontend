import apiClient from './api';

/**
 * Withdrawal Service - Complete API integration for withdrawals
 */

// Request withdrawal
export const requestWithdrawal = async (withdrawalData) => {
  const response = await apiClient.post('/withdrawals', withdrawalData);
  return response.data;
};

// Get withdrawal by ID
export const getWithdrawalById = async (withdrawalId) => {
  const response = await apiClient.get(`/withdrawals/${withdrawalId}`);
  return response.data;
};

// Approve withdrawal (admin)
export const approveWithdrawal = async (withdrawalId, adminId, notes = '') => {
  const params = new URLSearchParams({ adminId });
  if (notes) params.append('notes', notes);
  const response = await apiClient.post(`/withdrawals/${withdrawalId}/approve?${params}`);
  return response.data;
};

// Reject withdrawal (admin)
export const rejectWithdrawal = async (withdrawalId, adminId, reason) => {
  const params = new URLSearchParams({ adminId, reason });
  const response = await apiClient.post(`/withdrawals/${withdrawalId}/reject?${params}`);
  return response.data;
};

// Get campaign withdrawals
export const getCampaignWithdrawals = async (campaignId, params = {}) => {
  const { page = 0, size = 20 } = params;
  const queryParams = new URLSearchParams({ page, size });
  const response = await apiClient.get(`/withdrawals/campaign/${campaignId}?${queryParams}`);
  return response.data;
};

// Get user withdrawals
export const getUserWithdrawals = async (userId, params = {}) => {
  const { page = 0, size = 20 } = params;
  const queryParams = new URLSearchParams({ page, size });
  const response = await apiClient.get(`/withdrawals/user/${userId}?${queryParams}`);
  return response.data;
};

// Get pending withdrawals (admin)
export const getPendingWithdrawals = async (params = {}) => {
  const { page = 0, size = 20 } = params;
  const queryParams = new URLSearchParams({ page, size });
  const response = await apiClient.get(`/withdrawals/pending?${queryParams}`);
  return response.data;
};

// Get total withdrawn amount for campaign
export const getTotalWithdrawn = async (campaignId) => {
  const response = await apiClient.get(`/withdrawals/campaign/${campaignId}/total`);
  return response.data;
};

export default {
  requestWithdrawal,
  getWithdrawalById,
  approveWithdrawal,
  rejectWithdrawal,
  getCampaignWithdrawals,
  getUserWithdrawals,
  getPendingWithdrawals,
  getTotalWithdrawn,
};
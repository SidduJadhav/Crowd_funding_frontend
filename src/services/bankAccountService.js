import apiClient from './api';

/**
 * Bank Account Service - Complete API integration for bank accounts
 */

// Add bank account
export const addBankAccount = async (bankAccountData) => {
  const response = await apiClient.post('/bank-accounts', bankAccountData);
  return response.data;
};

// Get bank account by ID
export const getBankAccountById = async (accountId, profileId) => {
  const response = await apiClient.get(`/bank-accounts/${accountId}?profileId=${profileId}`);
  return response.data;
};

// Update bank account
export const updateBankAccount = async (accountId, bankAccountData) => {
  const response = await apiClient.put(`/bank-accounts/${accountId}`, bankAccountData);
  return response.data;
};

// Delete bank account
export const deleteBankAccount = async (accountId, profileId) => {
  const response = await apiClient.delete(`/bank-accounts/${accountId}?profileId=${profileId}`);
  return response.data;
};

// Get user's bank accounts
export const getUserBankAccounts = async (profileId) => {
  const response = await apiClient.get(`/bank-accounts/user/${profileId}`);
  return response.data;
};

// Get primary bank account
export const getPrimaryBankAccount = async (profileId) => {
  const response = await apiClient.get(`/bank-accounts/user/${profileId}/primary`);
  return response.data;
};

// Verify bank account (admin)
export const verifyBankAccount = async (accountId, adminId) => {
  const response = await apiClient.post(`/bank-accounts/${accountId}/verify?adminId=${adminId}`);
  return response.data;
};

// Upload verification document
export const uploadVerificationDocument = async (accountId, profileId, documentUrl) => {
  const params = new URLSearchParams({ profileId, documentUrl });
  const response = await apiClient.post(`/bank-accounts/${accountId}/verification-document?${params}`);
  return response.data;
};

export default {
  addBankAccount,
  getBankAccountById,
  updateBankAccount,
  deleteBankAccount,
  getUserBankAccounts,
  getPrimaryBankAccount,
  verifyBankAccount,
  uploadVerificationDocument,
};
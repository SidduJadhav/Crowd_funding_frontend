import apiClient from './api';

/**
 * Donation Service - API calls related to donations
 */

// Create a new donation
export const createDonation = async (donationData) => {
  const response = await apiClient.post('/donations', donationData);
  return response.data;
};

// Get donation by ID
export const getDonationById = async (donationId) => {
  const response = await apiClient.get(`/donations/${donationId}`);
  return response.data;
};

// Get campaign donations with pagination
export const getCampaignDonations = async (campaignId, params = {}) => {
  const { page = 0, size = 20 } = params;
  const queryParams = new URLSearchParams({ page, size });
  
  const response = await apiClient.get(`/donations/campaign/${campaignId}?${queryParams}`);
  return response.data;
};

// Get user donations with pagination
export const getUserDonations = async (userId, params = {}) => {
  const { page = 0, size = 20 } = params;
  const queryParams = new URLSearchParams({ page, size });
  
  const response = await apiClient.get(`/donations/user/${userId}?${queryParams}`);
  return response.data;
};

// Get total donations for a campaign
export const getTotalDonations = async (campaignId) => {
  const response = await apiClient.get(`/donations/campaign/${campaignId}/total`);
  return response.data;
};

// Get unique donor count for a campaign
export const getUniqueDonorCount = async (campaignId) => {
  const response = await apiClient.get(`/donations/campaign/${campaignId}/donors/count`);
  return response.data;
};

// Refund donation (admin only)
export const refundDonation = async (donationId, adminId, reason) => {
  const response = await apiClient.post(
    `/donations/${donationId}/refund?adminId=${adminId}&reason=${encodeURIComponent(reason)}`
  );
  return response.data;
};

export default {
  createDonation,
  getDonationById,
  getCampaignDonations,
  getUserDonations,
  getTotalDonations,
  getUniqueDonorCount,
  refundDonation,
};
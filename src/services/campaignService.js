import apiClient from './api';

/**
 * Campaign Service - API calls related to campaigns
 */

// Get all active campaigns with pagination and filters
export const getActiveCampaigns = async (params = {}) => {
  const { page = 0, size = 20, category, sort } = params;
  const queryParams = new URLSearchParams({
    page,
    size,
    ...(category && { category }),
    ...(sort && { sort }),
  });
  
  const response = await apiClient.get(`/campaigns/active?${queryParams}`);
  return response.data;
};

// Get campaign by ID
export const getCampaignById = async (campaignId, userId = null) => {
  const params = userId ? `?userId=${userId}` : '';
  const response = await apiClient.get(`/campaigns/${campaignId}${params}`);
  return response.data;
};

// Get campaigns by category
export const getCampaignsByCategory = async (category, params = {}) => {
  const { page = 0, size = 20, userId } = params;
  const queryParams = new URLSearchParams({
    page,
    size,
    ...(userId && { userId }),
  });
  
  const response = await apiClient.get(`/campaigns/category/${category}?${queryParams}`);
  return response.data;
};

// Get user's campaigns
export const getUserCampaigns = async (creatorId, params = {}) => {
  const { page = 0, size = 20, viewerId } = params;
  const queryParams = new URLSearchParams({
    page,
    size,
    ...(viewerId && { viewerId }),
  });
  
  const response = await apiClient.get(`/campaigns/user/${creatorId}?${queryParams}`);
  return response.data;
};

// Get campaign progress
export const getCampaignProgress = async (campaignId) => {
  const response = await apiClient.get(`/campaigns/${campaignId}/progress`);
  return response.data;
};

// Create new campaign (requires authentication)
export const createCampaign = async (campaignData) => {
  const response = await apiClient.post('/campaigns', campaignData);
  return response.data;
};

// Update campaign
export const updateCampaign = async (campaignId, campaignData) => {
  const response = await apiClient.put(`/campaigns/${campaignId}`, campaignData);
  return response.data;
};

// Publish campaign
export const publishCampaign = async (campaignId, creatorId) => {
  const response = await apiClient.post(`/campaigns/${campaignId}/publish?creatorId=${creatorId}`);
  return response.data;
};

// Pause campaign
export const pauseCampaign = async (campaignId, creatorId) => {
  const response = await apiClient.post(`/campaigns/${campaignId}/pause?creatorId=${creatorId}`);
  return response.data;
};

// Resume campaign
export const resumeCampaign = async (campaignId, creatorId) => {
  const response = await apiClient.post(`/campaigns/${campaignId}/resume?creatorId=${creatorId}`);
  return response.data;
};

// Approve campaign (admin)
export const approveCampaign = async (campaignId, adminId) => {
  const response = await apiClient.post(`/campaigns/${campaignId}/approve?adminId=${adminId}`);
  return response.data;
};

// Like/Unlike campaign
export const likeCampaign = async (campaignId, userId) => {
  const response = await apiClient.post('/likes', {
    userId,
    campaignId,
  });
  return response.data;
};

export const unlikeCampaign = async (campaignId, userId) => {
  const response = await apiClient.delete('/likes', {
    data: { userId, campaignId },
  });
  return response.data;
};

// Check if campaign is liked by user
export const isCampaignLiked = async (campaignId, userId) => {
  const response = await apiClient.get(`/likes/campaign/${campaignId}/user/${userId}`);
  return response.data;
};

// Get campaign likes count
export const getCampaignLikesCount = async (campaignId) => {
  const response = await apiClient.get(`/likes/campaign/${campaignId}/count`);
  return response.data;
};

export default {
  getActiveCampaigns,
  getCampaignById,
  getCampaignsByCategory,
  getUserCampaigns,
  getCampaignProgress,
  createCampaign,
  updateCampaign,
  publishCampaign,
  pauseCampaign,
  resumeCampaign,
  approveCampaign,
  likeCampaign,
  unlikeCampaign,
  isCampaignLiked,
  getCampaignLikesCount,
};
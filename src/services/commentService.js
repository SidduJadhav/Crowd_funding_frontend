import apiClient from './api';

/**
 * Comment Service - API calls related to comments
 */

// Create a new comment
export const createComment = async (commentData) => {
  const response = await apiClient.post('/comments', commentData);
  return response.data;
};

// Update a comment
export const updateComment = async (commentId, commentData) => {
  const response = await apiClient.put(`/comments/${commentId}`, commentData);
  return response.data;
};

// Delete a comment
export const deleteComment = async (commentId, userId) => {
  const response = await apiClient.delete(`/comments/${commentId}?userId=${userId}`);
  return response.data;
};

// Get campaign comments with pagination
export const getCampaignComments = async (campaignId, params = {}) => {
  const { page = 0, size = 20 } = params;
  const queryParams = new URLSearchParams({ page, size });
  
  const response = await apiClient.get(`/comments/campaign/${campaignId}?${queryParams}`);
  return response.data;
};

// Get post comments with pagination
export const getPostComments = async (postId, params = {}) => {
  const { page = 0, size = 20 } = params;
  const queryParams = new URLSearchParams({ page, size });
  
  const response = await apiClient.get(`/comments/post/${postId}?${queryParams}`);
  return response.data;
};

// Get reel comments with pagination
export const getReelComments = async (reelId, params = {}) => {
  const { page = 0, size = 20 } = params;
  const queryParams = new URLSearchParams({ page, size });
  
  const response = await apiClient.get(`/comments/reel/${reelId}?${queryParams}`);
  return response.data;
};

// Get comment replies with pagination
export const getCommentReplies = async (parentCommentId, params = {}) => {
  const { page = 0, size = 20 } = params;
  const queryParams = new URLSearchParams({ page, size });
  
  const response = await apiClient.get(`/comments/${parentCommentId}/replies?${queryParams}`);
  return response.data;
};

// Like a comment
export const likeComment = async (commentId) => {
  const response = await apiClient.post(`/comments/${commentId}/like`);
  return response.data;
};

// Unlike a comment
export const unlikeComment = async (commentId) => {
  const response = await apiClient.delete(`/comments/${commentId}/like`);
  return response.data;
};

export default {
  createComment,
  updateComment,
  deleteComment,
  getCampaignComments,
  getPostComments,
  getReelComments,
  getCommentReplies,
  likeComment,
  unlikeComment,
};
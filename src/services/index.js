import apiClient from './api';

/**
 * Additional Services - Follow, Like, Notification, Report, Search, Campaign Updates, Posts, Reels
 */

// ==================== FOLLOW SERVICE ====================
export const followService = {
  followUser: async (followerId, followingId) => {
    return await apiClient.post(`/follows/${followingId}/follow?followerId=${followerId}`);
  },
  unfollowUser: async (followerId, followingId) => {
    return await apiClient.delete(`/follows/${followingId}/unfollow?followerId=${followerId}`);
  },
  approveFollowRequest: async (followingId, followerId) => {
    return await apiClient.post(`/follows/requests/${followerId}/approve?followingId=${followingId}`);
  },
  rejectFollowRequest: async (followingId, followerId) => {
    return await apiClient.post(`/follows/requests/${followerId}/reject?followingId=${followingId}`);
  },
  blockUser: async (blockerId, blockedId) => {
    return await apiClient.post(`/follows/${blockedId}/block?blockerId=${blockerId}`);
  },
  unblockUser: async (blockerId, blockedId) => {
    return await apiClient.delete(`/follows/${blockedId}/unblock?blockerId=${blockerId}`);
  },
  getFollowers: async (userId) => {
    const response = await apiClient.get(`/follows/${userId}/followers`);
    return response.data;
  },
  getFollowing: async (userId) => {
    const response = await apiClient.get(`/follows/${userId}/following`);
    return response.data;
  },
  getPendingRequests: async (userId) => {
    const response = await apiClient.get(`/follows/${userId}/requests`);
    return response.data;
  },
  getBlockedUsers: async (userId) => {
    const response = await apiClient.get(`/follows/${userId}/blocked`);
    return response.data;
  },
  isFollowing: async (followerId, followingId) => {
    const response = await apiClient.get(`/follows/${followerId}/follows/${followingId}`);
    return response.data;
  },
};

// ==================== NOTIFICATION SERVICE ====================
export const notificationService = {
  getUserNotifications: async (userId, params = {}) => {
    const { page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({ page, size });
    const response = await apiClient.get(`/notifications/user/${userId}?${queryParams}`);
    return response.data;
  },
  getUnreadCount: async (userId) => {
    const response = await apiClient.get(`/notifications/user/${userId}/unread/count`);
    return response.data;
  },
  markAsRead: async (notificationId, userId) => {
    return await apiClient.put(`/notifications/${notificationId}/read?userId=${userId}`);
  },
  markAllAsRead: async (userId) => {
    return await apiClient.put(`/notifications/user/${userId}/read-all`);
  },
  deleteNotification: async (notificationId, userId) => {
    return await apiClient.delete(`/notifications/${notificationId}?userId=${userId}`);
  },
};

// ==================== REPORT SERVICE ====================
export const reportService = {
  createReport: async (reportData) => {
    const response = await apiClient.post('/reports', reportData);
    return response.data;
  },
  getReportById: async (reportId) => {
    const response = await apiClient.get(`/reports/${reportId}`);
    return response.data;
  },
  reviewReport: async (reportId, adminId, action, notes = '') => {
    const params = new URLSearchParams({ adminId, action });
    if (notes) params.append('notes', notes);
    const response = await apiClient.post(`/reports/${reportId}/review?${params}`);
    return response.data;
  },
  resolveReport: async (reportId, adminId, action, notes = '') => {
    const params = new URLSearchParams({ adminId, action });
    if (notes) params.append('notes', notes);
    const response = await apiClient.post(`/reports/${reportId}/resolve?${params}`);
    return response.data;
  },
  dismissReport: async (reportId, adminId, reason) => {
    const params = new URLSearchParams({ adminId, reason });
    const response = await apiClient.post(`/reports/${reportId}/dismiss?${params}`);
    return response.data;
  },
  escalateReport: async (reportId, adminId, notes = '') => {
    const params = new URLSearchParams({ adminId });
    if (notes) params.append('notes', notes);
    const response = await apiClient.post(`/reports/${reportId}/escalate?${params}`);
    return response.data;
  },
  getPendingReports: async (params = {}) => {
    const { page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({ page, size });
    const response = await apiClient.get(`/reports/pending?${queryParams}`);
    return response.data;
  },
  getReportsByStatus: async (status, params = {}) => {
    const { page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({ page, size });
    const response = await apiClient.get(`/reports/status/${status}?${queryParams}`);
    return response.data;
  },
  getUserReports: async (userId, params = {}) => {
    const { page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({ page, size });
    const response = await apiClient.get(`/reports/user/${userId}?${queryParams}`);
    return response.data;
  },
};

// ==================== SEARCH SERVICE ====================
export const searchService = {
  searchAll: async (query, params = {}) => {
    const { page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({ query, page, size });
    const response = await apiClient.get(`/search?${queryParams}`);
    return response.data;
  },
  searchProfiles: async (query, params = {}) => {
    const { page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({ query, page, size });
    const response = await apiClient.get(`/search/profiles?${queryParams}`);
    return response.data;
  },
  searchPosts: async (query, params = {}) => {
    const { page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({ query, page, size });
    const response = await apiClient.get(`/search/posts?${queryParams}`);
    return response.data;
  },
  searchReels: async (query, params = {}) => {
    const { page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({ query, page, size });
    const response = await apiClient.get(`/search/reels?${queryParams}`);
    return response.data;
  },
};

// ==================== CAMPAIGN UPDATE SERVICE ====================
export const campaignUpdateService = {
  createUpdate: async (updateData) => {
    const response = await apiClient.post('/campaign-updates', updateData);
    return response.data;
  },
  getUpdateById: async (updateId) => {
    const response = await apiClient.get(`/campaign-updates/${updateId}`);
    return response.data;
  },
  updateCampaignUpdate: async (updateId, updateData) => {
    const response = await apiClient.put(`/campaign-updates/${updateId}`, updateData);
    return response.data;
  },
  deleteUpdate: async (updateId, creatorId) => {
    return await apiClient.delete(`/campaign-updates/${updateId}?creatorId=${creatorId}`);
  },
  getCampaignUpdates: async (campaignId, params = {}) => {
    const { page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({ page, size });
    const response = await apiClient.get(`/campaign-updates/campaign/${campaignId}?${queryParams}`);
    return response.data;
  },
  getCampaignMilestones: async (campaignId, params = {}) => {
    const { page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({ page, size });
    const response = await apiClient.get(`/campaign-updates/campaign/${campaignId}/milestones?${queryParams}`);
    return response.data;
  },
  getRecentUpdates: async (count = 10) => {
    const response = await apiClient.get(`/campaign-updates/recent?count=${count}`);
    return response.data;
  },
  getUpdatesByCreator: async (creatorId, params = {}) => {
    const { page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({ page, size });
    const response = await apiClient.get(`/campaign-updates/creator/${creatorId}?${queryParams}`);
    return response.data;
  },
};

// ==================== POST SERVICE ====================
export const postService = {
  createPost: async (postData) => {
    const response = await apiClient.post('/posts', postData);
    return response.data;
  },
  getPostById: async (postId, userId = null) => {
    const params = userId ? `?userId=${userId}` : '';
    const response = await apiClient.get(`/posts/${postId}${params}`);
    return response.data;
  },
  updatePost: async (postId, postData) => {
    const response = await apiClient.put(`/posts/${postId}`, postData);
    return response.data;
  },
  deletePost: async (postId, userId) => {
    return await apiClient.delete(`/posts/${postId}?userId=${userId}`);
  },
  getUserPosts: async (userId, currentUserId = null, params = {}) => {
    const { page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({ page, size });
    if (currentUserId) queryParams.append('currentUserId', currentUserId);
    const response = await apiClient.get(`/posts/user/${userId}?${queryParams}`);
    return response.data;
  },
  getFeedPosts: async (followingIds, userId, params = {}) => {
    const { page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({ userId, page, size });
    followingIds.forEach(id => queryParams.append('followingIds', id));
    const response = await apiClient.get(`/posts/feed?${queryParams}`);
    return response.data;
  },
};

// ==================== REEL SERVICE ====================
export const reelService = {
  createReel: async (reelData) => {
    const response = await apiClient.post('/reels', reelData);
    return response.data;
  },
  getReelById: async (reelId, userId = null) => {
    const params = userId ? `?userId=${userId}` : '';
    const response = await apiClient.get(`/reels/${reelId}${params}`);
    return response.data;
  },
  updateReel: async (reelId, reelData) => {
    const response = await apiClient.put(`/reels/${reelId}`, reelData);
    return response.data;
  },
  deleteReel: async (reelId, userId) => {
    return await apiClient.delete(`/reels/${reelId}?userId=${userId}`);
  },
  getUserReels: async (userId, currentUserId = null, params = {}) => {
    const { page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({ page, size });
    if (currentUserId) queryParams.append('currentUserId', currentUserId);
    const response = await apiClient.get(`/reels/user/${userId}?${queryParams}`);
    return response.data;
  },
};

export default {
  followService,
  notificationService,
  reportService,
  searchService,
  campaignUpdateService,
  postService,
  reelService,
};
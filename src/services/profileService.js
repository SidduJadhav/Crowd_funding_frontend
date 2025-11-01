import apiClient from './api';

/**
 * Get user profile by user ID
 */
export const getProfile = async (userId) => {
  try {
    console.log('[profileService.getProfile] Fetching profile for user:', userId);
    const response = await apiClient.get(`/profiles/${userId}`);
    console.log('[profileService.getProfile] Profile fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('[profileService.getProfile] Error fetching profile:', error);
    throw error;
  }
};


export const createProfile = async (profileData) => {
  try {
    console.log('[profileService.createProfile] Creating profile with data:', profileData);
    const response = await apiClient.post('/profiles', profileData);
    console.log('[profileService.createProfile] Profile created:', response.data);
    return response.data;
  } catch (error) {
    console.error('[profileService.createProfile] Error creating profile:', error);
    throw error;
  }
};

/**
 * Update existing profile
 */
export const updateProfile = async (userId, profileData) => {
  try {
    console.log('[profileService.updateProfile] Updating profile for user:', userId);
    console.log('[profileService.updateProfile] Update data:', profileData);
    const response = await apiClient.put(`/profiles/${userId}`, profileData);
    console.log('[profileService.updateProfile] Profile updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('[profileService.updateProfile] Error updating profile:', error);
    throw error;
  }
};

/**
 * Check if user has a profile
 */
export const hasProfile = async (userId) => {
  try {
    console.log('[profileService.hasProfile] Checking if profile exists for user:', userId);
    const response = await apiClient.get(`/profiles/${userId}`);
    console.log('[profileService.hasProfile] Profile exists');
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('[profileService.hasProfile] Profile not found');
      return false;
    }
    console.error('[profileService.hasProfile] Error checking profile:', error);
    throw error;
  }
};

/**
 * Create default profile for new user
 * Called automatically after successful login
 */
export const createDefaultProfile = async (userId, username) => {
  try {
    console.log('[profileService.createDefaultProfile] Creating default profile for:', username);
    
    const defaultProfileData = {
      name: username,
      bio: '',
      profilePictureUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    };

    const response = await apiClient.post('/profiles', defaultProfileData);
    console.log('[profileService.createDefaultProfile] Default profile created:', response.data);
    return response.data;
  } catch (error) {
    console.error('[profileService.createDefaultProfile] Error creating default profile:', error);
    // Don't throw - allow login to continue even if profile creation fails
    // Return a mock profile object
    return {
      id: userId,
      username: username,
      name: username,
      bio: '',
      profilePictureUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      followersCount: 0,
      followingCount: 0,
    };
  }
};


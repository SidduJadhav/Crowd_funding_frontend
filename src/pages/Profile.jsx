import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings, Calendar, Edit } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import { AuthContext } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/profileService';
import * as campaignService from '../services/campaignService';
import { followService } from '../services/index';
import { formatDate } from '../utils/formatters';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  console.log('[Profile] Component mounted with userId:', userId, 'currentUser:', currentUser);
  
  const [profile, setProfile] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({
    followersCount: 0,
    followingCount: 0,
    campaignsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    bio: '',
    profilePictureUrl: '',
  });
  const [activeTab, setActiveTab] = useState('campaigns');
  const [updating, setUpdating] = useState(false);

  // Determine whose profile we're viewing
  const profileUserId = userId ? parseInt(userId) : currentUser?.id;
  const isOwnProfile = currentUser?.id === profileUserId;

  useEffect(() => {
    console.log('[Profile] useEffect triggered - userId:', userId, 'currentUser.id:', currentUser?.id);
    
    if (!currentUser) {
      console.log('[Profile] No current user, redirecting to login');
      navigate('/login');
      return;
    }

    fetchProfileData();
  }, [userId, currentUser, navigate]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[Profile.fetchProfileData] Starting to fetch profile data for userId:', profileUserId);

      // Fetch profile
      console.log('[Profile.fetchProfileData] Fetching profile...');
      const profileData = await getProfile(profileUserId);
      console.log('[Profile.fetchProfileData] Profile fetched:', profileData);
      
      setProfile(profileData);
      setEditData({
        name: profileData.name || '',
        bio: profileData.bio || '',
        profilePictureUrl: profileData.profilePictureUrl || '',
      });

      // Fetch campaigns
      console.log('[Profile.fetchProfileData] Fetching campaigns...');
      try {
        const userCampaigns = await campaignService.getUserCampaigns(profileUserId);
        console.log('[Profile.fetchProfileData] Campaigns fetched:', userCampaigns);
        
        setCampaigns(userCampaigns.content || []);
        
        setStats(prev => ({
          ...prev,
          campaignsCount: userCampaigns.totalElements || userCampaigns.content?.length || 0,
        }));
      } catch (err) {
        console.error('[Profile.fetchProfileData] Error fetching campaigns:', err);
        setCampaigns([]);
      }

      // Fetch followers and following stats
      console.log('[Profile.fetchProfileData] Fetching follower stats...');
      try {
        const [followers, following] = await Promise.all([
          followService.getFollowers(profileUserId),
          followService.getFollowing(profileUserId),
        ]);
        
        console.log('[Profile.fetchProfileData] Followers:', followers, 'Following:', following);
        
        setStats(prev => ({
          ...prev,
          followersCount: followers?.totalCount || followers?.users?.length || 0,
          followingCount: following?.totalCount || following?.users?.length || 0,
        }));
      } catch (err) {
        console.error('[Profile.fetchProfileData] Error fetching follow stats:', err);
      }

      // Check if following (only for other users' profiles)
      if (!isOwnProfile && currentUser) {
        console.log('[Profile.fetchProfileData] Checking follow status...');
        try {
          const followStatus = await followService.isFollowing(currentUser.id, profileUserId);
          console.log('[Profile.fetchProfileData] Following status:', followStatus);
          setIsFollowing(followStatus);
        } catch (err) {
          console.error('[Profile.fetchProfileData] Error checking follow status:', err);
        }
      }

      console.log('[Profile.fetchProfileData] Profile data fetch complete');
    } catch (error) {
      console.error('[Profile.fetchProfileData] Error:', error);
      setError(error.message || 'Failed to load profile');
      
      // Show mock data on error
      console.log('[Profile.fetchProfileData] Using mock data due to error');
      setProfile(getMockProfile());
      setCampaigns(getMockCampaigns());
    } finally {
      setLoading(false);
    }
  };

  const getMockProfile = () => {
    console.log('[Profile.getMockProfile] Generating mock profile');
    return {
      id: profileUserId,
      username: currentUser?.username || 'user',
      name: currentUser?.username || 'User',
      bio: '',
      profilePictureUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username || 'user'}`,
      followersCount: 0,
      followingCount: 0,
      createdAt: new Date(),
    };
  };

  const getMockCampaigns = () => {
    console.log('[Profile.getMockCampaigns] Generating mock campaigns');
    return [
      {
        id: 1,
        title: 'Education for Underprivileged Children',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
        category: 'Education',
        description: 'Providing quality education to children in need',
        currentAmount: 45000,
        goalAmount: 100000,
        donorCount: 234,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        creatorName: profile?.name || 'User',
      },
    ];
  };

  const handleFollow = async () => {
    try {
      console.log('[Profile.handleFollow] Follow action - currently following:', isFollowing);
      
      if (isFollowing) {
        console.log('[Profile.handleFollow] Unfollowing user:', profileUserId);
        await followService.unfollowUser(currentUser.id, profileUserId);
        setIsFollowing(false);
        setStats({ ...stats, followersCount: Math.max(0, stats.followersCount - 1) });
        console.log('[Profile.handleFollow] Unfollow successful');
      } else {
        console.log('[Profile.handleFollow] Following user:', profileUserId);
        await followService.followUser(currentUser.id, profileUserId);
        setIsFollowing(true);
        setStats({ ...stats, followersCount: stats.followersCount + 1 });
        console.log('[Profile.handleFollow] Follow successful');
      }
    } catch (error) {
      console.error('[Profile.handleFollow] Error:', error);
      setError('Failed to update follow status');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);
      console.log('[Profile.handleUpdateProfile] Updating profile with data:', editData);
      
      await updateProfile(currentUser.id, editData);
      console.log('[Profile.handleUpdateProfile] Profile updated successfully');
      
      setProfile({ ...profile, ...editData });
      setShowEditModal(false);
      
      // Show success message (you can add a toast notification here)
    } catch (error) {
      console.error('[Profile.handleUpdateProfile] Error:', error);
      setError('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <LoadingSpinner text="Loading profile..." />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
        <div className="bg-status-error bg-opacity-10 border border-status-error text-status-error px-6 py-4 rounded-lg text-center max-w-md">
          <p className="font-semibold mb-2">Failed to Load Profile</p>
          <p className="text-sm mb-4">{error}</p>
          <Button variant="primary" size="sm" onClick={() => fetchProfileData()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-container mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-4 bg-status-error bg-opacity-10 border border-status-error text-status-error px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-dark-bg-secondary border border-dark-bg-tertiary rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={profile?.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username}`}
                alt={profile?.name}
                className="w-32 h-32 rounded-full border-4 border-accent-purple object-cover"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary mb-1">
                    {profile?.name || 'User'}
                  </h1>
                  <p className="text-text-secondary">@{profile?.username}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 md:mt-0">
                  {isOwnProfile ? (
                    <>
                      <Button
                        variant="secondary"
                        onClick={() => setShowEditModal(true)}
                      >
                        <Edit size={18} />
                        Edit Profile
                      </Button>
                      <Button variant="tertiary">
                        <Settings size={18} />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant={isFollowing ? 'secondary' : 'primary'}
                      onClick={handleFollow}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Bio */}
              <p className="text-text-primary mb-4 leading-relaxed">
                {profile?.bio || 'No bio yet'}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-text-secondary text-sm mb-6">
                {profile?.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    Joined {formatDate(profile.createdAt)}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <div className="hover:text-accent-purple transition-colors cursor-pointer">
                  <span className="text-text-primary font-bold">{stats.campaignsCount}</span>
                  <span className="text-text-secondary ml-1">Campaigns</span>
                </div>
                <div className="hover:text-accent-purple transition-colors cursor-pointer">
                  <span className="text-text-primary font-bold">{stats.followersCount}</span>
                  <span className="text-text-secondary ml-1">Followers</span>
                </div>
                <div className="hover:text-accent-purple transition-colors cursor-pointer">
                  <span className="text-text-primary font-bold">{stats.followingCount}</span>
                  <span className="text-text-secondary ml-1">Following</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-dark-bg-tertiary">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`pb-4 font-semibold transition-colors ${
                activeTab === 'campaigns'
                  ? 'text-accent-purple border-b-2 border-accent-purple'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Campaigns Created
            </button>
            <button
              onClick={() => setActiveTab('backed')}
              className={`pb-4 font-semibold transition-colors ${
                activeTab === 'backed'
                  ? 'text-accent-purple border-b-2 border-accent-purple'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Campaigns Backed
            </button>
          </div>
        </div>

        {/* Campaigns Grid */}
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                campaign={campaign}
                onViewClick={() => navigate(`/campaign/${campaign.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-text-secondary text-lg">
              {activeTab === 'campaigns'
                ? 'No campaigns created yet'
                : 'No campaigns backed yet'}
            </p>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Profile"
          actions={
            <>
              <Button 
                variant="secondary" 
                onClick={() => setShowEditModal(false)}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleUpdateProfile}
                loading={updating}
                disabled={updating}
              >
                Save Changes
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Name"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              placeholder="Your name"
              disabled={updating}
            />
            <div>
              <label className="block text-text-primary font-medium mb-2">Bio</label>
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={4}
                maxLength={500}
                disabled={updating}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-bg-tertiary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-purple resize-none disabled:opacity-50"
              />
              <p className="text-text-tertiary text-sm mt-1">{editData.bio.length}/500</p>
            </div>
            <Input
              label="Profile Picture URL"
              value={editData.profilePictureUrl}
              onChange={(e) => setEditData({ ...editData, profilePictureUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              disabled={updating}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Profile;
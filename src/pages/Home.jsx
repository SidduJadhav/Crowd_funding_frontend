import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, Users, Heart } from 'lucide-react';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { AuthContext } from '../context/AuthContext';
import * as campaignService from '../services/campaignService';
import { followService, postService } from '../services/index';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('following');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    followingCount: 0,
    contributedCount: 0,
    totalContributed: 0,
  });

  useEffect(() => {
    console.log('[Home] Component mounted, user:', user);

    if (!user) {
      console.log('[Home] No user found, redirecting to login');
      navigate('/login');
      return;
    }

    const initializeHome = async () => {
      console.log('[Home] Initializing home page...');
      await fetchUserStats();
      await fetchFeedData();
    };

    initializeHome();
  }, [user, navigate]);

  // Separate effect for tab changes
  useEffect(() => {
    console.log('[Home] Active tab changed to:', activeTab);
    if (user) {
      fetchFeedData();
    }
  }, [activeTab, user]);

  const fetchUserStats = async () => {
    try {
      console.log('[fetchUserStats] Starting to fetch user stats for user:', user?.id);
      
      const following = await followService.getFollowing(user.id);
      console.log('[fetchUserStats] Following data:', following);

      setStats({
        followingCount: following?.totalCount || following?.users?.length || 0,
        contributedCount: 0,
        totalContributed: 0,
      });

      console.log('[fetchUserStats] Stats updated successfully');
    } catch (error) {
      console.error('[fetchUserStats] Failed to fetch stats:', error);
      // Set default stats on error
      setStats({
        followingCount: 0,
        contributedCount: 0,
        totalContributed: 0,
      });
    }
  };

  const fetchFeedData = async () => {
    try {
      console.log('[fetchFeedData] Starting to fetch feed for tab:', activeTab);
      setLoading(true);
      setError(null);
      let data = [];

      switch (activeTab) {
        case 'following':
          console.log('[fetchFeedData] Fetching following campaigns...');
          try {
            const following = await followService.getFollowing(user.id);
            console.log('[fetchFeedData] Following response:', following);
            
            const followingIds = following?.users?.map(u => u.id) || [];
            console.log('[fetchFeedData] Following IDs:', followingIds);

            if (followingIds.length > 0) {
              const campaignPromises = followingIds.map(id =>
                campaignService.getUserCampaigns(id, { viewerId: user.id })
              );
              const results = await Promise.all(campaignPromises);
              data = results.flatMap(r => r.content || []);
              console.log('[fetchFeedData] Following campaigns fetched:', data.length);
            } else {
              console.log('[fetchFeedData] No following users, using mock data');
              data = getMockCampaigns();
            }
          } catch (err) {
            console.error('[fetchFeedData] Error fetching following:', err);
            data = getMockCampaigns();
          }
          break;

        case 'contributed':
          console.log('[fetchFeedData] Fetching contributed campaigns...');
          data = getMockContributedCampaigns();
          break;

        case 'suggested':
          console.log('[fetchFeedData] Fetching suggested campaigns...');
          try {
            const suggested = await campaignService.getActiveCampaigns({ size: 20 });
            console.log('[fetchFeedData] Suggested campaigns response:', suggested);
            data = suggested.content || getMockSuggestedCampaigns();
          } catch (err) {
            console.error('[fetchFeedData] Error fetching suggested:', err);
            data = getMockSuggestedCampaigns();
          }
          break;

        default:
          console.warn('[fetchFeedData] Unknown tab:', activeTab);
          data = getMockCampaigns();
      }

      console.log('[fetchFeedData] Setting campaigns:', data.length, 'items');
      setCampaigns(data);
    } catch (error) {
      console.error('[fetchFeedData] Unexpected error:', error);
      setError(error.message || 'Failed to load campaigns');
      setCampaigns(getMockCampaigns());
    } finally {
      console.log('[fetchFeedData] Feed data fetch complete, setting loading to false');
      setLoading(false);
    }
  };

  const getMockCampaigns = () => {
    console.log('[getMockCampaigns] Returning mock campaigns');
    return [
      {
        id: 1,
        title: 'Help Build Community Center',
        image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop',
        category: 'Social',
        description: 'Building a community center for underprivileged children',
        currentAmount: 75000,
        goalAmount: 150000,
        donorCount: 342,
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        creatorName: 'Community Foundation',
      },
      {
        id: 2,
        title: 'Clean Water Initiative',
        image: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=400&h=300&fit=crop',
        category: 'Environment',
        description: 'Providing clean water access to rural villages',
        currentAmount: 120000,
        goalAmount: 200000,
        donorCount: 567,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        creatorName: 'Green Earth NGO',
      },
    ];
  };

  const getMockContributedCampaigns = () => getMockCampaigns();
  const getMockSuggestedCampaigns = () => getMockCampaigns();

  const tabs = [
    { id: 'following', label: 'Following', icon: Users },
    { id: 'contributed', label: 'Contributed', icon: Heart },
    { id: 'suggested', label: 'Suggested', icon: TrendingUp },
  ];

  console.log('[Home] Render - loading:', loading, 'campaigns:', campaigns.length, 'error:', error);

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-text-secondary">
            Discover campaigns from creators you follow and support causes you care about
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-bg-secondary border border-dark-bg-tertiary rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Users className="text-accent-purple" size={32} />
              <div>
                <p className="text-text-tertiary text-sm">Following</p>
                <p className="text-text-primary text-2xl font-bold">{stats.followingCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-bg-secondary border border-dark-bg-tertiary rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Heart className="text-status-error" size={32} />
              <div>
                <p className="text-text-tertiary text-sm">Campaigns Backed</p>
                <p className="text-text-primary text-2xl font-bold">{stats.contributedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-bg-secondary border border-dark-bg-tertiary rounded-lg p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-status-success" size={32} />
              <div>
                <p className="text-text-tertiary text-sm">Total Contributed</p>
                <p className="text-text-primary text-2xl font-bold">
                  ₹{stats.totalContributed.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-dark-bg-tertiary">
          <div className="flex gap-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 flex items-center gap-2 font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'text-accent-purple border-b-2 border-accent-purple'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-status-error bg-opacity-10 border border-status-error text-status-error px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Feed Content */}
        {loading ? (
          <div className="py-20">
            <LoadingSpinner text="Loading your feed..." />
          </div>
        ) : campaigns.length > 0 ? (
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
          <EmptyState
            icon={Sparkles}
            title={
              activeTab === 'following'
                ? 'No campaigns yet'
                : activeTab === 'contributed'
                ? "You haven't backed any campaigns"
                : 'No suggestions available'
            }
            message={
              activeTab === 'following'
                ? 'Follow creators to see their campaigns here'
                : activeTab === 'contributed'
                ? 'Start supporting campaigns you believe in'
                : 'Check back later for personalized recommendations'
            }
            actionLabel={activeTab === 'following' ? 'Discover Campaigns' : 'Browse All'}
            onAction={() => navigate('/discover')}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
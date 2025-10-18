import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, Users, Calendar } from 'lucide-react';
import Button from '../components/Common/Button';
import Badge from '../components/Common/Badge';
import ProgressBar from '../components/Common/ProgressBar';
import PaymentModal from '../components/payment/PaymentModal';
import apiClient from '../services/api';
import { formatCurrency, formatNumber, getDaysLeft, getFundingPercentage, formatDate } from '../utils/formatters';
import { AuthContext } from '../context/AuthContext';

const CampaignDetail = () => {
  const { campaignId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchCampaignDetail();
  }, [campaignId]);

  const fetchCampaignDetail = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/campaigns/${campaignId}`);
      setCampaign(response.data);
    } catch (err) {
      setCampaign(getMockCampaign());
    } finally {
      setLoading(false);
    }
  };

  const getMockCampaign = () => ({
    id: 1,
    title: 'Smart Home Automation System',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    category: 'Technology',
    description: 'An open-source home automation platform for smart living. Control your entire home from your smartphone, voice commands, and automated routines.',
    fullDescription: `This is a comprehensive smart home system that brings automation and intelligence to your living space. With our platform, you can:

- Control all smart devices from a centralized dashboard
- Set up custom automation routines based on time, location, or device state
- Monitor energy consumption and optimize for efficiency
- Voice control integration with major platforms
- Secure cloud backup and local network options
- Developer-friendly API for custom integrations

Our mission is to make smart home technology accessible to everyone, not just tech enthusiasts. We believe in open standards and user privacy as core principles.`,
    currentAmount: 45000,
    goalAmount: 100000,
    donorCount: 234,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    creatorName: 'TechStartup Inc.',
    creatorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechStartup',
    isVerified: true,
    updates: [
      {
        id: 1,
        title: 'Beta Release Announcement',
        content: 'We are excited to announce our beta release! The platform is now available for early testing.',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        isMilestone: true,
      },
      {
        id: 2,
        title: '50% Funding Goal Reached',
        content: 'Thanks to all our backers! We have reached 50% of our funding goal.',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        isMilestone: true,
      },
    ],
    rewards: [
      {
        id: 1,
        title: 'Early Bird Special',
        amount: 49,
        description: 'Get the platform for 50% off the retail price',
        backers: 100,
        limited: true,
      },
      {
        id: 2,
        title: 'Standard Package',
        amount: 99,
        description: 'Full platform access plus lifetime updates',
        backers: 150,
        limited: false,
      },
      {
        id: 3,
        title: 'Premium Package',
        amount: 299,
        description: 'Premium support, custom integrations, and priority updates',
        backers: 50,
        limited: false,
      },
    ],
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg py-12">
        <div className="max-w-container mx-auto px-4">
          <div className="bg-dark-bg-secondary rounded-lg h-96 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-dark-bg py-12">
        <div className="max-w-container mx-auto px-4 text-center">
          <p className="text-text-secondary text-lg">Campaign not found</p>
        </div>
      </div>
    );
  }

  const fundingPercentage = getFundingPercentage(campaign.currentAmount, campaign.goalAmount);
  const daysLeft = getDaysLeft(campaign.endDate);

  return (
    <div className="min-h-screen bg-dark-bg py-12">
      <div className="max-w-container mx-auto px-4">
        {/* Hero Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge text={campaign.category} />
                {campaign.isVerified && <Badge text="Verified" variant="verified" />}
              </div>
              <h1 className="text-4xl font-bold text-text-primary mb-4">
                {campaign.title}
              </h1>
              <p className="text-text-secondary text-lg mb-6">
                {campaign.description}
              </p>

              {/* Creator Info */}
              <div className="flex items-center gap-4 pb-6 border-b border-dark-bg-tertiary">
                <img
                  src={campaign.creatorImage}
                  alt={campaign.creatorName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-text-primary font-semibold">
                    {campaign.creatorName}
                  </p>
                  <p className="text-text-secondary text-sm">
                    Creator
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex gap-8 border-b border-dark-bg-tertiary mb-8">
                {['about', 'rewards', 'updates'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 font-semibold capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-accent-purple border-b-2 border-accent-purple'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'about' && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-text-primary leading-relaxed whitespace-pre-line">
                    {campaign.fullDescription}
                  </p>
                </div>
              )}

              {activeTab === 'rewards' && (
                <div className="space-y-4">
                  {campaign.rewards.map((reward) => (
                    <div
                      key={reward.id}
                      className="border border-dark-bg-tertiary rounded-lg p-6 hover:border-accent-purple transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-text-primary font-semibold text-lg">
                            {reward.title}
                          </h3>
                          <p className="text-accent-purple font-bold text-2xl mt-2">
                            ${reward.amount}
                          </p>
                        </div>
                        {reward.limited && (
                          <Badge text="Limited" variant="warning" />
                        )}
                      </div>
                      <p className="text-text-secondary mb-3">
                        {reward.description}
                      </p>
                      <p className="text-text-tertiary text-sm">
                        {reward.backers} backers
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'updates' && (
                <div className="space-y-6">
                  {campaign.updates.map((update) => (
                    <div
                      key={update.id}
                      className="border-l-2 border-accent-purple pl-6"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-text-primary font-semibold text-lg">
                          {update.title}
                        </h3>
                        {update.isMilestone && (
                          <Badge text="Milestone" variant="success" />
                        )}
                      </div>
                      <p className="text-text-tertiary text-sm mb-3">
                        {formatDate(update.date)}
                      </p>
                      <p className="text-text-secondary">
                        {update.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Funding Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-dark-bg-secondary border border-dark-bg-tertiary rounded-lg p-6 sticky top-24">
              {/* Progress */}
              <div className="mb-6">
                <ProgressBar
                  current={campaign.currentAmount}
                  goal={campaign.goalAmount}
                  size="lg"
                />
                <div className="mt-4">
                  <p className="text-text-primary font-bold text-2xl">
                    {formatCurrency(campaign.currentAmount)}
                  </p>
                  <p className="text-text-tertiary text-sm">
                    of {formatCurrency(campaign.goalAmount)} goal
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4 pb-6 border-b border-dark-bg-tertiary mb-6">
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-accent-purple" />
                  <div>
                    <p className="text-text-secondary text-sm">Backers</p>
                    <p className="text-text-primary font-semibold">
                      {formatNumber(campaign.donorCount)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={20} className="text-accent-purple" />
                  <div>
                    <p className="text-text-secondary text-sm">Days Left</p>
                    <p className="text-text-primary font-semibold">
                      {daysLeft} days
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                {user ? (
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    Back This Project
                  </Button>
                ) : (
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full"
                    onClick={() => navigate('/login')}
                  >
                    Sign in to Back
                  </Button>
                )}
                <Button variant="secondary" size="lg" className="w-full">
                  <Share2 size={20} />
                  Share
                </Button>
              </div>

              {/* Like Button */}
              <button
                onClick={() => setLiked(!liked)}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 border border-dark-bg-tertiary rounded-lg hover:border-accent-purple transition-colors group"
              >
                <Heart
                  size={20}
                  className={liked ? 'fill-status-error text-status-error' : 'text-text-secondary group-hover:text-accent-purple'}
                />
                <span className="text-text-secondary group-hover:text-accent-purple">
                  {liked ? 'Liked' : 'Like'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          campaign={campaign}
        />
      )}
    </div>
  );
};

export default CampaignDetail;
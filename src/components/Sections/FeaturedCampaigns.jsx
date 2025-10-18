import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import apiClient from '../../services/api';

const FeaturedCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedCampaigns();
  }, []);

  const fetchFeaturedCampaigns = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/campaigns/active?size=6');
      setCampaigns(response.data.content || []);
    } catch (err) {
      setError(err.message);
      // Mock data for demo
      setCampaigns(getMockCampaigns());
    } finally {
      setLoading(false);
    }
  };

  const getMockCampaigns = () => [
    {
      id: 1,
      title: 'Smart Home Automation System',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      category: 'Technology',
      description: 'An open-source home automation platform for smart living',
      currentAmount: 45000,
      goalAmount: 100000,
      donorCount: 234,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      creatorName: 'TechStartup Inc.',
    },
    {
      id: 2,
      title: 'Eco-Friendly Water Bottle',
      image: 'https://images.unsplash.com/photo-1527671579615-76fde982fa04?w=400&h=300&fit=crop',
      category: 'Environment',
      description: 'Sustainable water bottles made from recycled ocean plastic',
      currentAmount: 78000,
      goalAmount: 150000,
      donorCount: 512,
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      creatorName: 'EcoWorks',
    },
    {
      id: 3,
      title: 'AI-Powered Fitness Trainer',
      image: 'https://images.unsplash.com/photo-1532635241749-b8833cb531e9?w=400&h=300&fit=crop',
      category: 'Health',
      description: 'Personalized workout plans powered by artificial intelligence',
      currentAmount: 92000,
      goalAmount: 120000,
      donorCount: 456,
      endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      creatorName: 'FitAI Labs',
    },
    {
      id: 4,
      title: 'Indie Game Development',
      image: 'https://images.unsplash.com/photo-1538481143235-5d630a9cd10b?w=400&h=300&fit=crop',
      category: 'Entertainment',
      description: 'A story-driven indie game with stunning visuals',
      currentAmount: 34000,
      goalAmount: 80000,
      donorCount: 189,
      endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      creatorName: 'CreativeStudio',
    },
    {
      id: 5,
      title: 'Advanced Photography Workshop',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      category: 'Education',
      description: 'Learn professional photography techniques online',
      currentAmount: 12000,
      goalAmount: 50000,
      donorCount: 95,
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      creatorName: 'PhotoPro Academy',
    },
    {
      id: 6,
      title: 'Portable Solar Charger',
      image: 'https://images.unsplash.com/photo-1518495285647-b694cc472da7?w=400&h=300&fit=crop',
      category: 'Technology',
      description: 'Compact solar charging solution for travelers',
      currentAmount: 56000,
      goalAmount: 90000,
      donorCount: 323,
      endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      creatorName: 'GreenTech Solutions',
    },
  ];

  if (error && campaigns.length === 0) {
    return (
      <section className="py-16 bg-dark-bg">
        <div className="max-w-container mx-auto px-4 text-center">
          <p className="text-status-error">Failed to load campaigns</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-dark-bg">
      <div className="max-w-container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-2">
              Featured Projects
            </h2>
            <p className="text-text-secondary">
              Discover some of our most exciting campaigns
            </p>
          </div>
          <div className="hidden md:block">
            <Button
              variant="secondary"
              onClick={() => navigate('/discover')}
            >
              View All →
            </Button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-dark-bg-secondary rounded-lg animate-pulse h-80"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                campaign={campaign}
                onViewClick={() => navigate(`/campaign/${campaign.id}`)}
              />
            ))}
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="md:hidden mt-8 flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/discover')}
            className="w-full sm:w-auto"
          >
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCampaigns;
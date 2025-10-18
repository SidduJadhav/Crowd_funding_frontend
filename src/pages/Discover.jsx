import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import apiClient from '../services/api';
import { CATEGORIES, SORT_OPTIONS } from '../utils/constants';

const Discover = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    filterCampaigns();
  }, [campaigns, searchQuery, selectedCategory, sortBy]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/campaigns/active?size=50');
      setCampaigns(response.data.content || getMockCampaigns());
    } catch (err) {
      setCampaigns(getMockCampaigns());
    } finally {
      setLoading(false);
    }
  };

  const getMockCampaigns = () => {
    const base = [
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
    return base.concat(base).concat(base);
  };

  const filterCampaigns = () => {
    let filtered = [...campaigns];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((c) => c.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'trending':
        filtered.sort((a, b) => b.donorCount - a.donorCount);
        break;
      case 'most_funded':
        filtered.sort((a, b) => b.currentAmount - a.currentAmount);
        break;
      case 'ending_soon':
        filtered.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredCampaigns(filtered);
  };

  return (
    <div className="min-h-screen bg-dark-bg py-12">
      <div className="max-w-container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-2">
            Discover Projects
          </h1>
          <p className="text-text-secondary">
            Explore {filteredCampaigns.length} active campaigns
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-text-tertiary" size={20} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-bg-secondary border border-dark-bg-tertiary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-purple transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div
            className={`${
              showFilters ? 'block' : 'hidden'
            } lg:block lg:col-span-1 bg-dark-bg-secondary border border-dark-bg-tertiary rounded-lg p-6 h-fit sticky top-20`}
          >
            <div className="flex items-center justify-between lg:block mb-6">
              <h2 className="text-lg font-bold text-text-primary">Filters</h2>
              <button
                className="lg:hidden text-text-tertiary hover:text-accent-purple"
                onClick={() => setShowFilters(false)}
              >
                ✕
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <h3 className="text-text-primary font-semibold mb-4">Category</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                    selectedCategory === ''
                      ? 'bg-accent-purple text-white'
                      : 'text-text-secondary hover:text-accent-purple'
                  }`}
                >
                  All Categories
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                      selectedCategory === cat
                        ? 'bg-accent-purple text-white'
                        : 'text-text-secondary hover:text-accent-purple'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div>
              <h3 className="text-text-primary font-semibold mb-4">Sort By</h3>
              <div className="space-y-2">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                      sortBy === option.value
                        ? 'bg-accent-purple text-white'
                        : 'text-text-secondary hover:text-accent-purple'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full"
              >
                <Filter size={20} />
                Filters
              </Button>
            </div>

            {/* Results */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-dark-bg-secondary rounded-lg animate-pulse h-80" />
                ))}
              </div>
            ) : filteredCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCampaigns.map((campaign) => (
                  <Card
                    key={campaign.id}
                    campaign={campaign}
                    onViewClick={() => navigate(`/campaign/${campaign.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-text-secondary text-lg mb-4">
                  No campaigns found matching your criteria
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setSortBy('newest');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
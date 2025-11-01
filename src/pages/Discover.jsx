import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { AuthContext } from '../context/AuthContext';
import { getActiveCampaigns, getCampaignsByCategory } from '../services/campaignService';
import { CATEGORIES, SORT_OPTIONS } from '../utils/constants';

const Discover = () => {
  const { user } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  });
  const navigate = useNavigate();

  // Fetch campaigns from backend
  useEffect(() => {
    fetchCampaigns();
  }, [selectedCategory, sortBy, pagination.page]);

  // Client-side search filter only (backend doesn't support search in /active endpoint)
  useEffect(() => {
    if (searchQuery) {
      const filtered = campaigns.filter(
        (c) =>
          c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCampaigns(filtered);
    } else {
      setFilteredCampaigns(campaigns);
    }
  }, [campaigns, searchQuery]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      
      let response;
      const params = {
        page: pagination.page,
        size: pagination.size,
        userId: user?.id, // Pass userId to get liked status
        sort: getSortParam(sortBy),
      };

      if (selectedCategory) {
        // Use category-specific endpoint
        response = await getCampaignsByCategory(selectedCategory, params);
      } else {
        // Use active campaigns endpoint
        response = await getActiveCampaigns(params);
      }

      // Handle paginated response
      if (response && response.content) {
        setCampaigns(response.content);
        setFilteredCampaigns(response.content);
        setPagination(prev => ({
          ...prev,
          totalElements: response.totalElements || 0,
          totalPages: response.totalPages || 0,
        }));
      } else {
        // Fallback to mock data
        const mockData = getMockCampaigns();
        setCampaigns(mockData);
        setFilteredCampaigns(mockData);
      }
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
      // Fallback to mock data on error
      const mockData = getMockCampaigns();
      setCampaigns(mockData);
      setFilteredCampaigns(mockData);
    } finally {
      setLoading(false);
    }
  };

  const getSortParam = (sortValue) => {
    switch (sortValue) {
      case 'trending':
        return 'donorCount,desc';
      case 'most_funded':
        return 'currentAmount,desc';
      case 'ending_soon':
        return 'endDate,asc';
      case 'newest':
      default:
        return 'createdAt,desc';
    }
  };

  const handleLoadMore = () => {
    if (pagination.page + 1 < pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  const getMockCampaigns = () => {
    return [
      {
        id: 1,
        title: 'Smart Home Automation System',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        category: 'Technology',
        description: 'An open-source home automation platform for smart living',
        currentAmount: 45000,
        goalAmount: 100000,
        donorCount: 234,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        creatorName: 'TechStartup Inc.',
        liked: false,
      },
      {
        id: 2,
        title: 'Eco-Friendly Water Bottle',
        imageUrl: 'https://images.unsplash.com/photo-1527671579615-76fde982fa04?w=400&h=300&fit=crop',
        category: 'Environment',
        description: 'Sustainable water bottles made from recycled ocean plastic',
        currentAmount: 78000,
        goalAmount: 150000,
        donorCount: 512,
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        creatorName: 'EcoWorks',
        liked: false,
      },
      {
        id: 3,
        title: 'AI-Powered Fitness Trainer',
        imageUrl: 'https://images.unsplash.com/photo-1532635241749-b8833cb531e9?w=400&h=300&fit=crop',
        category: 'Health',
        description: 'Personalized workout plans powered by artificial intelligence',
        currentAmount: 92000,
        goalAmount: 120000,
        donorCount: 456,
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        creatorName: 'FitAI Labs',
        liked: false,
      },
      {
        id: 4,
        title: 'Indie Game Development',
        imageUrl: 'https://images.unsplash.com/photo-1538481143235-5d630a9cd10b?w=400&h=300&fit=crop',
        category: 'Entertainment',
        description: 'A story-driven indie game with stunning visuals',
        currentAmount: 34000,
        goalAmount: 80000,
        donorCount: 189,
        endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        creatorName: 'CreativeStudio',
        liked: false,
      },
      {
        id: 5,
        title: 'Advanced Photography Workshop',
        imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
        category: 'Education',
        description: 'Learn professional photography techniques online',
        currentAmount: 12000,
        goalAmount: 50000,
        donorCount: 95,
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        creatorName: 'PhotoPro Academy',
        liked: false,
      },
      {
        id: 6,
        title: 'Portable Solar Charger',
        imageUrl: 'https://images.unsplash.com/photo-1518495285647-b694cc472da7?w=400&h=300&fit=crop',
        category: 'Technology',
        description: 'Compact solar charging solution for travelers',
        currentAmount: 56000,
        goalAmount: 90000,
        donorCount: 323,
        endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
        creatorName: 'GreenTech Solutions',
        liked: false,
      },
    ];
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortBy('newest');
    setPagination(prev => ({ ...prev, page: 0 }));
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
                  onClick={() => {
                    setSelectedCategory('');
                    setPagination(prev => ({ ...prev, page: 0 }));
                  }}
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
                    onClick={() => {
                      setSelectedCategory(cat);
                      setPagination(prev => ({ ...prev, page: 0 }));
                    }}
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
                    onClick={() => {
                      setSortBy(option.value);
                      setPagination(prev => ({ ...prev, page: 0 }));
                    }}
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
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCampaigns.map((campaign) => (
                    <Card
                      key={campaign.id}
                      campaign={campaign}
                      onViewClick={() => navigate(`/campaign/${campaign.id}`)}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {pagination.page + 1 < pagination.totalPages && (
                  <div className="mt-8 text-center">
                    <Button
                      variant="secondary"
                      onClick={handleLoadMore}
                      disabled={loading}
                    >
                      Load More
                    </Button>
                  </div>
                )}

                {/* Pagination Info */}
                <div className="mt-4 text-center text-text-tertiary text-sm">
                  Showing {filteredCampaigns.length} of {pagination.totalElements} campaigns
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-text-secondary text-lg mb-4">
                  No campaigns found matching your criteria
                </p>
                <Button variant="secondary" onClick={handleClearFilters}>
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
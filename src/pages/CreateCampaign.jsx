import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign } from 'lucide-react';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { AuthContext } from '../context/AuthContext';
import { createCampaign } from '../services/campaignService';

const CreateCampaign = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalAmount: '',
    currency: 'INR',
    category: 'EDUCATION',
    startDate: '',
    endDate: '',
    imageUrl: '',
    videoUrl: '',
    beneficiaryName: '',
  });

  const categories = [
    'EDUCATION',
    'MEDICAL',
    'DISASTER_RELIEF',
    'ANIMAL_WELFARE',
    'ENVIRONMENT',
    'COMMUNITY',
    'ARTS',
    'SPORTS',
    'TECHNOLOGY',
    'OTHER',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.description || !formData.goalAmount || !formData.beneficiaryName) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.goalAmount) < 100) {
      setError('Goal amount must be at least 100');
      return;
    }

    try {
      setLoading(true);

      const campaignData = {
        creatorId: user.id,
        title: formData.title,
        description: formData.description,
        goalAmount: parseFloat(formData.goalAmount),
        currency: formData.currency,
        category: formData.category,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        imageUrl: formData.imageUrl || `https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=600&fit=crop`,
        videoUrl: formData.videoUrl || '',
        beneficiaryName: formData.beneficiaryName,
      };

      const response = await createCampaign(campaignData);
      navigate(`/campaign/${response.id}`);
    } catch (err) {
      console.error('Failed to create campaign:', err);
      setError(err.response?.data?.message || 'Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user && !authLoading) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Authentication Required</h2>
          <p className="text-text-secondary">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Create Campaign</h1>
          <p className="text-text-secondary">Start your crowdfunding journey and make an impact</p>
        </div>

        {error && (
          <div className="mb-6 bg-status-error bg-opacity-10 border border-status-error text-status-error px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-dark-bg-secondary border border-dark-bg-tertiary rounded-lg p-6 space-y-6">
          <Input
            label="Campaign Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a compelling title"
            required
            maxLength={200}
          />

          <div>
            <label className="block text-text-primary font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your campaign in detail"
              rows={6}
              required
              minLength={50}
              maxLength={5000}
              className="w-full px-4 py-3 bg-dark-bg border border-dark-bg-tertiary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-purple resize-none"
            />
            <p className="text-text-tertiary text-sm mt-1">{formData.description.length}/5000</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Goal Amount"
              type="number"
              name="goalAmount"
              value={formData.goalAmount}
              onChange={handleChange}
              placeholder="Enter goal amount"
              required
              min="100"
              step="0.01"
              icon={<DollarSign size={18} />}
            />

            <div>
              <label className="block text-text-primary font-medium mb-2">Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-bg-tertiary rounded-lg text-text-primary focus:outline-none focus:border-accent-purple"
              >
                <option value="INR">INR - Indian Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-text-primary font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-bg border border-dark-bg-tertiary rounded-lg text-text-primary focus:outline-none focus:border-accent-purple"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Beneficiary Name"
            name="beneficiaryName"
            value={formData.beneficiaryName}
            onChange={handleChange}
            placeholder="Who will benefit from this campaign?"
            required
            maxLength={100}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Start Date (Optional)"
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              icon={<Calendar size={18} />}
            />

            <Input
              label="End Date (Optional)"
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              icon={<Calendar size={18} />}
            />
          </div>

          <Input
            label="Campaign Image URL (Optional)"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />

          <Input
            label="Campaign Video URL (Optional)"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            placeholder="https://example.com/video.mp4"
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/home')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Creating Campaign...' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;

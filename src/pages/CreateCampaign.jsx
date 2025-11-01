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
    category: 'Education',
    startDate: '',
    endDate: '',
    imageUrl: '',
    videoUrl: '',
    beneficiaryName: '',
  });

  // FIXED: Categories now match API documentation
  const categories = [
    'Technology',
    'Art',
    'Design',
    'Health',
    'Education',
    'Social',
    'Environment',
    'Entertainment',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // FIXED: Enhanced validation
  const validateForm = () => {
    if (!formData.title || formData.title.length < 5 || formData.title.length > 200) {
      setError('Campaign title must be between 5 and 200 characters');
      return false;
    }

    if (!formData.description || formData.description.length < 50 || formData.description.length > 5000) {
      setError('Description must be between 50 and 5000 characters');
      return false;
    }

    if (!formData.goalAmount || parseFloat(formData.goalAmount) < 100) {
      setError('Goal amount must be at least 100');
      return false;
    }

    if (!formData.beneficiaryName || formData.beneficiaryName.length < 2 || formData.beneficiaryName.length > 100) {
      setError('Beneficiary name must be between 2 and 100 characters');
      return false;
    }

    // FIXED: Date validation
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end <= start) {
        setError('End date must be after start date');
        return false;
      }

      if (start < new Date()) {
        setError('Start date cannot be in the past');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    // FIXED: Verify user object structure
    if (!user || !user.id) {
      setError('User authentication error. Please login again.');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      const now = new Date();
      const defaultEndDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

      const campaignData = {
        creatorId: user.id, // Ensure this matches your AuthContext user structure
        title: formData.title.trim(),
        description: formData.description.trim(),
        goalAmount: parseFloat(formData.goalAmount),
        currency: formData.currency,
        category: formData.category,
        startDate: formData.startDate 
          ? new Date(formData.startDate).toISOString() 
          : now.toISOString(),
        endDate: formData.endDate 
          ? new Date(formData.endDate).toISOString() 
          : defaultEndDate.toISOString(),
        // FIXED: Remove default image, let backend handle it or make it required
        imageUrl: formData.imageUrl.trim() || null,
        videoUrl: formData.videoUrl.trim() || null,
        beneficiaryName: formData.beneficiaryName.trim(),
      };

      const response = await createCampaign(campaignData);
      
      // Success - redirect to campaign page
      navigate(`/campaign/${response.id}`);
    } catch (err) {
      console.error('Failed to create campaign:', err);
      
      // FIXED: Better error handling
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        navigate('/login');
      } else if (err.response?.status === 400) {
        // Validation error from backend
        const validationErrors = err.response?.data?.errors;
        if (validationErrors && Array.isArray(validationErrors)) {
          setError(validationErrors.map(e => e.message).join(', '));
        } else {
          setError(err.response?.data?.message || 'Invalid campaign data. Please check your inputs.');
        }
      } else if (err.response?.status === 403) {
        setError('You do not have permission to create campaigns.');
      } else {
        setError(err.response?.data?.message || 'Failed to create campaign. Please try again.');
      }
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
            placeholder="Enter a compelling title (5-200 characters)"
            required
            maxLength={200}
          />

          <div>
            <label className="block text-text-primary font-medium mb-2">
              Description <span className="text-status-error">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your campaign in detail (minimum 50 characters)"
              rows={6}
              required
              minLength={50}
              maxLength={5000}
              className="w-full px-4 py-3 bg-dark-bg border border-dark-bg-tertiary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-purple resize-none"
            />
            <p className={`text-sm mt-1 ${formData.description.length < 50 ? 'text-status-error' : 'text-text-tertiary'}`}>
              {formData.description.length}/5000 {formData.description.length < 50 && `(minimum 50 characters)`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Goal Amount"
              type="number"
              name="goalAmount"
              value={formData.goalAmount}
              onChange={handleChange}
              placeholder="Minimum 100"
              required
              min="100"
              step="0.01"
              icon={DollarSign}
            />

            <div>
              <label className="block text-text-primary font-medium mb-2">
                Currency <span className="text-status-error">*</span>
              </label>
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
            <label className="block text-text-primary font-medium mb-2">
              Category <span className="text-status-error">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-bg border border-dark-bg-tertiary rounded-lg text-text-primary focus:outline-none focus:border-accent-purple"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Beneficiary Name"
            name="beneficiaryName"
            value={formData.beneficiaryName}
            onChange={handleChange}
            placeholder="Who will benefit from this campaign? (2-100 characters)"
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
              icon={Calendar}
            />

            <Input
              label="End Date (Optional)"
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              icon={Calendar}
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
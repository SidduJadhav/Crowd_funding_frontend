import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag } from 'lucide-react';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { AuthContext } from '../context/AuthContext';
import { reelService } from '../services/index';

const CreateReel = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    caption: '',
    videoUrl: '',
    thumbnailUrl: '',
    duration: '',
    aspectRatio: '9:16',
    tags: [],
    isPublic: true,
  });
  const [tagInput, setTagInput] = useState('');

  const aspectRatios = [
    { value: '9:16', label: '9:16 (Vertical)' },
    { value: '16:9', label: '16:9 (Horizontal)' },
    { value: '1:1', label: '1:1 (Square)' },
    { value: '4:5', label: '4:5 (Portrait)' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.caption.trim()) {
      setError('Caption is required');
      return;
    }

    if (!formData.videoUrl.trim()) {
      setError('Video URL is required');
      return;
    }

    if (!formData.duration || parseInt(formData.duration) <= 0) {
      setError('Valid duration is required');
      return;
    }

    try {
      setLoading(true);

      const reelData = {
        userId: user.id,
        caption: formData.caption,
        videoUrl: formData.videoUrl,
        thumbnailUrl: formData.thumbnailUrl || null,
        duration: parseInt(formData.duration),
        aspectRatio: formData.aspectRatio,
        tags: formData.tags,
        isPublic: formData.isPublic,
      };

      await reelService.createReel(reelData);
      navigate('/reels');
    } catch (err) {
      console.error('Failed to create reel:', err);
      setError(err.response?.data?.message || 'Failed to create reel. Please try again.');
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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Create Reel</h1>
          <p className="text-text-secondary">Share engaging video content with your followers</p>
        </div>

        {error && (
          <div className="mb-6 bg-status-error bg-opacity-10 border border-status-error text-status-error px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-dark-bg-secondary border border-dark-bg-tertiary rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-text-primary font-medium mb-2">Caption</label>
            <textarea
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              placeholder="Write a caption for your reel..."
              rows={4}
              required
              maxLength={2200}
              className="w-full px-4 py-3 bg-dark-bg border border-dark-bg-tertiary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-purple resize-none"
            />
            <p className="text-text-tertiary text-sm mt-1">{formData.caption.length}/2200</p>
          </div>

          <Input
            label="Video URL"
            type="url"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            placeholder="https://example.com/video.mp4"
            required
          />

          <Input
            label="Thumbnail URL (Optional)"
            type="url"
            name="thumbnailUrl"
            value={formData.thumbnailUrl}
            onChange={handleChange}
            placeholder="https://example.com/thumbnail.jpg"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Duration (seconds)"
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Enter duration in seconds"
              required
              min="1"
              max="180"
            />

            <div>
              <label className="block text-text-primary font-medium mb-2">Aspect Ratio</label>
              <select
                name="aspectRatio"
                value={formData.aspectRatio}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-bg-tertiary rounded-lg text-text-primary focus:outline-none focus:border-accent-purple"
              >
                {aspectRatios.map(ratio => (
                  <option key={ratio.value} value={ratio.value}>
                    {ratio.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-text-primary font-medium mb-2">Tags</label>
            <div className="flex gap-2 mb-3">
              <div className="flex-grow relative">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add a tag"
                  className="w-full px-4 py-3 pl-10 bg-dark-bg border border-dark-bg-tertiary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-purple"
                />
                <Tag size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddTag}
              >
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-accent-purple bg-opacity-20 text-accent-purple rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-accent-purple-hover"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              className="w-4 h-4 text-accent-purple bg-dark-bg border-dark-bg-tertiary rounded focus:ring-accent-purple"
            />
            <label htmlFor="isPublic" className="text-text-primary">
              Make this reel public
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/reels')}
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
              {loading ? 'Creating Reel...' : 'Create Reel'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReel;

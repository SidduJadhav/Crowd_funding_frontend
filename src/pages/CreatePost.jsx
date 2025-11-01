import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Tag } from 'lucide-react';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { AuthContext } from '../context/AuthContext';
import { postService } from '../services/index';

const CreatePost = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    caption: '',
    mediaUrls: [''],
    tags: [],
    location: '',
    isPublic: true,
  });
  const [tagInput, setTagInput] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMediaUrlChange = (index, value) => {
    const newMediaUrls = [...formData.mediaUrls];
    newMediaUrls[index] = value;
    setFormData(prev => ({ ...prev, mediaUrls: newMediaUrls }));
  };

  const addMediaUrl = () => {
    if (formData.mediaUrls.length < 10) {
      setFormData(prev => ({
        ...prev,
        mediaUrls: [...prev.mediaUrls, ''],
      }));
    }
  };

  const removeMediaUrl = (index) => {
    if (formData.mediaUrls.length > 1) {
      const newMediaUrls = formData.mediaUrls.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, mediaUrls: newMediaUrls }));
    }
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

    const validMediaUrls = formData.mediaUrls.filter(url => url.trim() !== '');
    if (validMediaUrls.length === 0) {
      setError('At least one media URL is required');
      return;
    }

    try {
      setLoading(true);

      const postData = {
        userId: user.id,
        caption: formData.caption,
        mediaUrls: validMediaUrls,
        tags: formData.tags,
        location: formData.location || null,
        isPublic: formData.isPublic,
      };

      await postService.createPost(postData);
      navigate('/posts');
    } catch (err) {
      console.error('Failed to create post:', err);
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Create Post</h1>
          <p className="text-text-secondary">Share your campaign updates with the community</p>
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
              placeholder="Write a caption for your post..."
              rows={4}
              required
              maxLength={2200}
              className="w-full px-4 py-3 bg-dark-bg border border-dark-bg-tertiary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-purple resize-none"
            />
            <p className="text-text-tertiary text-sm mt-1">{formData.caption.length}/2200</p>
          </div>

          <div>
            <label className="block text-text-primary font-medium mb-2">Media URLs (1-10 images)</label>
            <div className="space-y-3">
              {formData.mediaUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleMediaUrlChange(index, e.target.value)}
                    placeholder={`Image URL ${index + 1}`}
                    className="flex-grow px-4 py-3 bg-dark-bg border border-dark-bg-tertiary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-purple"
                  />
                  {formData.mediaUrls.length > 1 && (
                    <Button
                      type="button"
                      variant="tertiary"
                      onClick={() => removeMediaUrl(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              {formData.mediaUrls.length < 10 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addMediaUrl}
                >
                  Add Another Image
                </Button>
              )}
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

          <Input
            label="Location (Optional)"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Add a location"
            icon={MapPin}
          />

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
              Make this post public
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/posts')}
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
              {loading ? 'Creating Post...' : 'Create Post'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;

import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const result = await signup(
      formData.username,
      formData.email,
      formData.password,
      formData.confirmPassword
      
      
    );

    if (result.success) {
      // Show success message and redirect to login
      alert('Account created successfully! Please log in.');
      navigate('/login');
    } else {
      setErrors({ form: result.error || 'Signup failed' });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-dark-bg-secondary border border-dark-bg-tertiary rounded-lg p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Join Our Community
            </h1>
            <p className="text-text-secondary">
              Create an account to start supporting projects
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Error Message */}
            {errors.form && (
              <div className="bg-status-error bg-opacity-10 border border-status-error text-status-error px-4 py-3 rounded-lg text-sm">
                {errors.form}
              </div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-text-primary font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose your username"
                className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none transition-colors ${
                  errors.username
                    ? 'border-status-error focus:border-status-error'
                    : 'border-dark-bg-tertiary focus:border-accent-purple'
                }`}
              />
              {errors.username && (
                <p className="text-status-error text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-text-primary font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none transition-colors ${
                  errors.email
                    ? 'border-status-error focus:border-status-error'
                    : 'border-dark-bg-tertiary focus:border-accent-purple'
                }`}
              />
              {errors.email && (
                <p className="text-status-error text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-text-primary font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none transition-colors ${
                  errors.password
                    ? 'border-status-error focus:border-status-error'
                    : 'border-dark-bg-tertiary focus:border-accent-purple'
                }`}
              />
              {errors.password && (
                <p className="text-status-error text-sm mt-1">{errors.password}</p>
              )}
              <p className="text-text-tertiary text-xs mt-2">
                Must be at least 8 characters
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-text-primary font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none transition-colors ${
                  errors.confirmPassword
                    ? 'border-status-error focus:border-status-error'
                    : 'border-dark-bg-tertiary focus:border-accent-purple'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-status-error text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 rounded bg-dark-bg border border-dark-bg-tertiary cursor-pointer mt-1"
              />
              <label htmlFor="terms" className="ml-2 text-text-secondary text-sm cursor-pointer">
                I agree to the{' '}
                <a href="#" className="text-accent-purple hover:text-accent-purple-hover transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-accent-purple hover:text-accent-purple-hover transition-colors">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Sign Up Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-bg-tertiary" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-bg-secondary text-text-tertiary">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link to="/login" className="block">
            <Button variant="secondary" size="lg" className="w-full">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Common/Button';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  console.log('[Login] Component initialized');
  console.log('[Login] AuthContext login function:', typeof login);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`[Login] handleChange - field: ${name}, value: ${value}`);
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[Login] Form submitted');
    console.log('[Login] Form data:', formData);

    setError('');
    setLoading(true);
    console.log('[Login] Loading state set to true');

    // Validation
    if (!formData.username || !formData.password) {
      console.log('[Login] Validation failed - empty fields');
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    console.log('[Login] Validation passed');
    console.log('[Login] Calling login function with:', {
      username: formData.username,
      password: '***hidden***',
    });

    try {
      console.log('[Login] Before login() call');
      const result = await login(formData.username, formData.password);
      
      console.log('[Login] After login() call');
      console.log('[Login] Login result:', result);
      console.log('[Login] Result type:', typeof result);
      console.log('[Login] Result keys:', result ? Object.keys(result) : 'null');

      if (!result) {
        console.error('[Login] Login returned null or undefined');
        setError('Login failed: No response from server');
        setLoading(false);
        return;
      }

      if (result.success) {
        console.log('[Login] Login successful!');
        console.log('[Login] Navigating to /home');
        navigate('/home');
      } else {
        console.log('[Login] Login failed');
        console.log('[Login] Error message:', result.error);
        setError(result.error || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      console.error('[Login] Exception caught during login:', err);
      console.error('[Login] Error message:', err.message);
      console.error('[Login] Error stack:', err.stack);
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }

    console.log('[Login] handleSubmit execution complete');
  };

  console.log('[Login] Rendering with loading:', loading, 'error:', error);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-dark-bg-secondary border border-dark-bg-tertiary rounded-lg p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Welcome Back
            </h1>
            <p className="text-text-secondary">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-status-error bg-opacity-10 border border-status-error text-status-error px-4 py-3 rounded-lg text-sm">
                <strong>Error:</strong> {error}
                <div className="text-xs mt-2 opacity-75">
                  Check browser console (F12) for more details
                </div>
              </div>
            )}

            {/* Debug Info (Only in development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-accent-purple bg-opacity-10 border border-accent-purple text-accent-purple px-4 py-3 rounded-lg text-xs">
                <strong>Debug Mode ON</strong>
                <div>Loading: {loading ? 'Yes' : 'No'}</div>
                <div>Username filled: {formData.username ? 'Yes' : 'No'}</div>
                <div>Password filled: {formData.password ? 'Yes' : 'No'}</div>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-text-primary font-medium mb-2">
                Username or Email
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username or email"
                disabled={loading}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-bg-tertiary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-purple transition-colors disabled:opacity-50"
              />
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
                placeholder="Enter your password"
                disabled={loading}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-bg-tertiary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-purple transition-colors disabled:opacity-50"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                disabled={loading}
                className="w-4 h-4 rounded bg-dark-bg border border-dark-bg-tertiary cursor-pointer disabled:opacity-50"
              />
              <label htmlFor="remember" className="ml-2 text-text-secondary text-sm cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Login Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
              disabled={loading}
              type="submit"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-bg-tertiary" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-bg-secondary text-text-tertiary">
                New to Crowdfund?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link to="/signup" className="block">
            <Button variant="secondary" size="lg" className="w-full" disabled={loading}>
              Create Account
            </Button>
          </Link>

          {/* Footer Links */}
          <div className="mt-6 text-center text-text-tertiary text-sm">
            <a href="#" onClick={(e) => {
              e.preventDefault();
              console.log('[Login] Forgot password clicked');
            }} className="hover:text-accent-purple transition-colors">
              Forgot your password?
            </a>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="mt-8 text-center text-text-tertiary text-sm">
          By signing in, you agree to our{' '}
          <a href="#" onClick={(e) => e.preventDefault()} className="text-accent-purple hover:text-accent-purple-hover transition-colors">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" onClick={(e) => e.preventDefault()} className="text-accent-purple hover:text-accent-purple-hover transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
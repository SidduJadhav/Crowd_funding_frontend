// API Configuration
let API_BASE_URL;

if (window.location.hostname === 'localhost') {
  // Frontend is running locally
  API_BASE_URL = 'http://localhost:8080/api/v1';
} else {
  // Frontend is hosted (e.g. Render, Vercel, etc.)
  API_BASE_URL = 'https://catalyster.onrender.com/api/v1';
}

export { API_BASE_URL };


// Categories for filtering
export const CATEGORIES = [
  'Technology',
  'Art',
  'Design',
  'Health',
  'Education',
  'Social',
  'Environment',
  'Entertainment',
];

// Funding statuses
export const FUNDING_STATUS = {
  ACTIVE: 'active',
  FUNDED: 'funded',
  FAILED: 'failed',
};

// Sort options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'trending', label: 'Trending' },
  { value: 'most_funded', label: 'Most Funded' },
  { value: 'ending_soon', label: 'Ending Soon' },
];

// Colors
export const COLORS = {
  darkBg: '#0d1117',
  darkBgSecondary: '#161b22',
  darkBgTertiary: '#21262d',
  accentPurple: '#a371f7',
  accentPurpleHover: '#923cc5',
  textPrimary: '#e6edf3',
  textSecondary: '#8b949e',
  textTertiary: '#6e7681',
  success: '#26a641',
  error: '#da3633',
  warning: '#fb8500',
  info: '#0969da',
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  FILTERS: 'campaign_filters',
};

/**
 * Utility helper functions for the application
 */

// Validation helpers
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUsername = (username) => {
  return username.length >= 3 && username.length <= 30;
};

export const isValidPassword = (password) => {
  return password.length >= 8;
};

export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

// String helpers
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.split(' ').map(capitalizeFirst).join(' ');
};

export const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Array helpers
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export const filterBy = (array, key, value) => {
  return array.filter((item) => item[key] === value);
};

// Object helpers
export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

export const omit = (obj, keys) => {
  return Object.keys(obj).reduce((result, key) => {
    if (!keys.includes(key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

export const deepMerge = (target, source) => {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};

const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

// Local storage helpers
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving to localStorage: ${e.message}`);
  }
};

export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading from localStorage: ${e.message}`);
    return defaultValue;
  }
};

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`Error removing from localStorage: ${e.message}`);
  }
};

export const clearLocalStorage = () => {
  try {
    localStorage.clear();
  } catch (e) {
    console.error(`Error clearing localStorage: ${e.message}`);
  }
};

// Error handling
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Delay helpers
export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const retry = async (fn, maxAttempts = 3, delayMs = 1000) => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxAttempts - 1) throw error;
      await delay(delayMs);
    }
  }
};

// URL helpers
export const getQueryParam = (param) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
};

export const setQueryParams = (params) => {
  const queryString = new URLSearchParams(params).toString();
  const newUrl = `${window.location.pathname}?${queryString}`;
  window.history.replaceState({ path: newUrl }, '', newUrl);
};

export const buildQueryString = (params) => {
  return new URLSearchParams(params).toString();
};

// Browser helpers
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    console.error('Failed to copy:', e);
    return false;
  }
};

export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const getDeviceType = () => {
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Random helpers
export const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const generateRandomColor = () => {
  const colors = [
    '#a371f7',
    '#923cc5',
    '#0969da',
    '#26a641',
    '#da3633',
    '#fb8500',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
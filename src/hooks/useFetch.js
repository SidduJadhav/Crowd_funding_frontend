import { useState, useEffect } from 'react';
import apiClient from '../services/api';

/**
 * Custom hook for fetching data from API
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @returns {object} - { data, loading, error, refetch }
 */
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(url);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

/**
 * Custom hook for POST/PUT requests
 * @returns {object} - { execute, loading, error, data }
 */
export const useAsync = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (method, url, payload = null) => {
    try {
      setLoading(true);
      setError(null);
      let response;

      if (method === 'post') {
        response = await apiClient.post(url, payload);
      } else if (method === 'put') {
        response = await apiClient.put(url, payload);
      } else if (method === 'delete') {
        response = await apiClient.delete(url);
      } else {
        response = await apiClient.get(url);
      }

      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    execute,
    loading,
    error,
    data,
  };
};

/**
 * Custom hook for pagination
 * @param {array} items - Array of items to paginate
 * @param {number} itemsPerPage - Items per page
 * @returns {object} - { currentItems, currentPage, totalPages, goToPage }
 */
export const usePagination = (items = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil((items?.length || 0) / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items?.slice(startIndex, endIndex) || [];

  const goToPage = (page) => {
    const pageNum = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNum);
  };

  return {
    currentItems,
    currentPage,
    totalPages,
    goToPage,
  };
};

/**
 * Custom hook for debounced values
 * @param {any} value - Value to debounce
 * @param {number} delay - Debounce delay in ms
 * @returns {any} - Debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
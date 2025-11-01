import { loadStripe } from '@stripe/stripe-js';
import apiClient from './api';

/**
 * Stripe Payment Service - Frontend Integration
 * Using Checkout Session with server-side redirect
 */

let stripePromise = null;

/**
 * Initialize Stripe
 */
const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      throw new Error(
        'Stripe publishable key is not configured. ' +
        'Please set VITE_STRIPE_PUBLISHABLE_KEY in your environment variables.'
      );
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

/**
 * Check if Stripe is properly configured
 */
export const isStripeConfigured = () => {
  return !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
};

/**
 * Initiate donation and get Checkout Session ID
 * @param {Object} donationData - Donation details
 * @returns {Promise<Object>} Contains sessionId, donationId, amount, currency, checkoutUrl
 */
export const initiateDonation = async (donationData) => {
  try {
    console.log('Initiating donation:', donationData);

    const response = await apiClient.post('/donations/initiate', {
      campaignId: donationData.campaignId,
      donorId: donationData.donorId,
      donorEmail: donationData.donorEmail,
      amount: donationData.amount,
      currency: donationData.currency || 'INR',
      isAnonymous: donationData.isAnonymous || false,
      message: donationData.message || '',
      paymentMethod: 'STRIPE_CHECKOUT',
    });

    console.log('Donation initiated successfully:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error initiating donation:', error);
    throw error;
  }
};

/**
 * Redirect to Stripe Checkout
 * Method: Direct URL redirect (simplest approach)
 * The backend returns the Checkout URL, we just redirect to it
 * @param {string} checkoutUrl - Stripe Checkout URL from backend
 * @returns {void}
 */
export const redirectToCheckout = (checkoutUrl) => {
  try {
    console.log('Redirecting to Stripe Checkout URL:', checkoutUrl);
    
    if (!checkoutUrl) {
      throw new Error('Checkout URL not provided');
    }

    // Simple redirect to Stripe Checkout
    window.location.href = checkoutUrl;

  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
};

/**
 * Complete donation flow - initiate and redirect
 * @param {Object} donationData - Donation details
 * @returns {Promise<void>}
 */
export const startDonationCheckout = async (donationData) => {
  try {
    // Step 1: Initiate donation and get checkout URL from backend
    const { sessionId, checkoutUrl } = await initiateDonation(donationData);

    if (!checkoutUrl) {
      throw new Error('Backend did not return checkout URL');
    }

    // Step 2: Redirect to Stripe Checkout
    redirectToCheckout(checkoutUrl);

  } catch (error) {
    console.error('Donation checkout failed:', error);
    throw error;
  }
};

/**
 * Verify payment after returning from Stripe
 * @param {string} sessionId - Stripe session ID from URL
 * @param {string} donationId - Donation ID from URL
 * @returns {Promise<Object>} Donation details
 */
export const verifyPayment = async (sessionId, donationId) => {
  try {
    console.log('Verifying payment:', { sessionId, donationId });

    const response = await apiClient.get('/donations/verify', {
      params: {
        session_id: sessionId,
        donation_id: donationId,
      },
    });

    console.log('Payment verified successfully:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

/**
 * Get donation details
 * @param {string} donationId - Donation ID
 * @returns {Promise<Object>} Donation details
 */
export const getDonationDetails = async (donationId) => {
  try {
    const response = await apiClient.get(`/donations/${donationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching donation details:', error);
    throw error;
  }
};

/**
 * Get campaign donations
 * @param {string} campaignId - Campaign ID
 * @param {Object} params - Pagination params
 * @returns {Promise<Object>} Paginated donations
 */
export const getCampaignDonations = async (campaignId, params = {}) => {
  try {
    const { page = 0, size = 20 } = params;
    const response = await apiClient.get(`/donations/campaign/${campaignId}`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching campaign donations:', error);
    throw error;
  }
};

/**
 * Get user donations
 * @param {Object} params - Pagination params
 * @returns {Promise<Object>} Paginated donations
 */
export const getUserDonations = async (params = {}) => {
  try {
    const { page = 0, size = 20 } = params;
    const response = await apiClient.get('/donations/user/me', {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user donations:', error);
    throw error;
  }
};

/**
 * Get total donations for campaign
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<number>} Total amount
 */
export const getCampaignTotal = async (campaignId) => {
  try {
    const response = await apiClient.get(
      `/donations/campaign/${campaignId}/total`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching campaign total:', error);
    throw error;
  }
};

/**
 * Get unique donor count for campaign
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<number>} Donor count
 */
export const getDonorCount = async (campaignId) => {
  try {
    const response = await apiClient.get(
      `/donations/campaign/${campaignId}/donors/count`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching donor count:', error);
    throw error;
  }
};

/**
 * Refund donation (admin only)
 * @param {string} donationId - Donation ID
 * @param {string} reason - Refund reason
 * @returns {Promise<Object>} Refund details
 */
export const refundDonation = async (donationId, reason) => {
  try {
    const response = await apiClient.post(
      `/donations/${donationId}/refund?reason=${encodeURIComponent(reason)}`
    );
    return response.data;
  } catch (error) {
    console.error('Error refunding donation:', error);
    throw error;
  }
};

export default {
  getStripe,
  isStripeConfigured,
  initiateDonation,
  redirectToCheckout,
  startDonationCheckout,
  verifyPayment,
  getDonationDetails,
  getCampaignDonations,
  getUserDonations,
  getCampaignTotal,
  getDonorCount,
  refundDonation,
};
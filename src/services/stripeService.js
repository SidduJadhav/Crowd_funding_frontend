import apiClient from './api';
import { loadStripe } from '@stripe/stripe-js';

/**
 * Stripe Payment Service
 * Handles Stripe Checkout integration for donations
 */

let stripePromise = null;

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      throw new Error('Stripe publishable key is not configured. Please set VITE_STRIPE_PUBLISHABLE_KEY in your environment variables.');
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

/**
 * Check if Stripe is properly configured
 * @returns {boolean} True if Stripe key is available
 */
export const isStripeConfigured = () => {
  return !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
};

/**
 * Create a Stripe Checkout session for donation using the backend payment initiation endpoint
 * @param {Object} donationData - Donation details
 * @returns {Promise} Payment session data with checkout URL
 */
export const createCheckoutSession = async (donationData) => {
  try {
    const currentUrl = window.location.origin;
    const campaignId = donationData.campaignId;
    
    const response = await apiClient.post('/payments/initiate', {
      campaignId: donationData.campaignId,
      donorId: donationData.donorId,
      amount: donationData.amount,
      currency: donationData.currency || 'INR',
      paymentMethod: 'STRIPE',
      isAnonymous: donationData.isAnonymous || false,
      message: donationData.message || '',
    });

    return response.data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

/**
 * Initiate payment and redirect to Stripe Checkout or payment URL
 * @param {Object} donationData - Donation details
 * @returns {Promise} Redirect to Stripe Checkout or return payment data
 */
export const initiateStripePayment = async (donationData) => {
  try {
    const checkoutData = await createCheckoutSession(donationData);
    
    if (checkoutData.sessionId) {
      try {
        const stripe = await getStripe();
        const { error } = await stripe.redirectToCheckout({
          sessionId: checkoutData.sessionId,
        });
        
        if (error) {
          throw new Error(`Stripe checkout failed: ${error.message}`);
        }
        return { redirecting: true, paymentId: checkoutData.paymentId };
      } catch (stripeError) {
        throw new Error(`Stripe initialization failed: ${stripeError.message}. Please check if Stripe is properly configured.`);
      }
    }
    
    if (checkoutData.redirectUrl) {
      window.location.href = checkoutData.redirectUrl;
      return { redirecting: true, paymentId: checkoutData.paymentId };
    }
    
    throw new Error('Backend did not return a valid Stripe session or redirect URL');
  } catch (error) {
    console.error('Payment initiation error:', error);
    throw error;
  }
};

/**
 * Verify payment status using payment ID
 * @param {string} paymentId - Payment ID from backend
 * @returns {Promise} Payment verification data
 */
export const verifyStripePayment = async (paymentId) => {
  try {
    const response = await apiClient.get(`/payments/verify/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

/**
 * Create donation directly (for testing or non-Stripe payments)
 * @param {Object} donationData - Donation details
 * @returns {Promise} Donation creation response
 */
export const createDirectDonation = async (donationData) => {
  try {
    const response = await apiClient.post('/donations', {
      campaignId: donationData.campaignId,
      donorId: donationData.donorId,
      amount: donationData.amount,
      currency: donationData.currency || 'INR',
      isAnonymous: donationData.isAnonymous || false,
      message: donationData.message || '',
      paymentMethod: donationData.paymentMethod || 'STRIPE',
      paymentDetails: donationData.paymentDetails || {},
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating donation:', error);
    throw error;
  }
};

export default {
  createCheckoutSession,
  initiateStripePayment,
  verifyStripePayment,
  createDirectDonation,
  getStripe,
  isStripeConfigured,
};

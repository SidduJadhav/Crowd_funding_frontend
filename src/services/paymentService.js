import apiClient from './api';

/**
 * Payment Service - Indian Payment Integration
 * Supports: UPI, Net Banking, Debit/Credit Cards, Wallets
 */

// ==================== PAYMENT INITIATION ====================

// Initialize payment for donation
export const initiatePayment = async (paymentData) => {
  const response = await apiClient.post('/payments/initiate', paymentData);
  return response.data;
};

// ==================== UPI PAYMENT ====================

// Generate UPI payment link
export const generateUPILink = async (amount, campaignId, donorId) => {
  const response = await apiClient.post('/payments/upi/generate', {
    amount,
    campaignId,
    donorId,
  });
  return response.data;
};

// Generate UPI QR Code
export const generateUPIQRCode = async (amount, campaignId, donorId) => {
  const response = await apiClient.post('/payments/upi/qr-code', {
    amount,
    campaignId,
    donorId,
  });
  return response.data; // Returns base64 QR code image
};

// Verify UPI payment
export const verifyUPIPayment = async (transactionId) => {
  const response = await apiClient.get(`/payments/upi/verify/${transactionId}`);
  return response.data;
};

// ==================== CARD PAYMENT ====================

// Process card payment
export const processCardPayment = async (cardData) => {
  const response = await apiClient.post('/payments/card/process', cardData);
  return response.data;
};

// Validate card
export const validateCard = async (cardNumber) => {
  const response = await apiClient.post('/payments/card/validate', { cardNumber });
  return response.data;
};

// ==================== NET BANKING ====================

// Get list of supported banks
export const getSupportedBanks = async () => {
  const response = await apiClient.get('/payments/netbanking/banks');
  return response.data;
};

// Initiate net banking payment
export const initiateNetBanking = async (bankCode, amount, campaignId, donorId) => {
  const response = await apiClient.post('/payments/netbanking/initiate', {
    bankCode,
    amount,
    campaignId,
    donorId,
  });
  return response.data;
};

// ==================== WALLET PAYMENT ====================

// Get supported wallets (Paytm, PhonePe, Google Pay, etc.)
export const getSupportedWallets = async () => {
  const response = await apiClient.get('/payments/wallet/supported');
  return response.data;
};

// Initiate wallet payment
export const initiateWalletPayment = async (walletType, amount, campaignId, donorId) => {
  const response = await apiClient.post('/payments/wallet/initiate', {
    walletType,
    amount,
    campaignId,
    donorId,
  });
  return response.data;
};

// ==================== PAYMENT VERIFICATION ====================

// Verify payment status
export const verifyPayment = async (paymentId) => {
  const response = await apiClient.get(`/payments/verify/${paymentId}`);
  return response.data;
};

// Get payment details
export const getPaymentDetails = async (paymentId) => {
  const response = await apiClient.get(`/payments/${paymentId}`);
  return response.data;
};

// ==================== REFUND ====================

// Request refund
export const requestRefund = async (paymentId, reason) => {
  const response = await apiClient.post(`/payments/${paymentId}/refund`, { reason });
  return response.data;
};

// Get refund status
export const getRefundStatus = async (refundId) => {
  const response = await apiClient.get(`/payments/refund/${refundId}/status`);
  return response.data;
};

// ==================== PAYMENT HISTORY ====================

// Get user payment history
export const getUserPaymentHistory = async (userId, params = {}) => {
  const { page = 0, size = 20 } = params;
  const queryParams = new URLSearchParams({ page, size });
  const response = await apiClient.get(`/payments/user/${userId}/history?${queryParams}`);
  return response.data;
};

// Get campaign payment history
export const getCampaignPaymentHistory = async (campaignId, params = {}) => {
  const { page = 0, size = 20 } = params;
  const queryParams = new URLSearchParams({ page, size });
  const response = await apiClient.get(`/payments/campaign/${campaignId}/history?${queryParams}`);
  return response.data;
};

// ==================== HELPER FUNCTIONS ====================

// Validate UPI ID
export const validateUPIId = (upiId) => {
  const upiRegex = /^[\w.-]+@[\w.-]+$/;
  return upiRegex.test(upiId);
};

// Validate card number (Luhn algorithm)
export const validateCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleaned)) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Get card type from number
export const getCardType = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(cleaned)) return 'Visa';
  if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
  if (/^3[47]/.test(cleaned)) return 'American Express';
  if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
  if (/^35/.test(cleaned)) return 'JCB';
  if (/^(?:2131|1800|30[0-5])/.test(cleaned)) return 'Diners Club';
  if (/^(5018|5020|5038|6304|6759|6761|6763)/.test(cleaned)) return 'Maestro';
  if (/^(6062|60[6-9][0-9]|65[0-9])/.test(cleaned)) return 'RuPay';
  
  return 'Unknown';
};

// Format card number with spaces
export const formatCardNumber = (cardNumber) => {
  return cardNumber.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || cardNumber;
};

// Mask card number
export const maskCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, '');
  return `**** **** **** ${cleaned.slice(-4)}`;
};

export default {
  initiatePayment,
  generateUPILink,
  generateUPIQRCode,
  verifyUPIPayment,
  processCardPayment,
  validateCard,
  getSupportedBanks,
  initiateNetBanking,
  getSupportedWallets,
  initiateWalletPayment,
  verifyPayment,
  getPaymentDetails,
  requestRefund,
  getRefundStatus,
  getUserPaymentHistory,
  getCampaignPaymentHistory,
  validateUPIId,
  validateCardNumber,
  getCardType,
  formatCardNumber,
  maskCardNumber,
};
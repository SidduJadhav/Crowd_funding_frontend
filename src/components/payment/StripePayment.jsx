import { useState, useEffect } from 'react';
import Button from '../Common/Button';
import Alert from '../Common/Alert';
import { CreditCard } from 'lucide-react';
import { initiateStripePayment, isStripeConfigured } from '../../services/stripeService';

const StripePayment = ({ amount, campaignId, donorId, isAnonymous, message, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stripeAvailable, setStripeAvailable] = useState(true);

  useEffect(() => {
    const checkStripeConfig = () => {
      if (!isStripeConfigured()) {
        setStripeAvailable(false);
        setError('Stripe payment is not available. Please use alternative payment methods.');
        onError('Stripe is not configured. Contact support or use alternative payment methods.');
      }
    };
    
    checkStripeConfig();
  }, [onError]);

  const handleStripeCheckout = async () => {
    if (!stripeAvailable) {
      setError('Stripe payment is currently unavailable');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!donorId) {
      setError('Please login to make a donation');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const donationData = {
        campaignId,
        donorId,
        amount: parseFloat(amount),
        currency: 'INR',
        isAnonymous,
        message,
        paymentMethod: 'STRIPE',
      };

      const result = await initiateStripePayment(donationData);
      
      if (result.redirecting) {
        console.log('Redirecting to Stripe Checkout...');
      } else if (result.paymentId || result.id) {
        onSuccess(result);
      } else {
        throw new Error('Invalid response from payment service');
      }
    } catch (err) {
      console.error('Stripe payment error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Payment initiation failed. Please try again.';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <Alert type="error" message={error} onDismiss={() => setError('')} />}

      <div className="bg-dark-bg-tertiary rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="text-accent-purple" size={24} />
          <div>
            <h3 className="text-text-primary font-semibold">Secure Card Payment</h3>
            <p className="text-text-secondary text-sm">Powered by Stripe</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <svg className="w-4 h-4 text-status-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Secure SSL encrypted payment</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <svg className="w-4 h-4 text-status-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>All major credit and debit cards accepted</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <svg className="w-4 h-4 text-status-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>PCI DSS compliant</span>
          </div>
        </div>

        <div className="border-t border-dark-bg-tertiary pt-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-text-secondary">Donation Amount:</span>
            <span className="text-text-primary font-semibold text-lg">
              ₹{parseFloat(amount || 0).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary text-sm">Platform Fee:</span>
            <span className="text-text-primary text-sm">₹0</span>
          </div>
        </div>

        <Button
          onClick={handleStripeCheckout}
          variant="primary"
          loading={loading}
          disabled={loading || !amount || parseFloat(amount) <= 0 || !stripeAvailable}
          className="w-full py-3 text-lg"
        >
          {loading ? 'Processing...' : `Pay ₹${parseFloat(amount || 0).toLocaleString('en-IN')}`}
        </Button>

        <p className="text-text-tertiary text-xs text-center mt-4">
          By proceeding, you agree to our terms of service and privacy policy
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-text-tertiary">
        <span>Accepted cards:</span>
        <div className="flex gap-1">
          <span className="px-2 py-1 bg-dark-bg-tertiary rounded text-xs">Visa</span>
          <span className="px-2 py-1 bg-dark-bg-tertiary rounded text-xs">Mastercard</span>
          <span className="px-2 py-1 bg-dark-bg-tertiary rounded text-xs">RuPay</span>
        </div>
      </div>
    </div>
  );
};

export default StripePayment;

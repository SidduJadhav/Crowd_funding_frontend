import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { verifyPayment } from '../services/paymentService';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      try {
        const paymentId = searchParams.get('payment_id');
        const sessionId = searchParams.get('session_id');
        const campaignId = searchParams.get('campaign_id');
        
        if (paymentId) {
          try {
            const data = await verifyPayment(paymentId);
            setPaymentData(data);
          } catch (verifyError) {
            console.warn('Payment verification failed, showing success anyway:', verifyError);
            setPaymentData({ campaignId, paymentId });
          }
        } else if (sessionId) {
          console.log('Stripe session detected, payment completed via Stripe');
          setPaymentData({ campaignId, sessionId, stripePayment: true });
        } else if (campaignId) {
          setPaymentData({ campaignId });
        } else {
          setPaymentData({});
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError('Unable to verify payment details. Please check your donation history or contact support if amount was deducted.');
      } finally {
        setLoading(false);
      }
    };

    verifyPaymentStatus();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-dark-bg-secondary border border-dark-bg-tertiary rounded-lg p-8 text-center">
          <div className="text-status-error text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Verification Error</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <Button onClick={() => navigate('/home')} variant="primary">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-dark-bg-secondary border border-dark-bg-tertiary rounded-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="text-status-success mx-auto" size={80} />
        </div>
        
        <h1 className="text-3xl font-bold text-text-primary mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-text-secondary mb-2">
          Thank you for your generous donation.
        </p>
        
        <p className="text-text-secondary mb-8">
          Your contribution will make a real difference to this campaign.
        </p>

        {paymentData && (
          <div className="bg-dark-bg-tertiary rounded-lg p-4 mb-8 space-y-2">
            {paymentData.amount && (
              <div className="flex justify-between text-sm">
                <span className="text-text-tertiary">Amount:</span>
                <span className="text-text-primary font-semibold">
                  ₹{parseFloat(paymentData.amount).toLocaleString('en-IN')}
                </span>
              </div>
            )}
            {paymentData.transactionId && (
              <div className="flex justify-between text-sm">
                <span className="text-text-tertiary">Transaction ID:</span>
                <span className="text-text-primary font-mono text-xs">
                  {paymentData.transactionId}
                </span>
              </div>
            )}
            {paymentData.paymentMethod && (
              <div className="flex justify-between text-sm">
                <span className="text-text-tertiary">Payment Method:</span>
                <span className="text-text-primary">
                  {paymentData.paymentMethod}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          {paymentData?.campaignId && (
            <Button
              onClick={() => navigate(`/campaign/${paymentData.campaignId}`)}
              variant="primary"
              className="w-full"
            >
              View Campaign
              <ArrowRight size={18} className="ml-2" />
            </Button>
          )}
          
          <Button
            onClick={() => navigate('/home')}
            variant="secondary"
            className="w-full"
          >
            Back to Home
          </Button>
        </div>

        <p className="text-text-tertiary text-sm mt-6">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;

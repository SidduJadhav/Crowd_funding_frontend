import { useEffect, useState } from 'react';
import { CheckCircle, Loader, AlertCircle } from 'lucide-react';
import { verifyPayment } from '../services/paymentService.js';

const PaymentSuccess = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyAndConfirmPayment = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        const donationId = urlParams.get('donation_id');

        console.log('PaymentSuccess - Params:', { sessionId, donationId });

        if (!sessionId || !donationId) {
          setError('Missing payment information in URL');
          setLoading(false);
          return;
        }

        // Verify payment with backend
        console.log('Verifying payment with backend...');
        const data = await verifyPayment(sessionId, donationId);
        
        console.log('Payment verified successfully:', data);
        setPaymentData(data);

        // Auto-redirect after 3 seconds
        setTimeout(() => {
          window.location.href = `/campaign/${data.campaignId}`;
        }, 3000);

      } catch (err) {
        console.error('Payment verification error:', err);
        setError(
          err.response?.data?.message || 
          'Payment verification failed. Please check your email or contact support.'
        );
      } finally {
        setLoading(false);
      }
    };

    verifyAndConfirmPayment();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader size={40} className="animate-spin text-indigo-500" />
          <p className="text-gray-300 text-lg">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
          <AlertCircle size={60} className="text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Verification Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => (window.location.href = '/home')}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
        
        <div className="mb-6 flex justify-center">
          <CheckCircle size={80} className="text-green-500 animate-bounce" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">
          Payment Successful!
        </h1>
        
        <p className="text-gray-400 mb-6">
          Thank you for your generous donation. Your contribution will make a real difference.
        </p>

        {paymentData && (
          <div className="bg-slate-700 rounded-lg p-4 mb-6 space-y-3 text-left">x
            <div className="flex justify-between">
              <span className="text-gray-400">Amount Donated:</span>
              <span className="text-white font-semibold">
                ₹{parseFloat(paymentData.amount).toLocaleString('en-IN')}
              </span>
            </div>
            {paymentData.campaignTitle && (
              <div className="flex justify-between">
                <span className="text-gray-400">Campaign:</span>
                <span className="text-white font-semibold truncate max-w-xs">
                  {paymentData.campaignTitle}
                </span>
              </div>
            )}
            {paymentData.transactionId && (
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction ID:</span>
                <span className="text-gray-300 text-xs font-mono">
                  {paymentData.transactionId.slice(0, 20)}...
                </span>
              </div>
            )}
            {paymentData.createdAt && (
              <div className="flex justify-between">
                <span className="text-gray-400">Date:</span>
                <span className="text-white">
                  {new Date(paymentData.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3 mb-6">
          {paymentData?.campaignId && (
            <button
              onClick={() => (window.location.href = `/campaign/${paymentData.campaignId}`)}
              className="w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-lg transition font-semibold"
            >
              View Campaign
            </button>
          )}

          <button
            onClick={() => (window.location.href = '/home')}
            className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
          >
            Back to Home
          </button>
        </div>

        <div className="pt-4 border-t border-slate-600">
          <p className="text-xs text-gray-500">
            Auto-redirecting in 3 seconds...
          </p>
          <p className="text-xs text-gray-500 mt-2">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
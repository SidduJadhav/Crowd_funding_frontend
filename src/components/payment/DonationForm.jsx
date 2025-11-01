import { useState } from 'react';
import { Heart, Loader, AlertCircle } from 'lucide-react';
import { startDonationCheckout } from '../../services/paymentService';

const DonationForm = ({ campaignId, campaignTitle, donorId, donorEmail }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const presetAmounts = [100, 500, 1000, 5000, 10000];

  const validateForm = () => {
    if (!amount || parseFloat(amount) < 1) {
      setError('Please enter amount >= ₹1');
      return false;
    }
    if (message.length > 500) {
      setError('Message max 500 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await startDonationCheckout({
        campaignId,
        donorId,
        donorEmail,
        amount: parseFloat(amount),
        currency: 'INR',
        message,
        isAnonymous,
      });
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-center mb-6">
        <Heart className="text-red-500 mr-2" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">Support {campaignTitle}</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg flex items-start gap-2">
          <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Donation Amount *
          </label>
          <div className="relative mb-2">
            <span className="absolute left-3 top-3 text-gray-600 font-semibold">₹</span>
            <input
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="500"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
          </div>

          <div className="flex gap-2">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset.toString())}
                className="flex-1 py-1 px-2 text-xs bg-white border border-gray-300 rounded hover:bg-indigo-50 transition"
                disabled={loading}
              >
                ₹{preset}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your support message..."
            maxLength="500"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows="3"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">{message.length}/500</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
            disabled={loading}
          />
          <label htmlFor="anonymous" className="text-sm text-gray-700">
            Make this donation anonymous
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !amount}
          className="w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <Loader size={18} className="animate-spin" />}
          {loading ? 'Processing...' : 'Donate Now'}
        </button>
      </div>

      <p className="text-xs text-gray-600 text-center mt-4">
        💳 Secure payment powered by Stripe
      </p>
    </div>
  );
};

export default DonationForm;
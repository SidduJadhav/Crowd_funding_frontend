import { useState } from 'react';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import Input from '../Common/Input';
import Alert from '../Common/Alert';
import { Heart } from 'lucide-react';

const DonationModal = ({ isOpen, onClose, campaign }) => {
  const [formData, setFormData] = useState({
    amount: '',
    message: '',
    isAnonymous: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const handlePresetAmount = (amount) => {
    setFormData((prev) => ({
      ...prev,
      amount: amount.toString(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      // TODO: Call donation API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert('Thank you for your donation!');
      onClose();
      setFormData({ amount: '', message: '', isAnonymous: false });
    } catch (err) {
      setError('Donation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const actions = (
    <div className="flex gap-3 w-full">
      <Button
        variant="secondary"
        size="lg"
        className="flex-1"
        onClick={onClose}
        disabled={loading}
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        size="lg"
        className="flex-1"
        loading={loading}
        disabled={loading}
        onClick={handleSubmit}
      >
        <Heart size={20} />
        Donate
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Support ${campaign?.title || 'This Project'}`}
      actions={actions}
      size="lg"
    >
      <div className="space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert type="error" message={error} dismissible={false} />
        )}

        {/* Amount Selection */}
        <div>
          <label className="block text-text-primary font-medium mb-4">
            Select or Enter Amount
          </label>

          {/* Preset Amounts */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handlePresetAmount(amount)}
                className={`py-2 px-3 rounded border transition-colors font-semibold ${
                  formData.amount === amount.toString()
                    ? 'bg-accent-purple border-accent-purple text-white'
                    : 'border-dark-bg-tertiary text-text-secondary hover:border-accent-purple'
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <Input
            type="number"
            placeholder="Enter custom amount"
            value={formData.amount}
            onChange={handleChange}
            name="amount"
            min="1"
            step="0.01"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-text-primary font-medium mb-2">
            Leave a Message (Optional)
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Share your thoughts about this project..."
            maxLength={500}
            rows={4}
            className="w-full px-4 py-3 bg-dark-bg border border-dark-bg-tertiary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-purple transition-colors resize-none"
          />
          <p className="text-text-tertiary text-sm mt-1">
            {formData.message.length}/500
          </p>
        </div>

        {/* Anonymous Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="anonymous"
            name="isAnonymous"
            checked={formData.isAnonymous}
            onChange={handleChange}
            className="w-4 h-4 rounded bg-dark-bg border border-dark-bg-tertiary cursor-pointer"
          />
          <label htmlFor="anonymous" className="ml-2 text-text-secondary text-sm cursor-pointer">
            Keep my donation anonymous
          </label>
        </div>

        {/* Summary */}
        <div className="bg-dark-bg-tertiary rounded p-4 border border-dark-bg-tertiary">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Your Donation:</span>
            <span className="text-2xl font-bold text-accent-purple">
              ${parseFloat(formData.amount || 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Info */}
        <Alert
          type="info"
          message="Your donation is secure and processed through our trusted payment partner."
          dismissible={false}
        />
      </div>
    </Modal>
  );
};

export default DonationModal;
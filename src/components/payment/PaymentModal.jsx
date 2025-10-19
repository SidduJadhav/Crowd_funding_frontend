import { useState, useContext } from 'react';
import Modal from '../Common/Modal';
import Button from '../Common/Button';  
import Alert from '../Common/Alert';
import { CreditCard, Building2, Smartphone, Wallet, QrCode } from 'lucide-react';
import UPIPayment from './UPIPayment';
import CardPayment from './CardPayment';
import NetBankingPayment from './NetBankingPayment';
import WalletPayment from './WalletPayment';
import StripePayment from './StripePayment';
import { AuthContext } from '../../context/AuthContext';

const PaymentModal = ({ isOpen, onClose, campaign, amount: initialAmount }) => {
  const { user } = useContext(AuthContext);
  const [amount, setAmount] = useState(initialAmount || '');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const paymentMethods = [
    { id: 'stripe', name: 'Card (Stripe)', icon: CreditCard, desc: 'Secure card payment via Stripe', recommended: true },
    { id: 'upi', name: 'UPI', icon: QrCode, desc: 'Pay via Google Pay, PhonePe, Paytm' },
    { id: 'card', name: 'Card', icon: CreditCard, desc: 'Debit/Credit Card' },
    { id: 'netbanking', name: 'Net Banking', icon: Building2, desc: 'All major banks' },
    { id: 'wallet', name: 'Wallet', icon: Wallet, desc: 'Paytm, PhonePe, etc.' },
  ];

  const presetAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const handlePaymentSuccess = (paymentData) => {
    alert('Payment successful! Thank you for your donation.');
    onClose();
  };

  const handlePaymentError = (errorMsg) => {
    setError(errorMsg);
  };

  const renderPaymentForm = () => {
    const commonProps = {
      amount,
      campaignId: campaign?.id,
      donorId: user?.id,
      isAnonymous,
      message,
      onSuccess: handlePaymentSuccess,
      onError: handlePaymentError,
    };

    switch (paymentMethod) {
      case 'stripe':
        return <StripePayment {...commonProps} />;
      case 'upi':
        return <UPIPayment {...commonProps} />;
      case 'card':
        return <CardPayment {...commonProps} />;
      case 'netbanking':
        return <NetBankingPayment {...commonProps} />;
      case 'wallet':
        return <WalletPayment {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Support This Campaign"
      size="lg"
    >
      <div className="space-y-6">
        {/* Campaign Info */}
        <div className="flex items-center gap-4 p-4 bg-dark-bg-tertiary rounded-lg">
          <img
            src={campaign?.image || 'https://via.placeholder.com/80'}
            alt={campaign?.title}
            className="w-16 h-16 rounded object-cover"
          />
          <div>
            <h3 className="text-text-primary font-semibold">{campaign?.title}</h3>
            <p className="text-text-secondary text-sm">by {campaign?.creatorName}</p>
          </div>
        </div>

        {error && <Alert type="error" message={error} onDismiss={() => setError('')} />}

        {!paymentMethod ? (
          <>
            {/* Amount Selection */}
            <div>
              <label className="block text-text-primary font-medium mb-3">
                Select or Enter Amount (₹)
              </label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset.toString())}
                    className={`py-3 px-4 rounded border transition-colors font-semibold ${
                      amount === preset.toString()
                        ? 'bg-accent-purple border-accent-purple text-white'
                        : 'border-dark-bg-tertiary text-text-secondary hover:border-accent-purple'
                    }`}
                  >
                    ₹{preset.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Enter custom amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-bg-tertiary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-purple"
                min="1"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-text-primary font-medium mb-2">
                Leave a Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts about this project..."
                maxLength={500}
                rows={3}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-bg-tertiary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-purple resize-none"
              />
              <p className="text-text-tertiary text-sm mt-1">{message.length}/500</p>
            </div>

            {/* Anonymous */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded bg-dark-bg border-dark-bg-tertiary cursor-pointer"
              />
              <label htmlFor="anonymous" className="ml-2 text-text-secondary text-sm cursor-pointer">
                Keep my donation anonymous
              </label>
            </div>

            {/* Payment Methods */}
            <div>
              <label className="block text-text-primary font-medium mb-3">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      disabled={!amount || parseFloat(amount) <= 0}
                      className={`p-4 border rounded-lg hover:border-accent-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left relative ${
                        method.recommended ? 'border-accent-purple bg-accent-purple bg-opacity-5' : 'border-dark-bg-tertiary'
                      }`}
                    >
                      {method.recommended && (
                        <span className="absolute top-2 right-2 text-xs bg-accent-purple text-white px-2 py-1 rounded">
                          Recommended
                        </span>
                      )}
                      <Icon className="text-accent-purple mb-2" size={24} />
                      <h4 className="text-text-primary font-semibold">{method.name}</h4>
                      <p className="text-text-tertiary text-sm">{method.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Total Summary */}
            <div className="bg-dark-bg-tertiary rounded-lg p-4 border border-dark-bg-tertiary">
              <div className="flex justify-between items-center mb-2">
                <span className="text-text-secondary">Donation Amount:</span>
                <span className="text-text-primary font-semibold">
                  ₹{parseFloat(amount || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-text-secondary">Platform Fee (0%):</span>
                <span className="text-text-primary font-semibold">₹0</span>
              </div>
              <div className="border-t border-dark-bg-tertiary my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-text-primary font-semibold text-lg">Total:</span>
                <span className="text-accent-purple font-bold text-2xl">
                  ₹{parseFloat(amount || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <Alert
              type="info"
              message="Your donation is secure. We use industry-standard encryption to protect your payment information."
              dismissible={false}
            />
          </>
        ) : (
          <>
            {/* Back Button */}
            <button
              onClick={() => setPaymentMethod('')}
              className="text-accent-purple hover:text-accent-purple-hover flex items-center gap-2"
            >
              ← Back to payment methods
            </button>

            {/* Payment Form */}
            {renderPaymentForm()}
          </>
        )}
      </div>
    </Modal>
  );
};

export default PaymentModal;
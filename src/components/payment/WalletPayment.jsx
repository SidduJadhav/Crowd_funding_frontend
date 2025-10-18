import { useState, useEffect } from 'react';
import Button from '../Common/Button';
import Alert from '../Common/Alert';
import { Wallet } from 'lucide-react';
import { getSupportedWallets, initiateWalletPayment } from '../../services/paymentService';

const WalletPayment = ({ amount, campaignId, donorId, isAnonymous, message, onSuccess, onError }) => {
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [loading, setLoading] = useState(false);

  // Popular Indian wallets
  const popularWallets = [
    { 
      code: 'PAYTM', 
      name: 'Paytm', 
      icon: '💙',
      description: 'Pay with Paytm wallet'
    },
    { 
      code: 'PHONEPE', 
      name: 'PhonePe', 
      icon: '💜',
      description: 'Pay with PhonePe wallet'
    },
    { 
      code: 'GOOGLEPAY', 
      name: 'Google Pay', 
      icon: '🔵',
      description: 'Pay with Google Pay'
    },
    { 
      code: 'AMAZONPAY', 
      name: 'Amazon Pay', 
      icon: '🟠',
      description: 'Pay with Amazon Pay'
    },
    { 
      code: 'MOBIKWIK', 
      name: 'Mobikwik', 
      icon: '🔴',
      description: 'Pay with Mobikwik wallet'
    },
    { 
      code: 'FREECHARGE', 
      name: 'Freecharge', 
      icon: '💚',
      description: 'Pay with Freecharge wallet'
    },
    { 
      code: 'AIRTEL', 
      name: 'Airtel Money', 
      icon: '🔴',
      description: 'Pay with Airtel Money'
    },
    { 
      code: 'JIO', 
      name: 'JioMoney', 
      icon: '🔵',
      description: 'Pay with JioMoney'
    },
  ];

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const response = await getSupportedWallets();
      setWallets(response.data || popularWallets);
    } catch (error) {
      setWallets(popularWallets);
    }
  };

  const handleWalletSelect = (walletCode) => {
    setSelectedWallet(walletCode);
  };

  const handleSubmit = async () => {
    if (!selectedWallet) {
      onError('Please select a wallet');
      return;
    }

    try {
      setLoading(true);
      const response = await initiateWalletPayment(
        selectedWallet,
        amount,
        campaignId,
        donorId
      );
      
      // Redirect to wallet's payment page
      if (response.redirectUrl) {
        window.location.href = response.redirectUrl;
      } else {
        onSuccess(response);
      }
    } catch (error) {
      onError(error.response?.data?.message || 'Failed to initiate wallet payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Wallet Selection */}
      <div>
        <label className="block text-text-primary font-medium mb-3">
          Select Wallet
        </label>
        <div className="grid grid-cols-2 gap-3">
          {wallets.map((wallet) => (
            <button
              key={wallet.code}
              onClick={() => handleWalletSelect(wallet.code)}
              className={`p-4 border rounded-lg transition-colors text-left ${
                selectedWallet === wallet.code
                  ? 'border-accent-purple bg-accent-purple bg-opacity-10'
                  : 'border-dark-bg-tertiary hover:border-accent-purple'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{wallet.icon}</span>
                <div>
                  <p className="text-text-primary font-semibold text-sm">
                    {wallet.name}
                  </p>
                  <p className="text-text-tertiary text-xs mt-1">
                    {wallet.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Wallet Info */}
      {selectedWallet && (
        <div className="bg-dark-bg-tertiary rounded-lg p-4">
          <p className="text-text-secondary text-sm mb-1">Selected Wallet:</p>
          <p className="text-text-primary font-semibold">
            {wallets.find((w) => w.code === selectedWallet)?.name}
          </p>
          <p className="text-text-secondary text-sm mt-2">
            Amount to pay: ₹{parseFloat(amount).toLocaleString('en-IN')}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleSubmit}
        loading={loading}
        disabled={!selectedWallet || loading}
      >
        <Wallet size={20} />
        Pay with {selectedWallet ? wallets.find(w => w.code === selectedWallet)?.name : 'Wallet'}
      </Button>

      {/* Instructions */}
      <div className="bg-dark-bg-tertiary rounded-lg p-4">
        <h4 className="text-text-primary font-semibold mb-2">Payment Process:</h4>
        <ol className="text-text-secondary text-sm space-y-1 list-decimal list-inside">
          <li>Select your preferred wallet</li>
          <li>You'll be redirected to the wallet app/website</li>
          <li>Login and authorize the payment</li>
          <li>Return here for confirmation</li>
        </ol>
      </div>

      {/* Benefits */}
      <div className="bg-dark-bg-tertiary rounded-lg p-4">
        <h4 className="text-text-primary font-semibold mb-2">Why use wallet?</h4>
        <ul className="text-text-secondary text-sm space-y-1">
          <li>✓ Instant payment confirmation</li>
          <li>✓ No need to enter card details</li>
          <li>✓ Cashback and rewards available</li>
          <li>✓ Secure and encrypted transactions</li>
        </ul>
      </div>

      {/* Security */}
      <Alert
        type="info"
        message="All wallet transactions are secured with end-to-end encryption. Your wallet credentials are never shared with us."
        dismissible={false}
      />
    </div>
  );
};

export default WalletPayment;
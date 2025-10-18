import { useState, useEffect } from 'react';
import Button from '../Common/Button';
import Alert from '../Common/Alert';
import LoadingSpinner from '../Common/LoadingSpinner';
import { Building2, Search } from 'lucide-react';
import { getSupportedBanks, initiateNetBanking } from '../../services/paymentService';

const NetBankingPayment = ({ amount, campaignId, donorId, isAnonymous, message, onSuccess, onError }) => {
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(true);

  // Popular Indian banks (mock data - replace with API data)
  const popularBanks = [
    { code: 'SBI', name: 'State Bank of India', icon: '🏦' },
    { code: 'HDFC', name: 'HDFC Bank', icon: '🏦' },
    { code: 'ICICI', name: 'ICICI Bank', icon: '🏦' },
    { code: 'AXIS', name: 'Axis Bank', icon: '🏦' },
    { code: 'KOTAK', name: 'Kotak Mahindra Bank', icon: '🏦' },
    { code: 'PNB', name: 'Punjab National Bank', icon: '🏦' },
    { code: 'BOB', name: 'Bank of Baroda', icon: '🏦' },
    { code: 'CANARA', name: 'Canara Bank', icon: '🏦' },
    { code: 'UNION', name: 'Union Bank of India', icon: '🏦' },
    { code: 'IDBI', name: 'IDBI Bank', icon: '🏦' },
    { code: 'YES', name: 'Yes Bank', icon: '🏦' },
    { code: 'INDUSIND', name: 'IndusInd Bank', icon: '🏦' },
  ];

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      setLoadingBanks(true);
      const response = await getSupportedBanks();
      setBanks(response.data || popularBanks);
    } catch (error) {
      // Use mock data if API fails
      setBanks(popularBanks);
    } finally {
      setLoadingBanks(false);
    }
  };

  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBankSelect = (bankCode) => {
    setSelectedBank(bankCode);
  };

  const handleSubmit = async () => {
    if (!selectedBank) {
      onError('Please select a bank');
      return;
    }

    try {
      setLoading(true);
      const response = await initiateNetBanking(selectedBank, amount, campaignId, donorId);
      
      // Redirect to bank's payment page
      if (response.redirectUrl) {
        window.location.href = response.redirectUrl;
      } else {
        onSuccess(response);
      }
    } catch (error) {
      onError(error.response?.data?.message || 'Failed to initiate net banking payment');
    } finally {
      setLoading(false);
    }
  };

  if (loadingBanks) {
    return (
      <div className="py-12">
        <LoadingSpinner text="Loading banks..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-text-tertiary" size={20} />
        <input
          type="text"
          placeholder="Search your bank..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-dark-bg border border-dark-bg-tertiary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-purple"
        />
      </div>

      {/* Popular Banks */}
      <div>
        <label className="block text-text-primary font-medium mb-3">
          Popular Banks
        </label>
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {filteredBanks.map((bank) => (
            <button
              key={bank.code}
              onClick={() => handleBankSelect(bank.code)}
              className={`p-4 border rounded-lg transition-colors text-left ${
                selectedBank === bank.code
                  ? 'border-accent-purple bg-accent-purple bg-opacity-10'
                  : 'border-dark-bg-tertiary hover:border-accent-purple'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{bank.icon}</span>
                <div>
                  <p className="text-text-primary font-medium text-sm">{bank.name}</p>
                  <p className="text-text-tertiary text-xs">{bank.code}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {filteredBanks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-text-secondary">No banks found matching "{searchQuery}"</p>
        </div>
      )}

      {/* Selected Bank Info */}
      {selectedBank && (
        <div className="bg-dark-bg-tertiary rounded-lg p-4">
          <p className="text-text-secondary text-sm mb-1">Selected Bank:</p>
          <p className="text-text-primary font-semibold">
            {banks.find((b) => b.code === selectedBank)?.name}
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
        disabled={!selectedBank || loading}
      >
        <Building2 size={20} />
        Proceed to Bank
      </Button>

      {/* Instructions */}
      <div className="bg-dark-bg-tertiary rounded-lg p-4">
        <h4 className="text-text-primary font-semibold mb-2">How it works:</h4>
        <ol className="text-text-secondary text-sm space-y-1 list-decimal list-inside">
          <li>Select your bank from the list above</li>
          <li>You'll be redirected to your bank's secure page</li>
          <li>Login with your net banking credentials</li>
          <li>Complete the payment and return to our site</li>
        </ol>
      </div>

      {/* Security Info */}
      <Alert
        type="info"
        message="You will be redirected to your bank's secure payment gateway. Never share your password with anyone."
        dismissible={false}
      />
    </div>
  );
};

export default NetBankingPayment;
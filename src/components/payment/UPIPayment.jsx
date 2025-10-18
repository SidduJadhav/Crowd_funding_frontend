import { useState, useEffect } from 'react';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { QrCode, Smartphone, Copy, Check } from 'lucide-react';
import { generateUPIQRCode, verifyUPIPayment, validateUPIId } from '../../services/paymentService';

const UPIPayment = ({ amount, campaignId, donorId, isAnonymous, message, onSuccess, onError }) => {
  const [upiId, setUpiId] = useState('');
  const [upiMethod, setUpiMethod] = useState('qr'); // 'qr' or 'id'
  const [qrCode, setQrCode] = useState('');
  const [upiLink, setUpiLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  // Popular UPI apps
  const upiApps = [
    { name: 'Google Pay', icon: '🟢', package: 'com.google.android.apps.nbu.paisa.user' },
    { name: 'PhonePe', icon: '🟣', package: 'com.phonepe.app' },
    { name: 'Paytm', icon: '🔵', package: 'net.one97.paytm' },
    { name: 'BHIM', icon: '🟠', package: 'in.org.npci.upiapp' },
  ];

  useEffect(() => {
    if (upiMethod === 'qr') {
      generateQRCode();
    }
  }, [upiMethod]);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      const response = await generateUPIQRCode(amount, campaignId, donorId);
      setQrCode(response.qrCodeImage);
      setUpiLink(response.upiLink);
      setTransactionId(response.transactionId);
    } catch (error) {
      onError('Failed to generate QR code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUPIIdSubmit = async () => {
    if (!validateUPIId(upiId)) {
      onError('Please enter a valid UPI ID');
      return;
    }

    try {
      setLoading(true);
      // Generate UPI payment link for the entered UPI ID
      const upiLink = `upi://pay?pa=${upiId}&pn=Crowdfund&am=${amount}&cu=INR&tn=Donation`;
      window.location.href = upiLink;
      
      // Start verification polling
      startVerificationPolling();
    } catch (error) {
      onError('Failed to initiate UPI payment');
    } finally {
      setLoading(false);
    }
  };

  const handleUPIAppClick = (app) => {
    if (upiLink) {
      window.location.href = upiLink;
      startVerificationPolling();
    }
  };

  const startVerificationPolling = () => {
    setVerifying(true);
    const interval = setInterval(async () => {
      try {
        const response = await verifyUPIPayment(transactionId);
        if (response.status === 'SUCCESS') {
          clearInterval(interval);
          setVerifying(false);
          onSuccess(response);
        } else if (response.status === 'FAILED') {
          clearInterval(interval);
          setVerifying(false);
          onError('Payment failed. Please try again.');
        }
      } catch (error) {
        console.error('Verification error:', error);
      }
    }, 3000); // Check every 3 seconds

    // Stop checking after 5 minutes
    setTimeout(() => {
      clearInterval(interval);
      setVerifying(false);
    }, 300000);
  };

  const copyUPILink = () => {
    if (upiLink) {
      navigator.clipboard.writeText(upiLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* UPI Method Selection */}
      <div>
        <label className="block text-text-primary font-medium mb-3">
          Choose UPI Payment Method
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setUpiMethod('qr')}
            className={`p-4 border rounded-lg transition-colors ${
              upiMethod === 'qr'
                ? 'border-accent-purple bg-accent-purple bg-opacity-10'
                : 'border-dark-bg-tertiary hover:border-accent-purple'
            }`}
          >
            <QrCode className="text-accent-purple mx-auto mb-2" size={32} />
            <p className="text-text-primary font-semibold text-sm">Scan QR Code</p>
          </button>
          <button
            onClick={() => setUpiMethod('id')}
            className={`p-4 border rounded-lg transition-colors ${
              upiMethod === 'id'
                ? 'border-accent-purple bg-accent-purple bg-opacity-10'
                : 'border-dark-bg-tertiary hover:border-accent-purple'
            }`}
          >
            <Smartphone className="text-accent-purple mx-auto mb-2" size={32} />
            <p className="text-text-primary font-semibold text-sm">Enter UPI ID</p>
          </button>
        </div>
      </div>

      {/* QR Code Payment */}
      {upiMethod === 'qr' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg text-center">
            {loading ? (
              <div className="animate-pulse">
                <div className="w-64 h-64 bg-gray-200 mx-auto rounded"></div>
              </div>
            ) : qrCode ? (
              <>
                <img
                  src={`data:image/png;base64,${qrCode}`}
                  alt="UPI QR Code"
                  className="w-64 h-64 mx-auto"
                />
                <p className="text-gray-600 mt-4 text-sm">
                  Scan with any UPI app to pay ₹{parseFloat(amount).toLocaleString('en-IN')}
                </p>
              </>
            ) : (
              <div className="w-64 h-64 bg-gray-100 mx-auto rounded flex items-center justify-center">
                <p className="text-gray-500">QR Code loading...</p>
              </div>
            )}
          </div>

          {/* UPI Apps */}
          <div>
            <p className="text-text-secondary text-sm mb-3">Or pay directly with:</p>
            <div className="grid grid-cols-2 gap-2">
              {upiApps.map((app) => (
                <button
                  key={app.name}
                  onClick={() => handleUPIAppClick(app)}
                  disabled={!upiLink || loading}
                  className="flex items-center gap-2 p-3 border border-dark-bg-tertiary rounded-lg hover:border-accent-purple transition-colors disabled:opacity-50"
                >
                  <span className="text-2xl">{app.icon}</span>
                  <span className="text-text-primary font-medium text-sm">{app.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Copy UPI Link */}
          {upiLink && (
            <button
              onClick={copyUPILink}
              className="w-full flex items-center justify-center gap-2 p-3 border border-dark-bg-tertiary rounded-lg hover:border-accent-purple transition-colors"
            >
              {copied ? (
                <>
                  <Check size={20} className="text-status-success" />
                  <span className="text-status-success">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={20} className="text-text-secondary" />
                  <span className="text-text-primary">Copy UPI Link</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* UPI ID Payment */}
      {upiMethod === 'id' && (
        <div className="space-y-4">
          <div>
            <label className="block text-text-primary font-medium mb-2">
              Enter Your UPI ID
            </label>
            <input
              type="text"
              placeholder="yourname@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-4 py-3 bg-dark-bg border border-dark-bg-tertiary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-purple"
            />
            <p className="text-text-tertiary text-xs mt-1">
              Example: yourname@paytm, yourname@oksbi, yourname@ybl
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleUPIIdSubmit}
            loading={loading}
            disabled={!upiId || loading}
          >
            Pay ₹{parseFloat(amount).toLocaleString('en-IN')}
          </Button>
        </div>
      )}

      {/* Verification Status */}
      {verifying && (
        <Alert
          type="info"
          title="Verifying Payment"
          message="Please complete the payment in your UPI app. We're checking for confirmation..."
          dismissible={false}
        />
      )}

      {/* Instructions */}
      <div className="bg-dark-bg-tertiary rounded-lg p-4">
        <h4 className="text-text-primary font-semibold mb-2">How to pay:</h4>
        <ol className="text-text-secondary text-sm space-y-1 list-decimal list-inside">
          <li>Scan the QR code or click on your UPI app</li>
          <li>Verify the amount and campaign details</li>
          <li>Complete the payment in your app</li>
          <li>You'll receive a confirmation here automatically</li>
        </ol>
      </div>
    </div>
  );
};

export default UPIPayment;
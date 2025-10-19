import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import Button from '../components/Common/Button';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get('campaign_id');

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-dark-bg-secondary border border-dark-bg-tertiary rounded-lg p-8 text-center">
        <div className="mb-6">
          <XCircle className="text-status-warning mx-auto" size={80} />
        </div>
        
        <h1 className="text-3xl font-bold text-text-primary mb-4">
          Payment Cancelled
        </h1>
        
        <p className="text-text-secondary mb-2">
          Your payment was not completed.
        </p>
        
        <p className="text-text-secondary mb-8">
          No charges have been made to your account. You can try again whenever you're ready.
        </p>

        <div className="bg-dark-bg-tertiary rounded-lg p-4 mb-8">
          <h3 className="text-text-primary font-semibold mb-2">Why did this happen?</h3>
          <ul className="text-text-secondary text-sm space-y-1 text-left">
            <li>• Payment was manually cancelled</li>
            <li>• Session expired</li>
            <li>• Payment gateway error</li>
            <li>• Insufficient funds</li>
          </ul>
        </div>

        <div className="space-y-3">
          {campaignId && (
            <Button
              onClick={() => navigate(`/campaign/${campaignId}`)}
              variant="primary"
              className="w-full"
            >
              <RotateCcw size={18} className="mr-2" />
              Try Again
            </Button>
          )}
          
          <Button
            onClick={() => navigate('/home')}
            variant="secondary"
            className="w-full"
          >
            <ArrowRight size={18} className="mr-2" />
            Back to Home
          </Button>
        </div>

        <p className="text-text-tertiary text-sm mt-6">
          Need help? Contact our support team for assistance.
        </p>
      </div>
    </div>
  );
};

export default PaymentCancel;

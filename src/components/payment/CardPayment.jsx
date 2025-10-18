import { useState } from 'react';
import Button from '../Common/Button';
import Alert from '../Common/Alert';
import Input from '../Common/Input';
import { CreditCard, Lock } from 'lucide-react';
import { processCardPayment, validateCardNumber, getCardType, formatCardNumber } from '../../services/paymentService';

const CardPayment = ({ amount, campaignId, donorId, isAnonymous, message, onSuccess, onError }) => {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [cardType, setCardType] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saveCard, setSaveCard] = useState(false);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length <= 19) {
      const formatted = formatCardNumber(value);
      setCardData({ ...cardData, cardNumber: formatted });
      setCardType(getCardType(value));
      
      if (errors.cardNumber) {
        setErrors({ ...errors, cardNumber: '' });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData({ ...cardData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Card Number
    const cleanCardNumber = cardData.cardNumber.replace(/\s/g, '');
    if (!cleanCardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!validateCardNumber(cleanCardNumber)) {
      newErrors.cardNumber = 'Invalid card number';
    }

    // Card Holder
    if (!cardData.cardHolder || cardData.cardHolder.length < 3) {
      newErrors.cardHolder = 'Card holder name is required';
    }

    // Expiry Month
    const month = parseInt(cardData.expiryMonth);
    if (!cardData.expiryMonth || month < 1 || month > 12) {
      newErrors.expiryMonth = 'Invalid month';
    }

    // Expiry Year
    const currentYear = new Date().getFullYear() % 100;
    const year = parseInt(cardData.expiryYear);
    if (!cardData.expiryYear || year < currentYear) {
      newErrors.expiryYear = 'Invalid year';
    }

    // CVV
    if (!cardData.cvv || cardData.cvv.length < 3) {
      newErrors.cvv = 'CVV is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const paymentData = {
        cardNumber: cardData.cardNumber.replace(/\s/g, ''),
        cardHolder: cardData.cardHolder,
        expiryMonth: cardData.expiryMonth,
        expiryYear: cardData.expiryYear,
        cvv: cardData.cvv,
        amount,
        campaignId,
        donorId,
        isAnonymous,
        message,
        saveCard,
      };

      const response = await processCardPayment(paymentData);
      onSuccess(response);
    } catch (error) {
      onError(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCardIcon = () => {
    switch (cardType) {
      case 'Visa':
        return '💳';
      case 'Mastercard':
        return '💳';
      case 'RuPay':
        return '🟠';
      case 'American Express':
        return '💳';
      default:
        return '💳';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Card Number */}
      <div>
        <label className="block text-text-primary font-medium mb-2">
          Card Number
        </label>
        <div className="relative">
          <input
            type="text"
            name="cardNumber"
            value={cardData.cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            className={`w-full px-4 py-3 pr-12 bg-dark-bg border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none transition-colors ${
              errors.cardNumber
                ? 'border-status-error'
                : 'border-dark-bg-tertiary focus:border-accent-purple'
            }`}
          />
          {cardType && (
            <div className="absolute right-3 top-3 text-2xl">
              {getCardIcon()}
            </div>
          )}
        </div>
        {errors.cardNumber && (
          <p className="text-status-error text-sm mt-1">{errors.cardNumber}</p>
        )}
        {cardType && (
          <p className="text-text-secondary text-sm mt-1">{cardType} Card</p>
        )}
      </div>

      {/* Card Holder Name */}
      <div>
        <label className="block text-text-primary font-medium mb-2">
          Card Holder Name
        </label>
        <input
          type="text"
          name="cardHolder"
          value={cardData.cardHolder}
          onChange={handleChange}
          placeholder="Name as on card"
          className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none transition-colors uppercase ${
            errors.cardHolder
              ? 'border-status-error'
              : 'border-dark-bg-tertiary focus:border-accent-purple'
          }`}
        />
        {errors.cardHolder && (
          <p className="text-status-error text-sm mt-1">{errors.cardHolder}</p>
        )}
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-text-primary font-medium mb-2">
            Month
          </label>
          <input
            type="text"
            name="expiryMonth"
            value={cardData.expiryMonth}
            onChange={handleChange}
            placeholder="MM"
            maxLength="2"
            className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none transition-colors ${
              errors.expiryMonth
                ? 'border-status-error'
                : 'border-dark-bg-tertiary focus:border-accent-purple'
            }`}
          />
          {errors.expiryMonth && (
            <p className="text-status-error text-xs mt-1">{errors.expiryMonth}</p>
          )}
        </div>

        <div>
          <label className="block text-text-primary font-medium mb-2">
            Year
          </label>
          <input
            type="text"
            name="expiryYear"
            value={cardData.expiryYear}
            onChange={handleChange}
            placeholder="YY"
            maxLength="2"
            className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none transition-colors ${
              errors.expiryYear
                ? 'border-status-error'
                : 'border-dark-bg-tertiary focus:border-accent-purple'
            }`}
          />
          {errors.expiryYear && (
            <p className="text-status-error text-xs mt-1">{errors.expiryYear}</p>
          )}
        </div>

        <div>
          <label className="block text-text-primary font-medium mb-2">
            CVV
          </label>
          <input
            type="password"
            name="cvv"
            value={cardData.cvv}
            onChange={handleChange}
            placeholder="123"
            maxLength="4"
            className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none transition-colors ${
              errors.cvv
                ? 'border-status-error'
                : 'border-dark-bg-tertiary focus:border-accent-purple'
            }`}
          />
          {errors.cvv && (
            <p className="text-status-error text-xs mt-1">{errors.cvv}</p>
          )}
        </div>
      </div>

      {/* Save Card */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="saveCard"
          checked={saveCard}
          onChange={(e) => setSaveCard(e.target.checked)}
          className="w-4 h-4 rounded bg-dark-bg border-dark-bg-tertiary cursor-pointer"
        />
        <label htmlFor="saveCard" className="ml-2 text-text-secondary text-sm cursor-pointer">
          Save this card for future donations
        </label>
      </div>

      {/* Security Info */}
      <div className="bg-dark-bg-tertiary rounded-lg p-4 flex items-start gap-3">
        <Lock className="text-status-success flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="text-text-primary font-semibold text-sm mb-1">Secure Payment</p>
          <p className="text-text-secondary text-xs">
            Your card information is encrypted and secure. We never store your full card details.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        loading={loading}
        disabled={loading}
      >
        <CreditCard size={20} />
        Pay ₹{parseFloat(amount).toLocaleString('en-IN')}
      </Button>

      {/* Accepted Cards */}
      <div className="text-center">
        <p className="text-text-tertiary text-xs mb-2">We accept</p>
        <div className="flex justify-center gap-3">
          <span className="text-2xl">💳</span>
          <span className="text-text-secondary text-sm">Visa</span>
          <span className="text-text-secondary text-sm">•</span>
          <span className="text-text-secondary text-sm">Mastercard</span>
          <span className="text-text-secondary text-sm">•</span>
          <span className="text-text-secondary text-sm">RuPay</span>
        </div>
      </div>
    </form>
  );
};

export default CardPayment;
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  type = 'text',
  label,
  placeholder,
  error,
  helpText,
  value,
  onChange,
  disabled = false,
  required = false,
  icon: Icon,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-text-primary font-medium mb-2"> {/* UPDATED */}
          {label}
          {required && <span className="text-status-error ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-3 text-text-tertiary pointer-events-none" size={20} /> // UPDATED
        )}

        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-3 ${Icon ? 'pl-10' : ''} bg-light-bg-secondary border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${ // UPDATED
            error
              ? 'border-status-error focus:border-status-error'
              : 'border-light-bg-tertiary focus:border-accent-green' // UPDATED
          }`}
          {...props}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-text-tertiary hover:text-text-primary transition-colors" // UPDATED
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {error && <p className="text-status-error text-sm mt-1">{error}</p>}
      {helpText && !error && (
        <p className="text-text-tertiary text-sm mt-1">{helpText}</p> // UPDATED
      )}
    </div>
  );
};

export default Input;
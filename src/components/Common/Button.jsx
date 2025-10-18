const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-medium rounded-md transition-all duration-200 inline-flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-accent-purple hover:bg-accent-purple-hover text-white disabled:bg-text-tertiary',
    secondary: 'bg-transparent border border-accent-purple text-accent-purple hover:bg-dark-bg-tertiary disabled:border-text-tertiary disabled:text-text-tertiary',
    tertiary: 'bg-dark-bg-tertiary hover:bg-dark-bg-secondary text-text-primary disabled:bg-dark-bg-secondary disabled:text-text-tertiary',
    danger: 'bg-status-error hover:bg-red-700 text-white disabled:bg-text-tertiary',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="inline-block animate-spin">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;
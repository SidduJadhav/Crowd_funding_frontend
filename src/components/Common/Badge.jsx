const Badge = ({ text, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-accent-purple text-white',
    category: 'bg-dark-bg-tertiary text-accent-purple border border-accent-purple',
    status: 'bg-status-info text-white',
    success: 'bg-status-success text-white',
    error: 'bg-status-error text-white',
    warning: 'bg-status-warning text-dark-bg',
    verified: 'bg-status-success text-white',
  };

  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${variants[variant]}`}>
      {text}
    </span>
  );
};

export default Badge;
const ProgressBar = ({ current, goal, percentage, animated = true, size = 'md' }) => {
  const displayPercentage = percentage || (goal ? (current / goal) * 100 : 0);
  const normalizedPercentage = Math.min(displayPercentage, 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4',
  };

  return (
    <div className={`w-full bg-dark-bg-tertiary rounded-full overflow-hidden ${sizes[size]}`}>
      <div
        className={`bg-gradient-to-r from-accent-purple to-purple-400 ${sizes[size]} ${
          animated ? 'transition-all duration-500' : ''
        }`}
        style={{ width: `${normalizedPercentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
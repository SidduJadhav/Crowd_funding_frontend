/**
 * Skeleton Loader Component for loading states
 */

export const SkeletonCard = () => {
  return (
    <div className="bg-dark-bg-secondary border border-dark-bg-tertiary rounded-lg overflow-hidden animate-pulse">
      <div className="bg-dark-bg-tertiary h-48" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-dark-bg-tertiary rounded w-3/4" />
        <div className="h-4 bg-dark-bg-tertiary rounded w-1/2" />
        <div className="h-4 bg-dark-bg-tertiary rounded w-full" />
        <div className="h-4 bg-dark-bg-tertiary rounded w-full" />
        <div className="h-2 bg-dark-bg-tertiary rounded w-full mt-4" />
        <div className="flex justify-between">
          <div className="h-4 bg-dark-bg-tertiary rounded w-24" />
          <div className="h-4 bg-dark-bg-tertiary rounded w-16" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonText = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2 animate-pulse ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className="h-4 bg-dark-bg-tertiary rounded"
          style={{ width: i === lines - 1 ? '70%' : '100%' }}
        />
      ))}
    </div>
  );
};

export const SkeletonCircle = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`${sizes[size]} bg-dark-bg-tertiary rounded-full animate-pulse`} />
  );
};

export const SkeletonImage = ({ className = '' }) => {
  return (
    <div className={`bg-dark-bg-tertiary animate-pulse ${className}`} />
  );
};

export const SkeletonButton = ({ className = '' }) => {
  return (
    <div className={`h-10 bg-dark-bg-tertiary rounded-lg animate-pulse ${className}`} />
  );
};

const SkeletonLoader = {
  Card: SkeletonCard,
  Text: SkeletonText,
  Circle: SkeletonCircle,
  Image: SkeletonImage,
  Button: SkeletonButton,
};

export default SkeletonLoader;
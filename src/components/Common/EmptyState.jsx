import { Inbox, Search, AlertCircle } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon,
  title,
  message,
  actionLabel,
  onAction,
  variant = 'default',
}) => {
  const variants = {
    default: { icon: Inbox, title: 'Nothing here yet', message: 'Check back later' },
    search: { icon: Search, title: 'No results found', message: 'Try adjusting your search or filters' },
    error: { icon: AlertCircle, title: 'Something went wrong', message: 'Please try again later' },
  };

  const config = variants[variant] || variants.default;
  const DisplayIcon = Icon || config.icon;
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-24 h-24 rounded-full bg-dark-bg-tertiary flex items-center justify-center mb-6">
        <DisplayIcon size={48} className="text-text-tertiary" />
      </div>
      
      <h3 className="text-2xl font-bold text-text-primary mb-2">
        {displayTitle}
      </h3>
      
      <p className="text-text-secondary mb-8 max-w-md">
        {displayMessage}
      </p>
      
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
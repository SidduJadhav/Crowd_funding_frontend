import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

const Alert = ({ type = 'info', title, message, dismissible = true, onDismiss }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  const styles = {
    success: {
      bg: 'bg-status-success bg-opacity-10',
      border: 'border-status-success',
      icon: 'text-status-success',
      text: 'text-status-success',
      Icon: CheckCircle,
    },
    error: {
      bg: 'bg-status-error bg-opacity-10',
      border: 'border-status-error',
      icon: 'text-status-error',
      text: 'text-status-error',
      Icon: AlertCircle,
    },
    warning: {
      bg: 'bg-status-warning bg-opacity-10',
      border: 'border-status-warning',
      icon: 'text-status-warning',
      text: 'text-status-warning',
      Icon: AlertTriangle,
    },
    info: {
      bg: 'bg-status-info bg-opacity-10',
      border: 'border-status-info',
      icon: 'text-status-info',
      text: 'text-status-info',
      Icon: Info,
    },
  };

  const style = styles[type] || styles.info;
  const { Icon, bg, border, icon, text } = style;

  return (
    <div className={`${bg} border ${border} rounded-lg p-4 flex items-start gap-3`}>
      <Icon className={`${icon} flex-shrink-0 mt-0.5`} size={20} />
      <div className="flex-grow">
        {title && <h4 className={`${text} font-semibold mb-1`}>{title}</h4>}
        {message && (
          <p className={`text-text-secondary text-sm`}>{message}</p>
        )}
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className={`${text} hover:opacity-70 flex-shrink-0 transition-opacity`}
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default Alert;
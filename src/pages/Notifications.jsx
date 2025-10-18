import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus, TrendingUp, DollarSign, Bell, Check } from 'lucide-react';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import EmptyState from '../components/Common/EmptyState';
import { AuthContext } from '../context/AuthContext';
import { notificationService } from '../services/index';
import { formatDate } from '../utils/formatters';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getUserNotifications(user.id, { size: 50 });
      let data = response.content || getMockNotifications();
      
      if (filter === 'unread') {
        data = data.filter(n => !n.isRead);
      }
      
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications(getMockNotifications());
    } finally {
      setLoading(false);
    }
  };

  const getMockNotifications = () => [
    {
      id: 1,
      type: 'donation',
      message: 'donated ₹5,000 to your campaign',
      actorUsername: 'john_doe',
      actorProfilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      campaignId: 1,
      isRead: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: 2,
      type: 'follow',
      message: 'started following you',
      actorUsername: 'jane_smith',
      actorProfilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 3,
      type: 'like',
      message: 'liked your campaign',
      actorUsername: 'mike_wilson',
      actorProfilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      campaignId: 2,
      isRead: true,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: 4,
      type: 'comment',
      message: 'commented on your campaign',
      actorUsername: 'sarah_jones',
      actorProfilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      campaignId: 1,
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: 5,
      type: 'milestone',
      message: 'Your campaign reached 50% of its goal!',
      campaignId: 1,
      isRead: false,
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'donation':
        return { icon: DollarSign, color: 'text-status-success' };
      case 'follow':
        return { icon: UserPlus, color: 'text-accent-purple' };
      case 'like':
        return { icon: Heart, color: 'text-status-error' };
      case 'comment':
        return { icon: MessageCircle, color: 'text-status-info' };
      case 'milestone':
        return { icon: TrendingUp, color: 'text-status-warning' };
      default:
        return { icon: Bell, color: 'text-text-secondary' };
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.isRead) {
      await notificationService.markAsRead(notification.id, user.id);
      setNotifications(notifications.map(n => 
        n.id === notification.id ? { ...n, isRead: true } : n
      ));
    }

    // Navigate based on type
    if (notification.campaignId) {
      navigate(`/campaign/${notification.campaignId}`);
    } else if (notification.actorId) {
      navigate(`/profile/${notification.actorId}`);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead(user.id);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <LoadingSpinner text="Loading notifications..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Notifications
            </h1>
            <p className="text-text-secondary">
              Stay updated with your campaigns and community
            </p>
          </div>
          {notifications.some(n => !n.isRead) && (
            <Button variant="secondary" size="sm" onClick={handleMarkAllRead}>
              <Check size={18} />
              Mark all read
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6 border-b border-dark-bg-tertiary">
          <button
            onClick={() => setFilter('all')}
            className={`pb-3 px-4 font-semibold transition-colors ${
              filter === 'all'
                ? 'text-accent-purple border-b-2 border-accent-purple'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`pb-3 px-4 font-semibold transition-colors ${
              filter === 'unread'
                ? 'text-accent-purple border-b-2 border-accent-purple'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Unread
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-accent-purple text-white text-xs rounded-full">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </button>
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const { icon: Icon, color } = getNotificationIcon(notification.type);
              
              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full p-4 rounded-lg transition-colors text-left ${
                    notification.isRead
                      ? 'bg-dark-bg-secondary hover:bg-dark-bg-tertiary'
                      : 'bg-dark-bg-tertiary hover:bg-dark-bg-secondary border-l-4 border-accent-purple'
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Icon/Avatar */}
                    <div className="flex-shrink-0">
                      {notification.actorProfilePicture ? (
                        <img
                          src={notification.actorProfilePicture}
                          alt={notification.actorUsername}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className={`w-12 h-12 rounded-full bg-dark-bg-tertiary flex items-center justify-center ${color}`}>
                          <Icon size={24} />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-grow min-w-0">
                      <p className="text-text-primary">
                        {notification.actorUsername && (
                          <span className="font-semibold">
                            {notification.actorUsername}{' '}
                          </span>
                        )}
                        <span className={notification.isRead ? 'text-text-secondary' : ''}>
                          {notification.message}
                        </span>
                      </p>
                      <p className="text-text-tertiary text-sm mt-1">
                        {getTimeAgo(notification.createdAt)}
                      </p>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.isRead && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-accent-purple rounded-full" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Bell}
            title="No notifications"
            message={
              filter === 'unread'
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications yet."
            }
          />
        )}
      </div>
    </div>
  );
};

export default Notifications;
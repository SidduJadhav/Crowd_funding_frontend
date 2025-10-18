import { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Compass, Image, Video, Bell, User, PlusCircle } from 'lucide-react';
import Button from '../Common/Button';
import { AuthContext } from '../../context/AuthContext';
import { notificationService } from '../../services/index';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = user ? [
    { label: 'Home', href: '/home', icon: Home },
    { label: 'Discover', href: '/discover', icon: Compass },
    { label: 'Posts', href: '/posts', icon: Image },
    { label: 'Reels', href: '/reels', icon: Video },
  ] : [
    { label: 'Discover', href: '/discover', icon: Compass },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'About', href: '/#about' },
  ];

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const isActive = (href) => location.pathname === href;

  const handleLogoClick = () => {
    if (user) {
      navigate('/home');
    } else {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-dark-bg border-b border-dark-bg-tertiary">
      <div className="max-w-container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={handleLogoClick}
          className="text-2xl font-bold text-accent-purple hover:text-accent-purple-hover transition-colors"
        >
          Crowdfund
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-2 transition-colors ${
                  isActive(link.href)
                    ? 'text-accent-purple'
                    : 'text-text-primary hover:text-accent-purple'
                }`}
              >
                {Icon && <Icon size={20} />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {/* Create Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowCreateMenu(!showCreateMenu)}
                  className="p-2 hover:bg-dark-bg-tertiary rounded-full transition-colors"
                >
                  <PlusCircle size={22} className="text-text-primary" />
                </button>
                {showCreateMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-bg-secondary border border-dark-bg-tertiary rounded-lg shadow-lg py-2 z-50">
                    <button
                      onClick={() => {
                        navigate('/create-campaign');
                        setShowCreateMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-text-primary hover:bg-dark-bg-tertiary transition-colors"
                    >
                      Create Campaign
                    </button>
                    <button
                      onClick={() => {
                        navigate('/create-post');
                        setShowCreateMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-text-primary hover:bg-dark-bg-tertiary transition-colors"
                    >
                      Create Post
                    </button>
                    <button
                      onClick={() => {
                        navigate('/create-reel');
                        setShowCreateMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-text-primary hover:bg-dark-bg-tertiary transition-colors"
                    >
                      Create Reel
                    </button>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <button
                onClick={() => navigate('/notifications')}
                className="relative p-2 hover:bg-dark-bg-tertiary rounded-full transition-colors"
              >
                <Bell size={22} className="text-text-primary" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-status-error text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Profile */}
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 hover:bg-dark-bg-tertiary px-3 py-2 rounded-lg transition-colors"
              >
                <User size={20} className="text-text-primary" />
                <span className="text-text-primary">{user.username}</span>
              </button>

              {/* Logout */}
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-text-primary hover:text-accent-purple transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-bg-secondary border-t border-dark-bg-tertiary p-4">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-3 transition-colors ${
                    isActive(link.href)
                      ? 'text-accent-purple'
                      : 'text-text-primary hover:text-accent-purple'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {Icon && <Icon size={20} />}
                  {link.label}
                </Link>
              );
            })}

            {user && (
              <>
                <div className="border-t border-dark-bg-tertiary pt-4 mt-4">
                  <p className="text-text-secondary text-sm mb-2 px-2">Create</p>
                  <Link
                    to="/create-campaign"
                    className="flex items-center gap-3 text-text-primary hover:text-accent-purple transition-colors mb-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <PlusCircle size={20} />
                    Create Campaign
                  </Link>
                  <Link
                    to="/create-post"
                    className="flex items-center gap-3 text-text-primary hover:text-accent-purple transition-colors mb-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Image size={20} />
                    Create Post
                  </Link>
                  <Link
                    to="/create-reel"
                    className="flex items-center gap-3 text-text-primary hover:text-accent-purple transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Video size={20} />
                    Create Reel
                  </Link>
                </div>

                <div className="border-t border-dark-bg-tertiary pt-4 mt-4">
                  <Link
                    to="/notifications"
                    className="flex items-center gap-3 text-text-primary hover:text-accent-purple transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Bell size={20} />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-status-error text-white text-xs rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/profile"
                    className="flex items-center gap-3 text-text-primary hover:text-accent-purple transition-colors mt-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={20} />
                    Profile
                  </Link>
                </div>
              </>
            )}

            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-dark-bg-tertiary">
              {user ? (
                <Button
                  variant="tertiary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    logout();
                    navigate('/');
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Link to="/login" className="w-full">
                    <Button variant="secondary" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" className="w-full">
                    <Button variant="primary" size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
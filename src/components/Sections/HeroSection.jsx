import { Link } from 'react-router-dom';
import { TrendingUp, Users, Target, ArrowRight } from 'lucide-react';
import Button from '../Common/Button';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg-secondary to-dark-bg flex items-center overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-purple opacity-10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 opacity-10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500 opacity-5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-20">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-purple bg-opacity-10 border border-accent-purple rounded-full w-fit mb-2">
            <TrendingUp size={16} className="text-accent-purple" />
            <span className="text-accent-purple text-sm font-medium">Join 50,000+ Creators & Supporters</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-text-primary leading-tight">
            Fund Dreams,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-blue-500">Create Impact</span>
          </h1>

          <p className="text-xl text-text-secondary leading-relaxed max-w-lg">
            The social crowdfunding platform where innovation meets community.
            Share your vision, build your audience, and bring your projects to life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/discover" className="group">
              <Button variant="primary" size="lg" className="w-full sm:w-auto group-hover:shadow-lg group-hover:shadow-accent-purple/50 transition-all">
                Explore Campaigns
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/create-campaign">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Start Your Campaign
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 pt-8 border-t border-dark-bg-tertiary">
            <div className="group cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <Target size={20} className="text-accent-purple" />
                <p className="text-3xl font-bold text-text-primary group-hover:text-accent-purple transition-colors">2,500+</p>
              </div>
              <p className="text-text-secondary text-sm">Active Campaigns</p>
            </div>
            <div className="group cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <Users size={20} className="text-blue-500" />
                <p className="text-3xl font-bold text-text-primary group-hover:text-blue-500 transition-colors">75K+</p>
              </div>
              <p className="text-text-secondary text-sm">Supporters</p>
            </div>
            <div className="group cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={20} className="text-green-500" />
                <p className="text-3xl font-bold text-text-primary group-hover:text-green-500 transition-colors">$120M+</p>
              </div>
              <p className="text-text-secondary text-sm">Total Raised</p>
            </div>
          </div>
        </div>

        {/* Right Column - Feature Grid */}
        <div className="hidden md:flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple to-blue-600 opacity-20 rounded-2xl blur-2xl" />
            <div className="relative grid grid-cols-2 gap-4">
              <div className="bg-dark-bg-secondary border border-dark-bg-tertiary rounded-xl p-6 hover:border-accent-purple transition-colors">
                <div className="text-4xl mb-2">📱</div>
                <p className="text-text-primary font-semibold text-sm">Social Feed</p>
                <p className="text-text-tertiary text-xs mt-1">Share updates</p>
              </div>
              <div className="bg-dark-bg-secondary border border-dark-bg-tertiary rounded-xl p-6 hover:border-blue-500 transition-colors">
                <div className="text-4xl mb-2">💰</div>
                <p className="text-text-primary font-semibold text-sm">Secure Funding</p>
                <p className="text-text-tertiary text-xs mt-1">Safe donations</p>
              </div>
              <div className="bg-dark-bg-secondary border border-dark-bg-tertiary rounded-xl p-6 hover:border-green-500 transition-colors">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-text-primary font-semibold text-sm">Track Progress</p>
                <p className="text-text-tertiary text-xs mt-1">Real-time stats</p>
              </div>
              <div className="bg-dark-bg-secondary border border-dark-bg-tertiary rounded-xl p-6 hover:border-purple-500 transition-colors">
                <div className="text-4xl mb-2">🌍</div>
                <p className="text-text-primary font-semibold text-sm">Global Reach</p>
                <p className="text-text-tertiary text-xs mt-1">Worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
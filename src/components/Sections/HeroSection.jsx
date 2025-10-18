import { Link } from 'react-router-dom';
import Button from '../common/Button';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg-secondary to-dark-bg flex items-center overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-purple opacity-10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 opacity-10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-20">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary leading-tight">
            Bring Ideas to <span className="text-accent-purple">Life</span>
          </h1>

          <p className="text-xl text-text-secondary leading-relaxed max-w-lg">
            Connect with creators, back projects you believe in, and make a real impact. 
            Discover innovative ideas and help bring them to reality.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/discover">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Discover Projects
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-8 border-t border-dark-bg-tertiary">
            <div>
              <p className="text-3xl font-bold text-accent-purple">1,000+</p>
              <p className="text-text-secondary text-sm">Active Projects</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent-purple">50K+</p>
              <p className="text-text-secondary text-sm">Community Members</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent-purple">$50M+</p>
              <p className="text-text-secondary text-sm">Funded</p>
            </div>
          </div>
        </div>

        {/* Right Column - Image Placeholder */}
        <div className="hidden md:flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple to-purple-600 opacity-20 rounded-2xl blur-2xl" />
            <div className="relative bg-dark-bg-secondary border border-dark-bg-tertiary rounded-2xl p-8 aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🚀</div>
                <p className="text-text-primary font-semibold">Crowdfunding Platform</p>
                <p className="text-text-secondary text-sm mt-2">Supporting innovation worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
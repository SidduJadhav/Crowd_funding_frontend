import { Link } from 'react-router-dom';
import { TrendingUp, Users, Target, ArrowRight } from 'lucide-react';
import Button from '../Common/Button';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

// Helper component for animated blobs
const AnimatedBlob = ({ className }) => (
  <div
    className={`absolute rounded-full blur-3xl opacity-10 animate-pulse ${className}`}
    style={{ animationDuration: '8s' }}
  />
);

const HeroSection = () => {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  // Use a style object for custom animation delays
  const getDelay = (delay) => ({
    animationDelay: `${delay}ms`,
    opacity: 0,
    animationFillMode: 'forwards',
  });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-light-bg" // UPDATED: Removed image, using new bg
    >
      {/* Decorative Background Elements (These will now float over the image) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AnimatedBlob className="-top-40 -right-40 w-80 h-80 bg-accent-green" /> {/* UPDATED */}
        <AnimatedBlob className="-bottom-40 -left-40 w-80 h-80 bg-blue-500" />
        <AnimatedBlob className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-light-green" /> {/* UPDATED */}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-20">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-accent-green bg-opacity-10 border border-accent-green rounded-full w-fit mb-2 transition-all duration-700 ${isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-5'}`} // UPDATED
            style={getDelay(0)}
          >
            <TrendingUp size={16} className="text-accent-green" /> {/* UPDATED */}
            <span className="text-accent-green text-sm font-medium">Join 50,000+ Creators & Supporters</span> {/* UPDATED */}
          </div>

          <h1
            className={`text-5xl md:text-7xl font-bold text-text-primary leading-tight transition-all duration-700 ${isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-5'}`} // UPDATED (class maps to new dark color)
            style={getDelay(100)}
          >
            Fund Dreams,
            <br />
            {/* UPDATED: New gradient */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-green to-accent-light-green">Create Impact</span>
          </h1>

          <p
            className={`text-xl text-text-secondary leading-relaxed max-w-lg transition-all duration-700 ${isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-5'}`} // UPDATED (class maps to new medium color)
            style={getDelay(200)}
          >
            The social crowdfunding platform where innovation meets community.
            Share your vision, build your audience, and bring your projects to life.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-4 pt-4 transition-all duration-700 ${isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-5'}`}
            style={getDelay(300)}
          >
            <Link to="/discover" className="group">
              <Button variant="primary" size="lg" className="w-full sm:w-auto group-hover:shadow-lg group-hover:shadow-accent-green/50 transition-all"> {/* UPDATED */}
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
          <div
            className={`flex flex-wrap gap-8 pt-8 border-t border-light-bg-tertiary transition-all duration-700 ${isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-5'}`} // UPDATED
            style={getDelay(400)}
          >
            <div className="group cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <Target size={20} className="text-accent-green" /> {/* UPDATED */}
                <p className="text-3xl font-bold text-text-primary group-hover:text-accent-green transition-colors">2,500+</p> {/* UPDATED */}
              </div>
              <p className="text-text-secondary text-sm">Active Campaigns</p> {/* UPDATED */}
            </div>
            <div className="group cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <Users size={20} className="text-blue-500" />
                <p className="text-3xl font-bold text-text-primary group-hover:text-blue-500 transition-colors">75K+</p> {/* UPDATED */}
              </div>
              <p className="text-text-secondary text-sm">Supporters</p> {/* UPDATED */}
            </div>
            <div className="group cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={20} className="text-green-500" />
                <p className="text-3xl font-bold text-text-primary group-hover:text-green-500 transition-colors">$120M+</p> {/* UPDATED */}
              </div>
              <p className="text-text-secondary text-sm">Total Raised</p> {/* UPDATED */}
            </div>
          </div>
        </div>

        {/* Right Column - Rocket Video */}
        <div
          className={`transition-all duration-1000 ${isVisible ? 'animate-zoomIn opacity-100' : 'opacity-0 scale-95'}`}
          style={getDelay(500)}
        >
          {/* UPDATED: Glassmorphism for light mode */}
          <div className="relative w-full aspect-video max-h-[450px] rounded-lg overflow-hidden
                          bg-white/30 backdrop-blur-md border border-black/10">
            <video
              src="/Rocket Gif.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
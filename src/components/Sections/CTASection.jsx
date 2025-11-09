import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../Common/Button';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'; // Import the hook

const CTASection = () => {
  const [sectionRef, isVisible] = useIntersectionObserver();

  return (
    <section className="py-20 bg-accent-light-green overflow-hidden"> {/* UPDATED */}
      <div className="max-w-container mx-auto px-4">
        <div
          ref={sectionRef}
          className={`text-center transition-all duration-700 ${isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-5'}`}
        >
          {/* Replaced Icon with your Video */}
          <div className="inline-flex items-center justify-center w-40 h-40 bg-white/20 rounded-full mb-6 overflow-hidden">
            <video
              src="/Rocket Gif.mp4" // Make sure 'Rocket Gif.mp4' is in your /public folder
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6"> {/* UPDATED */}
            Ready to Make an Impact?
          </h2>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8"> {/* UPDATED */}
            Whether you're a creator with a vision or a supporter looking to make a difference,
            your journey starts here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create-campaign" className="group">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-accent-green hover:bg-gray-100 border-0 group-hover:shadow-xl transition-all" // UPDATED
              >
                Start Your Campaign
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/discover">
              <Button
                variant="tertiary"
                size="lg"
                className="border-2 border-text-primary text-text-primary hover:bg-white hover:text-accent-green transition-all" // UPDATED
              >
                Explore Campaigns
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div>
              <p className="text-3xl font-bold text-text-primary mb-1">95%</p> {/* UPDATED */}
              <p className="text-text-secondary text-sm">Success Rate</p> {/* UPDATED */}
            </div>
            <div>
              <p className="text-3xl font-bold text-text-primary mb-1">24/7</p> {/* UPDATED */}
              <p className="text-text-secondary text-sm">Support</p> {/* UPDATED */}
            </div>
            <div>
              <p className="text-3xl font-bold text-text-primary mb-1">0%</p> {/* UPDATED */}
              <p className="text-text-secondary text-sm">Platform Fee</p> {/* UPDATED */}
            </div>
            <div>
              <p className="text-3xl font-bold text-text-primary mb-1">100%</p> {/* UPDATED */}
              <p className="text-text-secondary text-sm">Secure</p> {/* UPDATED */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
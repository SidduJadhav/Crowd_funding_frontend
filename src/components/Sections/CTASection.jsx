import { Link } from 'react-router-dom';
import { Rocket, ArrowRight } from 'lucide-react';
import Button from '../Common/Button';

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-accent-purple to-blue-600">
      <div className="max-w-container mx-auto px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6">
            <Rocket size={40} className="text-white" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make an Impact?
          </h2>

          <p className="text-xl text-white text-opacity-90 max-w-2xl mx-auto mb-8">
            Whether you're a creator with a vision or a supporter looking to make a difference,
            your journey starts here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create-campaign" className="group">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-accent-purple hover:bg-gray-100 border-0 group-hover:shadow-xl transition-all"
              >
                Start Your Campaign
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/discover">
              <Button
                variant="tertiary"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-accent-purple transition-all"
              >
                Explore Campaigns
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div>
              <p className="text-3xl font-bold text-white mb-1">95%</p>
              <p className="text-white text-opacity-80 text-sm">Success Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">24/7</p>
              <p className="text-white text-opacity-80 text-sm">Support</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">0%</p>
              <p className="text-white text-opacity-80 text-sm">Platform Fee</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">100%</p>
              <p className="text-white text-opacity-80 text-sm">Secure</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

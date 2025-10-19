import HeroSection from '../components/Sections/HeroSection';
import FeaturedCampaigns from '../components/Sections/FeaturedCampaigns';
import CategoryShowcase from '../components/Sections/CategoryShowcase';
import HowItWorks from '../components/Sections/HowItWorks';
import Testimonials from '../components/Sections/Testimonials';
import CTASection from '../components/Sections/CTASection';

const Landing = () => {
  return (
    <div className="min-h-screen bg-dark-bg">
      <HeroSection />
      <CategoryShowcase />
      <FeaturedCampaigns />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </div>
  );
};

export default Landing;
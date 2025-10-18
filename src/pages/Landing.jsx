import HeroSection from '../components/sections/HeroSection';
import FeaturedCampaigns from '../components/sections/FeaturedCampaigns';
import HowItWorks from '../components/sections/HowItWorks';

const Landing = () => {
  return (
    <div className="min-h-screen bg-dark-bg">
      <HeroSection />
      <FeaturedCampaigns />
      <HowItWorks />
    </div>
  );
};

export default Landing;
import HeroSection from '../components/Sections/HeroSection';
import FeaturedCampaigns from '../components/Sections/FeaturedCampaigns';
import HowItWorks from '../components/Sections/HowItWorks';

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
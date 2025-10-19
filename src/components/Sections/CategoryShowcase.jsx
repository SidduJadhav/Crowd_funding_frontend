import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Heart,
  Leaf,
  Lightbulb,
  Users,
  Palette,
  Zap,
  Globe
} from 'lucide-react';

const CategoryShowcase = () => {
  const navigate = useNavigate();

  const categories = [
    {
      icon: GraduationCap,
      name: 'Education',
      count: '450+',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500',
      description: 'Learning & Schools',
    },
    {
      icon: Heart,
      name: 'Medical',
      count: '320+',
      color: 'text-red-500',
      bgColor: 'bg-red-500',
      description: 'Health & Wellness',
    },
    {
      icon: Leaf,
      name: 'Environment',
      count: '280+',
      color: 'text-green-500',
      bgColor: 'bg-green-500',
      description: 'Sustainability',
    },
    {
      icon: Lightbulb,
      name: 'Technology',
      count: '510+',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500',
      description: 'Innovation & Tech',
    },
    {
      icon: Users,
      name: 'Community',
      count: '390+',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500',
      description: 'Local Projects',
    },
    {
      icon: Palette,
      name: 'Arts',
      count: '240+',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500',
      description: 'Creative Works',
    },
    {
      icon: Zap,
      name: 'Sports',
      count: '180+',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500',
      description: 'Athletics & Fitness',
    },
    {
      icon: Globe,
      name: 'Disaster Relief',
      count: '150+',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500',
      description: 'Emergency Aid',
    },
  ];

  return (
    <section className="py-20 bg-dark-bg-secondary">
      <div className="max-w-container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Explore by Category
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Find campaigns that match your passions and interests
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(`/discover?category=${category.name.toUpperCase()}`)}
                className="group bg-dark-bg border border-dark-bg-tertiary rounded-xl p-6 hover:border-accent-purple transition-all hover:shadow-lg hover:shadow-accent-purple/20 transform hover:-translate-y-1"
              >
                <div className={`w-14 h-14 ${category.bgColor} bg-opacity-20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                  <Icon size={28} className={category.color} />
                </div>
                <h3 className="text-text-primary font-semibold mb-1">{category.name}</h3>
                <p className="text-text-tertiary text-sm mb-2">{category.description}</p>
                <p className="text-accent-purple font-medium text-sm">{category.count} campaigns</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;

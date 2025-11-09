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
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'; // Import the hook

const CategoryShowcase = () => {
  const navigate = useNavigate();
  // Create refs for the elements we want to animate
  const [headerRef, isHeaderVisible] = useIntersectionObserver();
  const [gridRef, isGridVisible] = useIntersectionObserver({ threshold: 0.05 });

  const categories = [
    // ... (category data remains the same)
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
    <section className="py-20 bg-light-bg-secondary overflow-hidden"> {/* UPDATED */}
      <div className="max-w-container mx-auto px-4">
        <div
          ref={headerRef} // Attach the ref
          className={`text-center mb-16 transition-all duration-700 ${isHeaderVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-5'}`} // Apply animation conditionally
        >
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4"> {/* UPDATED */}
            Explore by Category
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto"> {/* UPDATED */}
            Find campaigns that match your passions and interests
          </p>
        </div>

        <div
          ref={gridRef} // Attach the ref to the grid container
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {categories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(`/discover?category=${category.name.toUpperCase()}`)}
                // Apply animation and stagger the delay
                className={`group bg-light-bg border border-light-bg-tertiary rounded-xl p-6 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-accent-green/20 hover:border-accent-green ${isGridVisible ? 'animate-zoomIn' : 'opacity-0 scale-95'}`} // UPDATED
                style={{ animationDelay: `${isGridVisible ? idx * 75 : 0}ms`, transitionDelay: `${isGridVisible ? idx * 75 : 0}ms` }}
              >
                <div className={`w-14 h-14 ${category.bgColor} bg-opacity-20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={28} className={category.color} />
                </div>
                <h3 className="text-text-primary font-semibold mb-1">{category.name}</h3> {/* UPDATED */}
                <p className="text-text-tertiary text-sm mb-2">{category.description}</p> {/* UPDATED */}
                <p className="text-accent-green font-medium text-sm">{category.count} campaigns</p> {/* UPDATED */}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
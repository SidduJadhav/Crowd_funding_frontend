import { Star } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'; // Import the hook

const Testimonials = () => {
  const [headerRef, isHeaderVisible] = useIntersectionObserver();
  const [gridRef, isGridVisible] = useIntersectionObserver({ threshold: 0.1 });

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Campaign Creator',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      content: 'This platform helped me raise $50,000 for my educational initiative. The community support was incredible!',
      rating: 5,
      campaign: 'Education for All',
    },
    {
      name: 'Michael Chen',
      role: 'Backer & Supporter',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
      content: "I've backed over 20 projects here. Love seeing the real-time updates and knowing my contributions make a difference.",
      rating: 5,
      campaign: 'Multiple Projects',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Campaign Creator',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
      content: 'The social features make crowdfunding feel personal. I connected with supporters and built a lasting community.',
      rating: 5,
      campaign: 'Clean Water Project',
    },
  ];

  return (
    <section className="py-20 bg-dark-bg overflow-hidden"> {/* Added overflow-hidden */}
      <div className="max-w-container mx-auto px-4">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${isHeaderVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-5'}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Loved by Creators & Supporters
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            See what our community has to say about their experience
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className={`bg-dark-bg-secondary border border-dark-bg-tertiary rounded-xl p-8 hover:border-accent-purple transition-all duration-300 transform hover:-translate-y-1 ${isGridVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-5'}`}
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={18} className="fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              <p className="text-text-primary leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-dark-bg-tertiary">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-text-primary font-semibold">{testimonial.name}</p>
                  <p className="text-text-tertiary text-sm">{testimonial.role}</p>
                  <p className="text-accent-purple text-xs mt-1">{testimonial.campaign}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
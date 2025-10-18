import { Search, Heart, Zap } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: 'Browse',
      description: 'Explore a diverse range of creative and innovative projects from creators worldwide.',
    },
    {
      icon: Heart,
      title: 'Support',
      description: 'Back projects you believe in with secure donations. No commitment needed to explore.',
    },
    {
      icon: Zap,
      title: 'See Impact',
      description: 'Watch projects come to life. Receive updates and see how your support makes a difference.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-dark-bg">
      <div className="max-w-container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            How It Works
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Supporting creators and bringing ideas to life has never been easier
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative">
                {/* Card */}
                <div className="bg-dark-bg-secondary border border-dark-bg-tertiary rounded-lg p-8 h-full hover:border-accent-purple transition-colors duration-200">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-lg bg-accent-purple text-white flex items-center justify-center mb-6">
                    <Icon size={32} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-text-primary mb-3">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {step.description}
                  </p>

                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-accent-purple text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {idx + 1}
                  </div>
                </div>

                {/* Connector Arrow (hidden on mobile) */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-1 bg-gradient-to-r from-accent-purple to-transparent" />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-text-secondary mb-6">
            Ready to start? Browse projects or create your own.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/discover"
              className="px-8 py-3 bg-accent-purple hover:bg-accent-purple-hover text-white rounded-md font-medium transition-colors"
            >
              Browse Projects
            </a>
            <a
              href="/create"
              className="px-8 py-3 border border-accent-purple text-accent-purple hover:bg-dark-bg-tertiary rounded-md font-medium transition-colors"
            >
              Start a Campaign
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
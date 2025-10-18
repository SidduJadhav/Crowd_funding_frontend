import { Twitter, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'About',
      links: [
        { label: 'Our Story', href: '#' },
        { label: 'Team', href: '#' },
        { label: 'Careers', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Creator Guide', href: '#' },
        { label: 'FAQ', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-dark-bg-secondary border-t border-dark-bg-tertiary mt-20">
      <div className="max-w-container mx-auto px-4 py-12">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-accent-purple mb-4">Crowdfund</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Bring creative projects to life through community support.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-text-secondary hover:text-accent-purple transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-text-secondary hover:text-accent-purple transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-text-secondary hover:text-accent-purple transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-text-primary font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a
                      href={link.href}
                      className="text-text-secondary hover:text-accent-purple transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-bg-tertiary pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-tertiary text-sm">
            © {currentYear} Crowdfund. All rights reserved.
          </p>
          <div className="flex gap-6 text-text-tertiary text-sm">
            <a href="#" className="hover:text-accent-purple transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-accent-purple transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-accent-purple transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
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
    <footer className="bg-light-bg-secondary border-t border-light-bg-tertiary mt-20"> {/* UPDATED */}
      <div className="max-w-container mx-auto px-4 py-12">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-accent-green mb-4">Catalyster</h3> {/* UPDATED */}
            <p className="text-text-secondary text-sm leading-relaxed"> {/* UPDATED */}
              Bring creative projects to life through community support.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-text-secondary hover:text-accent-green transition-colors"> {/* UPDATED */}
                <Twitter size={20} />
              </a>
              <a href="#" className="text-text-secondary hover:text-accent-green transition-colors"> {/* UPDATED */}
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-text-secondary hover:text-accent-green transition-colors"> {/* UPDATED */}
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-text-primary font-semibold mb-4">{section.title}</h4> {/* UPDATED */}
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a
                      href={link.href}
                      className="text-text-secondary hover:text-accent-green transition-colors text-sm" // UPDATED
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
        <div className="border-t border-light-bg-tertiary pt-8 flex flex-col md:flex-row justify-between items-center gap-4"> {/* UPDATED */}
          <p className="text-text-tertiary text-sm"> {/* UPDATED */}
            © {currentYear} Catalyster. All rights reserved.
          </p>
          <div className="flex gap-6 text-text-tertiary text-sm"> {/* UPDATED */}
            <a href="#" className="hover:text-accent-green transition-colors"> {/* UPDATED */}
              Privacy
            </a>
            <a href="#" className="hover:text-accent-green transition-colors"> {/* UPDATED */}
              Terms
            </a>
            <a href="#" className="hover:text-accent-green transition-colors"> {/* UPDATED */}
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
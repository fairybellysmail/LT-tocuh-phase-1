import { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { IMAGES } from '../content/images';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Programs & News', href: '/programs-news' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Donate now', href: '/donate', hasArrow: true },
  ];

  return (
    <header className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-black/5">
      <div className="container-page py-4 flex justify-between items-center">
        <a href="/" className="flex items-center gap-2">
          <img 
            src={IMAGES.logo} 
            alt="LiftersTouch Logo" 
            className="h-10 w-auto"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback if image is missing
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML += '<span class="text-2xl font-bold text-brand-primary">LiftersTouch</span>';
            }}
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-brand-text hover:text-brand-primary transition-colors inline-flex items-center gap-1"
            >
              {link.name}
              {link.hasArrow && <ArrowRight className="h-3.5 w-3.5 text-brand-accent inline-block" />}
            </a>
          ))}

          <a href="/contact-support" className="btn-primary !px-5 !py-2 text-sm shadow-sm">
            Contact & Support
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-brand-text"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="md:hidden bg-white border-b border-black/5 py-4 px-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-base font-medium text-brand-text hover:text-brand-primary transition-colors flex items-center gap-1"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
              {link.hasArrow && <ArrowRight className="h-4 w-4 text-brand-accent inline-block" />}
            </a>
          ))}

          <a 
            href="/contact-support" 
            className="btn-primary w-full text-center"
            onClick={() => setIsOpen(false)}
          >
            Contact & Support
          </a>
        </nav>
      )}
    </header>
  );
}

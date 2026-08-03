import { Heart, Globe, Facebook, Twitter, Instagram, Mail, Phone, MapPin, Settings } from 'lucide-react';
import { IMAGES } from '../content/images';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-footer pt-16 pb-8 text-white">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <img 
                src={IMAGES.logo} 
                alt="LiftersTouch Logo" 
                className="h-12 w-auto brightness-0 invert"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const textLogo = document.createElement('h3');
                  textLogo.className = 'text-white font-bold text-2xl';
                  textLogo.innerText = 'LiftersTouch';
                  e.currentTarget.parentElement!.appendChild(textLogo);
                }}
              />
            </div>
            <p className="text-white/70 max-w-sm leading-relaxed">
              A non-profit organization dedicated to uplifting communities through sustainable programs and direct impact. We believe in the power of collective action to create lasting change.
            </p>
            <div className="mt-8 flex gap-4">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-brand-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-brand-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-brand-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg mb-6 font-semibold">Quick Links</h4>
            <ul className="space-y-4 text-white/70">
              <li><a href="/" className="hover:text-brand-accent transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-brand-accent transition-colors">About Us</a></li>
              <li><a href="/programs-news" className="hover:text-brand-accent transition-colors">Programs & News</a></li>
              <li><a href="/gallery" className="hover:text-brand-accent transition-colors">Gallery</a></li>
              <li><a href="/donate" className="hover:text-brand-accent transition-colors font-semibold text-brand-accent flex items-center gap-1">Donate now →</a></li>
              <li><a href="/contact-support" className="hover:text-brand-accent transition-colors">Contact & Support</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white text-lg mb-6 font-semibold">Contact Us</h4>
            <ul className="space-y-4 text-white/70">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-1 text-brand-accent" />
                <span>info@lifterstouch.org</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-1 text-brand-accent" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-1 text-brand-accent" />
                <span>123 Impact Way, Suite 100<br />Community City, ST 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            &copy; {currentYear} LiftersTouch. All rights reserved.
          </p>
          <div className="flex gap-6 items-center">
            <a href="/privacy" className="text-white/50 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-white/50 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a 
              href="/settings" 
              className="p-1 text-white/50 hover:text-white transition-colors rounded hover:bg-white/10 inline-flex items-center" 
              title="Admin Settings"
            >
              <Settings className="h-4 w-4" />
            </a>
            <div className="flex gap-4 ml-4">
              <Globe className="h-5 w-5 text-white/50 hover:text-white cursor-pointer" />
              <Heart className="h-5 w-5 text-white/50 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

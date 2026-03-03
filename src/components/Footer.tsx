import { Heart, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-bg pt-16 pb-8">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white mb-6">LiftersTouch</h3>
            <p className="text-white/70 max-w-sm">
              A non-profit organization dedicated to uplifting communities through sustainable programs and direct impact.
            </p>
          </div>
          <div>
            <h4 className="text-white text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-white/70">
              <li><a href="/" className="hover:text-brand-accent transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-brand-accent transition-colors">About Us</a></li>
              <li><a href="/programs-impact" className="hover:text-brand-accent transition-colors">Programs</a></li>
              <li><a href="/contact-support" className="hover:text-brand-accent transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-lg mb-6">Contact</h4>
            <ul className="space-y-4 text-white/70">
              <li>info@lifterstouch.org</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Impact Way, Suite 100</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            &copy; 2026 LiftersTouch. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Globe className="h-5 w-5 text-white/50 hover:text-white cursor-pointer" />
            <Heart className="h-5 w-5 text-white/50 hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
}

export default function HeroSection({ 
  title, 
  description, 
  ctaText, 
  ctaLink, 
  backgroundImage = "https://picsum.photos/seed/community/1920/1080" 
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage} 
          alt="Hero Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-footer/90 via-brand-footer/70 to-transparent" />
      </div>

      <div className="container-page relative z-10 py-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-white mb-6 leading-tight">
              {title}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-white/80 text-lg md:text-xl mb-10 leading-relaxed"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-wrap gap-4"
          >
            <a href={ctaLink} className="btn-primary group">
              {ctaText}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="/about" className="btn-secondary !border-white !text-white hover:!bg-white/10">
              Learn More
            </a>
          </motion.div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-brand-accent/10 blur-3xl rounded-full -mr-20 -mb-20" />
    </section>
  );
}

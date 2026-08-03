import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import HeroSection from '../components/HeroSection';
import homepageFallback from '../content/homepage.json';

export default function HomePage() {
  const [data, setData] = useState<any>(homepageFallback);

  useEffect(() => {
    fetch('/api/content/homepage')
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((hp) => {
        if (hp) {
          let stats = homepageFallback.stats;
          if (hp.statsJson) {
            try {
              stats = JSON.parse(hp.statsJson);
            } catch (e) {}
          }
          setData({
            hero: {
              badge: hp.badge || homepageFallback.hero.badge,
              title: hp.heroTitle || homepageFallback.hero.title,
              highlight: hp.heroHighlight || homepageFallback.hero.highlight,
              description: hp.heroDescription || homepageFallback.hero.description,
              primaryCta: hp.primaryCta || homepageFallback.hero.primaryCta,
              secondaryCta: hp.secondaryCta || homepageFallback.hero.secondaryCta,
            },
            stats: stats,
            aboutPreview: {
              title: hp.aboutTitle || homepageFallback.aboutPreview.title,
              description: hp.aboutDescription || homepageFallback.aboutPreview.description,
              cta: homepageFallback.aboutPreview.cta,
            },
            programsPreview: homepageFallback.programsPreview,
          });
        }
      })
      .catch((err) => console.error('Error fetching homepage API:', err));
  }, []);

  const { hero, stats, aboutPreview, programsPreview } = data;

  return (
    <>
      <HeroSection 
        title={hero.title}
        description={hero.description}
        ctaText={hero.primaryCta}
        ctaLink="/programs-news"
      />

      {/* Stats Strip */}
      <section className="bg-brand-primary py-12 text-white">
        <div className="container-page">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat: any, index: number) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="stat-value text-white">{stat.value}</p>
                <p className="text-sm opacity-80 uppercase tracking-wider mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="section">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="order-2 md:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://picsum.photos/seed/about/800/600" 
                alt="Our Story" 
                className="rounded-brand shadow-brand"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <motion.div 
              className="order-1 md:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6">{aboutPreview.title}</h2>
              <p className="text-lg text-brand-muted mb-8">
                {aboutPreview.description}
              </p>
              <a href="/about" className="btn-secondary">
                {aboutPreview.cta}
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Preview */}
      <section className="section-alt">
        <div className="container-page">
          <div className="text-center mb-16">
            <h2 className="mb-4">{programsPreview.title}</h2>
            <p className="text-lg text-brand-muted max-w-2xl mx-auto">
              {programsPreview.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programsPreview.items.map((item: any, index: number) => (
              <motion.div 
                key={index} 
                className="card hover:border-brand-primary transition-colors cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-xl mb-4 group-hover:text-brand-primary transition-colors">{item.title}</h3>
                <p className="text-brand-muted">{item.description}</p>
                <a href="/programs-news" className="mt-6 flex items-center text-brand-primary font-medium">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section bg-brand-primary text-white text-center">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-white mb-6">Ready to make a difference?</h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Whether you want to volunteer your time or contribute financially, every bit of support helps us reach more people.
            </p>
            <a href="/donate" className="btn-accent px-12 py-4 text-lg inline-block">
              Donate Now
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}

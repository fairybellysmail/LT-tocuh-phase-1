import homepageContent from '../content/homepage.json';
import { ArrowRight, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function HomePage() {
  const { hero, stats, aboutPreview, programsPreview } = homepageContent;

  return (
    <>
      {/* HeroSection */}
      <section id="hero" className="relative overflow-hidden bg-brand-bg pt-32 pb-16 md:pt-48 md:pb-24">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-brand-alt-bg text-brand-primary text-sm font-semibold mb-6">
                {hero.badge}
              </span>
              <h1>
                {hero.title.split(hero.highlight)[0]}
                <span className="text-brand-primary">{hero.highlight}</span>
                {hero.title.split(hero.highlight)[1]}
              </h1>
              <p className="mt-6 text-xl text-brand-muted max-w-2xl">
                {hero.description}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button className="btn-primary">
                  {hero.primaryCta} <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="btn-accent">
                  {hero.secondaryCta}
                </button>
              </div>
            </motion.div>
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="aspect-square rounded-brand overflow-hidden shadow-brand">
                <img 
                  src="https://picsum.photos/seed/lifter/800/800" 
                  alt="Community Impact" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <motion.div 
                className="absolute -bottom-6 -left-6 card max-w-xs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-alt-bg rounded-full">
                    <Users className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-brand-muted">Community Members</p>
                    <p className="text-2xl font-bold text-brand-text">12,400+</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-brand-primary py-12 text-white">
        <div className="container-page">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
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
            {programsPreview.items.map((item, index) => (
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
                <div className="mt-6 flex items-center text-brand-primary font-medium">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </div>
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
            <button className="btn-accent px-12 py-4 text-lg">
              Donate Now
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
}

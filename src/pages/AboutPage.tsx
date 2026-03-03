import aboutContent from '../content/about.json';
import { motion } from 'motion/react';

export default function AboutPage() {
  const { title, mission, vision, values, history } = aboutContent;

  return (
    <div className="pt-32 pb-24">
      <div className="container-page">
        <div className="max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {title}
          </motion.h1>
          
          <div className="space-y-12">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl mb-4 text-brand-primary">Our Mission</h2>
              <p className="text-xl leading-relaxed text-brand-muted">
                {mission}
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl mb-4 text-brand-primary">Our Vision</h2>
              <p className="text-xl leading-relaxed text-brand-muted">
                {vision}
              </p>
            </motion.section>

            <motion.section 
              className="bg-brand-alt-bg p-8 rounded-brand border border-brand-primary/10"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl mb-6 text-brand-primary">Core Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {values.map((value, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-bold mb-2">{value.name}</h3>
                    <p className="text-brand-muted text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl mb-4 text-brand-primary">Our History</h2>
              <p className="text-lg leading-relaxed text-brand-muted">
                {history}
              </p>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}

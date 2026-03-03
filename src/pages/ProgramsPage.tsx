import programsContent from '../content/programs.json';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProgramsPage() {
  const { title, description, programs } = programsContent;

  return (
    <div className="pt-32 pb-24">
      <div className="container-page">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="mb-4">{title}</h1>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12">
          {programs.map((program, index) => (
            <motion.div 
              key={program.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card overflow-hidden flex flex-col md:flex-row gap-8 items-center"
            >
              <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-brand overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${program.id}/600/600`} 
                  alt={program.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 text-brand-primary font-semibold text-sm uppercase tracking-wider mb-2">
                  <CheckCircle className="h-4 w-4" />
                  {program.category}
                </div>
                <h2 className="text-3xl mb-4">{program.name}</h2>
                <p className="text-lg text-brand-muted mb-6">
                  {program.description}
                </p>
                <div className="bg-brand-alt-bg p-4 rounded-brand inline-block mb-6">
                  <p className="text-brand-primary font-bold">Impact: {program.impact}</p>
                </div>
                <div>
                  <button className="btn-primary">
                    Get Involved <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

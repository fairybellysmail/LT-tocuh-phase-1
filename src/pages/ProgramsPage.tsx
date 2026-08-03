import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Heart, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface Program {
  id: string;
  name: string;
  category: string;
  description: string;
  impact: string;
  imageUrl?: string;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await fetch('/api/content/programs');
      if (res.ok) {
        const data = await res.json();
        setPrograms(data);
      }
    } catch (err) {
      console.error('Failed to fetch programs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24">
      <div className="container-page">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Users className="h-3.5 w-3.5" /> High Impact Initiatives
          </div>
          <h1 className="mb-4">Programs & Impact</h1>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto">
            Our programs are designed to create measurable, sustainable change in the communities we serve.
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="card h-64 bg-black/5 animate-pulse" />
            ))}
          </div>
        ) : (
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
                <div className="w-full md:w-1/3 aspect-square rounded-brand overflow-hidden flex-shrink-0 bg-black/5">
                  <img 
                    src={program.imageUrl || `https://picsum.photos/seed/${program.id}/600/600`} 
                    alt={program.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 text-brand-primary font-semibold text-xs uppercase tracking-wider mb-2">
                    <CheckCircle className="h-4 w-4" />
                    {program.category}
                  </div>
                  <h2 className="text-3xl mb-4 font-bold">{program.name}</h2>
                  <p className="text-lg text-brand-muted mb-6 leading-relaxed">
                    {program.description}
                  </p>
                  <div className="bg-brand-alt-bg p-4 rounded-brand inline-block mb-6 border border-brand-primary/10">
                    <p className="text-brand-primary font-bold text-sm flex items-center gap-2">
                      <Heart className="h-4 w-4 fill-current text-brand-primary" /> Impact: {program.impact}
                    </p>
                  </div>
                  <div>
                    <a href="/donate" className="btn-primary inline-flex items-center">
                      Get Involved <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

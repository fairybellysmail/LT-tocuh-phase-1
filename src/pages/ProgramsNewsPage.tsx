import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, Heart, Users, Newspaper, Calendar, User, Sparkles, Filter } from 'lucide-react';

interface Program {
  id: string;
  name: string;
  category: string;
  description: string;
  impact: string;
  imageUrl?: string;
}

interface NewsArticle {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content?: string;
  imageUrl?: string;
}

export default function ProgramsNewsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'programs' | 'news'>('all');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [progRes, newsRes] = await Promise.all([
        fetch('/api/content/programs'),
        fetch('/api/content/news')
      ]);

      if (progRes.ok) setPrograms(await progRes.json());
      if (newsRes.ok) setNews(await newsRes.json());
    } catch (err) {
      console.error('Failed to fetch programs & news data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24">
      <div className="container-page">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-brand-primary/20">
            <Sparkles className="h-3.5 w-3.5" /> High Impact & Latest Stories
          </div>
          <h1 className="mb-4">Programs & News</h1>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto">
            Discover our active social programs and read the latest impact stories from the communities we serve.
          </p>
        </motion.div>

        {/* View Filter Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-black/5 p-1.5 rounded-full border border-black/10 shadow-inner">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-brand-accent text-white shadow-md'
                  : 'text-brand-text hover:text-brand-accent'
              }`}
            >
              <Filter className="h-3.5 w-3.5" /> All Initiatives & News
            </button>
            <button
              onClick={() => setActiveTab('programs')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'programs'
                  ? 'bg-brand-accent text-white shadow-md'
                  : 'text-brand-text hover:text-brand-accent'
              }`}
            >
              <Users className="h-3.5 w-3.5" /> Programs ({programs.length})
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'news'
                  ? 'bg-brand-accent text-white shadow-md'
                  : 'text-brand-text hover:text-brand-accent'
              }`}
            >
              <Newspaper className="h-3.5 w-3.5" /> News Articles ({news.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-8 max-w-4xl mx-auto">
            {[1, 2, 3].map((n) => (
              <div key={n} className="card h-48 bg-black/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-16">
            {/* PROGRAMS SECTION */}
            {(activeTab === 'all' || activeTab === 'programs') && (
              <section>
                {activeTab === 'all' && (
                  <div className="flex items-center gap-3 mb-8 pb-3 border-b border-black/10">
                    <Users className="h-6 w-6 text-brand-primary" />
                    <h2 className="text-2xl font-bold">Key Community Programs</h2>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-10">
                  {programs.map((program, index) => (
                    <motion.div 
                      key={program.id} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                      className="card overflow-hidden flex flex-col md:flex-row gap-8 items-center border hover:border-brand-primary/40 transition-all"
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
                        <h2 className="text-2xl md:text-3xl mb-3 font-bold">{program.name}</h2>
                        <p className="text-base text-brand-muted mb-5 leading-relaxed">
                          {program.description}
                        </p>
                        <div className="bg-brand-alt-bg p-3.5 rounded-brand inline-block mb-6 border border-brand-primary/10">
                          <p className="text-brand-primary font-bold text-sm flex items-center gap-2">
                            <Heart className="h-4 w-4 fill-current text-brand-primary" /> Impact: {program.impact}
                          </p>
                        </div>
                        <div>
                          <a href="/donate" className="btn-primary inline-flex items-center">
                            Get Involved <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* NEWS SECTION */}
            {(activeTab === 'all' || activeTab === 'news') && (
              <section className={activeTab === 'all' ? 'pt-6' : ''}>
                {activeTab === 'all' && (
                  <div className="flex items-center gap-3 mb-8 pb-3 border-b border-black/10">
                    <Newspaper className="h-6 w-6 text-brand-primary" />
                    <h2 className="text-2xl font-bold">Latest Impact Stories & News</h2>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {news.map((item, index) => (
                    <motion.article 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                      className="card group cursor-pointer hover:border-brand-primary transition-all flex flex-col justify-between"
                      onClick={() => setActiveArticle(item)}
                    >
                      <div>
                        <div className="aspect-video rounded-brand overflow-hidden bg-black/5 mb-5">
                          <img 
                            src={item.imageUrl || `https://picsum.photos/seed/${item.id}/600/400`} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex items-center gap-4 text-xs font-semibold text-brand-muted mb-2">
                          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {item.date}</span>
                          <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {item.author}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors">{item.title}</h3>
                        <p className="text-brand-muted text-sm leading-relaxed mb-4 line-clamp-3">{item.excerpt}</p>
                      </div>

                      <div className="pt-4 border-t border-black/5 flex items-center text-brand-primary font-bold text-sm">
                        Read Story <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Article Full Modal */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-brand max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl">
              <button 
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 p-2 text-brand-muted hover:text-black rounded-full text-lg font-bold"
              >
                ✕
              </button>
              {activeArticle.imageUrl && (
                <img 
                  src={activeArticle.imageUrl} 
                  alt={activeArticle.title} 
                  className="w-full h-56 object-cover rounded-brand mb-6"
                />
              )}
              <div className="flex items-center gap-4 text-xs font-bold text-brand-muted mb-3">
                <span>{activeArticle.date}</span>
                <span>•</span>
                <span>By {activeArticle.author}</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">{activeArticle.title}</h2>
              <div className="text-brand-text leading-relaxed space-y-4">
                <p className="font-medium text-brand-muted">{activeArticle.excerpt}</p>
                <p>{activeArticle.content || activeArticle.excerpt}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-black/10 flex justify-end">
                <button className="btn-secondary" onClick={() => setActiveArticle(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

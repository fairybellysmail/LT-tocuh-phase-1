import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight, Newspaper } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content?: string;
  imageUrl?: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/content/news');
      if (res.ok) {
        const data = await res.json();
        setNews(data);
      }
    } catch (err) {
      console.error('Failed to fetch news:', err);
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
            <Newspaper className="h-3.5 w-3.5" /> Latest Updates & Stories
          </div>
          <h1 className="mb-4">Community News</h1>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto">
            Stay updated with the latest happenings, impact stories, and community developments at LiftersTouch.
          </p>
        </motion.div>

        {loading ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="card h-48 bg-black/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
            {news.map((item, index) => (
              <motion.article 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card group cursor-pointer hover:border-brand-primary transition-colors"
                onClick={() => setActiveArticle(item)}
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/3 aspect-video rounded-brand overflow-hidden bg-black/5 flex-shrink-0">
                    <img 
                      src={item.imageUrl || `https://picsum.photos/seed/${item.id}/600/400`} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 text-xs font-semibold text-brand-muted mb-3">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {item.date}</span>
                        <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {item.author}</span>
                      </div>
                      <h2 className="text-2xl mb-3 group-hover:text-brand-primary transition-colors">{item.title}</h2>
                      <p className="text-brand-muted text-sm leading-relaxed mb-4">{item.excerpt}</p>
                    </div>
                    <div className="flex items-center text-brand-primary font-bold text-sm">
                      Read Story <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Modal for viewing full news article */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-brand max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl">
              <button 
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 p-2 text-brand-muted hover:text-black rounded-full"
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

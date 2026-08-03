import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Tag } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  caption?: string;
  imageUrl: string;
  category?: string;
  date?: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/content/gallery');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category || 'Community').filter(Boolean)))];

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(i => (i.category || 'Community') === selectedCategory);

  return (
    <div className="pt-32 pb-24">
      <div className="container-page">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Visual Impact Archive
          </div>
          <h1 className="mb-4">Our Gallery</h1>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto">
            A visual journey through our community impact and the lives we've touched across every neighborhood.
          </p>
        </motion.div>

        {/* Category Filters */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-black/5 text-brand-text hover:bg-black/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="aspect-square rounded-brand bg-black/5 animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 card bg-brand-alt-bg">
            <p className="text-brand-muted">No gallery items found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((img, index) => (
              <motion.div 
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative aspect-square rounded-brand overflow-hidden shadow-brand cursor-pointer bg-black/5"
              >
                <img 
                  src={img.imageUrl} 
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end text-white">
                  {img.category && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand-accent mb-1">
                      <Tag className="h-3 w-3" /> {img.category}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-white mb-1">{img.title}</h3>
                  {img.caption && (
                    <p className="text-xs text-white/80 line-clamp-2 mb-2">{img.caption}</p>
                  )}
                  {img.date && (
                    <span className="flex items-center gap-1 text-[10px] text-white/60">
                      <Calendar className="h-3 w-3" /> {img.date}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

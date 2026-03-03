import { motion } from 'motion/react';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default function NewsPage() {
  const news = [
    {
      id: 1,
      title: 'New Community Center Opening in Downtown',
      date: 'Oct 12, 2025',
      author: 'Sarah Johnson',
      excerpt: 'We are thrilled to announce the opening of our newest facility, designed to serve over 500 families weekly.',
    },
    {
      id: 2,
      title: 'Annual Impact Report 2025 Released',
      date: 'Sep 28, 2025',
      author: 'Michael Chen',
      excerpt: 'Our latest report shows a 25% increase in community engagement and a record-breaking fundraising year.',
    },
    {
      id: 3,
      title: 'Volunteer Spotlight: Meet the Team',
      date: 'Sep 15, 2025',
      author: 'Elena Rodriguez',
      excerpt: 'This month we highlight the incredible work of our volunteers who make everything we do possible.',
    }
  ];

  return (
    <div className="pt-32 pb-24">
      <div className="container-page">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="mb-4">Latest News</h1>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto">
            Stay updated with the latest happenings, impact stories, and community events at LiftersTouch.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          {news.map((item, index) => (
            <motion.article 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card group cursor-pointer hover:border-brand-primary transition-colors"
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 aspect-video rounded-brand overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/news-${item.id}/600/400`} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-4 text-sm text-brand-muted mb-4">
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {item.date}</span>
                    <span className="flex items-center gap-1"><User className="h-4 w-4" /> {item.author}</span>
                  </div>
                  <h2 className="text-2xl mb-4 group-hover:text-brand-primary transition-colors">{item.title}</h2>
                  <p className="text-brand-muted mb-6">{item.excerpt}</p>
                  <div className="flex items-center text-brand-primary font-bold">
                    Read Story <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

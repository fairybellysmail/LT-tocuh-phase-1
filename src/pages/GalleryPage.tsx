import { motion } from 'motion/react';

export default function GalleryPage() {
  const images = [
    { id: 1, title: 'Community Workshop' },
    { id: 2, title: 'Youth Mentorship' },
    { id: 3, title: 'Urban Garden' },
    { id: 4, title: 'Tech Training' },
    { id: 5, title: 'Food Distribution' },
    { id: 6, title: 'Neighborhood Cleanup' },
  ];

  return (
    <div className="pt-32 pb-24">
      <div className="container-page">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="mb-4">Our Gallery</h1>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto">
            A visual journey through our community impact and the lives we've touched.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((img, index) => (
            <motion.div 
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative aspect-square rounded-brand overflow-hidden shadow-brand cursor-pointer"
            >
              <img 
                src={`https://picsum.photos/seed/gallery-${img.id}/800/800`} 
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white font-bold text-lg">{img.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

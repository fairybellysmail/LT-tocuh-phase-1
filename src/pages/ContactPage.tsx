import contactContent from '../content/contact.json';
import { Mail, Phone, MapPin, Heart, Send, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactPage() {
  const { title, description, contactInfo, support } = contactContent;

  return (
    <div className="pt-32 pb-24">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="mb-6">{title}</h1>
            <p className="text-xl text-brand-muted mb-12">
              {description}
            </p>

            <div className="space-y-8 mb-16">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-alt-bg rounded-full text-brand-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Email Us</h3>
                  <p className="text-brand-muted">{contactInfo.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-alt-bg rounded-full text-brand-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Call Us</h3>
                  <p className="text-brand-muted">{contactInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-alt-bg rounded-full text-brand-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Visit Us</h3>
                  <p className="text-brand-muted">{contactInfo.address}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                className="card bg-brand-primary text-white"
                whileHover={{ scale: 1.02 }}
              >
                <Heart className="h-8 w-8 mb-4 text-brand-accent" />
                <h3 className="text-xl font-bold mb-2 text-white">{support.donateTitle}</h3>
                <p className="text-white/80 text-sm mb-4">{support.donateDescription}</p>
                <button className="text-brand-accent font-bold hover:underline">Donate Now &rarr;</button>
              </motion.div>
              <motion.div 
                className="card border-brand-primary/20"
                whileHover={{ scale: 1.02 }}
              >
                <Users className="h-8 w-8 mb-4 text-brand-primary" />
                <h3 className="text-xl font-bold mb-2">{support.volunteerTitle}</h3>
                <p className="text-brand-muted text-sm mb-4">{support.volunteerDescription}</p>
                <button className="text-brand-primary font-bold hover:underline">Join Us &rarr;</button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl mb-8">Send us a message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-muted mb-2">First Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-brand border border-black/10 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-muted mb-2">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-brand border border-black/10 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-muted mb-2">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-brand border border-black/10 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-muted mb-2">Subject</label>
                <select className="w-full px-4 py-3 rounded-brand border border-black/10 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all bg-white">
                  <option>General Inquiry</option>
                  <option>Donation Question</option>
                  <option>Volunteer Application</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-muted mb-2">Message</label>
                <textarea rows={5} className="w-full px-4 py-3 rounded-brand border border-black/10 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all resize-none"></textarea>
              </div>
              <button className="btn-primary w-full">
                Send Message <Send className="ml-2 h-5 w-5" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

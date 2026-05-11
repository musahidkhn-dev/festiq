import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";
import { useState } from 'react';
import { toast } from 'react-toastify';

const supportCards = [
  {
    title: "Technical Support",
    description: "Issues with your Seeker Protocol or account access?",
    email: "tech@festiq.com",
    icon: Zap,
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    title: "Booking Assistance",
    description: "Need help with ticket modifications or event details?",
    email: "support@festiq.com",
    icon: MessageSquare,
    color: "bg-violet-500/10 text-violet-500"
  },
  {
    title: "Security & Privacy",
    description: "Questions about your data or AES-256 encryption?",
    email: "privacy@festiq.com",
    icon: ShieldCheck,
    color: "bg-emerald-500/10 text-emerald-500"
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Ohooo! Message sent successfully. Nova is on it! 🎭");
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050508] pt-24 md:pt-32 pb-20 selection:bg-violet-500/30">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-violet-600/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <section className="text-center mb-12 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-violet-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6 block">Contact Us</span>
            <h1 className="text-5xl md:text-9xl text-white mb-8 font-bebas tracking-tighter leading-none">
              Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-blue-500">Touch</span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              Have questions or just want to vibe? Our team is always online and ready to help.
            </p>
          </motion.div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20">
          {/* Contact Info & Support Cards */}
          <section className="space-y-8 md:space-y-12">
            <div>
              <h2 className="text-3xl md:text-4xl text-white mb-8">Support <span className="text-violet-500">Channels</span></h2>
              <div className="grid grid-cols-1 gap-6">
                {supportCards.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-white/[0.02] border border-white/5 flex gap-6 group hover:border-violet-500/30 transition-all cursor-pointer"
                    >
                      <div className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                         <Icon className="w-6 h-6" />
                      </div>
                      <div>
                         <h4 className="text-white text-lg mb-1 font-bold tracking-tight">{card.title}</h4>
                         <p className="text-gray-500 text-sm font-medium mb-4 leading-relaxed">{card.description}</p>
                         <span className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:text-violet-400">
                           {card.email} <ArrowRight className="w-3 h-3" />
                         </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="pt-8 md:pt-12 border-t border-white/5 space-y-8">
               <h3 className="text-white text-xs font-black uppercase tracking-[0.2em]">Global Connect</h3>
               <div className="flex flex-wrap gap-8 md:gap-12">
                  <div className="flex items-center gap-4 group">
                     <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-violet-500 transition-colors">
                        <Mail className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest">Email</p>
                        <p className="text-white text-sm font-bold tracking-tight">hello@festiq.com</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                     <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-blue-500 transition-colors">
                        <Phone className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest">Phone</p>
                        <p className="text-white text-sm font-bold tracking-tight">+1 (555) FESTIQ</p>
                     </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-4 pt-4">
                  {[FaTwitter, FaInstagram, FaGithub].map((Icon, i) => (
                    <motion.a 
                      key={i}
                      href="#"
                      whileHover={{ scale: 1.1, y: -4 }}
                      className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-violet-500/50 transition-all"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  ))}
               </div>
            </div>
          </section>

          {/* Contact Form */}
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 md:p-14 rounded-[2rem] md:rounded-[3rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-violet-600/5 blur-[80px] rounded-full"></div>
            
            <h2 className="text-3xl md:text-4xl text-white mb-8">Send A <span className="text-violet-500">Message</span></h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest px-2">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Musahid Khan"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 md:py-4 px-6 text-white placeholder-gray-700 outline-none focus:border-violet-500/50 transition-all font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest px-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="musahid@zenvyra.com"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 md:py-4 px-6 text-white placeholder-gray-700 outline-none focus:border-violet-500/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest px-2">Subject</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 md:py-4 px-6 text-white outline-none focus:border-violet-500/50 transition-all font-medium appearance-none"
                >
                  <option className="bg-[#0D0D15]">General Inquiry</option>
                  <option className="bg-[#0D0D15]">Event Collaboration</option>
                  <option className="bg-[#0D0D15]">Technical Support</option>
                  <option className="bg-[#0D0D15]">Business Partnerships</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest px-2">Your Message</label>
                <textarea 
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Tell us what's on your mind..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-6 px-6 text-white placeholder-gray-700 outline-none focus:border-violet-500/50 transition-all font-medium resize-none"
                ></textarea>
              </div>

              <button 
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-4 md:py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-violet-600/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                     <RefreshCw className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <>
                    Initialize Connection <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

function RefreshCw(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

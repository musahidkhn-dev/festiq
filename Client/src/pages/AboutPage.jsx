import { motion } from 'framer-motion';
import { Sparkles, Target, Zap, Heart, ShieldCheck, Star, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: "Tickets Sold", value: "500K+", icon: Zap },
  { label: "Active Events", value: "1,200+", icon: Star },
  { label: "Happy Users", value: "100K+", icon: Heart },
  { label: "Cities", value: "50+", icon: Target },
];

const features = [
  {
    title: "Instant Booking",
    description: "Get your tickets in seconds with our optimized Seeker Protocol logic.",
    icon: Zap,
    color: "from-blue-600 to-cyan-500"
  },
  {
    title: "Mood Matching",
    description: "Our AI helps you find events that match your current vibe perfectly.",
    icon: Sparkles,
    color: "from-violet-600 to-purple-500"
  },
  {
    title: "Secure Access",
    description: "AES-256 encryption ensures your tickets and data are always safe.",
    icon: ShieldCheck,
    color: "from-emerald-600 to-teal-500"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050508] pt-24 md:pt-32 pb-20 selection:bg-violet-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-16 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-violet-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6 block">Our Story</span>
            <h1 className="text-5xl md:text-9xl text-white mb-8 font-bebas tracking-tighter leading-none">
              Revolutionizing The <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-blue-500">Live Experience</span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">
              Festiq isn't just a ticket platform. It's a gateway to memories, 
              powered by next-gen technology and a passion for the ultimate vibe.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-12 md:mt-20 relative rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/5 aspect-video md:aspect-[21/9]"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050508]/80 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop" 
              alt="Concert Experience"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-24 h-24 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20 flex items-center justify-center group cursor-pointer"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                   <ArrowRight className="w-8 h-8 text-black" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16 md:mb-32">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.02] border border-white/5 text-center group hover:border-violet-500/30 transition-all"
              >
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-violet-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-3xl md:text-4xl text-white mb-2 leading-none">{stat.value}</h3>
                <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            );
          })}
        </section>

        {/* Mission Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center mb-16 md:mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6 block">Our Mission</span>
            <h2 className="text-3xl md:text-7xl text-white mb-8 leading-none">We Believe In <br /> The Power Of <span className="text-violet-500">Connection</span></h2>
            <p className="text-gray-500 text-lg font-medium leading-relaxed mb-8">
              At Festiq, our mission is to eliminate the friction between you and your next great adventure. 
              Whether it's a basement jazz club or a stadium concert, we build the bridges that bring people together.
            </p>
            <ul className="space-y-4">
              {["Decentralized ticketing infrastructure", "AI-driven event curation", "Global community of vibe-seekers"].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-white font-bold tracking-tight text-sm">
                  <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6"
          >
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-white/[0.03] border border-white/5 flex gap-6 group hover:bg-white/[0.05] transition-all">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${feature.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                     <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                     <h4 className="text-white text-xl mb-2">{feature.title}</h4>
                     <p className="text-gray-500 text-sm font-medium leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-10 md:p-24 rounded-[2rem] md:rounded-[4rem] bg-gradient-to-br from-violet-600 to-blue-700 relative overflow-hidden group text-center"
        >
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-8xl text-white mb-8 leading-none">Ready To Join <br /> The Movement?</h2>
            <p className="text-white/70 text-lg md:text-xl mb-12 font-medium">
              Join thousands of others discovering their next favorite moment on Festiq.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
               <Link to="/events" className="bg-white text-black px-8 py-4 md:px-12 md:py-5 rounded-[2rem] font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                 Browse Events
               </Link>
               <Link to="/register" className="bg-transparent border border-white/30 text-white px-8 py-4 md:px-12 md:py-5 rounded-[2rem] font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                 Join Now
               </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

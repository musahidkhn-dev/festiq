import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useEvents } from "../hooks/queries/useEvents";
import { useEffect, useState } from "react";
import LoadingScreen from "../components/LoadingScreen";
import EventCard from "../components/EventCard";
import { Sparkles, ArrowRight, Play, Star, Zap, Music, Ticket, Bot, Calendar, MapPin, Search, Mic2, Gamepad2, Coffee, Rocket, Swords, Trophy } from "lucide-react";
import SafeImage from "../components/SafeImage";
import SafeAvatar from "../components/SafeAvatar";

const moods = [
  { id: "all", label: "All", icon: Rocket, color: "from-gray-600 to-slate-600", tag: "Everything", categories: [] },
  { id: "party", label: "Party", icon: Rocket, color: "from-violet-600 to-indigo-600", tag: "Energy", categories: ["DJ Night", "Clubbing", "Party", "Nightlife", "Festival"] },
  { id: "chill", label: "Chill", icon: Coffee, color: "from-blue-600 to-cyan-600", tag: "Relax", categories: ["Food Festival", "Workshop", "Art", "Exhibition", "Photography", "Travel", "Adventure"] },
  { id: "music", label: "Music", icon: Music, color: "from-emerald-600 to-teal-600", tag: "Rhythm", categories: ["Music Concert", "Festivals", "Opera", "Dance"] },
  { id: "comedy", label: "Comedy", icon: Mic2, color: "from-fuchsia-600 to-pink-600", tag: "Laughs", categories: ["Stand-up Comedy", "Improv", "Smile"] },
  { id: "tech", label: "Tech", icon: Zap, color: "from-amber-600 to-orange-600", tag: "Future", categories: ["Tech Conference", "Startup Meetup", "Webinar", "Networking", "Seminar"] },
  { id: "gaming", label: "Gaming", icon: Gamepad2, color: "from-rose-600 to-red-600", tag: "Action", categories: ["Gaming", "Esports", "Tournament"] },
  { id: "sports", label: "Sports", icon: Trophy, icon2: Swords, color: "from-orange-600 to-red-600", tag: "Combat", categories: ["Sports", "MMA", "Boxing", "Combat Sports", "Wrestling", "Tournament"] },
];

// Encapsulated component to safely use hooks inside mapped arrays
function FloatingCard({ card, index, springX, springY }) {
  const x = useTransform(springX, [0, 2000], [index * 10, -index * 10]);
  const y = useTransform(springY, [0, 1000], [index * 5, -index * 5]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 0.15, scale: 1 }}
      transition={{ delay: 2 + index * 0.2, duration: 1 }}
      style={{ left: card.x, top: card.y, rotate: card.rot, x, y }}
      className="absolute w-48 h-64 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
    >
      <img src={card.img} className="w-full h-full object-cover grayscale" />
    </motion.div>
  );
}

export default function HomePage() {
  const { data, isLoading } = useEvents();
  const rawEvents = data?.events || [];
  const events = Array.from(new Map(rawEvents.map(event => [event._id, event])).values());
  const [selectedMood, setSelectedMood] = useState("all");

  // Parallax / Magnetic State
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 30, stiffness: 200 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Parallax Transformations
  const textX = useTransform(springX, [0, 2000], [-15, 15]);
  const textY = useTransform(springY, [0, 1000], [-10, 10]);
  const bgX = useTransform(springX, [0, 2000], [10, -10]);
  const bgY = useTransform(springY, [0, 1000], [5, -5]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const filteredEvents = selectedMood === "all" 
    ? events 
    : events.filter(ev => {
        const moodData = moods.find(m => m.id === selectedMood);
        return moodData?.categories.some(cat => ev.category?.toLowerCase().includes(cat.toLowerCase()));
      });

  // Scroll Progress for secondary parallax
  const { scrollYProgress } = useScroll();
  const trendingY = useTransform(scrollYProgress, [0, 0.3], [100, 0]);
  const trendingOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen text-white font-outfit">
      {/* Cinematic Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        
        {/* Next-Gen Aurora Background System */}
        <div className="aurora-bg">
          <motion.div 
            style={{ x: bgX, y: bgY }}
            className="aurora-layer bg-violet-600 top-[-20%] left-[-10%] scale-150" 
          />
          <motion.div 
            style={{ x: bgX, y: bgY }}
            className="aurora-layer bg-blue-600 bottom-[-20%] right-[-10%] scale-150" 
          />
          <motion.div 
            style={{ x: bgX, y: bgY }}
            className="aurora-layer bg-emerald-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-125 opacity-10" 
          />
        </div>

        {/* Scanline & Grid Effect */}
        <div className="scanline-effect"></div>
        <div className="noise-overlay"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ x: textX, y: textY }}
          >
            {/* Headline */}
            <h1 className="font-bebas text-[12vw] sm:text-[12vw] md:text-[10vw] lg:text-[13rem] leading-[0.8] tracking-tighter mb-6 md:mb-12 select-none">
              <motion.span 
                initial={{ opacity: 0, filter: "blur(20px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.2 }}
                className="block"
              >
                DISCOVER THE
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, filter: "blur(20px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-400 to-blue-500 drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]"
              >
                UNFORGETTABLE
              </motion.span>
            </h1>

            {/* Subline */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1, duration: 2 }}
              className="text-white text-base sm:text-2xl max-w-3xl mx-auto leading-relaxed mb-10 md:mb-20 font-medium tracking-wide"
            >
              Immersive event discovery powered by human vibe and neural sync. <br className="hidden md:block" /> 
              Your portal to the world's most exclusive experiences starts here.
            </motion.p>

            {/* Primary Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-12 md:mb-24"
            >
              <Link to="/events" className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139,92,246,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-8 py-4 md:px-12 md:py-6 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl shadow-2xl transition-all duration-300"
                >
                  Explore Grid
                </motion.button>
              </Link>
              <Link to="/host-event" className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-8 py-4 md:px-12 md:py-6 bg-transparent border border-white/20 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl backdrop-blur-xl transition-all duration-300"
                >
                  Host Protocol
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Cinematic Discovery Cards */}
          <div className="absolute inset-0 pointer-events-none hidden xl:block">
            {[
              { x: "10%", y: "20%", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400", rot: -15 },
              { x: "85%", y: "15%", img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400", rot: 12 },
              { x: "5%", y: "65%", img: "https://images.unsplash.com/photo-1514525253361-bee8a48790c3?w=400", rot: 10 },
              { x: "90%", y: "70%", img: "https://images.unsplash.com/photo-1459749411177-042180ce673c?w=400", rot: -8 },
            ].map((card, i) => (
              <FloatingCard key={i} card={card} index={i} springX={springX} springY={springY} />
            ))}
          </div>

          {/* Dynamic Mood Selection System */}
          <motion.div 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 1.5 }}
             className="grid grid-cols-4 sm:flex sm:flex-wrap justify-center gap-3 md:gap-6 px-2 md:px-4"
          >
            {moods.map((mood, idx) => (
              <motion.div
                key={mood.id}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedMood(mood.id)}
                className={`relative group cursor-pointer transition-all duration-500 ${selectedMood === mood.id ? 'scale-110' : 'opacity-40 hover:opacity-100'}`}
              >
                <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl flex flex-col items-center justify-center gap-2 border ${selectedMood === mood.id ? 'bg-violet-600 border-violet-400 shadow-[0_0_30px_rgba(139,92,246,0.5)]' : 'bg-white/5 border-white/10 backdrop-blur-xl'}`}>
                   <mood.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                   <span className="text-[6px] font-black uppercase tracking-[0.2em]">{mood.label}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Cinematic Scroll Sentinel */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <div className="w-[1px] h-20 bg-gradient-to-b from-white/20 via-white/10 to-transparent"></div>
          <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/20 rotate-90 translate-y-12">Scroll</span>
        </motion.div>
      </section>


      {/* Trending Section: Bento Grid */}
      <section className="py-12 md:py-32 max-w-7xl mx-auto px-6">
        <motion.div 
          style={{ y: trendingY, opacity: trendingOpacity }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-4 md:gap-6"
        >
          <div>
            <h2 className="text-3xl sm:text-5xl md:text-7xl text-white mb-4 uppercase font-bebas tracking-wider">TRENDING <span className="text-violet-500">NOW</span></h2>
            <p className="text-gray-500 font-bold text-[10px] sm:text-sm tracking-widest uppercase">The most hyped experiences in your city.</p>
          </div>
          <Link to="/events" className="flex items-center gap-3 group px-8 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all duration-500">
            <span className="text-xs font-black uppercase tracking-widest">Explore All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredEvents.length > 0 ? (
              filteredEvents.slice(0, 6).map((event, idx) => (
                <motion.div
                  key={event._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="font-bebas text-4xl text-white tracking-widest mb-2">No {selectedMood} vibes found</h3>
                <p className="text-gray-500 font-medium">Try another mood or check back later.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Immersive Feature: The "Live Pulse" Section */}
      <section className="relative py-12 md:py-40 overflow-hidden">
        {/* Layered Parallax Background */}
        <div className="absolute inset-0 z-0">
           <SafeImage 
             src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600" 
             className="w-full h-full opacity-20 scale-110 grayscale brightness-50" 
           />
           <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-transparent to-[#050508]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1 }}
           >
             <h3 className="font-bebas text-4xl md:text-[12rem] text-white leading-none tracking-tighter mb-8 md:mb-12 opacity-80">
                LIVE <span className="text-transparent border border-white/50 md:border-2 md:border-white bg-clip-text text-white/5 px-3 md:px-6 rounded-xl md:rounded-3xl">YOUR</span> STORY.
             </h3>
             <div className="flex justify-center gap-4 md:gap-12">
               {[
                 { label: "Tickets Sold", val: "1.2M+" },
                 { label: "Elite Artists", val: "500+" },
                 { label: "Host Cities", val: "50+" }
               ].map((stat, i) => (
                 <div key={i} className="text-center">
                   <p className="text-2xl md:text-5xl font-bebas text-white mb-1 md:mb-2">{stat.val}</p>
                   <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{stat.label}</p>
                 </div>
               ))}
             </div>
           </motion.div>
        </div>
      </section>

      {/* Horizontal Rail: Categorized Discovery */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 mb-6 md:mb-16">
          <h2 className="text-3xl sm:text-6xl text-white font-bebas tracking-wider uppercase">GENRE <span className="text-blue-500">PULSE</span></h2>
        </div>

        <div className="flex gap-6 sm:gap-8 overflow-x-auto pb-12 px-6 no-scrollbar snap-x cursor-grab">
          {events.slice(3, 8).map((event) => (
            <div key={event._id} className="min-w-[280px] sm:min-w-[350px] md:min-w-[450px] snap-center">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </section>

      {/* MoodBot CTA: Cinematic Call to Action */}
      <section className="py-16 md:py-40 max-w-7xl mx-auto px-6">
        <div className="relative bg-gradient-to-br from-violet-600 to-blue-700 rounded-[2rem] md:rounded-[3rem] p-8 md:p-24 overflow-hidden group shadow-2xl">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
           
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="w-32 h-32 md:w-64 md:h-64 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center relative shadow-inner">
                 <Bot className="w-16 h-16 md:w-24 md:h-24 text-white animate-bounce" />
                 <div className="absolute -top-2 -right-2 bg-emerald-500 text-black font-black text-[8px] md:text-[10px] px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg">ONLINE_NOW</div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                 <h4 className="font-bebas text-4xl sm:text-7xl text-white tracking-wider mb-4 md:mb-6">Feeling <span className="italic opacity-80">Indecisive?</span></h4>
                 <p className="text-white/70 text-sm sm:text-xl font-medium mb-8 md:mb-10 leading-relaxed max-w-xl">
                    MoodBot V2 is powered by emotional intelligence. Tell us how you feel, and we’ll map your night out instantly.
                 </p>
                 <Link to="/chat">
                   <motion.button 
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     className="px-8 py-4 md:px-10 md:py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-2xl hover:bg-[#050508] hover:text-white transition-all duration-500"
                   >
                     Start Chat
                   </motion.button>
                 </Link>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}

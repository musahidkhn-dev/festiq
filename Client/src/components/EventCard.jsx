import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Ticket, Star, Sparkles, ChevronRight, Zap } from "lucide-react";
import SafeImage from "./SafeImage";

export default function EventCard({ event }) {
  if (!event) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover="hover"
      className="group relative w-full h-[280px] md:h-[440px] rounded-[1.5rem] md:rounded-[2rem]"
    >
      {/* Cinematic Spotlight Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-violet-600/30 via-transparent to-blue-600/30 rounded-[2.2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>

      {/* Main Card Container */}
      <div className="relative w-full h-full bg-[#050508] rounded-[1.5rem] md:rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl transition-all duration-700 z-10 group-hover:border-violet-500/20 group-hover:shadow-[0_0_40px_rgba(139,92,246,0.1)]">
        
        {/* Full Bleed Image Layer */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <SafeImage 
            src={event.eventImage} 
            alt={event.title} 
            className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
          />
          {/* Deep Multi-stop Cinematic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/60 to-transparent opacity-80"></div>
        </div>

        {/* Content Layers (Z-10) */}
        <div className="relative z-10 h-full p-3.5 md:p-6 flex flex-col justify-between">
          
          {/* Top Section: Badges & Price */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
               <motion.div 
                variants={{ hover: { y: 2 } }}
                className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg md:rounded-xl px-2 py-1 md:px-3 md:py-1.5 shadow-xl"
              >
                <div className={`w-1.5 h-1.5 rounded-full ${
                  event.status === 'live' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]' :
                  event.status === 'upcoming' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' :
                  'bg-gray-500'
                }`}></div>
                <span className="text-white text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em]">
                  {event.status || 'Live'}
                </span>
              </motion.div>

              {/* Category Badge */}
              <motion.div 
                variants={{ hover: { y: 4 } }}
                transition={{ delay: 0.05 }}
                className="inline-flex items-center bg-violet-600/20 backdrop-blur-md border border-violet-500/20 rounded-lg md:rounded-xl px-2 py-0.5 md:px-3 md:py-1 shadow-xl"
              >
                <span className="text-violet-300 text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em]">
                  {event.category || 'Event'}
                </span>
              </motion.div>
            </div>

            {/* Price Tag */}
            <motion.div 
              variants={{ hover: { scale: 1.05, rotate: -2 } }}
              className="bg-white text-black px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl shadow-2xl flex flex-col items-center justify-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-200"></div>
              <span className="relative z-10 font-bebas text-xl md:text-2xl leading-none">₹{event.ticketPrice}</span>
            </motion.div>
          </div>

          {/* Bottom Section: Info & Action */}
          <div className="flex flex-col gap-4 mt-auto">
             {/* Title & Rating */}
            <div className="space-y-1 transform translate-y-1 md:translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex items-center gap-2 mb-1 md:mb-2">
                <div className="flex items-center gap-1 bg-white/5 backdrop-blur-sm border border-white/5 rounded-md px-1.5 py-0.5">
                  <Star className="w-2 md:w-2.5 h-2 md:h-2.5 text-amber-400 fill-amber-400" />
                  <span className="text-gray-300 text-[8px] md:text-[9px] font-bold tracking-widest">{event.averageRating?.toFixed(1) || "NEW"}</span>
                </div>
              </div>
              <h3 className="font-bebas text-2xl md:text-5xl text-white leading-[0.9] tracking-wider group-hover:text-violet-300 transition-colors line-clamp-2 drop-shadow-2xl">
                {event.title}
              </h3>
            </div>

             {/* Metadata Glass Panel */}
            <div className="grid grid-cols-2 gap-2 md:gap-3 p-2 md:p-4 bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-xl md:rounded-2xl group-hover:bg-white/[0.04] transition-colors">
              <div className="flex items-start gap-2 md:gap-2.5">
                <div className="mt-0.5 w-5 h-5 md:w-6 md:h-6 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-2.5 md:w-3 h-2.5 md:h-3 text-violet-400" />
                </div>
                <div>
                  <p className="text-[6px] md:text-[7px] text-gray-500 font-black uppercase tracking-[0.2em] mb-0.5">Date</p>
                  <p className="text-[9px] md:text-[10px] text-white font-bold tracking-wide truncate">
                    {new Date(event.eventDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-2.5">
                <div className="mt-0.5 w-5 h-5 md:w-6 md:h-6 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-2.5 md:w-3 h-2.5 md:h-3 text-rose-400" />
                </div>
                <div>
                  <p className="text-[6px] md:text-[7px] text-gray-500 font-black uppercase tracking-[0.2em] mb-0.5">Location</p>
                  <p className="text-[9px] md:text-[10px] text-white font-bold tracking-wide truncate line-clamp-1">{event.eventLocation}</p>
                </div>
              </div>
            </div>

             {/* Interactive Footer */}
            <div className="flex items-center justify-between pt-0.5">
               <div className="flex items-center gap-1 text-gray-400 group-hover:text-white transition-colors">
                  <Zap className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-400" />
                  <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">{event.totalSeats} Tickets</span>
               </div>
               
               <Link to={`/events/${event._id}`}>
                 <motion.button 
                   whileTap={{ scale: 0.95 }}
                   className="flex items-center gap-2 bg-white text-black px-3 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] hover:bg-violet-500 hover:text-white transition-colors group/btn shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                 >
                   Explore
                   <ChevronRight className="w-3 md:w-3.5 h-3 md:h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                 </motion.button>
               </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

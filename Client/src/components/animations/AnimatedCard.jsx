import { motion } from "framer-motion";

export default function AnimatedCard({ children, className = "", delay = 0, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className={`relative group bg-[#050508]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 shadow-2xl hover:border-violet-500/30 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] ${className}`}
    >
      {/* Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}

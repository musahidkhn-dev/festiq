import { motion } from 'framer-motion';

export default function LoadingScreen({ text }) {
  return (
    <div className="bg-[#050508] min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-outfit select-none">
      
      {/* Deep Aurora Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-30%] left-[-20%] w-[80vw] h-[80vw] bg-violet-600/15 rounded-full blur-[180px] animate-[pulse_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-30%] right-[-20%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[150px] animate-[pulse_8s_ease-in-out_infinite_1s]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-emerald-600/5 rounded-full blur-[120px] animate-[pulse_7s_ease-in-out_infinite_2s]"></div>
      </div>

      {/* Noise Overlay */}
      <div className="noise-overlay"></div>

      {/* Scanline */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
      }}></div>

      {/* Central Loader System */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Orbital Ring System */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-12">
          {/* Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-white/[0.06]"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-violet-500 rounded-full shadow-[0_0_12px_rgba(139,92,246,0.8)]"></div>
          </motion.div>

          {/* Middle Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-white/[0.04]"
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
          </motion.div>

          {/* Inner Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-8 rounded-full border border-violet-500/10"
          >
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
          </motion.div>

          {/* Core Glow Orb */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-violet-600 to-blue-600 shadow-[0_0_40px_rgba(139,92,246,0.4),0_0_80px_rgba(139,92,246,0.15)]"
            ></motion.div>
          </div>
        </div>

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center"
        >
          <h1 className="font-bebas text-5xl sm:text-6xl text-white tracking-[0.2em] leading-none mb-3">
            MOOD<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-500">GO</span>
          </h1>
          
          {/* Loading Bar */}
          <div className="w-48 sm:w-56 h-[2px] bg-white/[0.06] rounded-full mx-auto mt-6 overflow-hidden">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1/2 h-full bg-gradient-to-r from-transparent via-violet-500 to-transparent rounded-full"
            ></motion.div>
          </div>

          {/* Status Text */}
          <motion.p
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-gray-600 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] mt-6"
          >
            {text || 'Preparing unforgettable experiences'}
          </motion.p>
        </motion.div>

        {/* Floating Status Dots */}
        <div className="flex items-center gap-2 mt-10">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-violet-500"
            ></motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Version Tag */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2"
      >
        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
        <span className="text-gray-800 text-[8px] font-black uppercase tracking-[0.3em]">System Active • v3.0</span>
      </motion.div>
    </div>
  );
}

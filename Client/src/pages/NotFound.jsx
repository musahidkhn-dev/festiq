import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Zap, Map } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-[#050508] min-h-screen flex items-center justify-center relative overflow-hidden font-outfit selection:bg-violet-500/30">
      {/* Noise Overlay */}
      <div className="noise-overlay"></div>

      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rose-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Background ID */}
      <motion.span 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute text-[30rem] md:text-[50rem] font-black text-white/[0.01] select-none pointer-events-none font-bebas leading-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 tracking-tighter"
      >
        404
      </motion.span>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-rose-500/5 border border-rose-500/10 backdrop-blur-md mb-4">
             <ShieldAlert className="w-5 h-5 text-rose-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500">Page Not Found</span>
          </div>

          <div>
            <h1 className="font-bebas text-7xl md:text-9xl text-white tracking-widest leading-none mb-6">
              LOST <span className="text-violet-500">IDENTITY.</span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
              The page you're looking for doesn't exist. You may have followed a broken link or the page was moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
            <Link to="/" className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-violet-600 hover:text-white transition-all duration-500 shadow-2xl">
              <ArrowLeft className="w-4 h-4" /> Go Home
            </Link>
            <Link to="/events" className="w-full sm:w-auto bg-white/[0.02] border border-white/5 text-gray-500 px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-white/5 hover:text-white transition-all duration-500">
              <Map className="w-4 h-4" /> Browse Events
            </Link>
          </div>

          {/* Floating Protocol Fragment */}
          <div className="pt-20">
             <div className="inline-block p-1 bg-gradient-to-tr from-white/5 to-transparent rounded-[2rem]">
                <div className="bg-[#12121A] border border-white/5 rounded-[2rem] p-8 text-left space-y-4 shadow-2xl">
                   <div className="flex items-center justify-between gap-20">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                         <span className="text-[8px] font-black uppercase tracking-widest text-gray-700">Page Not Found</span>
                      </div>
                      <Zap className="w-3 h-3 text-gray-800" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-white text-[10px] font-black uppercase tracking-widest">Error: 404</p>
                      <p className="text-gray-700 text-[8px] font-black uppercase tracking-widest leading-none">The page you're looking for doesn't exist.</p>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

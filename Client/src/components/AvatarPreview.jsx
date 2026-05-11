import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { useUIStore } from '../store/uiStore';

const AvatarPreview = () => {
  const { previewData, setPreviewData } = useUIStore();

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setPreviewData(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setPreviewData]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (previewData) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [previewData]);

  if (!previewData) return null;

  const { src, name } = previewData;

  const getInitials = (n) => {
    if (!n) return '?';
    const names = n.split(' ');
    if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
    return n[0].toUpperCase();
  };

  const getBackgroundColor = (n) => {
    const colors = [
      'from-violet-600 to-indigo-600', 
      'from-blue-600 to-cyan-600', 
      'from-emerald-600 to-teal-600', 
      'from-fuchsia-600 to-pink-600', 
      'from-amber-600 to-orange-600'
    ];
    let hash = 0;
    for (let i = 0; i < (n?.length || 0); i++) {
      hash = n.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <AnimatePresence>
      {previewData && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewData(null)}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setPreviewData(null)}
            className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-500 rounded-2xl border border-white/10 transition-all z-10 group"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
          </motion.button>

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-2xl w-full aspect-square bg-[#0A0A0F] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(139,92,246,0.15)] group"
          >
            {/* Background Accent */}
            <div className={`absolute inset-0 opacity-10 bg-gradient-to-tr ${getBackgroundColor(name)} blur-[100px]`}></div>

            {src ? (
              <img 
                src={src} 
                alt={name} 
                className="w-full h-full object-cover relative z-10 select-none pointer-events-none" 
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center text-white font-bebas text-[15rem] bg-gradient-to-tr ${getBackgroundColor(name)} relative z-10`}>
                {getInitials(name)}
              </div>
            )}

            {/* Bottom Info Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="flex justify-between items-end"
               >
                  <div>
                     <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Subject Identity</p>
                     <h3 className="font-bebas text-5xl text-white tracking-widest leading-none">{name}</h3>
                  </div>
                  <div className="flex flex-col items-end">
                     <div className="flex items-center gap-2 px-4 py-2 bg-violet-600/20 border border-violet-500/30 rounded-xl mb-2">
                        <ZoomIn className="w-4 h-4 text-violet-400" />
                        <span className="text-[10px] text-violet-400 font-black uppercase tracking-widest">Enhanced View</span>
                     </div>
                     <p className="text-gray-700 text-[9px] font-black uppercase tracking-widest">Authorized Transmission</p>
                  </div>
               </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AvatarPreview;

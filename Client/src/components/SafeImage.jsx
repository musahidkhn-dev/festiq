import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SafeImage = ({ 
  src, 
  alt, 
  className = "", 
  fallbackSrc = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&auto=format&fit=crop",
  priority = false 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading Skeleton / Placeholder */}
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center"
          >
            <div className="w-10 h-10 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.img
        src={hasError ? fallbackSrc : src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError) setHasError(true);
        }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0, 
          scale: isLoaded ? 1 : 1.1 
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`w-full h-full object-cover ${className}`}
      />

      {/* Cinematic Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none"></div>
    </div>
  );
};

export default SafeImage;

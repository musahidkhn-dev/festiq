import React, { useState } from 'react';
import { useUIStore } from '../store/uiStore';

const SafeAvatar = ({ src, name, className = "w-10 h-10", clickable = true }) => {
  const [error, setError] = useState(false);
  const { setPreviewData } = useUIStore();

  const getInitials = (n) => {
    if (!n) return '?';
    const names = n.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
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

  const handlePreview = (e) => {
    if (!clickable) return;
    e.stopPropagation();
    setPreviewData({ src: error ? null : src, name });
  };

  const commonClasses = `${className} rounded-full flex-shrink-0 transition-all duration-500 ${
    clickable ? 'cursor-pointer hover:scale-110 active:scale-95 hover:ring-4 hover:ring-violet-500/20' : ''
  }`;

  if (error || !src) {
    return (
      <div 
        onClick={handlePreview}
        className={`${commonClasses} flex items-center justify-center text-white font-bold text-sm bg-gradient-to-tr shadow-lg border border-white/10 ${getBackgroundColor(name)}`}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onClick={handlePreview}
      onError={() => setError(true)}
      className={`${commonClasses} object-cover border border-white/10 shadow-xl`}
    />
  );
};

export default SafeAvatar;

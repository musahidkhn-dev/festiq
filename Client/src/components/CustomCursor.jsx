import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 250 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);
  const [hoverType, setHoverType] = useState('default');

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isClickable = target.closest('button, a, .clickable, input, [role="button"]');
      const isHeading = target.closest('h1, h2');
      
      if (isClickable) {
        setIsHovering(true);
        setHoverType('clickable');
      } else if (isHeading) {
        setIsHovering(true);
        setHoverType('heading');
      } else {
        setIsHovering(false);
        setHoverType('default');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full bg-violet-500/30 border border-violet-500/50 pointer-events-none z-[9999] blur-[2px]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? (hoverType === 'heading' ? 4 : 2) : 1,
          backgroundColor: isHovering ? (hoverType === 'heading' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.4)') : 'rgba(139, 92, 246, 0.3)',
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[10000]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 0.5 : 1,
          opacity: isHovering ? 0.5 : 1,
        }}
      />
      {/* Magnetic/Glow Trail */}
      <motion.div
        className="fixed top-0 left-0 w-40 h-40 rounded-full bg-violet-600/10 pointer-events-none z-[9998] blur-[60px]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  );
}

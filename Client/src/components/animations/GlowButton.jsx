import { motion } from "framer-motion";

export default function GlowButton({ children, onClick, type = "button", className = "", variant = "primary", disabled = false }) {
  const baseStyles = "relative px-8 py-3 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 overflow-hidden group flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-[#050508] hover:text-white hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]",
    secondary: "bg-transparent border border-white/20 text-white backdrop-blur-xl hover:bg-white/10",
    danger: "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {/* Magnetic Glow Effect (Visible on Hover) */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>
      
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

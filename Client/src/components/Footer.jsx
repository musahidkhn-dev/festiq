import { Link } from "react-router-dom";
import { Sparkles, Mail, ArrowRight, Heart } from "lucide-react";
import { FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative bg-[#050508] border-t border-white/5 pt-10 md:pt-24 pb-6 md:pb-12 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 mb-10 md:mb-24">
          {/* Brand Section */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bebas text-3xl text-white tracking-widest">Festiq</span>
            </Link>
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-xs font-medium">
              Your go-to platform for discovering and booking the best events in your city.
            </p>
            <div className="flex items-center gap-4">
              {[FaTwitter, FaInstagram, FaGithub].map((Icon, i) => (
                <motion.a 
                  key={i}
                  href="#" 
                  whileHover={{ y: -4 }}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/50 transition-all"
                >
                  <Icon className="w-4.5 h-4.5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-3 md:mb-8">Explore</h4>
            <ul className="space-y-3 md:space-y-4">
              {["Events", "About", "Contact", "Pricing", "Partners"].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-500 hover:text-violet-400 transition-colors text-[13px] md:text-sm font-medium">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-3 md:mb-8">Legal</h4>
            <ul className="space-y-3 md:space-y-4">
              {["Terms of Service", "Privacy Policy", "Cookie Policy", "Security", "Support"].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-500 hover:text-violet-400 transition-colors text-[13px] md:text-sm font-medium">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 lg:col-span-1 space-y-5 md:space-y-8 mt-4 lg:mt-0">
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-3 md:mb-8">Stay Updated</h4>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 md:py-4 pl-6 pr-14 text-white placeholder-gray-600 outline-none focus:border-violet-500/50 transition-all font-medium"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 bg-white text-black rounded-xl flex items-center justify-center hover:bg-violet-500 hover:text-white transition-all shadow-lg">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-600 text-[9px] font-bold uppercase tracking-widest leading-relaxed">
              * By subscribing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 md:pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
          <p className="text-gray-600 text-[9px] font-bold uppercase tracking-widest text-center md:text-left">
            &copy; 2025 Festiq. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2 text-gray-700 text-[9px] font-bold uppercase tracking-widest">
            <span>Built with</span>
            <Heart className="w-2.5 h-2.5 text-red-500 animate-pulse fill-red-500" />
            <span>for the Vibe Tribe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

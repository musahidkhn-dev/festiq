import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Search, Menu, X, LogOut, LayoutDashboard, User as UserIcon, Bell, Sparkles, ShieldCheck } from "lucide-react";
import SafeAvatar from "./SafeAvatar";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-3 py-2 md:px-6 md:py-4`}>
      <div className={`max-w-7xl mx-auto rounded-2xl transition-all duration-500 ${
        isScrolled ? "bg-[#0A0A0F]/80 backdrop-blur-2xl border border-white/10 py-2 md:py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]" : "bg-transparent py-3 md:py-4"
      }`}>
        <div className="flex justify-between items-center px-4 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 sm:w-9 sm:h-9 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="font-bebas text-lg sm:text-2xl text-white tracking-widest group-hover:text-violet-400 transition-colors duration-300">
              Festiq
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              {["Events", "About", "Contact"].map((item) => (
                <Link 
                  key={item}
                  to={`/${item.toLowerCase()}`} 
                  className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-500 transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            <div className="h-4 w-px bg-white/10"></div>

            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/events?focus=search")} className="p-2 text-gray-400 hover:text-white transition-colors">
                <Search className="w-4.5 h-4.5" />
              </button>

              {user ? (
                <div className="flex items-center gap-4">
                  <div className="hidden lg:flex items-center gap-3">
                    <Link to="/creator/dashboard" className="flex items-center gap-1.5 text-gray-400 hover:text-white px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all border border-transparent hover:border-white/10">
                      <LayoutDashboard className="w-3 h-3" /> My Studio
                    </Link>
                    <Link to="/host-event" className="flex items-center gap-1.5 bg-violet-600/20 text-violet-400 hover:bg-violet-600 hover:text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all border border-violet-500/30 hover:border-violet-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                      <Sparkles className="w-3 h-3" /> Host Event
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                    <Link to={user.isAdmin ? "/admin" : "/auth/profile"} className="flex items-center gap-3 group">
                      <div className="text-right hidden lg:block">
                        <p className="text-white text-[10px] font-bold uppercase tracking-tighter leading-none mb-1">{user.name}</p>
                        <p className="text-violet-500 text-[8px] font-black uppercase tracking-widest leading-none">
                          {user.isAdmin ? "Admin" : "User"}
                        </p>
                      </div>
                      <SafeAvatar src={user.profilePicture} name={user.name} className="w-9 h-9" />
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-red-500/10 hover:border-red-500/30 text-gray-500 hover:text-red-400 transition-all duration-300"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
                    Log In
                  </Link>
                  <Link to="/register" className="bg-white text-black px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-all shadow-lg active:scale-95">
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 bg-[#0D0D15] border border-white/10 rounded-2xl p-4 md:hidden z-50 shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              {["Events", "About", "Contact"].map((item) => (
                <Link 
                  key={item}
                  to={`/${item.toLowerCase()}`} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white text-base font-bebas tracking-widest border-b border-white/5 pb-2"
                >
                  {item}
                </Link>
              ))}
              {!user ? (
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 border border-white/10 rounded-xl text-center font-bold text-sm">Log In</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 bg-white text-black rounded-xl text-center font-bold text-sm">Join</Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <Link to="/auth/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                      <SafeAvatar src={user.profilePicture} name={user.name} className="w-9 h-9" />
                      <div>
                        <p className="text-white font-bold text-xs">{user.name}</p>
                        <p className="text-violet-500 text-[9px] font-bold uppercase tracking-widest">{user.isAdmin ? "Admin" : "User"}</p>
                      </div>
                    </Link>
                    <button onClick={handleLogout} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl"><LogOut className="w-4.5 h-4.5" /></button>
                  </div>
                  
                  <div className="flex flex-col gap-3 mt-2">
                    {user.isAdmin && (
                      <Link 
                        to="/admin" 
                        onClick={() => setIsMobileMenuOpen(false)} 
                        className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl text-white font-black text-[9px] uppercase tracking-widest shadow-lg shadow-violet-600/20 active:scale-95"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Admin Panel
                      </Link>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Link to="/creator/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-[10px]">
                        <LayoutDashboard className="w-3.5 h-3.5" /> Studio
                      </Link>
                      <Link to="/host-event" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 py-2.5 bg-violet-600/20 border border-violet-500/30 rounded-xl text-violet-400 font-bold text-[10px]">
                        <Sparkles className="w-3.5 h-3.5" /> Host
                      </Link>
                    </div>

                    <Link to="/auth/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-[10px]">
                      <UserIcon className="w-3.5 h-3.5 text-violet-500" /> My Profile
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

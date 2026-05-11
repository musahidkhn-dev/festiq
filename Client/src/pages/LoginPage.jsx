import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, ShieldCheck, Zap, Bot, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loginUser } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "../components/LoadingScreen";
import SafeAvatar from "../components/SafeAvatar";
import PageTransition from "../components/animations/PageTransition";

export default function LoginPage() {
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { email, password } = formData;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please enter both email and password.");
    dispatch(loginUser(formData));
  };

  useEffect(() => {
    if (user) navigate(user.isAdmin ? "/admin" : "/auth/profile");
    if (isError && message) toast.error(message);
  }, [user, isError, message, navigate]);

  if (isLoading) return <LoadingScreen />;

  return (
    <PageTransition>
    <div className="bg-[#050508] min-h-screen flex items-stretch overflow-hidden selection:bg-violet-500/30 font-outfit">
      {/* Visual Side: Cinematic Immersive Panel */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden flex-col justify-between p-16">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-violet-600/10 blur-[150px] rounded-full"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, -90, 0],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-[-20%] left-[-10%] w-[900px] h-[900px] bg-blue-600/10 blur-[150px] rounded-full"
            />
            <div className="noise-overlay !absolute"></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-xl flex items-center justify-center shadow-2xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bebas text-3xl text-white tracking-widest">Festiq</span>
          </Link>
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <Zap className="w-4 h-4 text-violet-400" />
              <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Platform Live</span>
            </div>
            <h1 className="font-bebas text-5xl sm:text-7xl md:text-[8rem] leading-[0.8] text-white tracking-tighter mb-8">
              UNLEASH <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500">YOUR MOOD.</span>
            </h1>
            <p className="text-gray-500 text-xl max-w-lg leading-relaxed font-medium">
              Access the most exclusive cinematic experiences, underground festivals, and elite networking summits. Your identity is your ticket.
            </p>
          </motion.div>

          <div className="mt-16 flex items-center gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl w-fit">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <SafeAvatar key={i} src={null} name={`User ${i}`} className="w-12 h-12 border-4 border-[#050508]" />
              ))}
            </div>
            <div className="pr-4">
              <p className="text-white font-bold text-sm">Joined by 15k+ Users</p>
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Verified Community</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-8 text-gray-700 text-[10px] font-black uppercase tracking-widest">
          <span>&copy; 2025 Festiq Platform</span>
          <div className="w-1 h-1 rounded-full bg-gray-800"></div>
          <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>

      {/* Auth Side: Premium Glass Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-16 relative bg-[#0A0A10]">
        <div className="absolute inset-0 lg:hidden overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
        </div>

        {/* Mobile Navigation: Back to Home */}
        <Link 
          to="/" 
          className="absolute top-8 left-8 z-50 flex lg:hidden items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Home</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-10"
        >
          <div className="mb-4 md:mb-12">
            <h2 className="font-bebas text-2xl md:text-6xl text-white tracking-widest mb-1 md:mb-2">Login</h2>
            <p className="text-gray-500 text-xs md:text-base font-medium">Enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-8">
            <div className="space-y-2 md:space-y-6">
              <div className="space-y-1 md:space-y-2">
                <label className="text-gray-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-violet-600/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 md:left-5 w-3.5 h-3.5 md:w-5 md:h-5 text-gray-600 group-focus-within:text-violet-400 transition-colors" />
                    <input 
                      type="email" 
                      name="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="commander@moodgo.in" 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl py-2.5 md:py-5 pl-11 md:pl-14 pr-6 text-white placeholder-gray-700 outline-none focus:border-violet-500/50 transition-all font-bold text-[13px] md:text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1 md:space-y-2">
                <label className="text-gray-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-violet-600/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 md:left-5 w-3.5 h-3.5 md:w-5 md:h-5 text-gray-600 group-focus-within:text-violet-400 transition-colors" />
                    <input 
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={handleChange}
                      placeholder="••••••••••••" 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl py-2.5 md:py-5 pl-11 md:pl-14 pr-11 md:pr-14 text-white placeholder-gray-700 outline-none focus:border-violet-500/50 transition-all font-bold text-[13px] md:text-base"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 md:right-5 text-gray-600 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5 md:w-5 md:h-5" /> : <Eye className="w-3.5 h-3.5 md:w-5 md:h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-5 h-5 rounded-md border border-white/10 flex items-center justify-center group-hover:border-violet-500 transition-colors">
                  <div className="w-2 h-2 bg-violet-500 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <span className="text-gray-500 text-xs font-bold">Remember Me</span>
              </div>
              <Link to="/forgot-password" className="text-violet-500 text-xs font-black uppercase tracking-widest hover:text-violet-400 transition-colors">Forgot Password?</Link>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 md:py-5 bg-white text-black font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs rounded-xl md:rounded-2xl flex items-center justify-center gap-3 hover:bg-violet-500 hover:text-white transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] group"
            >
              Login <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          <div className="mt-6 pt-4 md:mt-12 md:pt-8 border-t border-white/5 flex flex-col items-center gap-6 md:gap-8">
            <div className="flex items-center gap-4">
              <span className="text-gray-700 text-[10px] font-black uppercase tracking-widest">Identity Verified By</span>
              <div className="flex items-center gap-2 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-help">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-white text-[10px] font-black tracking-widest">SECURE LOGIN</span>
              </div>
            </div>
            
            <p className="text-gray-500 font-bold text-sm">
              New here?{" "}
              <Link to="/register" className="text-violet-500 hover:text-violet-400 transition-colors underline underline-offset-4 decoration-2">Create Account</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
    </PageTransition>
  );
}

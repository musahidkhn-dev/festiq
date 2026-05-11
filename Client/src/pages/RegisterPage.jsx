import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, ShieldCheck, Zap, Globe, Sparkles, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "../components/LoadingScreen";
import SafeAvatar from "../components/SafeAvatar";
import PageTransition from "../components/animations/PageTransition";

export default function RegisterPage() {
  const { user, isLoading, isError, message } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { name, email, phone, password } = formData;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) return toast.error("All fields are mandatory.");
    dispatch(registerUser(formData));
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
      <div className="hidden lg:flex w-[45%] relative overflow-hidden flex-col justify-between p-16">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0">
            <motion.div 
              animate={{ scale: [1, 1.1, 1], rotate: [0, -45, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full"
            />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-violet-600/10 blur-[150px] rounded-full"
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
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Global Event Network</span>
            </div>
            <h1 className="font-bebas text-5xl sm:text-7xl md:text-[8rem] lg:text-[7rem] leading-[0.8] text-white tracking-tighter mb-8">
              JOIN THE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">PULSE.</span>
            </h1>
            <p className="text-gray-500 text-xl max-w-sm leading-relaxed font-medium">
              Create your unique identity and gain instant access to the world's most exclusive experiences.
            </p>
          </motion.div>

          <div className="mt-12 space-y-4">
            {[
              { icon: Zap, text: "Priority Seat Reservations" },
              { icon: ShieldCheck, text: "End-to-End Secure Booking" },
              { icon: Sparkles, text: "Personalized Mood Discovery" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-violet-500 transition-colors">
                  <item.icon className="w-4 h-4 text-gray-400 group-hover:text-violet-400 transition-colors" />
                </div>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-gray-700 text-[10px] font-black uppercase tracking-widest">
          <span>Explore with Festiq Ecosystem</span>
        </div>
      </div>

      {/* Auth Side: Premium Glass Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-16 relative bg-[#0A0A10]">
        <div className="absolute inset-0 lg:hidden overflow-hidden">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
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
          <div className="mb-4 md:mb-10">
            <h2 className="font-bebas text-2xl md:text-6xl text-white tracking-widest mb-1 md:mb-2">Create Account</h2>
            <p className="text-gray-500 text-xs md:text-base font-medium">Join the next generation of event goers.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6">
            <div className="space-y-2 md:space-y-4">
              <div className="space-y-1 md:space-y-2">
                <label className="text-gray-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] ml-1">Full Name</label>
                <div className="relative group">
                  <div className="relative flex items-center">
                    <User className="absolute left-4 md:left-5 w-3.5 h-3.5 md:w-5 md:h-5 text-gray-600 group-focus-within:text-violet-400 transition-colors" />
                    <input 
                      type="text" 
                      name="name"
                      value={name}
                      onChange={handleChange}
                      placeholder="Musahid Khan" 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl py-2.5 md:py-4.5 pl-11 md:pl-14 pr-6 text-white placeholder-gray-700 outline-none focus:border-violet-500/50 transition-all font-bold text-[13px] md:text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1 md:space-y-2">
                <label className="text-gray-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] ml-1">Email Address</label>
                <div className="relative group">
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 md:left-5 w-3.5 h-3.5 md:w-5 md:h-5 text-gray-600 group-focus-within:text-violet-400 transition-colors" />
                    <input 
                      type="email" 
                      name="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="commander@moodgo.in" 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl py-2.5 md:py-4.5 pl-11 md:pl-14 pr-6 text-white placeholder-gray-700 outline-none focus:border-violet-500/50 transition-all font-bold text-[13px] md:text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1 md:space-y-2">
                <label className="text-gray-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="relative flex items-center">
                    <Phone className="absolute left-4 md:left-5 w-3.5 h-3.5 md:w-5 md:h-5 text-gray-600 group-focus-within:text-violet-400 transition-colors" />
                    <input 
                      type="tel" 
                      name="phone"
                      value={phone}
                      onChange={handleChange}
                      placeholder="+91 00000 00000" 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl py-2.5 md:py-4.5 pl-11 md:pl-14 pr-6 text-white placeholder-gray-700 outline-none focus:border-violet-500/50 transition-all font-bold text-[13px] md:text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Password</label>
                <div className="relative group">
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 md:left-5 w-4 h-4 md:w-5 md:h-5 text-gray-600 group-focus-within:text-violet-400 transition-colors" />
                    <input 
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={handleChange}
                      placeholder="••••••••••••" 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4.5 pl-12 md:pl-14 pr-12 md:pr-14 text-white placeholder-gray-700 outline-none focus:border-violet-500/50 transition-all font-bold text-sm md:text-base"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 md:right-5 text-gray-600 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 md:py-5 bg-white text-black font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs rounded-xl md:rounded-2xl flex items-center justify-center gap-3 hover:bg-violet-500 hover:text-white transition-all duration-500 shadow-xl group mt-3 md:mt-4"
            >
              Create Account <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          <div className="mt-4 md:mt-10 text-center">
            <p className="text-gray-500 font-bold text-xs md:text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-violet-500 hover:text-violet-400 transition-colors underline underline-offset-4 decoration-2">Login Here</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
    </PageTransition>
  );
}

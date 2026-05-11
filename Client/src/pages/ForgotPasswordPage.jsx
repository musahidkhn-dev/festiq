import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Sparkles, ShieldCheck, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useForgotPassword } from "../hooks/queries/useAuth";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", phone: "", newPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const forgotPasswordMutation = useForgotPassword();

  const { email, phone, newPassword } = formData;
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPasswordMutation.mutate(formData, {
      onSuccess: () => {
        setTimeout(() => navigate("/login"), 2000);
      }
    });
  };

  return (
    <div className="bg-[#050508] min-h-screen flex items-center justify-center p-8 font-outfit selection:bg-violet-500/30">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back to Login */}
        <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
        </Link>

        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-xl flex items-center justify-center shadow-2xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bebas text-3xl text-white tracking-widest">Festiq</span>
          </div>
          <h2 className="font-bebas text-5xl sm:text-6xl text-white tracking-widest mb-2">Reset Password</h2>
          <p className="text-gray-500 font-medium">Verify your identity with email and phone number to reset your password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-violet-600/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center">
                <Mail className="absolute left-5 w-5 h-5 text-gray-600 group-focus-within:text-violet-400 transition-colors" />
                <input 
                  type="email" name="email" value={email} onChange={handleChange}
                  placeholder="your@email.com" 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white placeholder-gray-700 outline-none focus:border-violet-500/50 transition-all font-bold"
                />
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Phone Number</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-violet-600/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center">
                <Phone className="absolute left-5 w-5 h-5 text-gray-600 group-focus-within:text-violet-400 transition-colors" />
                <input 
                  type="text" name="phone" value={phone} onChange={handleChange}
                  placeholder="Your registered phone" 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white placeholder-gray-700 outline-none focus:border-violet-500/50 transition-all font-bold"
                />
              </div>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] ml-1">New Password</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-violet-600/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center">
                <Lock className="absolute left-5 w-5 h-5 text-gray-600 group-focus-within:text-violet-400 transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} name="newPassword" value={newPassword} onChange={handleChange}
                  placeholder="Min 6 characters" 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-14 text-white placeholder-gray-700 outline-none focus:border-violet-500/50 transition-all font-bold"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 text-gray-600 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
            <ShieldCheck className="w-5 h-5 text-violet-500 flex-shrink-0" />
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              We verify your identity by matching your email and registered phone number.
            </p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={forgotPasswordMutation.isPending}
            className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-xs rounded-2xl flex items-center justify-center gap-3 hover:bg-violet-500 hover:text-white transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] group disabled:opacity-50"
          >
            {forgotPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'} 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-gray-500 font-bold text-sm">
            Remember your password?{" "}
            <Link to="/login" className="text-violet-500 hover:text-violet-400 transition-colors underline underline-offset-4 decoration-2">Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

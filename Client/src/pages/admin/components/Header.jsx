import { Bell, Menu, Search, Command, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { useUIStore } from "../../../store/uiStore";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import SafeAvatar from "../../../components/SafeAvatar";

export default function Header() {
  const { toggleSidebar } = useUIStore();
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="h-24 sticky top-0 z-50 flex items-center px-8 md:px-10 bg-[#050508]/80 backdrop-blur-2xl border-b border-white/5">
      <div className="flex-1 flex items-center gap-10">
        <button className="lg:hidden p-3 bg-white/5 rounded-xl" onClick={toggleSidebar}>
          <Menu className="w-5 h-5 text-gray-400" />
        </button>

        <div className="hidden md:flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-2.5 w-96 group focus-within:border-violet-500/50 transition-all">
          <Search className="w-4 h-4 text-gray-600 group-focus-within:text-violet-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-600 w-full font-bold tracking-tight"
          />
          <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-md border border-white/5">
             <Command className="w-3 h-3 text-gray-600" />
             <span className="text-[10px] text-gray-600 font-bold">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">All Systems Live</span>
        </div>

        <div className="relative group cursor-pointer">
           <div className="absolute -top-1 -right-1 w-4 h-4 bg-violet-600 border-2 border-[#050508] rounded-full flex items-center justify-center text-[8px] font-bold text-white z-10 group-hover:scale-125 transition-transform">
             3
           </div>
           <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/10 transition-all">
             <Bell className="w-4.5 h-4.5 text-gray-400" />
           </div>
        </div>

        <div className="h-8 w-px bg-white/10 mx-2"></div>

        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="text-right hidden md:block">
            <p className="text-white text-[10px] font-bold uppercase tracking-widest leading-none mb-1">{user.name}</p>
            <p className="text-violet-500 text-[8px] font-black uppercase tracking-[0.2em] leading-none">System Admin</p>
          </div>
          <div className="relative">
             <SafeAvatar src={null} name={user.name} className="w-10 h-10 ring-2 ring-violet-500/20 group-hover:ring-violet-500 transition-all" />
             <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#050508] rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
}

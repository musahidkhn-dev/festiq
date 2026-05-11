import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck,
  Zap,
  Ticket,
  User as UserIcon,
  X
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../features/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import SafeAvatar from "../../../components/SafeAvatar";
import { useUIStore } from "../../../store/uiStore";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", route: "/admin", badge: "Live" },
  { icon: LayoutDashboard, label: "My Studio", route: "/creator/dashboard" },
  { icon: UserIcon, label: "Profile", route: "/admin/profile" },
  { icon: Calendar, label: "Events", route: "/admin/events" },
  { icon: ShoppingBag, label: "Orders", route: "/admin/orders" },
  { icon: Users, label: "Users", route: "/admin/users" },
  { icon: Ticket, label: "Coupons", route: "/admin/coupons" },
  { icon: Settings, label: "Settings", route: "/admin/settings" },
];

export default function Sidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  const handleLogout = () => dispatch(logoutUser());

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden custom-scrollbar pr-2">
      {/* Brand */}
      <div className="mb-16 flex-shrink-0 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
             <span className="font-bebas text-3xl text-white tracking-widest leading-none">Festiq</span>
             <span className="text-violet-500 text-[8px] font-black uppercase tracking-[0.2em] mt-1">Admin Panel</span>
          </div>
        </Link>
        <button onClick={toggleSidebar} className="lg:hidden p-2 bg-white/5 rounded-xl text-gray-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.route;
          return (
            <Link 
              key={item.label}
              to={item.route}
              onClick={() => {
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className={`group relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                isActive ? "bg-white/[0.03] border border-white/10" : "hover:bg-white/[0.02]"
              }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-violet-500" : "text-gray-600 group-hover:text-white"}`} />
              <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? "text-white" : "text-gray-500 group-hover:text-white"}`}>
                {item.label}
              </span>
              
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute left-0 w-1 h-6 bg-violet-600 rounded-r-full"
                />
              )}

              {item.badge && (
                <span className="ml-auto px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest rounded-md border border-emerald-500/20">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile Footer */}
      <div className="mt-auto pt-10 pb-4 flex-shrink-0 space-y-6">
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
          <div className="flex items-center gap-4">
            <SafeAvatar src={user?.profilePicture} name={user?.name} className="w-10 h-10 ring-2 ring-violet-500/20" />
            <div className="min-w-0">
              <p className="text-white text-[10px] font-bold uppercase tracking-widest truncate">{user?.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-violet-500" />
                <span className="text-gray-600 text-[8px] font-black uppercase tracking-widest">Administrator</span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full py-3 flex items-center justify-center gap-2 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-widest"
          >
            <LogOut className="w-3 h-3" /> Log Out
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 px-6">
           <Zap className="w-3 h-3 text-gray-700" />
           <span className="text-gray-700 text-[8px] font-black uppercase tracking-[0.3em]">Festiq Platform v2.4.0</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-80 h-screen sticky top-0 hidden lg:flex flex-col bg-[#0A0A10] border-r border-white/5 p-6 sm:p-8">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            
            {/* Mobile Menu */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] sm:w-80 bg-[#0A0A10] border-r border-white/5 p-6 sm:p-8 z-[70] lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

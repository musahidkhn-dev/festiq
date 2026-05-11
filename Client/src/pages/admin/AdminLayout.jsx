import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout() {
  const { user } = useSelector((state) => state.auth);

  if (!user || !user.isAdmin) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="bg-[#050508] min-h-screen flex font-outfit selection:bg-violet-500/30">
      {/* Noise Overlay */}
      <div className="noise-overlay"></div>
      
      {/* Static Background Ambient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-600/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full"></div>
      </div>

      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Header />
        <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";

export default function MainLayout() {
  return (
    <div className="bg-[#050508] min-h-screen flex flex-col font-outfit selection:bg-violet-500/30 overflow-x-hidden">
      {/* Global Noise Overlay */}
      <div className="noise-overlay"></div>
      
      <Navbar />
      
      <main className="flex-1 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}

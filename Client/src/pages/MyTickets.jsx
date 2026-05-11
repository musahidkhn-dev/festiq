import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, Calendar, Search, Filter, ArrowRight, Info, Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrders } from '../hooks/queries/useOrders';
import TicketCard from '../components/TicketCard';
import LoadingScreen from '../components/LoadingScreen';
import PageTransition from '../components/animations/PageTransition';

export default function MyTickets() {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const { data, isLoading, isError } = useOrders();
  const orders = data?.tickets || [];

  if (isLoading) return <LoadingScreen text='Loading your tickets...' />;

  if (isError) {
    return (
      <PageTransition>
      <div className="bg-[#050508] min-h-screen text-white flex items-center justify-center p-6 font-outfit">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-rose-500/5 border border-rose-500/10 rounded-[3rem] p-16 text-center max-w-md shadow-2xl"
        >
          <Info className="w-16 h-16 text-rose-500 mx-auto mb-8 opacity-50" />
          <h2 className="font-bebas text-5xl text-white tracking-widest mb-4">VAULT_LOCK</h2>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">Could not establish a secure connection to your asset vault. Please recalibrating your link.</p>
          <button onClick={() => window.location.reload()} className="w-full py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-white transition-all duration-500 shadow-2xl">
            Retry Connection
          </button>
        </motion.div>
      </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
    <div className="min-h-screen text-white selection:bg-violet-500/30 font-outfit">
      {/* Cinematic Header Section */}

      {/* Cinematic Header Section */}
      <section className="relative pt-44 pb-20 px-6 overflow-hidden">
        {/* Ambient Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-violet-600/5 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-md">
               <Zap className="w-4 h-4 text-violet-400" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Encrypted Asset Vault</span>
            </div>
            <h1 className="font-bebas text-7xl md:text-[8rem] text-white tracking-tighter leading-none">
              YOUR <span className="text-violet-500">EXPERIENCES.</span>
            </h1>
            <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed font-medium">
              Your confirmed tickets for all upcoming events.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Vault Content */}
      <main className="max-w-7xl mx-auto px-6 pb-40 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16">
          <div className="flex items-center gap-6 px-8 py-5 bg-white/[0.02] border border-white/5 rounded-[2rem] w-full md:w-fit group">
            <Ticket className="w-5 h-5 text-violet-500 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
               <span className="text-white font-black text-[10px] tracking-widest uppercase leading-none">
                 {orders.length} ACTIVE {orders.length === 1 ? 'TICKET' : 'TICKETS'}
               </span>
               <span className="text-gray-700 text-[8px] font-black tracking-widest uppercase mt-1">Status: Operational</span>
            </div>
          </div>
          
          <Link to="/events" className="flex items-center gap-3 text-[10px] font-black text-violet-400 hover:text-white transition-all uppercase tracking-[0.3em] group bg-white/5 px-8 py-5 rounded-2xl border border-white/5 hover:bg-violet-600 hover:border-violet-500 hover:shadow-2xl hover:shadow-violet-600/20">
            Expand Discovery <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <motion.div 
          layout
          className="space-y-12"
        >
          <AnimatePresence mode="popLayout">
            {orders.length > 0 ? (
              orders.map((order, i) => (
                <motion.div 
                  key={order._id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <TicketCard order={order} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#12121A] border border-white/5 rounded-[4rem] p-24 text-center border-dashed border-white/10 shadow-2xl"
              >
                <div className="w-32 h-32 bg-white/5 rounded-[3rem] flex items-center justify-center mx-auto mb-10 border border-white/5">
                  <Sparkles className="w-12 h-12 text-gray-800" />
                </div>
                <h3 className="font-bebas text-6xl tracking-widest text-white mb-6 uppercase">Vault Empty</h3>
                <p className="text-gray-600 text-xl max-w-sm mx-auto mb-12 leading-relaxed font-medium">
                  You haven't booked any events yet. Head to Events to find something amazing.
                </p>
                <Link to="/events" className="bg-white text-black px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] inline-block transition-all hover:bg-violet-600 hover:text-white hover:scale-105 active:scale-95 shadow-2xl">
                  Initiate Discovery
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

    </div>
    </PageTransition>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAdminOrders, useUpdateOrderStatus, useDeleteOrder } from "../../hooks/queries/useAdmin";
import LoadingScreen from "../../components/LoadingScreen";
import { Search, Filter, ShoppingBag, Calendar, User, IndianRupee, MoreHorizontal, CheckCircle2, XCircle, Trash2, Eye, X, ChevronLeft, ChevronRight, AlertTriangle, ShieldCheck, Zap, Info, ArrowUpRight, History, Activity, CreditCard, Ticket, Clock, Tag } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, oid: null });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, isError } = useAdminOrders({ page, limit: 10, search: debouncedSearch });
  const orders = data?.orders || [];
  const pagination = data?.pagination || {};

  const updateStatusMutation = useUpdateOrderStatus();
  const deleteOrderMutation = useDeleteOrder();

  const handleStatusUpdate = (oid, status) => {
    updateStatusMutation.mutate({ oid, orderData: { status } });
  };

  if (isLoading && !data) return <LoadingScreen />;

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 text-violet-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
             <CreditCard className="w-3 h-3" /> Transaction Ledger
          </div>
          <h1 className="font-bebas text-6xl md:text-8xl text-white tracking-widest leading-none">ORDER <span className="text-violet-500">HISTORY</span></h1>
          <p className="text-gray-500 font-medium mt-2">Monitor financial flow, manage ticket status, and oversee platform bookings.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
           <div className="relative group w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-violet-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search by event or buyer..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#12121A] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-xs text-white placeholder-gray-700 outline-none focus:border-violet-500/50 transition-all shadow-2xl"
              />
           </div>
           <div className="flex items-center gap-3 bg-white/5 border border-white/5 p-1.5 rounded-2xl">
              <button className="px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-violet-600 hover:text-white transition-all duration-500">Download Ledger</button>
           </div>
        </div>
      </div>

      {/* Stats Mini Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Bookings", val: pagination.totalOrders || 0, icon: ShoppingBag, color: "violet" },
          { label: "Net Revenue", val: "₹1.8M", icon: IndianRupee, color: "emerald" },
          { label: "Tickets Issued", val: "2.4K", icon: Ticket, color: "blue" },
          { label: "System Load", val: "Stable", icon: Zap, color: "amber" },
        ].map((s, i) => (
          <motion.div 
            key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-[#0A0A0F] border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-6 group hover:border-violet-500/20 transition-all"
          >
             <div className={`w-14 h-14 rounded-2xl bg-${s.color}-500/10 flex items-center justify-center border border-${s.color}-500/20 group-hover:scale-110 transition-transform`}>
                <s.icon className={`w-6 h-6 text-${s.color}-500`} />
             </div>
             <div>
               <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-1">{s.label}</p>
               <p className="text-3xl font-bebas text-white tracking-wider">{s.val}</p>
             </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop View: Optimized Sticky Table */}
      <div className="hidden lg:block bg-[#0A0A0F] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead className="sticky top-0 z-20 bg-[#0A0A0F] shadow-xl">
              <tr className="border-b border-white/5">
                <th className="pl-10 pr-6 py-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Transaction</th>
                <th className="px-6 py-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Experience</th>
                <th className="px-6 py-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Buyer Details</th>
                <th className="px-6 py-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Financials</th>
                <th className="px-6 py-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Status</th>
                <th className="sticky right-0 bg-[#0A0A0F] px-10 py-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] text-center border-l border-white/5 shadow-[-10px_0_20px_rgba(0,0,0,0.5)]">Control Hub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="pl-10 pr-6 py-6">
                    <div className="space-y-1">
                       <p className="text-white font-bold text-[10px] tracking-widest uppercase">ID: {o._id.slice(-8)}</p>
                       <p className="text-gray-600 text-[8px] font-black tracking-widest uppercase">{new Date(o.createdAt).toLocaleString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white/5 group-hover:ring-violet-500 transition-all flex-shrink-0">
                          <img src={o.event?.eventImage} alt={o.event?.title} className="w-full h-full object-cover" />
                       </div>
                       <div className="min-w-0">
                          <p className="text-white font-bold text-[11px] truncate group-hover:text-violet-400 transition-colors">{o.event?.title || "DELETED EVENT"}</p>
                          <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest">{o.event?.category || "N/A"}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bebas text-gray-500">{o.user?.name?.[0] || "?"}</div>
                       <div>
                          <p className="text-white font-bold text-[10px] uppercase">{o.user?.name || "Deleted User"}</p>
                          <p className="text-gray-600 text-[8px] font-medium truncate max-w-[150px]">{o.user?.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-1">
                       <p className="text-emerald-400 font-bebas text-xl tracking-wider">₹{(o.billedAmount || 0).toLocaleString()}</p>
                       <div className="flex items-center gap-2">
                          <Tag className="w-3 h-3 text-gray-700" />
                          <span className="text-gray-700 text-[8px] font-black uppercase tracking-widest">{o.seats} Tickets</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                     <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border inline-block ${
                        o.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        o.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                     }`}>
                        {o.status}
                     </span>
                  </td>
                  <td className="sticky right-0 bg-[#0A0A0F] px-10 py-6 border-l border-white/5 shadow-[-10px_0_20px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center justify-center gap-2">
                       <button 
                         onClick={() => setSelectedOrder(o)}
                         className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                         title="Detailed Audit"
                       >
                         <Eye className="w-4 h-4" />
                       </button>
                       {o.status !== 'confirmed' && (
                         <button 
                           onClick={() => handleStatusUpdate(o._id, 'confirmed')}
                           className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-lg hover:shadow-emerald-500/20"
                           title="Confirm Order"
                         >
                           <CheckCircle2 className="w-4 h-4" />
                         </button>
                       )}
                       {o.status !== 'cancelled' && (
                         <button 
                           onClick={() => handleStatusUpdate(o._id, 'cancelled')}
                           className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg hover:shadow-rose-500/20"
                           title="Cancel Order"
                         >
                           <XCircle className="w-4 h-4" />
                         </button>
                       )}
                       <button 
                         onClick={() => setDeleteModal({ isOpen: true, oid: o._id })}
                         className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                         title="Purge Record"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View: Responsive Stacking Cards */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
         {orders.map((o) => (
           <motion.div 
             key={o._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
             className="bg-[#0A0A0F] border border-white/5 rounded-[2.5rem] p-6 space-y-6 overflow-hidden relative shadow-2xl"
           >
              <div className="flex items-start justify-between">
                 <div className="space-y-1">
                    <p className="text-gray-500 text-[8px] font-black uppercase tracking-[0.2em]">Transaction Protocol</p>
                    <p className="text-white font-bold text-xs uppercase">ID: {o._id.slice(-12)}</p>
                 </div>
                 <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                    o.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' : 
                    o.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border-rose-500/10' : 
                    'bg-amber-500/10 text-amber-400 border-amber-500/10'
                 }`}>
                    {o.status}
                 </span>
              </div>

              <div className="flex items-center gap-5 p-4 bg-white/[0.02] rounded-3xl border border-white/5">
                 <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/5 flex-shrink-0">
                    <img src={o.event?.eventImage} alt={o.event?.title} className="w-full h-full object-cover" />
                 </div>
                 <div className="min-w-0">
                    <p className="text-white font-bold text-xs truncate mb-1">{o.event?.title || "DELETED EVENT"}</p>
                    <div className="flex items-center gap-2">
                       <User className="w-3 h-3 text-gray-700" />
                       <p className="text-gray-600 text-[9px] font-bold uppercase truncate">{o.user?.name || "Deleted User"}</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 border-dashed">
                 <div>
                    <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest mb-1">Final Amount</p>
                    <p className="text-emerald-400 font-bebas text-2xl tracking-widest">₹{(o.billedAmount || 0).toLocaleString()}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest mb-1">Transaction Date</p>
                    <p className="text-white text-xs font-bold">{new Date(o.createdAt).toLocaleDateString()}</p>
                 </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                 <button onClick={() => setSelectedOrder(o)} className="flex items-center gap-2 text-violet-500 text-[10px] font-black uppercase tracking-widest">
                    <Eye className="w-4 h-4" /> Full Audit
                 </button>
                 <div className="flex gap-2">
                    {o.status !== 'confirmed' && <button onClick={() => handleStatusUpdate(o._id, 'confirmed')} className="p-3 bg-emerald-500/10 border border-emerald-500/10 rounded-xl text-emerald-500"><CheckCircle2 className="w-4 h-4" /></button>}
                    {o.status !== 'cancelled' && <button onClick={() => handleStatusUpdate(o._id, 'cancelled')} className="p-3 bg-rose-500/10 border border-rose-500/10 rounded-xl text-rose-500"><XCircle className="w-4 h-4" /></button>}
                    <button onClick={() => setDeleteModal({ isOpen: true, oid: o._id })} className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-500"><Trash2 className="w-4 h-4" /></button>
                 </div>
              </div>
           </motion.div>
         ))}
      </div>

      {/* Pagination Protocol */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-10 py-8 bg-[#0A0A0F] border border-white/5 rounded-[2.5rem]">
         <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
            Showing <span className="text-white">{(page - 1) * 10 + 1}-{Math.min(page * 10, pagination.totalOrders)}</span> of <span className="text-violet-500">{pagination.totalOrders}</span> Global Transactions
         </div>
         <div className="flex items-center gap-4">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/5 rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
            >
               <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
               {[...Array(pagination.totalPages || 0)].map((_, i) => {
                 const pNum = i + 1;
                 if (pagination.totalPages > 5) {
                    if (pNum !== 1 && pNum !== pagination.totalPages && Math.abs(pNum - page) > 1) {
                       if (Math.abs(pNum - page) === 2) return <span key={i} className="text-gray-700">...</span>;
                       return null;
                    }
                 }
                 return (
                    <button key={i} onClick={() => setPage(pNum)} className={`w-12 h-12 flex items-center justify-center rounded-xl text-[10px] font-black transition-all ${page === pNum ? 'bg-violet-600 text-white shadow-xl shadow-violet-600/20' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>
                       {pNum}
                    </button>
                 );
               })}
            </div>
            <button 
              disabled={page === pagination.totalPages}
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/5 rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
            >
               <ChevronRight className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* Audit Drawer Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-end p-0 sm:p-6 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl h-full sm:h-[90vh] bg-[#0A0A0F] border-l border-white/10 shadow-2xl flex flex-col"
            >
               <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                  <div>
                    <h3 className="text-white font-bebas text-4xl tracking-widest leading-none">Financial <span className="text-violet-500">Audit</span></h3>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Order Ref: {selectedOrder._id}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-4 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all"><X className="w-5 h-5" /></button>
               </div>

               <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                  {/* Status Bar */}
                  <div className={`p-8 rounded-[2.5rem] border flex items-center justify-between ${
                     selectedOrder.status === 'confirmed' ? 'bg-emerald-500/5 border-emerald-500/10' : 
                     selectedOrder.status === 'cancelled' ? 'bg-rose-500/5 border-rose-500/10' : 
                     'bg-amber-500/5 border-amber-500/10'
                  }`}>
                     <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                           selectedOrder.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 
                           selectedOrder.status === 'cancelled' ? 'bg-rose-500/10 text-rose-500' : 
                           'bg-amber-500/10 text-amber-500'
                        }`}>
                           {selectedOrder.status === 'confirmed' ? <ShieldCheck className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                        </div>
                        <div>
                           <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-1">Current Protocol</p>
                           <p className="text-white font-bebas text-3xl tracking-widest uppercase">{selectedOrder.status}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-1">Time Recieved</p>
                        <p className="text-white text-xs font-bold">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                     </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-8">
                        <p className="text-violet-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><CreditCard className="w-3 h-3" /> Ledger Summary</p>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center py-2 border-b border-white/5">
                              <p className="text-gray-500 text-[9px] font-black uppercase">Gross Amount</p>
                              <p className="text-white font-bebas text-xl">₹{(selectedOrder.totalPrice || 0).toLocaleString()}</p>
                           </div>
                           <div className="flex justify-between items-center py-2 border-b border-white/5">
                              <p className="text-gray-500 text-[9px] font-black uppercase">Coupon Discount</p>
                              <p className="text-rose-500 font-bebas text-xl">-₹{(selectedOrder.discountAmount || 0).toLocaleString()}</p>
                           </div>
                           <div className="flex justify-between items-center py-4">
                              <p className="text-emerald-500 text-[9px] font-black uppercase">Net Billed</p>
                              <p className="text-emerald-400 font-bebas text-3xl">₹{(selectedOrder.billedAmount || 0).toLocaleString()}</p>
                           </div>
                        </div>
                     </div>

                     <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-8">
                        <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Zap className="w-3 h-3" /> Distribution</p>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center py-2 border-b border-white/5">
                              <p className="text-gray-500 text-[9px] font-black uppercase">Creator Payout</p>
                              <p className="text-white font-bebas text-xl">₹{(selectedOrder.creatorEarning || 0).toLocaleString()}</p>
                           </div>
                           <div className="flex justify-between items-center py-2 border-b border-white/5">
                              <p className="text-gray-500 text-[9px] font-black uppercase">Platform Fee</p>
                              <p className="text-blue-400 font-bebas text-xl">₹{(selectedOrder.adminEarning || 0).toLocaleString()}</p>
                           </div>
                           <div className="flex justify-between items-center py-4">
                              <p className="text-gray-500 text-[9px] font-black uppercase">Tickets Issued</p>
                              <p className="text-white font-bebas text-3xl">{selectedOrder.seats} SEATS</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Entities Involved */}
                  <div className="space-y-6">
                     <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Stakeholder Hub</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-5 p-6 bg-[#12121A] border border-white/5 rounded-3xl">
                           <div className="w-12 h-12 rounded-xl bg-violet-600/10 flex items-center justify-center text-violet-500 font-bebas text-2xl">{selectedOrder.user?.name?.[0] || "?"}</div>
                           <div>
                              <p className="text-gray-500 text-[8px] font-black uppercase tracking-widest mb-0.5">Purchaser</p>
                              <p className="text-white font-bold text-xs uppercase">{selectedOrder.user?.name || "Deleted User"}</p>
                              <p className="text-gray-600 text-[9px] truncate">{selectedOrder.user?.email}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-5 p-6 bg-[#12121A] border border-white/5 rounded-3xl">
                           <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/5">
                              <img src={selectedOrder.event?.eventImage} className="w-full h-full object-cover" />
                           </div>
                           <div>
                              <p className="text-gray-500 text-[8px] font-black uppercase tracking-widest mb-0.5">Experience</p>
                              <p className="text-white font-bold text-xs uppercase truncate max-w-[120px]">{selectedOrder.event?.title || "Deleted Event"}</p>
                              <p className="text-gray-600 text-[9px] uppercase tracking-widest">{selectedOrder.event?.category}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Drawer Actions */}
               <div className="p-8 border-t border-white/5 bg-white/[0.01] grid grid-cols-2 gap-4">
                  {selectedOrder.status === 'pending' ? (
                     <>
                        <button onClick={() => handleStatusUpdate(selectedOrder._id, 'confirmed')} className="py-5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-emerald-600/20">Confirm Transfer</button>
                        <button onClick={() => handleStatusUpdate(selectedOrder._id, 'cancelled')} className="py-5 bg-white/5 border border-white/5 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]">Void Order</button>
                     </>
                  ) : (
                     <>
                        <button onClick={() => setSelectedOrder(null)} className="py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]">Close Audit</button>
                        <button onClick={() => setDeleteModal({ isOpen: true, oid: selectedOrder._id })} className="py-5 bg-rose-600/10 border border-rose-500/20 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]">Purge Record</button>
                     </>
                  )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0F0F16] border border-white/10 rounded-[3rem] p-12 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>
              <div className="text-center space-y-10">
                <div className="w-24 h-24 bg-rose-500/10 rounded-[2rem] flex items-center justify-center mx-auto border border-rose-500/20 shadow-2xl shadow-rose-500/10">
                  <AlertTriangle className="w-12 h-12 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-bebas text-6xl text-white tracking-widest mb-4 leading-none">PURGE <br/><span className="text-rose-500">TRANSACTION?</span></h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed">This operation is irreversible. The financial record of this order will be permanently removed from the ledger.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setDeleteModal({ isOpen: false, oid: null })} className="py-5 rounded-2xl bg-white/5 border border-white/5 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Abort</button>
                  <button onClick={() => { deleteOrderMutation.mutate(deleteModal.oid, { onSuccess: () => setDeleteModal({ isOpen: false, oid: null }) }); }}
                    className="py-5 rounded-2xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-rose-600/30 hover:bg-rose-700 transition-all"
                  >Confirm Purge</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

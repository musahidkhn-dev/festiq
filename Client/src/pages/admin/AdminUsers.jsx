import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAdminUsers, useUpdateUser, useDeleteUser, useAdminUserDetails } from "../../hooks/queries/useAdmin";
import LoadingScreen from "../../components/LoadingScreen";
import SafeAvatar from "../../components/SafeAvatar";
import { Search, Filter, Mail, Shield, Wallet, Calendar, MoreHorizontal, UserCheck, UserMinus, Trash2, Edit3, X, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, ShieldCheck, Zap, Info, ArrowUpRight, History, Activity, Eye, ShoppingBag, Star, TrendingUp, Ticket, MapPin, Clock } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, uid: null });
  const [creditModal, setCreditModal] = useState({ isOpen: false, uid: null, amount: 0 });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, isError } = useAdminUsers({ page, limit: 10, search: debouncedSearch });
  const users = data?.users || [];
  const pagination = data?.pagination || {};

  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handleToggleActive = (uid, currentStatus) => {
    updateUserMutation.mutate({ uid, userData: { isActive: !currentStatus } });
  };

  const handleUpdateCredits = () => {
    if (creditModal.amount === 0) return toast.error("Amount cannot be zero");
    updateUserMutation.mutate({ 
      uid: creditModal.uid, 
      userData: { credits: creditModal.amount } 
    }, {
      onSuccess: () => setCreditModal({ isOpen: false, uid: null, amount: 0 })
    });
  };

  if (isLoading && !data) return <LoadingScreen />;

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
             <ShieldCheck className="w-3 h-3" /> Security Protocol
          </div>
          <h1 className="font-bebas text-6xl md:text-8xl text-white tracking-widest leading-none">USER <span className="text-emerald-500">DIRECTORY</span></h1>
          <p className="text-gray-500 font-medium mt-2">Manage permissions, oversee wallets, and monitor platform community.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
           <div className="relative group w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#12121A] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-xs text-white placeholder-gray-700 outline-none focus:border-emerald-500/50 transition-all shadow-2xl"
              />
           </div>
           <div className="flex items-center gap-3 bg-white/5 border border-white/5 p-1.5 rounded-2xl">
              <button className="px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all duration-500">Export Records</button>
           </div>
        </div>
      </div>

      {/* Stats Mini Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Community", val: pagination.totalUsers || 0, icon: UserCheck, color: "emerald" },
          { label: "Platform Staff", val: "12", icon: Shield, color: "blue" },
          { label: "Global Credits", val: "₹4.2M", icon: Wallet, color: "amber" },
          { label: "New Joiners", val: "+24", icon: Zap, color: "rose" },
        ].map((s, i) => (
          <motion.div 
            key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-[#0A0A0F] border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-6 group hover:border-emerald-500/20 transition-all"
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
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="sticky top-0 z-20 bg-[#0A0A0F] shadow-xl">
              <tr className="border-b border-white/5">
                <th className="pl-10 pr-6 py-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Identity</th>
                <th className="px-6 py-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Role & Auth</th>
                <th className="px-6 py-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Wallet Status</th>
                <th className="px-6 py-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Engagement</th>
                <th className="sticky right-0 bg-[#0A0A0F] px-10 py-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] text-center border-l border-white/5 shadow-[-10px_0_20px_rgba(0,0,0,0.5)]">Control Hub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="pl-10 pr-6 py-6">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 rounded-2xl overflow-hidden ring-4 ring-white/5 group-hover:ring-emerald-500 transition-all shadow-2xl flex-shrink-0">
                          <SafeAvatar src={u.profilePicture} name={u.name} className="w-full h-full" />
                       </div>
                       <div className="min-w-0">
                          <p className="text-white font-bold text-sm mb-0.5 truncate group-hover:text-emerald-400 transition-colors">{u.name}</p>
                          <p className="text-gray-600 text-[10px] font-medium truncate">{u.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                     <div className="space-y-2">
                        <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border inline-flex items-center gap-2 ${
                           u.isAdmin ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                           u.isCreator ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                           'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                           <Shield className="w-3 h-3" /> {u.isAdmin ? 'Admin' : u.isCreator ? 'Creator' : 'Member'}
                        </div>
                        <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-gray-500'}`}></div>
                           <span className="text-gray-500 text-[8px] font-black uppercase tracking-widest">{u.isActive ? 'Active' : 'Suspended'}</span>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-1">
                       <p className="text-amber-400 font-bebas text-xl tracking-wider">₹{(u.credits || 0).toLocaleString()}</p>
                       <p className="text-gray-700 text-[8px] font-black uppercase tracking-widest flex items-center gap-1"><Wallet className="w-2 h-2" /> Balance</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                     <div className="space-y-1">
                        <p className="text-white font-black text-[10px] uppercase tracking-widest">Joined {new Date(u.createdAt).toLocaleDateString()}</p>
                        <p className="text-gray-600 text-[8px] font-bold uppercase tracking-widest">Protocol Date</p>
                     </div>
                  </td>
                  <td className="sticky right-0 bg-[#0A0A0F] px-10 py-6 border-l border-white/5 shadow-[-10px_0_20px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center justify-center gap-2">
                       <button 
                         onClick={() => setSelectedUserId(u._id)}
                         className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                         title="Intelligence Audit"
                       >
                         <Eye className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => setCreditModal({ isOpen: true, uid: u._id, amount: 0 })}
                         className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 hover:bg-amber-500 hover:text-white transition-all shadow-lg hover:shadow-amber-500/20"
                         title="Adjust Credits"
                       >
                         <Wallet className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => handleToggleActive(u._id, u.isActive)}
                         className={`p-3 border rounded-xl transition-all shadow-lg ${
                            u.isActive 
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white hover:shadow-rose-500/20' 
                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white hover:shadow-emerald-500/20'
                         }`}
                         title={u.isActive ? "Suspend Access" : "Restore Access"}
                       >
                         {u.isActive ? <UserMinus className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                       </button>
                       <button 
                         onClick={() => setDeleteModal({ isOpen: true, uid: u._id })}
                         className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                         title="Permanent Purge"
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
         {users.map((u) => (
           <motion.div 
             key={u._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
             className="bg-[#0A0A0F] border border-white/5 rounded-[2.5rem] p-6 space-y-6 overflow-hidden relative shadow-2xl"
           >
              <div className="flex items-start gap-5">
                 <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-white/5 flex-shrink-0">
                    <SafeAvatar src={u.profilePicture} name={u.name} className="w-full h-full" />
                 </div>
                 <div className="flex-1 overflow-hidden">
                    <h3 className="text-white font-bold text-base truncate mb-1">{u.name}</h3>
                    <p className="text-gray-600 text-[10px] truncate mb-3">{u.email}</p>
                    <div className="flex flex-wrap gap-2">
                       <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                          u.isAdmin ? 'bg-rose-500/10 text-rose-400 border-rose-500/10' : 
                          u.isCreator ? 'bg-blue-500/10 text-blue-400 border-blue-500/10' : 
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/10'
                       }`}>{u.isAdmin ? 'Admin' : u.isCreator ? 'Creator' : 'Member'}</span>
                       <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                          u.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' : 'bg-gray-500/10 text-gray-500 border-gray-500/10'
                       }`}>{u.isActive ? 'Active' : 'Suspended'}</span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 border-dashed">
                 <div>
                    <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest mb-1">Wallet Balance</p>
                    <p className="text-amber-400 font-bebas text-2xl tracking-widest">₹{(u.credits || 0).toLocaleString()}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest mb-1">Joining Date</p>
                    <p className="text-white text-xs font-bold">{new Date(u.createdAt).toLocaleDateString()}</p>
                 </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                 <button onClick={() => setSelectedUserId(u._id)} className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                    <Eye className="w-4 h-4" /> Full Audit
                 </button>
                 <div className="flex gap-2">
                    <button onClick={() => setCreditModal({ isOpen: true, uid: u._id, amount: 0 })} className="p-3 bg-amber-500/10 border border-amber-500/10 rounded-xl text-amber-500"><Wallet className="w-4 h-4" /></button>
                    <button onClick={() => handleToggleActive(u._id, u.isActive)} className={`p-3 border rounded-xl ${u.isActive ? 'bg-rose-500/10 border-rose-500/10 text-rose-500' : 'bg-emerald-500/10 border-emerald-500/10 text-emerald-500'}`}>
                       {u.isActive ? <UserMinus className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                 </div>
              </div>
           </motion.div>
         ))}
      </div>

      {/* Pagination Protocol */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-10 py-8 bg-[#0A0A0F] border border-white/5 rounded-[2.5rem]">
         <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
            Showing <span className="text-white">{(page - 1) * 10 + 1}-{Math.min(page * 10, pagination.totalUsers)}</span> of <span className="text-emerald-500">{pagination.totalUsers}</span> Community Members
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
                    <button key={i} onClick={() => setPage(pNum)} className={`w-12 h-12 flex items-center justify-center rounded-xl text-[10px] font-black transition-all ${page === pNum ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>
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

      {/* Credit Adjustment Modal */}
      <AnimatePresence>
        {creditModal.isOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0F0F16] border border-white/10 rounded-[3rem] p-12 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
              <div className="text-center space-y-10">
                <div className="w-24 h-24 bg-amber-500/10 rounded-[2rem] flex items-center justify-center mx-auto border border-amber-500/20 shadow-2xl shadow-amber-500/10">
                  <Wallet className="w-12 h-12 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-bebas text-5xl text-white tracking-widest mb-4">ADJUST <span className="text-amber-500">CREDITS</span></h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed">Enter the amount to adjust in the user's wallet. Positive for addition, negative for deduction.</p>
                </div>
                <div className="space-y-4">
                   <input 
                     type="number" 
                     placeholder="Amount (e.g. 500 or -500)" 
                     onChange={(e) => setCreditModal(prev => ({ ...prev, amount: e.target.value }))}
                     className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-5 px-6 text-center text-white font-bebas text-3xl outline-none focus:border-amber-500 transition-all"
                   />
                   <div className="grid grid-cols-2 gap-4">
                     <button onClick={() => setCreditModal({ isOpen: false, uid: null, amount: 0 })} className="py-5 rounded-2xl bg-white/5 border border-white/5 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Abort</button>
                     <button onClick={handleUpdateCredits} className="py-5 rounded-2xl bg-amber-600 text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-amber-600/30 hover:bg-amber-700 transition-all">Apply Change</button>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Intelligence Audit Drawer */}
      <IntelligenceDrawer 
        uid={selectedUserId} 
        onClose={() => setSelectedUserId(null)} 
        onToggleActive={handleToggleActive}
        onDelete={() => setDeleteModal({ isOpen: true, uid: selectedUserId })}
      />

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
                  <h3 className="font-bebas text-6xl text-white tracking-widest mb-4 leading-none">TERMINATE <br/><span className="text-rose-500">IDENTITY?</span></h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed">This operation is irreversible. All records, bookings, and credits for this user will be permanently purged from the system.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setDeleteModal({ isOpen: false, uid: null })} className="py-5 rounded-2xl bg-white/5 border border-white/5 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Abort</button>
                  <button onClick={() => { deleteUserMutation.mutate(deleteModal.uid, { onSuccess: () => setDeleteModal({ isOpen: false, uid: null }) }); }}
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

function IntelligenceDrawer({ uid, onClose, onToggleActive, onDelete }) {
  const { data: details, isLoading } = useAdminUserDetails(uid);
  const [activeTab, setActiveTab] = useState("overview");

  const user = details?.user;
  const hostedEvents = details?.hostedEvents || [];
  const bookings = details?.bookings || [];
  const reviews = details?.reviews || [];
  const stats = details?.creatorStats || {};

  return (
    <AnimatePresence>
      {uid && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-end p-0 sm:p-6 overflow-hidden">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-4xl h-full sm:h-[95vh] bg-[#0A0A0F] border-l border-white/10 shadow-2xl flex flex-col overflow-hidden sm:rounded-l-[3rem]"
          >
             {/* Drawer Header */}
             <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-emerald-500/20">
                      <SafeAvatar src={user?.profilePicture} name={user?.name} className="w-full h-full" />
                   </div>
                   <div>
                      <h3 className="text-white font-bebas text-4xl tracking-widest leading-none">{user?.name || "Loading Intelligence..."}</h3>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Platform ID: {uid}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="hidden md:flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
                      {["overview", "events", "bookings", "reviews"].map((t) => (
                         <button 
                           key={t} onClick={() => setActiveTab(t)}
                           className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-black shadow-xl' : 'text-gray-500 hover:text-white'}`}
                         >
                            {t}
                         </button>
                      ))}
                   </div>
                   <button onClick={onClose} className="p-4 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all"><X className="w-5 h-5" /></button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-6">
                     <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                     <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Decrypting User Intelligence</p>
                  </div>
                ) : (
                  <div className="p-8 space-y-12 pb-32">
                    {activeTab === "overview" && (
                      <div className="space-y-12">
                         {/* Stats Grid */}
                         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                               { label: "Wallet Balance", val: `₹${(user?.credits || 0).toLocaleString()}`, icon: Wallet, color: "amber" },
                               { label: "Total Bookings", val: bookings.length, icon: ShoppingBag, color: "violet" },
                               { label: "Revenue Earned", val: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: "emerald" },
                               { label: "Events Hosted", val: hostedEvents.length, icon: Calendar, color: "blue" },
                            ].map((s, i) => (
                               <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4 group hover:border-white/10 transition-all">
                                  <div className={`w-10 h-10 rounded-xl bg-${s.color}-500/10 flex items-center justify-center text-${s.color}-500`}><s.icon className="w-5 h-5" /></div>
                                  <div>
                                     <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest">{s.label}</p>
                                     <p className="text-2xl font-bebas text-white tracking-widest">{s.val}</p>
                                  </div>
                               </div>
                            ))}
                         </div>

                         {/* User Bio/Details Card */}
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="space-y-6">
                               <h4 className="text-white font-bebas text-2xl tracking-widest flex items-center gap-2"><Info className="w-5 h-5 text-emerald-500" /> Identity Profile</h4>
                               <div className="bg-[#12121A] border border-white/5 rounded-[2rem] p-8 space-y-6">
                                  <div className="flex justify-between items-center py-4 border-b border-white/5">
                                     <p className="text-gray-500 text-[9px] font-black uppercase">Authentication Role</p>
                                     <p className="text-white text-[10px] font-bold uppercase">{user?.isAdmin ? "Admin" : user?.isCreator ? "Creator" : "Member"}</p>
                                  </div>
                                  <div className="flex justify-between items-center py-4 border-b border-white/5">
                                     <p className="text-gray-500 text-[9px] font-black uppercase">Primary Contact</p>
                                     <p className="text-emerald-500 text-[10px] font-bold">{user?.email}</p>
                                  </div>
                                  <div className="flex justify-between items-center py-4">
                                     <p className="text-gray-500 text-[9px] font-black uppercase">Protocol Date</p>
                                     <p className="text-white text-[10px] font-bold">{new Date(user?.createdAt).toLocaleDateString()}</p>
                                  </div>
                               </div>
                            </div>
                            <div className="space-y-6">
                               <h4 className="text-white font-bebas text-2xl tracking-widest flex items-center gap-2"><Activity className="w-5 h-5 text-blue-500" /> Platform Engagement</h4>
                               <div className="bg-[#12121A] border border-white/5 rounded-[2rem] p-8 space-y-6">
                                  <div className="flex justify-between items-center py-4 border-b border-white/5">
                                     <p className="text-gray-500 text-[9px] font-black uppercase">Latest Review</p>
                                     <p className="text-white text-[10px] font-bold uppercase">{reviews[0]?.event?.title?.slice(0, 20) || "None"}</p>
                                  </div>
                                  <div className="flex justify-between items-center py-4 border-b border-white/5">
                                     <p className="text-gray-500 text-[9px] font-black uppercase">Last Booking</p>
                                     <p className="text-white text-[10px] font-bold uppercase">{bookings[0]?.event?.title?.slice(0, 20) || "None"}</p>
                                  </div>
                                  <div className="flex justify-between items-center py-4">
                                     <p className="text-gray-500 text-[9px] font-black uppercase">Active Tickets</p>
                                     <p className="text-white text-[10px] font-bold uppercase">{bookings.filter(b => b.status === 'confirmed').length} Active</p>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                    )}

                    {activeTab === "events" && (
                      <div className="space-y-8">
                         <div className="flex items-center justify-between">
                            <h4 className="text-white font-bebas text-3xl tracking-widest flex items-center gap-3">Hosted <span className="text-blue-500">Experiences</span></h4>
                            <span className="bg-blue-500/10 text-blue-500 border border-blue-500/10 px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{hostedEvents.length} Total</span>
                         </div>
                         {hostedEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               {hostedEvents.map((ev) => (
                                  <div key={ev._id} className="bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden group hover:border-blue-500/20 transition-all flex flex-col">
                                     <div className="h-40 overflow-hidden relative">
                                        <img src={ev.eventImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                                           <p className="text-emerald-500 font-bebas text-xl tracking-widest">₹{ev.ticketPrice}</p>
                                        </div>
                                     </div>
                                     <div className="p-6 space-y-4">
                                        <div>
                                           <p className="text-blue-500 text-[8px] font-black uppercase tracking-widest mb-1">{ev.category}</p>
                                           <h5 className="text-white font-bold text-sm truncate">{ev.title}</h5>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                           <div className="flex flex-col gap-1">
                                              <div className="flex items-center gap-2">
                                                 <div className={`w-1.5 h-1.5 rounded-full ${ev.approvalStatus === 'approved' ? 'bg-emerald-500' : ev.approvalStatus === 'pending' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                                                 <p className="text-gray-500 text-[8px] font-black uppercase tracking-widest">{ev.approvalStatus}</p>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                 <div className={`w-1.5 h-1.5 rounded-full ${ev.status === 'live' ? 'bg-blue-500 animate-pulse' : 'bg-gray-700'}`}></div>
                                                 <p className="text-gray-600 text-[7px] font-black uppercase tracking-widest">{ev.status}</p>
                                              </div>
                                           </div>
                                           <div className="text-right">
                                              <p className="text-emerald-500 font-bebas text-lg tracking-widest leading-none">₹{(ev.revenue || 0).toLocaleString()}</p>
                                              <div className="flex items-center justify-end gap-1 text-gray-500 mt-1">
                                                 <Ticket className="w-2.5 h-2.5" />
                                                 <p className="text-[8px] font-black">{ev.bookedSeats}/{ev.totalSeats}</p>
                                              </div>
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         ) : (
                            <div className="py-20 bg-white/[0.02] border border-white/5 rounded-[3rem] flex flex-col items-center justify-center space-y-4">
                               <Calendar className="w-12 h-12 text-gray-800" />
                               <p className="text-gray-600 font-black text-[10px] uppercase tracking-widest">No hosted events found in database</p>
                            </div>
                         )}
                      </div>
                    )}

                    {activeTab === "bookings" && (
                      <div className="space-y-8">
                         <div className="flex items-center justify-between">
                            <h4 className="text-white font-bebas text-3xl tracking-widest flex items-center gap-3">Booking <span className="text-violet-500">Intelligence</span></h4>
                            <span className="bg-violet-500/10 text-violet-500 border border-violet-500/10 px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{bookings.length} Orders</span>
                         </div>
                         {bookings.length > 0 ? (
                            <div className="space-y-4">
                               {bookings.map((b) => (
                                  <div key={b._id} className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:border-violet-500/20 transition-all">
                                     <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0">
                                           <img src={b.event?.eventImage} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                           <h5 className="text-white font-bold text-xs group-hover:text-violet-400 transition-colors uppercase tracking-widest">{b.event?.title || "Deleted Experience"}</h5>
                                           <div className="flex items-center gap-4 mt-2">
                                              <div className="flex items-center gap-1.5 text-gray-600">
                                                 <Calendar className="w-3 h-3" />
                                                 <span className="text-[8px] font-black uppercase">{new Date(b.createdAt).toLocaleDateString()}</span>
                                              </div>
                                              <div className="flex items-center gap-1.5 text-gray-600">
                                                 <Ticket className="w-3 h-3" />
                                                 <span className="text-[8px] font-black uppercase">{b.seats} Tickets</span>
                                              </div>
                                           </div>
                                        </div>
                                     </div>
                                     <div className="text-right space-y-2">
                                        <p className="text-emerald-500 font-bebas text-xl tracking-widest">₹{b.billedAmount}</p>
                                        <span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-[0.2em] border ${
                                           b.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 'bg-rose-500/10 text-rose-500 border-rose-500/10'
                                        }`}>{b.status}</span>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         ) : (
                            <div className="py-20 bg-white/[0.02] border border-white/5 rounded-[3rem] flex flex-col items-center justify-center space-y-4">
                               <ShoppingBag className="w-12 h-12 text-gray-800" />
                               <p className="text-gray-600 font-black text-[10px] uppercase tracking-widest">No transaction history found for this user</p>
                            </div>
                         )}
                      </div>
                    )}

                    {activeTab === "reviews" && (
                      <div className="space-y-8">
                         <div className="flex items-center justify-between">
                            <h4 className="text-white font-bebas text-3xl tracking-widest flex items-center gap-3">Review <span className="text-amber-500">Activity</span></h4>
                            <span className="bg-amber-500/10 text-amber-500 border border-amber-500/10 px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{reviews.length} Ratings</span>
                         </div>
                         {reviews.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                               {reviews.map((r) => (
                                  <div key={r._id} className="bg-[#12121A] border border-white/5 p-8 rounded-[2.5rem] space-y-6 relative group overflow-hidden">
                                     <div className="absolute top-0 right-0 p-8">
                                        <div className="flex items-center gap-1">
                                           {[...Array(5)].map((_, i) => (
                                              <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-800'}`} />
                                           ))}
                                        </div>
                                     </div>
                                     <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500"><Clock className="w-5 h-5" /></div>
                                        <div>
                                           <h5 className="text-white font-bold text-xs uppercase tracking-widest">{r.event?.title || "Deleted Experience"}</h5>
                                           <p className="text-gray-600 text-[8px] font-black uppercase">{new Date(r.createdAt).toLocaleString()}</p>
                                        </div>
                                     </div>
                                     <p className="text-gray-400 text-xs italic leading-relaxed">"{r.comment}"</p>
                                  </div>
                               ))}
                            </div>
                         ) : (
                            <div className="py-20 bg-white/[0.02] border border-white/5 rounded-[3rem] flex flex-col items-center justify-center space-y-4">
                               <Star className="w-12 h-12 text-gray-800" />
                               <p className="text-gray-600 font-black text-[10px] uppercase tracking-widest">This user has not contributed any reviews yet</p>
                            </div>
                         )}
                      </div>
                    )}
                  </div>
                )}
             </div>

             {/* Intelligence Actions Footer */}
             <div className="p-8 border-t border-white/5 bg-white/[0.02] grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => onToggleActive(user?._id, user?.isActive)}
                  className={`py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border ${
                     user?.isActive ? 'bg-rose-500/10 text-rose-500 border-rose-500/10 hover:bg-rose-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10 hover:bg-emerald-500 hover:text-white'
                  }`}
                >
                  {user?.isActive ? "Suspend Access" : "Restore Access"}
                </button>
                <button 
                  className="py-5 bg-white/5 border border-white/5 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  Reset Records <History className="w-4 h-4" />
                </button>
                <button 
                  className="py-5 bg-white/5 border border-white/5 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  Message User <Mail className="w-4 h-4" />
                </button>
                <button 
                  onClick={onDelete}
                  className="py-5 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-700 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-rose-600/30"
                >
                  Purge Identity <Trash2 className="w-4 h-4" />
                </button>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

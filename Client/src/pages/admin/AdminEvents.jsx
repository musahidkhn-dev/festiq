import { Plus, Pencil, Trash2, Calendar as CalendarIcon, X, AlertTriangle, Search, Eye, Globe, Zap, Ticket, ShieldCheck, CheckCircle2, ChevronLeft, ChevronRight, Info, User, Users, Tag, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminEvents, useDeleteEvent } from "../../hooks/queries/useAdmin";
import { useModerateEvent } from "../../hooks/queries/useEvents";
import LoadingScreen from "../../components/LoadingScreen";
import SafeAvatar from "../../components/SafeAvatar";
import SafeImage from "../../components/SafeImage";
import { toast } from "react-toastify";

export default function AdminEvents() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, eid: null });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, isError } = useAdminEvents({ page, limit: 10, search: debouncedSearch });
  const events = data?.events || [];
  const pagination = data?.pagination || {};

  const deleteEventMutation = useDeleteEvent();
  const moderateMutation = useModerateEvent();

  if (isLoading && !data) return <LoadingScreen />;

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
            <Zap className="w-3 h-3" /> System Logs
          </div>
          <h1 className="font-bebas text-6xl md:text-8xl text-white tracking-widest leading-none">EVENT <span className="text-blue-500">MANAGEMENT</span></h1>
          <p className="text-gray-500 font-medium mt-2">Scale and moderate global experiences with high-efficiency tools.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
           <div className="relative group w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search by title, artist, or category..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // Reset to first page on search
                }}
                className="w-full bg-[#12121A] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-xs text-white placeholder-gray-700 outline-none focus:border-blue-500/50 transition-all shadow-2xl"
              />
           </div>
           <button 
             onClick={() => navigate("/admin/events/create")}
             className="w-full sm:w-auto px-10 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 hover:text-white transition-all duration-500 flex items-center justify-center gap-3 active:scale-95"
           >
             <Plus className="w-4 h-4" /> Create Experience
           </button>
        </div>
      </div>

      {/* Stats Mini Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Platform Events", val: pagination.totalEvents || 0, icon: Globe, color: "blue" },
          { label: "Pending Review", val: events.filter(e => e.approvalStatus === 'pending').length, icon: Clock, color: "amber" },
          { label: "Total Capacity", val: "1.2M", icon: Zap, color: "rose" },
          { label: "System Health", val: "Optimum", icon: ShieldCheck, color: "emerald" },
        ].map((s, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-[#0A0A0F] border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-6 group hover:border-blue-500/20 transition-all"
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
                <th className="pl-10 pr-6 py-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Preview</th>
                <th className="px-6 py-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Experience Details</th>
                <th className="px-6 py-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Metrics</th>
                <th className="px-6 py-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Moderation</th>
                <th className="sticky right-0 bg-[#0A0A0F] px-10 py-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] text-center border-l border-white/5 shadow-[-10px_0_20px_rgba(0,0,0,0.5)]">Control Hub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {events.map((ev) => (
                <tr key={ev._id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="pl-10 pr-6 py-6">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-white/5 group-hover:ring-blue-500 transition-all shadow-2xl relative">
                       <SafeImage src={ev.eventImage} alt={ev.title} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                     <div>
                        <p className="text-white font-bold text-sm mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">{ev.title}</p>
                        <div className="flex items-center gap-3">
                           <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                              <Tag className="w-3 h-3 text-gray-600" />
                              <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">{ev.category}</span>
                           </div>
                           <div className="flex items-center gap-1.5">
                              <CalendarIcon className="w-3 h-3 text-gray-700" />
                              <span className="text-gray-600 text-[9px] font-black uppercase tracking-widest">{new Date(ev.eventDate).toLocaleDateString()}</span>
                           </div>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-1">
                       <p className="text-emerald-400 font-bebas text-xl tracking-wider">₹{ev.ticketPrice}</p>
                       <p className="text-gray-700 text-[8px] font-black uppercase tracking-widest flex items-center gap-1"><Users className="w-2 h-2" /> {ev.totalSeats} Capacity</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            ev.status === 'live' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' :
                            ev.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'
                          }`}></div>
                          <span className="text-white text-[9px] font-black uppercase tracking-widest">{ev.status || 'Draft'}</span>
                       </div>
                       <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border inline-block w-fit ${
                          ev.approvalStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          ev.approvalStatus === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                       }`}>
                          {ev.approvalStatus || 'pending'}
                       </span>
                    </div>
                  </td>
                  <td className="sticky right-0 bg-[#0A0A0F] px-10 py-6 border-l border-white/5 shadow-[-10px_0_20px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center justify-center gap-2">
                       {ev.approvalStatus === 'pending' && (
                         <div className="flex gap-2">
                           <button 
                             onClick={() => moderateMutation.mutate({ id: ev._id, approvalStatus: 'approved' })}
                             className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-lg hover:shadow-emerald-500/20"
                             title="Approve"
                           >
                             <CheckCircle2 className="w-4 h-4" />
                           </button>
                           <button 
                             onClick={() => moderateMutation.mutate({ id: ev._id, approvalStatus: 'rejected' })}
                             className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg hover:shadow-rose-500/20"
                             title="Reject"
                           >
                             <X className="w-4 h-4" />
                           </button>
                         </div>
                       )}
                       <button 
                         onClick={() => setSelectedEvent(ev)}
                         className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                         title="Quick View"
                       >
                         <Eye className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => navigate(`/admin/events/edit/${ev._id}`)}
                         className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                         title="Edit"
                       >
                         <Pencil className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => setDeleteModal({ isOpen: true, eid: ev._id })}
                         className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                         title="Delete"
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
         {events.map((ev) => (
           <motion.div 
             key={ev._id}
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-[#0A0A0F] border border-white/5 rounded-[2.5rem] p-6 space-y-6 overflow-hidden relative shadow-2xl"
           >
              <div className="flex items-start gap-5">
                 <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-white/5 flex-shrink-0">
                    <SafeImage src={ev.eventImage} alt={ev.title} className="w-full h-full object-cover" />
                 </div>
                 <div className="flex-1 overflow-hidden">
                    <h3 className="text-white font-bold text-lg line-clamp-1 mb-2">{ev.title}</h3>
                    <div className="flex flex-wrap gap-2">
                       <span className="px-2 py-1 bg-white/5 rounded-md text-[8px] font-black uppercase tracking-widest text-gray-500 border border-white/5">{ev.category}</span>
                       <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                          ev.approvalStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' :
                          ev.approvalStatus === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/10' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/10'
                       }`}>{ev.approvalStatus || 'pending'}</span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 border-dashed">
                 <div>
                    <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest mb-1">Entry Price</p>
                    <p className="text-emerald-400 font-bebas text-2xl tracking-widest">₹{ev.ticketPrice}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest mb-1">Experience Date</p>
                    <p className="text-white text-xs font-bold">{new Date(ev.eventDate).toLocaleDateString()}</p>
                 </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                 <button onClick={() => setSelectedEvent(ev)} className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-widest">
                    <Info className="w-4 h-4" /> Quick Details
                 </button>
                 <div className="flex gap-2">
                    <button onClick={() => navigate(`/admin/events/edit/${ev._id}`)} className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteModal({ isOpen: true, eid: ev._id })} className="p-3 bg-rose-500/10 border border-rose-500/10 rounded-xl text-rose-500"><Trash2 className="w-4 h-4" /></button>
                 </div>
              </div>

              {ev.approvalStatus === 'pending' && (
                <div className="flex gap-3 mt-4">
                   <button 
                     onClick={() => moderateMutation.mutate({ id: ev._id, approvalStatus: 'approved' })}
                     className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/10"
                   >Approve</button>
                   <button 
                     onClick={() => moderateMutation.mutate({ id: ev._id, approvalStatus: 'rejected' })}
                     className="flex-1 py-4 bg-white/5 border border-white/5 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em]"
                   >Reject</button>
                </div>
              )}
           </motion.div>
         ))}
      </div>

      {/* Pagination Protocol */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-10 py-8 bg-[#0A0A0F] border border-white/5 rounded-[2.5rem]">
         <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
            Showing <span className="text-white">{(page - 1) * 10 + 1}-{Math.min(page * 10, pagination.totalEvents)}</span> of <span className="text-blue-500">{pagination.totalEvents}</span> Experiences
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
                 // Logic to show only few page numbers
                 if (pagination.totalPages > 5) {
                    if (pNum !== 1 && pNum !== pagination.totalPages && Math.abs(pNum - page) > 1) {
                       if (Math.abs(pNum - page) === 2) return <span key={i} className="text-gray-700">...</span>;
                       return null;
                    }
                 }
                 return (
                    <button 
                      key={i}
                      onClick={() => setPage(pNum)}
                      className={`w-12 h-12 flex items-center justify-center rounded-xl text-[10px] font-black transition-all ${
                        page === pNum ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'bg-white/5 text-gray-500 hover:bg-white/10'
                      }`}
                    >
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

      {/* Details Drawer Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-end p-0 sm:p-6 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl h-full sm:h-[90vh] bg-[#0A0A0F] border-l border-white/10 shadow-2xl flex flex-col"
            >
               {/* Drawer Header */}
               <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                  <div>
                    <h3 className="text-white font-bebas text-4xl tracking-widest leading-none">Experience <span className="text-blue-500">Overview</span></h3>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Ref ID: {selectedEvent._id}</p>
                  </div>
                  <button onClick={() => setSelectedEvent(null)} className="p-4 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all"><X className="w-5 h-5" /></button>
               </div>

               {/* Drawer Content */}
               <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                  <div className="w-full aspect-video rounded-[2.5rem] overflow-hidden ring-4 ring-white/5 shadow-2xl">
                     <SafeImage src={selectedEvent.eventImage} className="w-full h-full object-cover" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-8">
                        <div className="space-y-3">
                           <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Info className="w-3 h-3" /> Description</p>
                           <p className="text-gray-400 text-sm leading-relaxed font-medium">{selectedEvent.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                              <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-2">Creator</p>
                              <div className="flex items-center gap-3">
                                 <SafeAvatar src={selectedEvent.user?.profilePicture} name={selectedEvent.user?.name} className="w-8 h-8" />
                                 <p className="text-white font-bold text-[10px] uppercase truncate">{selectedEvent.user?.name}</p>
                              </div>
                           </div>
                           <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                              <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-2">Artist</p>
                              <div className="flex items-center gap-3">
                                 <User className="w-4 h-4 text-blue-500" />
                                 <p className="text-white font-bold text-[10px] uppercase truncate">{selectedEvent.eventArtistName}</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-8">
                        <div className="p-8 bg-blue-600/5 border border-blue-500/10 rounded-[2rem] space-y-6">
                           <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest">Financial Protocol</p>
                           <div className="space-y-4">
                              <div className="flex justify-between items-end">
                                 <p className="text-gray-500 text-[9px] font-black uppercase">Ticket Price</p>
                                 <p className="text-white font-bebas text-3xl">₹{selectedEvent.ticketPrice}</p>
                              </div>
                              <div className="flex justify-between items-end">
                                 <p className="text-gray-500 text-[9px] font-black uppercase">Platform Earning</p>
                                 <p className="text-emerald-500 font-bebas text-xl">₹{(selectedEvent.ticketPrice * 0.1).toFixed(0)}</p>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Logistics Hub</p>
                           <div className="space-y-4">
                              <div className="flex items-center gap-4 text-gray-400">
                                 <MapPin className="w-4 h-4 text-rose-500" />
                                 <p className="text-xs font-bold uppercase">{selectedEvent.eventLocation}</p>
                              </div>
                              <div className="flex items-center gap-4 text-gray-400">
                                 <Clock className="w-4 h-4 text-amber-500" />
                                 <p className="text-xs font-bold uppercase">{selectedEvent.duration || 'N/A'}</p>
                              </div>
                              <div className="flex items-center gap-4 text-gray-400">
                                 <Users className="w-4 h-4 text-blue-500" />
                                 <p className="text-xs font-bold uppercase">{selectedEvent.totalSeats} Total Seats</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Drawer Actions */}
               <div className="p-8 border-t border-white/5 bg-white/[0.01] grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => navigate(`/admin/events/edit/${selectedEvent._id}`)}
                    className="py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    Edit Records <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => navigate(`/events/${selectedEvent._id}`)}
                    className="py-5 bg-white/5 border border-white/5 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    Live Preview <ArrowUpRight className="w-4 h-4" />
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0F0F16] border border-white/10 rounded-[3rem] p-12 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>
              <div className="text-center space-y-10">
                <div className="w-24 h-24 bg-rose-500/10 rounded-[2rem] flex items-center justify-center mx-auto border border-rose-500/20 shadow-2xl shadow-rose-500/10">
                  <AlertTriangle className="w-12 h-12 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-bebas text-6xl text-white tracking-widest mb-4 leading-none">TERMINATE <br/><span className="text-rose-500">EXPERIENCE?</span></h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed">Warning: This operation is irreversible. All records of this experience will be purged from the platform.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setDeleteModal({ isOpen: false, eid: null })}
                    className="py-5 rounded-2xl bg-white/5 border border-white/5 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Abort
                  </button>
                  <button 
                    onClick={() => {
                      deleteEventMutation.mutate(deleteModal.eid, {
                        onSuccess: () => setDeleteModal({ isOpen: false, eid: null })
                      });
                    }}
                    className="py-5 rounded-2xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-rose-600/30 hover:bg-rose-700 transition-all"
                  >
                    Confirm Deletion
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

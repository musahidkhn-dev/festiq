import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCreatorAnalytics, useUpdateBookingStatus, useDeleteEvent } from '../hooks/queries/useEvents';
import { Calendar, Users, IndianRupee, MapPin, Activity, AlertTriangle, Clock, CheckCircle2, XCircle, LayoutDashboard, Ticket, TrendingUp, Search, User as UserIcon, Mail, Wallet, Check, X, Undo, UserMinus, Trash2, Loader2, Pencil } from 'lucide-react';
import { useState } from 'react';
import SafeImage from '../components/SafeImage';
import SafeAvatar from '../components/SafeAvatar';
import PageTransition from '../components/animations/PageTransition';

export default function CreatorDashboard() {
  const { data: analytics, isLoading } = useCreatorAnalytics();
  const updateStatus = useUpdateBookingStatus();

  const [deleteId, setDeleteId] = useState(null);
  const deleteMutation = useDeleteEvent();

  const handleStatusUpdate = (oid, status) => {
    if (status === 'cancelled' || status === 'rejected') {
      if (!window.confirm(`Are you sure you want to ${status} this booking? A full refund will be processed automatically.`)) return;
    }
    updateStatus.mutate({ oid, status });
  };

  const confirmDelete = (id) => {
    deleteMutation.mutate(id, {
      onSuccess: () => setDeleteId(null)
    });
  };

  if (isLoading && !analytics) {
    return (
      <PageTransition>
      <div className="min-h-screen bg-[#050508] pt-32 pb-20 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-violet-500 font-black uppercase tracking-widest text-xs">Loading Studio...</p>
        </div>
      </div>
      </PageTransition>
    );
  }

  const events = analytics?.events || [];
  const metrics = analytics?.metrics || {
    totalEvents: 0,
    totalRevenue: 0,
    totalTicketsSold: 0,
    approvedEvents: 0,
    pendingEvents: 0,
    pendingBookings: 0,
    walletBalance: 0
  };
  const bookings = analytics?.recentBookings || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'pending': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'cancelled': 
      case 'rejected': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <PageTransition>
    <div className="min-h-screen text-white selection:bg-violet-500/30 font-outfit overflow-x-hidden bg-[#050508]">
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-[#0A0A0F] border border-white/10 p-8 rounded-[2rem] max-w-sm w-full"
            >
              <h3 className="text-xl font-bebas text-white mb-2">Delete Experience?</h3>
              <p className="text-gray-500 text-xs mb-8">This action is permanent and cannot be undone. Are you sure you want to remove this event?</p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white text-[10px] font-black uppercase tracking-widest transition-all">Cancel</button>
                <button onClick={() => confirmDelete(deleteId)} className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 rounded-xl text-white text-[10px] font-black uppercase tracking-widest transition-all">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
               <LayoutDashboard className="w-4 h-4 text-amber-400" />
               <span className="text-white text-[10px] font-black uppercase tracking-widest">Creator Studio</span>
            </div>
            <h1 className="font-bebas text-6xl md:text-8xl text-white tracking-widest leading-none">MY <span className="text-violet-500">STUDIO</span></h1>
            <p className="text-gray-400 mt-4 max-w-lg">Track your experiences, monitor real-time ticket sales, and manage your community.</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
             <a href="/host-event" className="flex items-center gap-3 bg-white text-black hover:bg-violet-500 hover:text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95">
                Host New Experience
             </a>
          </motion.div>
        </div>
 
        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Wallet Balance", val: `₹${metrics.walletBalance.toLocaleString()}`, sub: "Available credits", icon: Wallet, color: "violet" },
            { label: "Your Earnings", val: `₹${metrics.totalRevenue.toLocaleString()}`, sub: "Net revenue", icon: IndianRupee, color: "emerald" },
            { label: "Tickets Sold", val: metrics.totalTicketsSold, sub: "Confirmed attendees", icon: Ticket, color: "blue" },
            { label: "Pending Reservations", val: metrics.pendingBookings, sub: "Review required", icon: Clock, color: "amber" },
          ].map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0A0A0F] border border-white/5 rounded-3xl p-8 relative overflow-hidden group"
            >
              <div className={`absolute -inset-4 bg-${s.color}-600/5 blur-xl group-hover:bg-${s.color}-600/10 transition-colors`}></div>
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">{s.label}</p>
                  <p className="text-white font-bebas text-5xl tracking-wider mb-1">{s.val}</p>
                  <p className="text-gray-600 text-[10px] font-medium uppercase tracking-widest">{s.sub}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-${s.color}-500/10 border border-${s.color}-500/20 flex items-center justify-center`}>
                  <s.icon className={`w-5 h-5 text-${s.color}-500`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Tabs / Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Directory */}
          <div className="lg:col-span-8 space-y-12">
            <div>
              <h2 className="font-bebas text-4xl text-white tracking-widest mb-8">Event Directory</h2>
              
              {events.length === 0 ? (
                <div className="bg-[#0A0A0F] border border-white/5 rounded-[3rem] p-16 text-center">
                  <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
                     <Calendar className="w-10 h-10 text-gray-600" />
                  </div>
                  <h3 className="text-white font-bebas text-3xl tracking-widest mb-3">No Experiences Found</h3>
                  <p className="text-gray-500 text-sm mb-10 max-w-sm mx-auto font-medium leading-relaxed">Your journey as a creator starts here. Host your first cinematic event and build your community.</p>
                  <a href="/host-event" className="inline-block bg-violet-600 hover:bg-violet-700 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-violet-600/20 active:scale-95">Host Now</a>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.map((event) => (
                    <motion.div 
                      key={event._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#0A0A0F] border border-white/5 rounded-3xl overflow-hidden group"
                    >
                      <div className="h-48 relative overflow-hidden">
                        <SafeImage src={event.eventImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] to-transparent"></div>
                        
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          <Link 
                            to={`/creator/edit-event/${event._id}`}
                            className="bg-black/40 hover:bg-violet-600/80 text-white/60 hover:text-white p-2 rounded-xl backdrop-blur-md border border-white/10 transition-all group/edit"
                            title="Edit Event"
                          >
                            <Pencil className="w-4 h-4 group-hover/edit:scale-110 transition-transform" />
                          </Link>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(event._id);
                            }}
                            className="bg-black/40 hover:bg-rose-600/80 text-white/60 hover:text-white p-2 rounded-xl backdrop-blur-md border border-white/10 transition-all group/del"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4 group-hover/del:scale-110 transition-transform" />
                          </button>
                          {event.approvalStatus === 'approved' && <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-md shadow-lg"><CheckCircle2 className="w-3 h-3" /> Live</div>}
                          {(event.approvalStatus === 'pending' || !event.approvalStatus) && <div className="bg-amber-500/20 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-md shadow-lg"><Clock className="w-3 h-3" /> Under Review</div>}
                          {event.approvalStatus === 'rejected' && <div className="bg-rose-500/20 border border-rose-500/30 text-rose-400 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-md shadow-lg"><XCircle className="w-3 h-3" /> Rejected</div>}
                        </div>
                      </div>
                      
                      <div className="p-8">
                        <h3 className="text-xl text-white font-bold mb-6 line-clamp-1 group-hover:text-violet-400 transition-colors">{event.title}</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-gray-600 text-[8px] font-black uppercase tracking-[0.2em]">Date</p>
                            <p className="text-white text-xs font-bold">{new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                          </div>
                          <div className="space-y-1 text-right">
                            <p className="text-gray-600 text-[8px] font-black uppercase tracking-[0.2em]">Price</p>
                            <p className="text-emerald-400 text-xs font-bold">₹{event.ticketPrice}</p>
                          </div>
                        </div>

                        {(event.approvalStatus === 'pending' || !event.approvalStatus) && (
                          <div className="mt-6 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-2 text-amber-500/50">
                               <AlertTriangle className="w-3 h-3" />
                               <p className="text-[9px] font-medium uppercase tracking-widest italic">This experience is currently under admin review.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Attendee Management Table */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#0A0A0F] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col h-full min-h-[600px]">
              <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                <h2 className="font-bebas text-3xl text-white tracking-widest mb-2">Bookings</h2>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Real-time attendee list</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {bookings.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-8">
                     <Users className="w-12 h-12 text-gray-800 mb-4" />
                     <p className="text-gray-600 text-xs font-medium uppercase tracking-widest">No bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((order, idx) => (
                      <motion.div 
                        key={order._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white/[0.02] border border-white/5 p-5 rounded-3xl group hover:bg-white/[0.04] transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                           <div className="flex items-center gap-3">
                              <SafeAvatar src={order.user?.profilePicture} name={order.user?.name} className="w-10 h-10 ring-2 ring-white/5" />
                              <div className="overflow-hidden">
                                 <p className="text-white text-xs font-black uppercase tracking-wider truncate">{order.user?.name || "Guest User"}</p>
                                 <p className="text-gray-600 text-[9px] font-bold truncate">{order.user?.email}</p>
                              </div>
                           </div>
                           <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                              {order.status}
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 pt-4 border-t border-white/5">
                          <div>
                            <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest mb-1">Event</p>
                            <p className="text-violet-400 text-[10px] font-bold line-clamp-1">{order.event?.title}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest mb-1">Tickets</p>
                            <div className="bg-white/5 text-white px-2 py-0.5 rounded-md text-[10px] font-black inline-block border border-white/10">
                              {order.seats}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-3 pt-4 mt-4 border-t border-white/5 border-dashed">
                          <div>
                            <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest mb-0.5">Paid Amount</p>
                            <p className="text-white text-[10px] font-bold">₹{(order.displayAmount || order.billedAmount || 0).toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest mb-0.5">Your Earnings</p>
                            <p className="text-emerald-400 text-[10px] font-black">₹{(order.creatorEarning || order.billedAmount || 0).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest mb-0.5">Platform Fee</p>
                            <p className="text-gray-500 text-[10px] font-bold">₹{(order.platformFee || 0).toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest mb-0.5">Booking Date</p>
                            <p className="text-gray-400 text-[10px] font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/5">
                           {order.status === 'pending' && (
                              <button 
                                onClick={() => handleStatusUpdate(order._id, 'confirmed')}
                                className="flex-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white p-2 rounded-xl transition-all flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-widest"
                              >
                                 <Check className="w-3 h-3" /> Approve
                              </button>
                           )}
                           {order.status === 'confirmed' && (
                              <button 
                                onClick={() => handleStatusUpdate(order._id, 'pending')}
                                className="flex-1 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white p-2 rounded-xl transition-all flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-widest"
                              >
                                 <Undo className="w-3 h-3" /> Hold
                              </button>
                           )}
                           {(order.status === 'confirmed' || order.status === 'pending') && (
                              <>
                                 <button 
                                   onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                                   className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all group/btn"
                                   title="Cancel & Refund"
                                 >
                                    <UserMinus className="w-3 h-3" />
                                 </button>
                                 <button 
                                   onClick={() => handleStatusUpdate(order._id, 'rejected')}
                                   className="p-2 bg-gray-500/10 hover:bg-gray-500 text-gray-500 hover:text-white rounded-xl transition-all"
                                   title="Reject"
                                 >
                                    <X className="w-3 h-3" />
                                 </button>
                              </>
                           )}
                           {(order.status === 'cancelled' || order.status === 'rejected') && (
                              <div className="w-full text-center py-2 text-gray-600 text-[8px] font-black uppercase tracking-widest border border-dashed border-white/5 rounded-xl">
                                 Finalized Order
                              </div>
                           )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-white/5 bg-white/[0.01]">
                 <div className="flex items-center justify-between text-gray-500 text-[10px] font-black uppercase tracking-widest">
                    <span>Total Bookings</span>
                    <span className="text-white">{bookings.length}</span>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => !deleteMutation.isPending && setDeleteId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0F0F16] border border-white/5 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>
              
              <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-8">
                <Trash2 className="w-10 h-10 text-rose-500" />
              </div>

              <div className="text-center mb-10">
                <h3 className="text-white font-bebas text-4xl tracking-widest mb-4">DELETE <span className="text-rose-500">EXPERIENCE?</span></h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                  Are you sure you want to remove this event? This action cannot be undone and will permanently hide the experience from your studio.
                </p>
                <div className="mt-4 p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-center gap-3">
                   <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                   <p className="text-[10px] text-rose-500/80 font-bold uppercase tracking-widest text-left leading-tight">
                     If bookings exist, the event will be cancelled instead of deleted to protect transaction records.
                   </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  disabled={deleteMutation.isPending}
                  onClick={() => setDeleteId(null)}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  disabled={deleteMutation.isPending}
                  onClick={() => confirmDelete(deleteId)}
                  className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-rose-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Deleting...
                    </>
                  ) : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </PageTransition>
  );
}

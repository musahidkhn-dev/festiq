import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Armchair, Tag, Download, Share2, X, Info, Ticket as TicketIcon, QrCode, ShieldCheck, Zap, AlertTriangle, Loader2, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import SafeImage from "./SafeImage";
import { useState } from "react";
import { useCancelTicket } from "../hooks/queries/useOrders";

export default function TicketCard({ order }) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const cancelMutation = useCancelTicket();

  if (!order?.event) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative w-full max-w-4xl mx-auto"
    >
      {/* Background Ambient Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/5 to-blue-600/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

      <div className="relative bg-[#0A0A0F] border border-white/5 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl transition-all hover:border-white/10 hover:shadow-violet-900/10 hover:shadow-2xl">
        
        {/* Left Section: Event Identity */}
        <div className="w-full md:w-40 h-32 md:h-auto relative overflow-hidden flex-shrink-0">
          <SafeImage 
            src={order.event.eventImage} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent md:bg-gradient-to-r opacity-80 md:opacity-50"></div>
          
          <div className="absolute top-3 left-3">
             <div className="px-2.5 py-1 rounded-md bg-violet-600/90 text-white text-[6px] font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md border border-white/10">
               {order.event.category || 'EVENT'}
             </div>
          </div>
        </div>

        {/* Cinematic Perforated Divider */}
        <div className="hidden md:flex flex-col justify-between py-4 px-0.5 relative z-10">
           <div className="w-4 h-4 bg-[#050508] rounded-full -mt-6 -ml-2 border border-white/5 shadow-inner"></div>
           <div className="flex-1 border-r border-dashed border-white/10 my-2"></div>
           <div className="w-4 h-4 bg-[#050508] rounded-full -mb-6 -ml-2 border border-white/5 shadow-inner"></div>
        </div>

        {/* Middle Section: Protocol Data */}
        <div className="flex-1 p-3.5 md:p-5 flex flex-col justify-center space-y-3 md:space-y-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-violet-400 font-black text-[8px] uppercase tracking-[0.2em]">
              <div className="flex items-center gap-1.5 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                <Calendar className="w-3 h-3" />
                <span>{new Date(order.event.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <MapPin className="w-3 h-3 text-rose-500" />
                <span className="truncate max-w-[120px] sm:max-w-xs">{order.event.eventLocation}</span>
              </div>
            </div>
            
            <Link to={`/events/${order.event._id}`}>
              <h3 className="font-bebas text-2xl md:text-3xl text-white tracking-widest group-hover:text-violet-400 transition-colors leading-none truncate pr-2">
                {order.event.title}
              </h3>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 md:gap-x-6 gap-y-2 pt-2 md:pt-3 border-t border-white/5">
            <div>
              <p className="text-gray-600 text-[6px] font-black uppercase tracking-[0.2em] mb-0.5">Seats</p>
              <div className="flex items-center gap-1.5 text-white">
                <Armchair className="w-3 h-3 text-violet-500" />
                <span className="font-black text-[9px] uppercase tracking-widest">{order.seats || 1}</span>
              </div>
            </div>
            
            <div>
              <p className="text-gray-600 text-[6px] font-black uppercase tracking-[0.2em] mb-0.5">Status</p>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'confirmed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' : order.status === 'pending' ? 'bg-amber-500' : 'bg-gray-700'}`}></div>
                <span className={`text-[8px] font-black uppercase tracking-widest ${order.status === 'confirmed' ? 'text-emerald-500' : order.status === 'pending' ? 'text-amber-500' : 'text-gray-500'}`}>
                  {order.status === 'confirmed' ? 'VERIFIED' : order.status === 'pending' ? 'ON HOLD' : order.status}
                </span>
              </div>
            </div>

            <div className="hidden sm:block">
              <p className="text-gray-600 text-[6px] font-black uppercase tracking-[0.2em] mb-0.5">Auth ID</p>
              <div className="flex items-center gap-1 text-gray-400">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span className="text-[8px] font-bold tracking-widest font-mono">#{order._id.slice(-6).toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button 
              onClick={() => {
                const ticketText = `🎫 Festiq Ticket\n━━━━━━━━━━━━━━━━━\nEvent: ${order.event.title}\nDate: ${new Date(order.event.eventDate).toLocaleDateString()}\nLocation: ${order.event.eventLocation}\nSeats: ${order.seats || 1}\nAmount: ₹${order.billedAmount}\nStatus: ${order.status}\nBooking ID: ${order._id}\n━━━━━━━━━━━━━━━━━\nPowered by Festiq`;
                const blob = new Blob([ticketText], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Festiq-Ticket-${order._id.slice(-6).toUpperCase()}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 transition-all text-[7px] font-black uppercase tracking-widest"
            >
              <Download className="w-3 h-3" /> Ticket
            </button>
            <button 
              onClick={async () => {
                const shareData = {
                  title: `Festiq - ${order.event.title}`,
                  text: `🎫 Check out ${order.event.title} on ${new Date(order.event.eventDate).toLocaleDateString()} at ${order.event.eventLocation}!`,
                  url: `${window.location.origin}/events/${order.event._id}`
                };
                if (navigator.share) {
                  try { await navigator.share(shareData); } catch(e) { /* user cancelled */ }
                } else {
                  await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
                  const { toast } = await import('react-toastify');
                  toast.success("Link copied to clipboard!");
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-[7px] font-black uppercase tracking-widest"
            >
              <Share2 className="w-3 h-3" /> Share
            </button>
            
            {order.status !== 'cancelled' && order.status !== 'expired' && order.status !== 'rejected' && new Date(order.event.eventDate) >= new Date(new Date().setHours(0,0,0,0)) && (
              <button 
                onClick={() => setShowCancelModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:text-white hover:bg-rose-600 hover:border-rose-500 transition-all text-[7px] font-black uppercase tracking-widest ml-auto"
              >
                <X className="w-3 h-3" /> Cancel
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Compact QR Node */}
        <div className="w-full md:w-32 bg-white/[0.02] border-t md:border-t-0 md:border-l border-white/5 p-4 flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 relative group/node shrink-0">
           <div className="absolute inset-0 bg-violet-600 opacity-0 group-hover/node:opacity-[0.02] transition-opacity"></div>
           
           <div className="relative">
              <div className="absolute -inset-2 bg-white/10 blur-xl opacity-0 group-hover/node:opacity-100 transition-opacity rounded-full"></div>
              
              {order.status === 'cancelled' || order.status === 'rejected' || order.status === 'pending' ? (
                <div className={`relative p-2 bg-[#12121A] rounded-xl shadow-xl border ${order.status === 'pending' ? 'border-amber-500/30' : 'border-rose-500/30'} flex items-center justify-center w-16 h-16`}>
                  {order.status === 'pending' ? (
                    <Clock className="w-8 h-8 text-amber-500/50" />
                  ) : (
                    <X className="w-8 h-8 text-rose-500/50" />
                  )}
                  <div className={`absolute inset-0 border ${order.status === 'pending' ? 'border-amber-500/20' : 'border-rose-500/20'} rounded-xl animate-pulse`}></div>
                </div>
              ) : (
                <div className="relative p-2 bg-white rounded-xl shadow-xl transform group-hover/node:scale-105 transition-transform duration-500 border border-gray-200">
                   <img 
                     src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${order._id}`} 
                     alt="Ticket QR" 
                     className="w-12 h-12 grayscale group-hover/node:grayscale-0 transition-all" 
                   />
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/node:opacity-100 transition-opacity bg-white/95 rounded-xl">
                      <QrCode className="w-6 h-6 text-violet-600" />
                   </div>
                </div>
              )}
           </div>
           
           <div className="text-right md:text-center space-y-0.5">
             {order.status === 'cancelled' || order.status === 'rejected' ? (
               <div className="flex items-center justify-end md:justify-center gap-1 text-rose-500">
                  <AlertTriangle className="w-2 h-2" />
                  <span className="text-[6px] font-black tracking-[0.2em] uppercase line-through">Revoked</span>
               </div>
             ) : order.status === 'pending' ? (
               <div className="flex items-center justify-end md:justify-center gap-1 text-amber-500">
                  <Clock className="w-2 h-2" />
                  <span className="text-[6px] font-black tracking-[0.2em] uppercase">Pending Review</span>
               </div>
             ) : (
               <div className="flex items-center justify-end md:justify-center gap-1 text-emerald-500">
                  <Zap className="w-2 h-2" />
                  <span className="text-[6px] font-black tracking-[0.2em] uppercase">Valid</span>
               </div>
             )}
             <p className={`font-bebas text-xl md:text-2xl tracking-widest leading-none ${order.status === 'cancelled' ? 'text-gray-600' : 'text-white'}`}>
               ₹{order.billedAmount.toLocaleString()}
             </p>
           </div>
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCancelModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#0A0A0F] border border-rose-500/20 rounded-3xl shadow-2xl overflow-hidden relative"
            >
              {/* Warning Header */}
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-8 h-8 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-white font-bebas text-3xl tracking-widest leading-none">Cancel Reservation</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2 px-4 leading-relaxed">
                    Are you sure you want to cancel your booking for <span className="text-white">{order.event.title}</span>?
                  </p>
                </div>
              </div>

              {/* Refund Info */}
              <div className="px-6 py-4 bg-rose-500/5 border-y border-rose-500/10 flex items-center justify-between">
                <div>
                  <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Refund Amount</p>
                  <p className="text-rose-500 font-bebas text-2xl tracking-wider leading-none mt-1">₹{order.billedAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Destination</p>
                  <p className="text-white text-[10px] font-bold uppercase tracking-widest mt-1">Wallet Credits</p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelMutation.isPending}
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all disabled:opacity-50"
                >
                  Keep Ticket
                </button>
                <button 
                  onClick={() => {
                    cancelMutation.mutate(order._id, {
                      onSuccess: () => setShowCancelModal(false)
                    });
                  }}
                  disabled={cancelMutation.isPending}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelMutation.isPending ? (
                    <><Loader2 className="w-3 h-3 animate-spin" /> Cancelling</>
                  ) : (
                    "Confirm Cancel"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
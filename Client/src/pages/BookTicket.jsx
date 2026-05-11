import { Link, useParams, useNavigate } from 'react-router-dom';
import { Check, CheckCircle, Minus, Plus, CreditCard, Eye, Lock, ShieldCheck, Wifi, Sparkles, Zap, ArrowRight, IndianRupee, ShieldAlert, Calendar, MapPin, Tag, X, ChevronDown, Sparkle, Copy, Loader2, Ticket, Info } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';
import { useEventDetail } from '../hooks/queries/useEvents';
import { useBookTicket, useValidateCoupon, useUserCoupons } from '../hooks/queries/useOrders';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeImage from '../components/SafeImage';
import { toast } from 'react-toastify';

export default function BookTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useEventDetail(id);
  const event = data?.event;
  const bookMutation = useBookTicket();
  const validateMutation = useValidateCoupon();
  const { data: couponsData, isLoading: isLoadingCoupons } = useUserCoupons();
  
  const [qty, setQty] = useState(1);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);

  const handleCopyCoupon = (e, code) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    toast.success(`Coupon ${code} copied!`);
  };

  if (isLoading && !data) return <LoadingScreen />;
  if (isError || !event) return <div className="min-h-screen bg-[#050508] text-rose-500 flex items-center justify-center font-black uppercase tracking-widest">Event not found. Please go back and try again.</div>;

  const coupons = couponsData?.coupons || [];

  const handleApplyCoupon = (code) => {
    const codeToValidate = code || couponInput;
    if (!codeToValidate) return toast.info("Please enter a code");
    
    validateMutation.mutate({ 
      couponCode: codeToValidate,
      eventId: event._id,
      numberOfSeats: qty
    }, {
      onSuccess: (data) => {
        setAppliedCoupon(data.coupon);
        setCouponInput("");
        setShowCouponModal(false);
      }
    });
  };

  const baseSubtotal = event.ticketPrice * qty;
  let discountAmount = 0;
  
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = (baseSubtotal * appliedCoupon.discount) / 100;
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else {
      discountAmount = appliedCoupon.discount;
    }
  }

  const subtotal = Math.max(0, baseSubtotal - discountAmount);
  
  const convenienceFee = Math.round(subtotal * 0.03);
  const total = subtotal + convenienceFee;

  // BLOCK DIRECT ACCESS FOR COMPLETED/EXPIRED EVENTS
  const isExpired = event.status === "completed" || event.status === "expired" || new Date(event.eventDate) < new Date().setHours(0,0,0,0);
  
  if (isExpired) {
    return (
      <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center p-6 text-center selection:bg-rose-500/30">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-10 h-10 text-rose-500" />
          </div>
          <div>
            <h1 className="font-bebas text-6xl sm:text-7xl tracking-tighter mb-4 text-white">BOOKING <span className="text-rose-500">CLOSED</span></h1>
            <p className="text-gray-500 max-w-md mx-auto font-medium leading-relaxed">
              This experience has already concluded or reached its transmission limit. Please explore our active protocols.
            </p>
          </div>
          <button 
            onClick={() => navigate('/events')} 
            className="px-10 py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-2xl shadow-white/5"
          >
            Return to Discovery
          </button>
        </motion.div>
      </div>
    );
  }

  const handleBooking = () => {
    bookMutation.mutate({ 
      eid: event._id, 
      numberOfSeats: qty,
      couponCode: appliedCoupon?.code 
    }, {
      onSuccess: () => navigate('/auth/profile')
    });
  };

  const steps = [
    { label: "Account", done: true },
    { label: "Tickets", active: true },
    { label: "Payment", done: false },
    { label: "Confirm", done: false }
  ];

  return (
    <div className="min-h-screen text-white font-outfit selection:bg-violet-500/30 pb-20">
      <main className="max-w-7xl mx-auto px-6 pt-24 md:pt-32">
        {/* Protocol Header */}
        <div className="mb-8 md:mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Secure Booking Session</span>
          </motion.div>
          <h1 className="font-bebas text-5xl md:text-7xl text-white tracking-widest mb-4">COMPLETE <span className="text-violet-500">BOOKING</span></h1>
        </div>

        {/* Step Progress Bar */}
        <div className="max-w-3xl mx-auto flex items-center justify-between mb-12 md:mb-20 px-4">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center relative">
                <motion.div 
                  initial={step.active ? { scale: 0.8 } : {}}
                  animate={step.active ? { scale: 1 } : {}}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black tracking-widest ${
                    step.done ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' :
                    step.active ? 'bg-violet-600 ring-4 ring-violet-500/20 text-white shadow-xl shadow-violet-600/20' :
                    'bg-white/5 border border-white/10 text-gray-600'
                  }`}
                >
                  {step.done ? <Check className="w-5 h-5" /> : i + 1}
                </motion.div>
                <span className={`text-[8px] absolute -bottom-6 font-black uppercase tracking-[0.2em] whitespace-nowrap ${step.active ? 'text-white' : 'text-gray-700'}`}>{step.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-px mx-4 ${step.done ? 'bg-emerald-500/50' : 'bg-white/5'}`}></div>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
          {/* Left Column: Selection Details */}
          <div className="lg:col-span-7 space-y-8 md:space-y-12">
            {/* Event Summary Card */}
            <div className="bg-[#12121A] border border-white/5 rounded-[2rem] p-4 md:p-6 flex items-center gap-6 group">
               <div className="w-24 h-20 md:w-32 md:h-24 rounded-xl md:rounded-2xl overflow-hidden ring-4 ring-white/5 group-hover:ring-violet-500/30 transition-all duration-700 shadow-2xl flex-shrink-0">
                 <SafeImage src={event.eventImage} alt={event.title} className="w-full h-full" />
               </div>
               <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                     <span className="text-violet-500 text-[10px] font-black uppercase tracking-widest">{event.category}</span>
                     <div className="w-1 h-1 rounded-full bg-gray-800"></div>
                     <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Event ID: #{event._id.slice(-6).toUpperCase()}</span>
                  </div>
                  <h3 className="font-bebas text-2xl md:text-4xl text-white tracking-widest leading-none">{event.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                     <span className="flex items-center gap-1.5"><Calendar className="w-3 md:w-3.5 h-3 md:h-3.5" /> {new Date(event.eventDate).toLocaleDateString()}</span>
                     <span className="flex items-center gap-1.5"><MapPin className="w-3 md:w-3.5 h-3 md:h-3.5" /> {event.eventLocation}</span>
                  </div>
               </div>
            </div>

            {/* Selection Zone */}
            <div className="space-y-6 md:space-y-8">
               <h3 className="font-bebas text-2xl md:text-3xl text-white tracking-widest">TICKET <span className="text-blue-500">DETAILS</span></h3>
               <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 space-y-6 md:space-y-8">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                     <div>
                        <p className="text-white font-bold text-xl mb-1">General Entry Pass</p>
                        <p className="text-gray-500 text-xs font-medium">Standard access to the main event.</p>
                     </div>
                     <div className="flex items-center gap-4 md:gap-6 p-2 bg-white/5 border border-white/5 rounded-2xl">
                        <button 
                          onClick={() => setQty(Math.max(1, qty - 1))}
                          className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-rose-500 transition-all"
                        >
                          <Minus className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                        <span className="font-bebas text-2xl md:text-3xl text-white w-6 md:w-8 text-center">{qty}</span>
                        <button 
                          onClick={() => setQty(qty + 1)}
                          className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-violet-600 flex items-center justify-center hover:bg-violet-700 transition-all shadow-lg"
                        >
                          <Plus className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                     </div>
                  </div>

                   <div className="pt-8 border-t border-white/5">
                      <div className="flex items-center justify-between mb-6">
                         <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Digital Ticket Preview</p>
                         <Zap className="w-4 h-4 text-violet-500 animate-pulse" />
                      </div>
                      <div className="relative h-44 bg-gradient-to-br from-violet-600 to-indigo-900 rounded-3xl p-8 overflow-hidden shadow-2xl group max-w-sm mx-auto">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                           <div className="flex justify-between items-start">
                              <Wifi className="w-8 h-8 text-white/40 rotate-90" />
                              <div className="w-12 h-10 bg-amber-400/80 rounded-lg backdrop-blur-md border border-white/20"></div>
                           </div>
                            <div className="space-y-3">
                               <p className="font-mono text-xl text-white tracking-[0.2em]">•••• •••• •••• 4242</p>
                               <div className="flex justify-between items-end">
                                  <div>
                                     <p className="text-white/40 text-[7px] font-black uppercase tracking-widest mb-0.5">Attendee</p>
                                     <p className="text-white text-[9px] font-black uppercase tracking-widest">TICKET_HOLDER</p>
                                  </div>
                                  <div className="text-right">
                                     <p className="text-white/40 text-[7px] font-black uppercase tracking-widest mb-0.5">Expiry</p>
                                     <p className="text-white text-[9px] font-black uppercase tracking-widest">08/29</p>
                                  </div>
                               </div>
                            </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Sticky Ledger */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32 space-y-8">
               <motion.div 
                 initial={{ opacity: 0, x: 30 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="bg-[#12121A] border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 space-y-6 md:space-y-8"
               >
                  <div>
                    <h3 className="font-bebas text-3xl md:text-4xl text-white tracking-widest mb-2">ORDER <span className="text-emerald-500">SUMMARY</span></h3>
                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Detailed Price Breakdown</p>
                  </div>

                  {/* Coupon System UI */}
                  <div className="space-y-4">
                     <div className="relative group">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-violet-500 transition-colors" />
                        <input 
                          type="text" 
                          placeholder="ENTER PROMO CODE" 
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-28 text-white text-[10px] font-black tracking-widest placeholder-gray-700 outline-none focus:border-violet-500/50 transition-all"
                        />
                        <button 
                          onClick={() => handleApplyCoupon()}
                          disabled={validateMutation.isPending}
                          className="absolute right-2 top-2 bottom-2 px-4 bg-violet-600 text-white text-[8px] font-black uppercase tracking-widest rounded-xl hover:bg-violet-700 transition-all disabled:opacity-50"
                        >
                          {validateMutation.isPending ? 'VALIDATING' : 'APPLY'}
                        </button>
                     </div>

                     {/* View Offers Button */}
                     <button 
                       onClick={() => setShowCouponModal(true)}
                       className="w-full flex items-center justify-between p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/10 transition-all group overflow-hidden relative"
                     >
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                             <Ticket className="w-4 h-4 text-amber-500" />
                           </div>
                           <div className="text-left">
                              <p className="text-[10px] text-white font-bold uppercase tracking-widest">Available Offers</p>
                              <p className="text-[8px] text-gray-500 uppercase tracking-widest">{isLoadingCoupons ? 'Checking...' : `${coupons.length} Coupons Available`}</p>
                           </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors -rotate-90" />
                     </button>

                     <AnimatePresence>
                        {appliedCoupon && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                          >
                             <div className="flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-emerald-500" />
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                   {appliedCoupon.code} {appliedCoupon.type === 'percentage' ? `${appliedCoupon.discount}%` : `₹${appliedCoupon.discount}`} APPLIED
                                </span>
                             </div>
                             <button onClick={() => setAppliedCoupon(null)} className="p-1 hover:bg-emerald-500/20 rounded-lg transition-all">
                                <X className="w-3 h-3 text-emerald-500" />
                             </button>
                          </motion.div>
                        )}
                     </AnimatePresence>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                       <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Ticket Price ({qty} × ₹{event.ticketPrice})</span>
                       <span className="text-white font-bold text-sm">₹{baseSubtotal.toLocaleString()}</span>
                    </div>
                    
                    {appliedCoupon && (
                      <div className="flex justify-between items-center text-emerald-500">
                         <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <Tag className="w-3 h-3" />
                            Discount
                         </span>
                         <span className="font-bold text-sm">-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center group/fee cursor-help relative">
                       <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                          Convenience Fee
                          <Info className="w-3 h-3 text-gray-700 group-hover/fee:text-violet-500 transition-colors" />
                       </span>
                       <span className="text-gray-400 font-bold text-xs">₹{convenienceFee.toLocaleString()}</span>
                       
                       {/* Subtle Tooltip */}
                       <div className="absolute left-0 -top-8 bg-black/90 border border-white/10 px-3 py-1.5 rounded-lg text-[8px] font-bold text-gray-400 uppercase tracking-widest opacity-0 group-hover/fee:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          Inclusive of platform services
                       </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                       <div>
                          <p className="text-gray-600 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Final Amount</p>
                          <span className="font-bebas text-2xl md:text-4xl text-white tracking-widest">TOTAL</span>
                       </div>
                       <div className="text-right">
                          <p className="text-emerald-500 font-bebas text-4xl md:text-5xl tracking-wider">₹{total.toLocaleString()}</p>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <button 
                       onClick={handleBooking}
                       disabled={bookMutation.isPending}
                       className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-xs rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-500 hover:text-white transition-all duration-500 shadow-2xl disabled:opacity-50 group"
                     >
                        {bookMutation.isPending ? 'PROCESSING...' : <><Lock className="w-4 h-4" /> Confirm Booking <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                     </button>
                     <div className="flex items-center gap-3 justify-center text-gray-700">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verified by Secure Checkout</span>
                     </div>
                  </div>
               </motion.div>

               <div className="p-6 md:p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[2.5rem] flex items-center gap-5">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-violet-600/10 flex items-center justify-center flex-shrink-0">
                     <ShieldAlert className="w-5 h-5 md:w-6 md:h-6 text-violet-500" />
                  </div>
                  <p className="text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                     By confirming, you agree to the <span className="text-violet-500 underline underline-offset-4 cursor-pointer">Terms of Service</span> and Privacy Policy.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Premium Coupon Modal Overlay */}
      <AnimatePresence>
        {showCouponModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCouponModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0A0A0F] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center border border-violet-500/30">
                    <Sparkles className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bebas text-2xl tracking-widest leading-none">Available <span className="text-violet-400">Offers</span></h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Select or copy a promo code</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCouponModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 hover:text-rose-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
                
                {/* Loading State */}
                {isLoadingCoupons && (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-full h-24 bg-white/5 animate-pulse rounded-2xl border border-white/5 flex items-center p-4 gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-white/5 rounded w-1/3"></div>
                          <div className="h-3 bg-white/5 rounded w-1/2"></div>
                        </div>
                        <div className="w-16 h-8 bg-white/5 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {!isLoadingCoupons && coupons.length === 0 && (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                      <Tag className="w-6 h-6 text-gray-600" />
                    </div>
                    <p className="text-white font-bold text-lg mb-1">No Offers Available</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest max-w-[200px]">Check back later for exclusive discounts and platform offers.</p>
                  </div>
                )}

                {/* Coupon Cards */}
                {!isLoadingCoupons && coupons.map((c) => (
                  <div key={c._id} className="group relative bg-[#12121A] border border-white/5 rounded-2xl p-5 hover:border-violet-500/30 transition-colors overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-violet-600/10 transition-colors"></div>
                    
                    <div className="relative z-10 flex flex-col gap-4">
                      {/* Top Row: Code & Copy */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="px-3 py-1.5 rounded-lg bg-violet-600/20 border border-violet-500/30">
                            <span className="font-mono text-xs text-violet-400 font-bold tracking-widest">{c.couponCode}</span>
                          </div>
                          <button 
                            onClick={(e) => handleCopyCoupon(e, c.couponCode)}
                            className="p-1.5 rounded-md hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                            title="Copy Code"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] px-2 py-1 rounded border border-amber-500/30 text-amber-500 font-black tracking-widest bg-amber-500/10">
                          {c.discountType === 'percentage' ? `${c.couponDiscount}% OFF` : `₹${c.couponDiscount} OFF`}
                        </span>
                      </div>

                      {/* Middle Row: Description */}
                      <div>
                        <p className="text-xs text-gray-400 mb-1 leading-relaxed">{c.description || "Special platform discount valid for selected events."}</p>
                        {c.minPurchaseAmount > 0 && (
                          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Min. Purchase: ₹{c.minPurchaseAmount}</p>
                        )}
                      </div>

                      {/* Bottom Row: Action */}
                      <button 
                        onClick={() => handleApplyCoupon(c.couponCode)}
                        className="w-full py-3 mt-1 rounded-xl bg-white/5 hover:bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest border border-white/10 hover:border-violet-500 transition-all shadow-lg"
                      >
                        Apply Coupon
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEventDetail, useEvents, useAddReview, useDeleteReview, useUpdateReview, useToggleLike } from "../hooks/queries/useEvents";
import LoadingScreen from "../components/LoadingScreen";
import { Calendar, MapPin, Clock, Users, Ticket, Share2, Heart, ArrowLeft, Star, Sparkles, ShieldCheck, Zap, Info, Trash2, Pencil } from "lucide-react";
import SafeImage from "../components/SafeImage";
import SafeAvatar from "../components/SafeAvatar";
import EventCard from "../components/EventCard";
import { useRef, useState } from "react";
import { useProfile } from "../hooks/queries/useAuth";
import { toast } from "react-toastify";
import PageTransition from "../components/animations/PageTransition";
import GlowButton from "../components/animations/GlowButton";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useEventDetail(id);
  const event = data?.event;
  const { data: eventsData } = useEvents();
  const { data: profile } = useProfile();
  
  const addReviewMutation = useAddReview();
  const deleteReviewMutation = useDeleteReview();
  const updateReviewMutation = useUpdateReview();

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: "" });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, rid: null });
  const [hoveredRating, setHoveredRating] = useState(0);

  const toggleLikeMutation = useToggleLike();
  const isLiked = event?.likes?.includes(profile?._id);

  const handleLike = () => {
    if (!profile) {
      toast.info("Sign in to save events you love.");
      return navigate("/login");
    }
    toggleLikeMutation.mutate(id);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Festiq - ${event.title}`,
      text: `Check out this amazing event on Festiq: ${event.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          toast.error("Sharing failed");
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link");
      }
    }
  };

  const relatedEvents = eventsData?.events?.filter(e => e._id !== id && e._id !== event?._id).slice(0, 3) || [];

  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!profile) return toast.info("Please login to write a review");
    addReviewMutation.mutate({ id, reviewData: reviewForm }, {
      onSuccess: () => setReviewForm({ rating: 5, comment: "" })
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateReviewMutation.mutate({ id, reviewId: editingReview, reviewData: editForm }, {
      onSuccess: () => setEditingReview(null)
    });
  };

  const startEditing = (rev) => {
    setEditingReview(rev._id);
    setEditForm({ rating: rev.rating, comment: rev.comment });
  };

  const handleDeleteReview = (rid) => {
    deleteReviewMutation.mutate({ id, reviewId: rid }, {
      onSuccess: () => setDeleteConfirm({ isOpen: false, rid: null })
    });
  };

  if (isLoading) return <LoadingScreen />;
  if (isError || !event) return <PageTransition><div className="min-h-screen bg-[#050508] flex items-center justify-center text-red-500 font-bebas text-2xl tracking-widest uppercase">Event not found. Please go back and try again.</div></PageTransition>;

  return (
    <PageTransition>
    <div ref={targetRef} className="min-h-screen text-white font-outfit pb-12 md:pb-24 selection:bg-violet-500/30">
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#12121A] border border-white/10 rounded-[3rem] p-12 max-w-md w-full shadow-2xl"
            >
              <div className="text-center space-y-8">
                <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto border border-rose-500/20">
                  <Trash2 className="w-10 h-10 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-bebas text-5xl text-white tracking-widest mb-4">DELETE REVIEW?</h3>
                  <p className="text-gray-500 font-medium">This action will permanently remove your feedback from the event protocol.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setDeleteConfirm({ isOpen: false, rid: null })}
                    className="py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleDeleteReview(deleteConfirm.rid)}
                    disabled={deleteReviewMutation.isPending}
                    className="py-4 rounded-2xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-600/20 hover:bg-rose-700 transition-all disabled:opacity-50"
                  >
                    {deleteReviewMutation.isPending ? "Removing..." : "Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <motion.div style={{ opacity, scale }} className="absolute inset-0 z-0">
          <SafeImage 
            src={event.eventImage} 
            alt={event.title} 
            className="w-full h-full object-cover scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/40 to-transparent"></div>
        </motion.div>

        <div className="absolute top-24 md:top-32 left-6 right-6 z-50 max-w-7xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white hover:text-black transition-all duration-500 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex gap-4">
            <button 
              onClick={handleShare}
              className="p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-violet-500 transition-all duration-500 group"
            >
              <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <button 
              onClick={handleLike}
              className={`p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl transition-all duration-500 group ${isLiked ? 'bg-rose-500/20 border-rose-500/50' : 'hover:bg-rose-500'}`}
            >
              <Heart className={`w-5 h-5 transition-all duration-500 group-active:scale-150 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 md:bottom-12 left-6 right-6 z-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="px-4 py-1.5 rounded-full bg-violet-600/90 text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-2xl flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> {event.category}
              </div>
              <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                Verified Event
              </div>
            </div>
            <h1 className="font-bebas text-4xl sm:text-7xl md:text-[8rem] lg:text-[10rem] leading-[0.85] tracking-tighter mb-6 md:mb-8 text-glow">
              {event.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-8 text-gray-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
              <div className="flex items-center gap-2 md:gap-3 bg-white/5 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-white/5">
                <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-violet-500" />
                <span>{new Date(event.eventDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 bg-white/5 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-white/5">
                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-violet-500" />
                <span>{event.eventLocation}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-10 md:mt-20 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
          <div className="lg:col-span-7 space-y-10 md:space-y-16">
            <div className="space-y-4 md:space-y-6">
              <h2 className="font-bebas text-4xl md:text-5xl text-white">ABOUT THE <span className="text-violet-500">EVENT</span></h2>
              <p className="text-gray-400 text-base md:text-xl leading-relaxed font-medium">
                {event.description}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Clock, label: "Duration", val: event.duration || "4h 30m" },
                { icon: Users, label: "Capacity", val: event.totalSeats },
                { icon: Ticket, label: "Available", val: event.totalSeats },
                { icon: Star, label: "Rating", val: `${event.averageRating?.toFixed(1) || "New"} (${event.totalReviews || 0})` }
              ].map((spec, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col gap-3 group hover:border-violet-500/30 transition-all">
                  <spec.icon className="w-4 h-4 md:w-5 md:h-5 text-violet-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-600 mb-1">{spec.label}</p>
                    <p className="text-white font-bold text-xs md:text-sm">{spec.val}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6 md:space-y-8 p-5 md:p-10 bg-gradient-to-br from-violet-600/10 to-blue-600/10 border border-white/5 rounded-[2rem] md:rounded-[3rem]">
              <div className="flex justify-between items-center">
                <h3 className="font-bebas text-2xl md:text-4xl text-white tracking-widest">Headlining <span className="text-blue-500">Artist</span></h3>
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 animate-pulse" />
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-violet-500/20">
                  <SafeAvatar src={null} name={event.eventArtistName} className="w-full h-full rounded-none" />
                </div>
                <div>
                  <p className="text-white font-black text-xl sm:text-2xl uppercase tracking-tighter">{event.eventArtistName}</p>
                  <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Headlining Artist</p>
                </div>
              </div>
            </div>

            <div className="space-y-12">
               <div className="flex items-end justify-between border-b border-white/5 pb-8">
                  <div>
                    <h2 className="font-bebas text-4xl md:text-5xl text-white">COMMUNITY <span className="text-violet-500">VOICE</span></h2>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">{event.totalReviews || 0} REVIEWS & FEEDBACK</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bebas text-white leading-none">{event.averageRating?.toFixed(1) || "0.0"}</p>
                    <div className="flex gap-1 mt-2">
                       {[1,2,3,4,5].map(s => (
                         <Star key={s} className={`w-3 h-3 ${s <= Math.round(event.averageRating || 0) ? "text-amber-400 fill-amber-400" : "text-gray-800"}`} />
                       ))}
                    </div>
                  </div>
               </div>

               {profile ? (
                 data?.hasBooked ? (
                   event.reviews?.some(r => r.user === profile._id) && !editingReview ? (
                     <div className="bg-violet-500/5 border border-violet-500/10 p-8 rounded-[2rem] text-center space-y-2">
                        <div className="w-12 h-12 bg-violet-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                           <ShieldCheck className="w-6 h-6 text-violet-400" />
                        </div>
                        <p className="text-white font-bebas text-2xl tracking-widest">REVIEW SUBMITTED</p>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Thank you for sharing your experience!</p>
                     </div>
                   ) : editingReview ? (
                     <div className="bg-white/[0.03] border border-violet-500/30 p-8 rounded-[2rem] space-y-6">
                        <h3 className="font-bebas text-2xl text-white tracking-widest uppercase">Update Your <span className="text-violet-500">Feedback</span></h3>
                        <form onSubmit={handleEditSubmit} className="space-y-6">
                           <div className="flex items-center gap-4">
                              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Update Rating:</p>
                              <div className="flex gap-1">
                                 {[1,2,3,4,5].map((star) => (
                                   <motion.button
                                     key={star}
                                     type="button"
                                     whileHover={{ scale: 1.2 }}
                                     whileTap={{ scale: 0.9 }}
                                     onClick={() => setEditForm(p => ({ ...p, rating: star }))}
                                   >
                                     <Star 
                                       className={`w-6 h-6 transition-all duration-300 ${
                                         star <= editForm.rating 
                                         ? "text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" 
                                         : "text-gray-800"
                                       }`} 
                                     />
                                   </motion.button>
                                 ))}
                              </div>
                           </div>
                           <textarea 
                              value={editForm.comment}
                              onChange={(e) => setEditForm(p => ({ ...p, comment: e.target.value }))}
                              className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all resize-none font-medium"
                           />
                           <div className="flex gap-4">
                              <button
                                 type="submit"
                                 disabled={updateReviewMutation.isPending}
                                 className="flex-1 py-4 bg-violet-600 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl shadow-2xl shadow-violet-600/20 disabled:opacity-50"
                              >
                                 {updateReviewMutation.isPending ? "SAVING..." : "SAVE CHANGES"}
                              </button>
                              <button
                                 type="button"
                                 onClick={() => setEditingReview(null)}
                                 className="px-8 py-4 bg-white/5 border border-white/10 text-gray-500 font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-white/10"
                              >
                                 CANCEL
                              </button>
                           </div>
                        </form>
                     </div>
                   ) : (
                     <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2rem] space-y-6">
                        <h3 className="font-bebas text-2xl text-white tracking-widest uppercase">Share Your <span className="text-violet-500">Experience</span></h3>
                        <form onSubmit={handleReviewSubmit} className="space-y-6">
                           <div className="flex items-center gap-4">
                              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Rate This Protocol:</p>
                              <div className="flex gap-1">
                                 {[1,2,3,4,5].map((star) => (
                                   <motion.button
                                     key={star}
                                     type="button"
                                     whileHover={{ scale: 1.2 }}
                                     whileTap={{ scale: 0.9 }}
                                     onMouseEnter={() => setHoveredRating(star)}
                                     onMouseLeave={() => setHoveredRating(0)}
                                     onClick={() => setReviewForm(p => ({ ...p, rating: star }))}
                                   >
                                     <Star 
                                       className={`w-6 h-6 transition-all duration-300 ${
                                         star <= (hoveredRating || reviewForm.rating) 
                                         ? "text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" 
                                         : "text-gray-800"
                                       }`} 
                                     />
                                   </motion.button>
                                 ))}
                              </div>
                           </div>
                           <textarea 
                              placeholder="What did you think of the vibe, sound, and organization?..."
                              value={reviewForm.comment}
                              onChange={(e) => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                              className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all resize-none font-medium placeholder-gray-700"
                           />
                           <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              disabled={addReviewMutation.isPending}
                              className="px-10 py-4 bg-violet-600 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl shadow-2xl shadow-violet-600/20 disabled:opacity-50"
                           >
                              {addReviewMutation.isPending ? "TRANSMITTING..." : "POST REVIEW"}
                           </motion.button>
                        </form>
                     </div>
                   )
                 ) : (
                   <div className="bg-white/[0.03] border border-dashed border-white/10 p-8 rounded-[2rem] text-center space-y-4">
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Reserve this experience to unlock reviews.</p>
                      <Link to={`/auth/book/${id}`} className="inline-block px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-violet-600 hover:text-white transition-all">Book Tickets</Link>
                   </div>
                 )
               ) : (
                 <div className="bg-white/[0.03] border border-dashed border-white/10 p-8 rounded-[2rem] text-center space-y-4">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Sign in to review experiences.</p>
                    <Link to="/login" className="inline-block px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-violet-600 hover:text-white transition-all">Sign In to Review</Link>
                 </div>
               )}

               <div className="space-y-6">
                 {event.reviews?.length > 0 ? (
                   event.reviews.map((rev, i) => (
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        key={rev._id} 
                        className={`p-8 bg-white/[0.02] border rounded-3xl space-y-4 relative group transition-all
                          ${editingReview === rev._id ? 'border-violet-500/50 bg-violet-500/5' : 'border-white/5'}`}
                     >
                        <div className="flex justify-between items-start">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/5">
                                 <SafeAvatar src={rev.avatar} name={rev.name} className="w-full h-full rounded-none" />
                              </div>
                              <div>
                                 <p className="text-white font-black text-sm uppercase tracking-tight">{rev.name}</p>
                                 <p className="text-gray-700 text-[10px] font-bold uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <div className="flex gap-1">
                              {[1,2,3,4,5].map(s => (
                                <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? "text-amber-400 fill-amber-400" : "text-gray-800"}`} />
                              ))}
                           </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed font-medium">{rev.comment}</p>
                        
                        {(profile?._id === rev.user || profile?.isAdmin) && (
                          <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            {profile?._id === rev.user && (
                              <button 
                                onClick={() => startEditing(rev)}
                                className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                                title="Edit Review"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => setDeleteConfirm({ isOpen: true, rid: rev._id })}
                              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                              title="Delete Review"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                     </motion.div>
                   ))
                 ) : (
                   <div className="py-20 text-center space-y-6">
                      <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto">
                         <Sparkles className="w-8 h-8 text-gray-800" />
                      </div>
                      <div>
                         <p className="text-white font-bebas text-3xl tracking-widest">BE THE FIRST</p>
                         <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] mt-1">No community reviews for this protocol yet.</p>
                      </div>
                   </div>
                 )}
               </div>
            </div>
          </div>

          {/* Right Column: Sticky Ticket Card */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32 space-y-6 md:space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-panel p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] space-y-6 md:space-y-8"
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-gray-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-none">Starting from</p>
                    <p className="text-3xl md:text-5xl font-bebas text-white">₹{event.ticketPrice?.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white text-black rounded-xl md:rounded-2xl flex items-center justify-center font-bebas text-2xl md:text-3xl shadow-2xl">
                    FQ
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">Secure Reservation</p>
                      <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">End-to-End Encryption</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Info className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">Booking Info</p>
                      <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Refundable via Wallet Credits</p>
                    </div>
                  </div>
                </div>

                {event.status === "completed" || event.status === "expired" ? (
                  <div className="w-full py-5 bg-white/5 border border-white/10 text-gray-500 font-black uppercase tracking-[0.3em] text-xs rounded-2xl text-center mt-4">
                    Booking Closed
                  </div>
                ) : (
                  <Link to={`/auth/book/${event._id}`} className="block mt-4">
                    <GlowButton variant="primary" className="w-full py-5 text-xs">
                      Book Tickets
                    </GlowButton>
                  </Link>
                )}

                <p className="text-center text-gray-700 text-[10px] font-bold uppercase tracking-widest">
                   Secure checkout powered by Festiq
                </p>
              </motion.div>

              {/* Promo Widget */}
              <div className="bg-[#12121A] border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
                    <Zap className="w-7 h-7" />
                 </div>
                 <div>
                    <p className="text-white font-bold text-sm">Exclusive Offers</p>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Check available coupons at checkout</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Experiences */}
      <section className="max-w-7xl mx-auto px-6 mt-20 md:mt-40">
        <div className="mb-8 md:mb-16">
          <h2 className="font-bebas text-3xl md:text-6xl text-white tracking-widest uppercase">SIMILAR <span className="text-blue-500">PROTOCOLS</span></h2>
          <p className="text-gray-500 font-bold text-[9px] md:text-sm uppercase tracking-widest">Other experiences designed for your mood.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedEvents.map((ev, idx) => (
            <motion.div
              key={ev._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <EventCard event={ev} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
    </PageTransition>
  );
}

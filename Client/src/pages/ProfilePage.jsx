import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, Camera, Edit, Trash2, Lock, Upload, 
  Settings, LogOut, Shield, Mail, Phone, Calendar, 
  Award, Star, Heart, Ticket, ChevronRight, User, Sparkles, Zap, ShieldCheck, Tag, Copy, CheckCircle2, Clock, LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { logoutUser } from '../features/auth/authSlice';
import SafeAvatar from '../components/SafeAvatar';
import SafeImage from '../components/SafeImage';
import { useProfile, useUpdateProfile, useChangePassword, useUpdateAvatar, useDeleteAvatar } from '../hooks/queries/useAuth';
import { useOrders, useUserCoupons } from '../hooks/queries/useOrders';
import TicketCard from '../components/TicketCard';
import LoadingScreen from '../components/LoadingScreen';
import PageTransition from '../components/animations/PageTransition';
import { useAdminAnalytics } from '../hooks/queries/useAdmin';
import { IndianRupee } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('identity');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const fileInputRef = useRef(null);

  const { data: freshUser, isLoading: profileLoading } = useProfile();
  const { data: ordersData, isLoading: ordersLoading } = useOrders();
  const { data: couponsData, isLoading: couponsLoading } = useUserCoupons();
  const { data: adminData } = useAdminAnalytics();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const updateAvatarMutation = useUpdateAvatar();
  const deleteAvatarMutation = useDeleteAvatar();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (freshUser || user) {
      const current = freshUser || user;
      setEditForm({ name: current.name || '', phone: current.phone || '' });
    }
  }, [freshUser, user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  const handleProfileUpdate = () => {
    if (!editForm.name.trim()) return toast.error("Name is required");
    updateProfileMutation.mutate(editForm, {
      onSuccess: (data) => {
        setIsEditing(false);
        // Update Redux localStorage
        localStorage.setItem('user', JSON.stringify(data));
      }
    });
  };

  const handlePasswordChange = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      return toast.error("Please fill both password fields");
    }
    if (passwordForm.newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }
    changePasswordMutation.mutate(passwordForm, {
      onSuccess: () => setPasswordForm({ currentPassword: '', newPassword: '' })
    });
  };

  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5MB");
      
      const formData = new FormData();
      formData.append('avatar', file);
      
      updateAvatarMutation.mutate(formData);
    }
  };

  const handleAvatarDelete = () => {
    if (window.confirm("Are you sure you want to remove your profile picture?")) {
      deleteAvatarMutation.mutate();
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon ${code} copied!`);
  };

  if (!user || profileLoading) return <LoadingScreen text="Loading your identity..." />;

  const orders = ordersData?.tickets || [];
  const coupons = couponsData?.coupons || [];
  const displayUser = freshUser || user;

  const stats = [
    { 
      icon: user.isAdmin ? IndianRupee : Ticket, 
      label: user.isAdmin ? "Platform Revenue" : "Experiences", 
      value: user.isAdmin 
        ? `₹${(adminData?.stats?.totalRevenue || 0).toLocaleString()}` 
        : orders.length.toString(), 
      color: user.isAdmin ? "text-blue-500" : "text-violet-500", 
      bg: user.isAdmin ? "bg-blue-500/10" : "bg-violet-500/10" 
    },
    { 
      icon: Zap, 
      label: user.isAdmin ? "Personal Wallet" : "Wallet", 
      value: `₹${displayUser.credits?.toLocaleString() || '0'}`, 
      color: "text-emerald-500", 
      bg: "bg-emerald-500/10" 
    },
    { 
      icon: user.isAdmin ? ShieldCheck : Tag, 
      label: user.isAdmin ? "Verified Users" : "My Coupons", 
      value: user.isAdmin 
        ? (adminData?.stats?.totalUsers || 0).toString() 
        : coupons.length.toString(), 
      color: user.isAdmin ? "text-violet-500" : "text-amber-500", 
      bg: user.isAdmin ? "bg-violet-500/10" : "bg-amber-500/10" 
    }
  ];

  const badges = [
    { icon: Sparkles, name: user.isAdmin ? "Platform Owner" : "Trendsetter", status: "Active" },
    { icon: ShieldCheck, name: "Verified Member", status: "Active" },
    { icon: Award, name: "Event Master", status: user.isAdmin ? "Active" : "Locked" }
  ];

  return (
    <PageTransition>
    <div className="min-h-screen text-white font-outfit selection:bg-violet-500/30 overflow-x-hidden pb-10 md:pb-20">
      {/* Cinematic Cover Section */}
      <section className="relative h-[30vh] md:h-[50vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SafeImage 
            src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600" 
            className="w-full h-full opacity-30 grayscale brightness-50" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/60 via-transparent to-transparent"></div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 -mt-20 md:-mt-32">
          
          {/* Left Side: Seeker Identity Card */}
          <aside className="lg:w-96 flex-shrink-0">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] text-center"
            >
              <div className="relative inline-block mb-8">
                 <div className="absolute inset-0 bg-violet-600 blur-[40px] opacity-20 rounded-full animate-pulse"></div>
                   <div className="relative">
                    <SafeAvatar src={displayUser.profilePicture} name={displayUser.name} className="w-28 h-28 md:w-40 md:h-40 ring-8 ring-[#050508]" />
                    {updateAvatarMutation.isPending && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      <button 
                        onClick={handleAvatarClick} 
                        disabled={updateAvatarMutation.isPending || deleteAvatarMutation.isPending}
                        className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center shadow-2xl hover:bg-violet-500 hover:text-white transition-all duration-500 disabled:opacity-50"
                        title="Change Avatar"
                      >
                         <Camera className="w-5 h-5" />
                      </button>
                      {displayUser.profilePicture && (
                        <button 
                          onClick={handleAvatarDelete} 
                          disabled={updateAvatarMutation.isPending || deleteAvatarMutation.isPending}
                          className="w-10 h-10 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl flex items-center justify-center shadow-2xl hover:bg-rose-500 hover:text-white transition-all duration-500 disabled:opacity-50"
                          title="Remove Avatar"
                        >
                           <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                 </div>
              </div>

              <h1 className="font-bebas text-3xl md:text-5xl text-white tracking-widest mb-1 truncate">{displayUser.name}</h1>
              <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] mb-8">{displayUser.isAdmin ? "Elite Admin" : "Seeker Member"}</p>

              <div className="space-y-3 pt-8 border-t border-white/5">
                {[
                  { id: 'identity', label: 'Identity', icon: User },
                  { id: 'coupons', label: 'Rewards', icon: Tag },
                  { id: 'bookings', label: 'Reservations', icon: Ticket },
                  { id: 'security', label: 'Security', icon: Shield }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-3.5 md:p-5 rounded-xl md:rounded-2xl transition-all duration-500 ${
                      activeTab === tab.id ? 'bg-white/5 border border-white/10 text-white shadow-xl' : 'text-gray-600 hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                       <tab.icon className={`w-4 h-4 md:w-5 md:h-5 ${activeTab === tab.id ? 'text-violet-500' : ''}`} />
                       <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'rotate-90 text-violet-500' : ''}`} />
                  </button>
                ))}
                
                {user.isAdmin && (
                  <Link to="/admin">
                    <button className="w-full flex items-center justify-between p-5 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-400 hover:bg-violet-600 hover:text-white transition-all duration-500 mb-3 text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95">
                      <div className="flex items-center gap-4">
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Admin Dashboard</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                )}

                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 p-3.5 md:p-5 rounded-xl md:rounded-2xl bg-rose-500/5 text-rose-500 border border-rose-500/10 hover:bg-rose-500 hover:text-white transition-all duration-500 mt-6 text-[10px] font-black uppercase tracking-widest"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            </motion.div>
          </aside>

          <main className="flex-1 space-y-12">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {stats.map((s, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#12121A] border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 group hover:border-violet-500/30 transition-all duration-500"
                >
                   <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl ${s.bg} flex items-center justify-center mb-4 md:mb-6`}>
                      <s.icon className={`w-5 h-5 md:w-6 md:h-6 ${s.color}`} />
                   </div>
                   <p className="font-bebas text-4xl md:text-6xl text-white tracking-widest leading-none mb-2">{s.value}</p>
                   <p className="text-gray-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest">{s.label}</p>
                </motion.div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'identity' && (
                <motion.div 
                  key="identity"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                   <div className="bg-[#12121A] border border-white/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12">
                      <h2 className="font-bebas text-2xl md:text-4xl text-white tracking-widest mb-10">MY <span className="text-blue-500">IDENTITY</span></h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
                        {isEditing ? (
                          <>
                            <div className="space-y-3">
                              <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Full Name</p>
                              <div className="flex items-center gap-4 p-5 bg-white/[0.02] border border-violet-500/30 rounded-2xl">
                                <User className="w-5 h-5 text-violet-400" />
                                <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="bg-transparent text-white font-bold text-sm outline-none w-full" placeholder="Your name" />
                              </div>
                            </div>
                            <div className="space-y-3">
                              <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Email Address</p>
                              <div className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl opacity-50">
                                <Mail className="w-5 h-5 text-gray-500" />
                                <span className="text-gray-400 font-bold text-sm truncate">{displayUser.email}</span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Phone Number</p>
                              <div className="flex items-center gap-4 p-5 bg-white/[0.02] border border-violet-500/30 rounded-2xl">
                                <Phone className="w-5 h-5 text-violet-400" />
                                <input type="text" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="bg-transparent text-white font-bold text-sm outline-none w-full" placeholder="Your phone" />
                              </div>
                            </div>
                            <div className="space-y-3">
                              <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Member Since</p>
                              <div className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl opacity-50">
                                <Calendar className="w-5 h-5 text-gray-500" />
                                <span className="text-gray-400 font-bold text-sm">{new Date(displayUser.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          [
                            { label: "Full Name", val: displayUser.name, icon: User },
                            { label: "Email Address", val: displayUser.email, icon: Mail },
                            { label: "Phone Number", val: displayUser.phone || "Not set", icon: Phone },
                            { label: "Member Since", val: new Date(displayUser.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }), icon: Calendar }
                          ].map((item, i) => (
                            <div key={i} className="space-y-2 md:space-y-3">
                               <p className="text-gray-700 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] ml-1">{item.label}</p>
                               <div className="flex items-center gap-4 p-4 md:p-5 bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl group hover:border-violet-500/50 transition-all">
                                  <item.icon className="w-4 h-4 md:w-5 md:h-5 text-gray-500 group-hover:text-violet-400 transition-colors" />
                                  <span className="text-white font-bold text-sm truncate">{item.val}</span>
                               </div>
                            </div>
                          ))
                        )}
                      </div>
                      
                      <div className="mt-12 flex gap-4">
                        {isEditing ? (
                          <>
                            <button onClick={handleProfileUpdate} disabled={updateProfileMutation.isPending} className="px-6 py-4 md:px-10 md:py-5 bg-violet-600 text-white rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-violet-700 transition-all duration-500 shadow-2xl active:scale-95 disabled:opacity-50">
                               {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button onClick={() => setIsEditing(false)} className="px-6 py-4 md:px-10 md:py-5 bg-white/5 text-gray-400 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all border border-white/10">
                                Cancel
                            </button>
                          </>
                        ) : (
                          <button onClick={() => setIsEditing(true)} className="px-6 py-4 md:px-10 md:py-5 bg-white text-black rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-violet-600 hover:text-white transition-all duration-500 shadow-2xl active:scale-95">
                             Update Protocol
                          </button>
                        )}
                      </div>
                   </div>

                   <div className="space-y-6 md:space-y-8">
                      <h2 className="font-bebas text-3xl md:text-4xl text-white tracking-widest">MY <span className="text-emerald-500">BADGES</span></h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {badges.map((b, i) => (
                          <div key={i} className={`p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-500 flex items-center gap-6 ${
                            b.status === 'Active' ? 'bg-white/[0.03] border-white/10 hover:border-emerald-500/30' : 'bg-white/[0.01] border-white/5 grayscale opacity-30'
                          }`}>
                             <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center ${b.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-500'}`}>
                                <b.icon className="w-6 h-6 md:w-7 md:h-7" />
                             </div>
                             <div>
                                <p className="text-white font-bold text-sm mb-1">{b.name}</p>
                                <p className={`text-[8px] font-black uppercase tracking-widest ${b.status === 'Active' ? 'text-emerald-500' : 'text-gray-700'}`}>{b.status}</p>
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>
                </motion.div>
              )}

              {activeTab === 'coupons' && (
                <motion.div 
                   key="coupons"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="space-y-8"
                >
                   <div className="flex justify-between items-end mb-6">
                      <div>
                        <h2 className="font-bebas text-4xl md:text-5xl text-white tracking-widest leading-none">MY <span className="text-amber-500">REWARDS</span></h2>
                        <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest mt-3">Exclusive discount protocols assigned to your account</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-2">
                         <Sparkles className="w-4 h-4 text-amber-500" />
                         <span className="text-white text-[10px] font-black uppercase tracking-widest">{coupons.length} Active Codes</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {coupons.length > 0 ? coupons.map((coupon, i) => (
                        <div key={i} className="group relative bg-[#12121A] border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 overflow-hidden hover:border-amber-500/30 transition-all duration-500">
                           <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full group-hover:bg-amber-500/10 transition-all"></div>
                           
                           <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                              <div className="flex justify-between items-start">
                                 <div className="p-4 bg-amber-500/10 rounded-2xl">
                                    <Tag className="w-6 h-6 text-amber-500" />
                                 </div>
                                 <div className="text-right">
                                    <p className="text-white font-bebas text-4xl tracking-widest">
                                       {coupon.discountType === 'percentage' ? `${coupon.couponDiscount}%` : `₹${coupon.couponDiscount}`}
                                    </p>
                                    <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest">Discount Protocol</p>
                                 </div>
                              </div>

                              <div className="space-y-4">
                                 <div className="flex flex-col gap-1">
                                    <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Unlock Code</span>
                                    <div className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 group/code">
                                       <span className="font-mono text-white font-bold tracking-[0.2em]">{coupon.couponCode}</span>
                                       <button 
                                         onClick={() => copyToClipboard(coupon.couponCode)}
                                         className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all"
                                       >
                                          <Copy className="w-4 h-4" />
                                       </button>
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                       <Clock className="w-3.5 h-3.5 text-gray-700" />
                                       <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">
                                          Expires: {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'NEVER'}
                                       </span>
                                    </div>
                                    <div className="flex items-center gap-2 justify-end">
                                       <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                       <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Verified</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                      )) : (
                        <div className="col-span-full py-20 text-center space-y-6 bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem]">
                           <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto">
                              <Tag className="w-8 h-8 text-gray-800" />
                           </div>
                           <h3 className="font-bebas text-3xl text-gray-500 tracking-widest">No Active Coupons</h3>
                           <p className="text-gray-700 text-xs font-medium max-w-xs mx-auto">Keep exploring events to unlock exclusive discount protocols.</p>
                        </div>
                      )}
                   </div>
                </motion.div>
              )}

              {activeTab === 'bookings' && (
                <motion.div 
                   key="bookings"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="py-20 text-center"
                >
                    {orders.length > 0 ? (
                      <div className="space-y-6 max-w-3xl mx-auto text-left">
                         {orders.map((order) => (
                           <TicketCard key={order._id} order={order} />
                         ))}
                      </div>
                   ) : (
                     <>
                        <div className="w-24 h-24 bg-white/5 border border-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                           <Ticket className="w-10 h-10 text-gray-700" />
                        </div>
                        <h3 className="font-bebas text-5xl text-white tracking-widest mb-2">No Active Reservations</h3>
                        <p className="text-gray-500 font-medium max-w-sm mx-auto">You haven't booked any events yet. Explore events to get started.</p>
                        <Link to="/events">
                          <button className="mt-10 px-8 py-4 bg-violet-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-violet-700 transition-all">Explore Events</button>
                        </Link>
                     </>
                    )}
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div 
                   key="security"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="bg-[#12121A] border border-white/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12"
                >
                   <h2 className="font-bebas text-3xl md:text-4xl text-white tracking-widest mb-10">SECURITY <span className="text-rose-500">SETTINGS</span></h2>
                   <div className="space-y-8 max-w-md">
                      <div className="space-y-3">
                         <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Current Password</p>
                         <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-rose-500 transition-colors" />
                            <input 
                              type="password" 
                              placeholder="••••••••" 
                              value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4.5 pl-14 pr-6 text-white outline-none focus:border-rose-500/50 transition-all" 
                            />
                         </div>
                      </div>
                      <div className="space-y-3">
                         <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.2em] ml-1">New Password</p>
                         <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-rose-500 transition-colors" />
                            <input 
                              type="password" 
                              placeholder="••••••••" 
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4.5 pl-14 pr-6 text-white outline-none focus:border-rose-500/50 transition-all" 
                            />
                         </div>
                      </div>
                      <button 
                        onClick={handlePasswordChange}
                        disabled={changePasswordMutation.isPending}
                        className="px-10 py-5 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-700 transition-all shadow-2xl shadow-rose-600/20 active:scale-95 disabled:opacity-50"
                      >
                        {changePasswordMutation.isPending ? 'Updating...' : 'Update Protocol'}
                      </button>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

    </div>
    </PageTransition>
  );
}

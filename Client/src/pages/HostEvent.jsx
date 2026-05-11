import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Upload, Sparkles, MapPin, Calendar, Users, IndianRupee, Image as ImageIcon, CheckCircle2, Zap, Loader2 } from 'lucide-react';
import { useHostEvent } from '../hooks/queries/useEvents';
import { toast } from 'react-toastify';
import { CATEGORIES } from '../constants/categories';
import PageTransition from '../components/animations/PageTransition';

export default function HostEvent() {
  const navigate = useNavigate();
  const hostEventMutation = useHostEvent();
  
  const [step, setStep] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    customCategory: '',
    eventArtistName: '',
    eventDate: '',
    duration: '',
    eventLocation: '',
    totalSeats: '',
    ticketPrice: '',
    description: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.title || !formData.category || !formData.eventArtistName)) {
      return toast.info("Please fill in all basic details.");
    }
    if (step === 1 && formData.category === 'Other' && !formData.customCategory) {
      return toast.info("Please specify your custom category.");
    }
    if (step === 2 && (!formData.eventDate || !formData.duration || !formData.eventLocation || !formData.totalSeats || !formData.ticketPrice)) {
      return toast.info("Please complete the logistics section.");
    }
    setStep(s => Math.min(3, s + 1));
  };

  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !formData.description) return toast.info('Please add an image and description.');

    const dataToSend = new FormData();
    
    // Determine final category
    const finalCategory = formData.category === 'Other' ? formData.customCategory : formData.category;

    Object.keys(formData).forEach(key => {
      if (key === 'category') {
        dataToSend.append(key, finalCategory);
      } else if (key !== 'customCategory') {
        dataToSend.append(key, formData[key]);
      }
    });

    dataToSend.append('eventImage', imageFile);

    hostEventMutation.mutate(dataToSend, {
      onSuccess: () => {
        navigate('/creator/dashboard');
      }
    });
  };

  const slideVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
  };

  return (
    <PageTransition>
    <div className="min-h-screen bg-[#050508] text-white selection:bg-violet-500/30 font-outfit overflow-x-hidden">
      
      {/* Decorative Background */}
      <div className="max-w-4xl mx-auto pt-32 pb-20 px-6">
        
        {/* Header */}
        <div className="text-center mb-16 relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-600/20 blur-[100px] rounded-full pointer-events-none"></div>
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
                 <Sparkles className="w-4 h-4 text-amber-400" />
                 <span className="text-white text-[10px] font-black uppercase tracking-widest">Creator Studio</span>
              </div>
              <h1 className="font-bebas text-6xl md:text-8xl text-white tracking-widest leading-none">HOST AN <span className="text-violet-500">EXPERIENCE</span></h1>
              <p className="text-gray-400 mt-4 max-w-lg mx-auto">Launch your own events, manage attendees, and build your community on the MoodGo platform.</p>
           </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -z-10"></div>
          <div className="absolute top-1/2 left-0 h-[1px] bg-violet-500 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          
          {[1, 2, 3].map((num) => (
            <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bebas text-xl transition-all duration-500 ${step >= num ? 'bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]' : 'bg-[#12121A] border border-white/10 text-gray-600'}`}>
              {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-[#0A0A0F] border border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          {/* Ambient Corner Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none"></div>

          <div className="p-8 md:p-12 relative z-10">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: BASICS */}
              {step === 1 && (
                <motion.div key="step1" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                  <div>
                    <h2 className="font-bebas text-3xl text-white tracking-widest mb-1">Basic Details</h2>
                    <p className="text-gray-500 text-xs font-medium">What is your event about?</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest ml-1">Event Title</label>
                      <input name="title" value={formData.title} onChange={handleChange} placeholder="Enter an eye-catching title..." className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-700 outline-none focus:border-violet-500/50 transition-all text-lg font-medium" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest ml-1">Category</label>
                        <select 
                          name="category" 
                          value={formData.category} 
                          onChange={handleChange} 
                          className="w-full bg-[#0F0F16] border border-white/10 rounded-2xl px-6 py-4 text-gray-400 outline-none focus:border-violet-500/50 transition-all font-medium appearance-none cursor-pointer"
                        >
                          <option value="">Select Category</option>
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest ml-1">Organizer / Artist</label>
                        <input name="eventArtistName" value={formData.eventArtistName} onChange={handleChange} placeholder="Who is hosting?" className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-700 outline-none focus:border-violet-500/50 transition-all font-medium" />
                      </div>
                    </div>

                    {formData.category === 'Other' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="space-y-2"
                      >
                        <label className="text-violet-500 text-[10px] font-black uppercase tracking-widest ml-1">Specify Custom Category</label>
                        <input 
                          name="customCategory" 
                          value={formData.customCategory} 
                          onChange={handleChange} 
                          placeholder="e.g. Anime Convention, Undergound Rave..." 
                          className="w-full bg-violet-500/5 border border-violet-500/20 rounded-2xl px-6 py-4 text-white placeholder-violet-900/50 outline-none focus:border-violet-500 transition-all font-medium" 
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: LOGISTICS */}
              {step === 2 && (
                <motion.div key="step2" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                  <div>
                    <h2 className="font-bebas text-3xl text-white tracking-widest mb-1">When & Where</h2>
                    <p className="text-gray-500 text-xs font-medium">Define the logistical parameters of your event.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest ml-1"><Calendar className="w-3 h-3 text-violet-400"/> Date & Time</label>
                      <input type="datetime-local" name="eventDate" value={formData.eventDate} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-violet-500/50 transition-all [color-scheme:dark]" />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest ml-1"><Zap className="w-3 h-3 text-violet-400"/> Duration</label>
                      <input name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. 3 Hours" className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-700 outline-none focus:border-violet-500/50 transition-all font-medium" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest ml-1"><MapPin className="w-3 h-3 text-rose-400"/> Location / Venue</label>
                      <input name="eventLocation" value={formData.eventLocation} onChange={handleChange} placeholder="Full address or virtual link" className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-700 outline-none focus:border-violet-500/50 transition-all font-medium" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest ml-1"><Users className="w-3 h-3 text-blue-400"/> Total Capacity</label>
                      <input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleChange} placeholder="100" className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-700 outline-none focus:border-violet-500/50 transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest ml-1"><IndianRupee className="w-3 h-3 text-emerald-400"/> Ticket Price (₹)</label>
                      <input type="number" name="ticketPrice" value={formData.ticketPrice} onChange={handleChange} placeholder="999" className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-700 outline-none focus:border-emerald-500/50 transition-all font-medium" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: MEDIA & DETAILS */}
              {step === 3 && (
                <motion.div key="step3" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                  <div>
                    <h2 className="font-bebas text-3xl text-white tracking-widest mb-1">Visuals & Story</h2>
                    <p className="text-gray-500 text-xs font-medium">Make it cinematic. Upload a high-quality banner and describe the experience.</p>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Image Upload Box */}
                    <div className="relative group">
                      <div className={`w-full h-64 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden relative cursor-pointer ${imagePreview ? 'border-violet-500/50' : 'border-white/10 hover:border-violet-500/30 bg-white/[0.01]'}`}>
                         <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                         
                         {imagePreview ? (
                           <>
                             <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                               <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
                                 <Upload className="w-4 h-4" /> Change Image
                               </div>
                             </div>
                           </>
                         ) : (
                           <div className="text-center">
                             <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                                <ImageIcon className="w-8 h-8 text-gray-500" />
                             </div>
                             <p className="text-white font-medium">Upload Event Banner</p>
                             <p className="text-gray-600 text-xs mt-1">Recommended: 1920x1080 (High Resolution)</p>
                           </div>
                         )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest ml-1">Event Description</label>
                      <textarea name="description" value={formData.description} onChange={handleChange} rows="5" placeholder="Tell people what to expect..." className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-700 outline-none focus:border-violet-500/50 transition-all resize-none font-medium leading-relaxed"></textarea>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Navigation */}
            <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
              <button 
                onClick={prevStep} 
                disabled={step === 1}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-xl transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'}`}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              {step < 3 ? (
                <button 
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-white text-black hover:bg-violet-500 hover:text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={hostEventMutation.isPending}
                  className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_30px_rgba(139,92,246,0.3)] disabled:opacity-50"
                >
                  {hostEventMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</> : <><Sparkles className="w-4 h-4" /> Publish Event</>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}

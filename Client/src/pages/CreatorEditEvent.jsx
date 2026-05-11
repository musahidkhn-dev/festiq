import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save, Upload, Sparkles, Calendar, MapPin, Tag, Users, Clock, IndianRupee, Info, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEventDetail, useUpdateEvent } from '../hooks/queries/useEvents';
import { toast } from 'react-toastify';
import LoadingScreen from '../components/LoadingScreen';
import { CATEGORIES } from '../constants/categories';

export default function CreatorEditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: eventData, isLoading, isError } = useEventDetail(id);
  const updateEventMutation = useUpdateEvent();
  
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    customCategory: '',
    description: '',
    eventDate: '',
    eventLocation: '',
    eventArtistName: '',
    totalSeats: '',
    duration: '',
    ticketPrice: '',
    status: 'upcoming',
    isActive: true
  });

  // Populate form when data is fetched
  useEffect(() => {
    if (eventData?.event) {
      const ev = eventData.event;
      const isPredefined = CATEGORIES.includes(ev.category);
      
      setFormData({
        title: ev.title || '',
        category: isPredefined ? ev.category : (ev.category ? 'Other' : ''),
        customCategory: isPredefined ? '' : (ev.category || ''),
        description: ev.description || '',
        eventDate: ev.eventDate ? new Date(ev.eventDate).toISOString().split('T')[0] : '',
        eventLocation: ev.eventLocation || '',
        eventArtistName: ev.eventArtistName || '',
        totalSeats: ev.totalSeats || '',
        duration: ev.duration || '',
        ticketPrice: ev.ticketPrice || '',
        status: ev.status || 'upcoming',
        isActive: ev.isActive !== undefined ? ev.isActive : true
      });
    }
  }, [eventData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    const finalCategory = formData.category === 'Other' ? formData.customCategory : formData.category;
    Object.keys(formData).forEach(key => {
      if (key === 'category') {
        dataToSend.append(key, finalCategory);
      } else if (key !== 'customCategory') {
        dataToSend.append(key, formData[key]);
      }
    });
    
    if (imageFile) {
      dataToSend.append('eventImage', imageFile);
    }

    updateEventMutation.mutate({ id, formData: dataToSend }, {
      onSuccess: () => {
        navigate('/creator/dashboard');
      }
    });
  };

  if (isLoading) return <LoadingScreen />;
  if (isError || !eventData?.event) return (
    <div className="min-h-screen flex items-center justify-center text-rose-500 font-bebas text-3xl tracking-widest">
      EVENT NOT FOUND / TRANSMISSION ERROR
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pt-32 selection:bg-violet-500/30 pb-20 px-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <button 
            onClick={() => navigate('/creator/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-white transition-all mb-4 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Studio</span>
          </button>
          <h1 className="font-bebas text-7xl text-white tracking-wider uppercase">Edit <span className="text-violet-500">Experience</span></h1>
          <p className="text-gray-500 font-medium">Update your cinematic event and resubmit for review.</p>
        </div>
        
        <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/5 rounded-2xl">
           <Zap className="w-4 h-4 text-violet-500" />
           <span className="text-white text-[10px] font-black uppercase tracking-widest">Creator Protocol</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#12121A] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl"
      >
        <form onSubmit={handleSubmit} className="p-10 md:p-16 space-y-20">
          
          {/* Identity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
               <h3 className="font-bebas text-4xl text-white tracking-widest mb-4">CORE <span className="text-blue-500">IDENTITY</span></h3>
               <p className="text-gray-600 text-xs font-medium leading-relaxed">Modify the title, artist, and primary classification. Edits will trigger a re-review.</p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-gray-700 text-[10px] font-black uppercase tracking-widest ml-1">Event Title</label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4.5 text-white outline-none focus:border-violet-500/50 transition-all font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 text-[10px] font-black uppercase tracking-widest ml-1">Headlining Artist</label>
                <input required name="eventArtistName" value={formData.eventArtistName} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4.5 text-white outline-none focus:border-violet-500/50 transition-all font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 text-[10px] font-black uppercase tracking-widest ml-1">Event Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#0F0F16] border border-white/5 rounded-2xl px-6 py-4.5 text-gray-500 outline-none focus:border-violet-500/50 transition-all font-bold appearance-none cursor-pointer">
                  <option value="">Select Category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              {formData.category === 'Other' && (
                <div className="md:col-span-2 space-y-2">
                  <label className="text-violet-500 text-[10px] font-black uppercase tracking-widest ml-1">Specify Custom Category</label>
                  <input name="customCategory" value={formData.customCategory} onChange={handleChange} placeholder="e.g. Anime Convention, Underground Rave..." className="w-full bg-violet-500/5 border border-violet-500/20 rounded-2xl px-6 py-4.5 text-white placeholder-violet-900/50 outline-none focus:border-violet-500 transition-all font-bold" />
                </div>
              )}
              
              <div className="md:col-span-2 space-y-2">
                <label className="text-gray-700 text-[10px] font-black uppercase tracking-widest ml-1">Event Description</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows="6" className="w-full bg-white/[0.02] border border-white/5 rounded-3xl px-6 py-6 text-white outline-none focus:border-violet-500/50 transition-all font-bold resize-none" />
              </div>
            </div>
          </div>

          {/* Logistics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pt-10 border-t border-white/5">
            <div className="lg:col-span-4">
               <h3 className="font-bebas text-4xl text-white tracking-widest mb-4">LOGISTICS & <span className="text-emerald-500">PRICING</span></h3>
               <p className="text-gray-600 text-xs font-medium leading-relaxed">Adjust timing, venue capacity, and entry fees.</p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-gray-700 text-[10px] font-black uppercase tracking-widest ml-1">Event Date</label>
                <input required type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4.5 text-white outline-none focus:border-violet-500/50 transition-all font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 text-[10px] font-black uppercase tracking-widest ml-1">Venue</label>
                <input required name="eventLocation" value={formData.eventLocation} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4.5 text-white outline-none focus:border-violet-500/50 transition-all font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 text-[10px] font-black uppercase tracking-widest ml-1">Duration</label>
                <input required name="duration" value={formData.duration} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4.5 text-white outline-none focus:border-violet-500/50 transition-all font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 text-[10px] font-black uppercase tracking-widest ml-1">Total Seats</label>
                <input required type="number" name="totalSeats" value={formData.totalSeats} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4.5 text-white outline-none focus:border-violet-500/50 transition-all font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 text-[10px] font-black uppercase tracking-widest ml-1">Entry Price (₹)</label>
                <input required type="number" name="ticketPrice" value={formData.ticketPrice} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4.5 text-white outline-none focus:border-violet-500/50 transition-all font-bold" />
              </div>
            </div>
          </div>

          {/* Image Overwrite Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pt-10 border-t border-white/5">
            <div className="lg:col-span-4">
               <h3 className="font-bebas text-4xl text-white tracking-widest mb-4">COVER <span className="text-amber-500">ASSET</span></h3>
               <p className="text-gray-600 text-xs font-medium leading-relaxed">Optionally upload a new image to overwrite the current one.</p>
            </div>
            <div className="lg:col-span-8">
               <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-40 h-40 rounded-3xl overflow-hidden ring-4 ring-white/5 shadow-2xl flex-shrink-0">
                     <img src={eventData.event.eventImage} alt="Current" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="relative group">
                      <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-50" />
                      <div className={`p-10 rounded-[2.5rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center gap-4 ${
                        imageFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03]'
                      }`}>
                         <Upload className={`w-8 h-8 ${imageFile ? 'text-emerald-500' : 'text-gray-700'}`} />
                         <p className="text-white font-bold text-sm">{imageFile ? imageFile.name : 'Click to Replace Image'}</p>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-between pt-10 border-t border-white/5">
             <div className="flex items-center gap-4 text-gray-700 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> Finalize Changes
             </div>
             <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               disabled={updateEventMutation.isPending}
               type="submit"
               className="bg-violet-600 text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 shadow-2xl hover:bg-violet-700 transition-all duration-500 disabled:opacity-50 group"
             >
               {updateEventMutation.isPending ? 'UPDATING...' : (
                 <>
                   Resubmit for Review <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                 </>
               )}
             </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

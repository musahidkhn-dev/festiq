import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Upload, Sparkles, Calendar, MapPin, Tag, Users, Clock, IndianRupee, Info, Zap, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreateEvent } from '../../hooks/queries/useEvents';
import { toast } from 'react-toastify';
import { CATEGORIES } from '../../constants/categories';

export default function CreateEvent() {
  const navigate = useNavigate();
  const createEventMutation = useCreateEvent();
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
    status: 'upcoming'
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return toast.error('System Error: Event image required.');

    const dataToSend = new FormData();
    const finalCategory = formData.category === 'Other' ? formData.customCategory : formData.category;
    Object.keys(formData).forEach(key => {
      if (key === 'category') {
        dataToSend.append(key, finalCategory);
      } else if (key !== 'customCategory') {
        dataToSend.append(key, formData[key]);
      }
    });
    dataToSend.append('eventImage', imageFile);

    createEventMutation.mutate(dataToSend, {
      onSuccess: () => {
        toast.success("Event Created Successfully!");
        navigate('/admin/events');
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto selection:bg-violet-500/30 pb-20">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <button 
            onClick={() => navigate('/admin/events')}
            className="flex items-center gap-2 text-gray-600 hover:text-white transition-all mb-4 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cancel</span>
          </button>
          <h1 className="font-bebas text-7xl text-white tracking-wider">CREATE <span className="text-violet-500">EVENT</span></h1>
          <p className="text-gray-500 font-medium">Add a new event to the Festiq platform.</p>
        </div>
        
        <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/5 rounded-2xl">
           <Zap className="w-4 h-4 text-violet-500" />
           <span className="text-white text-[10px] font-black uppercase tracking-widest">Event Form</span>
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
               <h3 className="font-bebas text-4xl text-white tracking-widest mb-4">EVENT <span className="text-blue-500">DETAILS</span></h3>
               <p className="text-gray-600 text-xs font-medium leading-relaxed">Define the core information and headliner for this event.</p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-gray-700 text-[10px] font-black uppercase tracking-widest ml-1">Event Title</label>
                <input required name="title" value={formData.title} onChange={handleChange} placeholder="Cyberpunk Summit 2025" className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4.5 text-white placeholder-gray-800 outline-none focus:border-violet-500/50 transition-all font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 text-[10px] font-black uppercase tracking-widest ml-1">Headlining Artist</label>
                <input required name="eventArtistName" value={formData.eventArtistName} onChange={handleChange} placeholder="Neon Pulse Collective" className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4.5 text-white placeholder-gray-800 outline-none focus:border-violet-500/50 transition-all font-bold" />
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
              <div className="space-y-2">
                <label className="text-gray-700 text-[10px] font-black uppercase tracking-widest ml-1">Event Status</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange} 
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4.5 text-gray-500 outline-none focus:border-violet-500/50 transition-all font-bold appearance-none"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live Event</option>
                  <option value="completed">Completed (Archive)</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="postponed">Postponed</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-gray-700 text-[10px] font-black uppercase tracking-widest ml-1">Event Description</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Describe the event for your attendees..." className="w-full bg-white/[0.02] border border-white/5 rounded-3xl px-6 py-6 text-white placeholder-gray-800 outline-none focus:border-violet-500/50 transition-all font-bold resize-none" />
              </div>
            </div>
          </div>

          {/* Logistics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pt-10 border-t border-white/5">
            <div className="lg:col-span-4">
               <h3 className="font-bebas text-4xl text-white tracking-widest mb-4">TIME & <span className="text-emerald-500">LOCATION</span></h3>
               <p className="text-gray-600 text-xs font-medium leading-relaxed">Set the date, location, and pricing for your event.</p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-gray-700 text-[10px] font-black uppercase tracking-widest ml-1">Event Date</label>
                <input required type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4.5 text-white outline-none focus:border-violet-500/50 transition-all font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 text-[10px] font-black uppercase tracking-widest ml-1">Venue</label>
                <input required name="eventLocation" value={formData.eventLocation} onChange={handleChange} placeholder="Berlin Outer Rim" className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4.5 text-white placeholder-gray-800 outline-none focus:border-violet-500/50 transition-all font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 text-[10px] font-black uppercase tracking-widest ml-1">Duration</label>
                <input required name="duration" value={formData.duration} onChange={handleChange} placeholder="6 Hours" className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4.5 text-white placeholder-gray-800 outline-none focus:border-violet-500/50 transition-all font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 text-[10px] font-black uppercase tracking-widest ml-1">Total Seats</label>
                <input required type="number" name="totalSeats" value={formData.totalSeats} onChange={handleChange} placeholder="1500" className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4.5 text-white placeholder-gray-800 outline-none focus:border-violet-500/50 transition-all font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 text-[10px] font-black uppercase tracking-widest ml-1">Entry Price (₹)</label>
                <input required type="number" name="ticketPrice" value={formData.ticketPrice} onChange={handleChange} placeholder="2499" className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4.5 text-white placeholder-gray-800 outline-none focus:border-violet-500/50 transition-all font-bold" />
              </div>
            </div>
          </div>

          {/* Assets Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pt-10 border-t border-white/5">
            <div className="lg:col-span-4">
               <h3 className="font-bebas text-4xl text-white tracking-widest mb-4">EVENT <span className="text-amber-500">IMAGE</span></h3>
               <p className="text-gray-600 text-xs font-medium leading-relaxed">Upload the main cover image for the event.</p>
            </div>
            <div className="lg:col-span-8">
              <div className="relative group">
                <input required type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-50" />
                <div className={`p-16 rounded-[3rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center gap-6 ${
                  imageFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-violet-500/30'
                }`}>
                   <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center transition-transform duration-500 ${
                     imageFile ? 'bg-emerald-500 text-white' : 'bg-white/5 text-gray-700 group-hover:scale-110 group-hover:text-violet-500'
                   }`}>
                      {imageFile ? <ShieldCheck className="w-10 h-10" /> : <Upload className="w-10 h-10" />}
                   </div>
                   <div className="text-center">
                     <p className="text-white font-bold text-lg mb-1">{imageFile ? imageFile.name : 'Upload Image'}</p>
                     <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.2em]">MAX_SIZE: 10MB | FORMAT: WEBP/PNG/JPG</p>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-between pt-10 border-t border-white/5">
             <div className="flex items-center gap-4 text-gray-700 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> Secure Submit
             </div>
             <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               disabled={createEventMutation.isPending}
               type="submit"
               className="bg-white text-black px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 shadow-2xl hover:bg-violet-600 hover:text-white transition-all duration-500 disabled:opacity-50 group"
             >
               {createEventMutation.isPending ? 'CREATING...' : (
                 <>
                   Create Event <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                 </>
               )}
             </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

import { MapPin, Camera, Edit, Trash2, Lock, Upload } from 'lucide-react'
import Navbar from '../components/Navbar'
import EventCard from '../components/EventCard'
import { currentUser,  comments } from '../data/mockData'
import { Star } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const achievements = [
  { emoji: "🎟️", name: "First Event", earned: true },
  { emoji: "⭐", name: "10 Events", earned: true },
  { emoji: "🏆", name: "Super Fan", earned: true },
  { emoji: "💬", name: "Reviewer", earned: true },
  { emoji: "🗺️", name: "Explorer", earned: false }
]


export default function ProfilePage() {

   const {user} = useSelector(state => state.auth  )

   const navigate = useNavigate()

   useEffect(() => {
    if(!user){
      navigate("/login")
    }
    if(user.isAdmin){
      navigate("/admin")
    }
   },[user])

  return (
    <div className="bg-[#0A0A0F] min-h-screen text-white font-['DM_Sans']">
      <Navbar />

      {/* Header Banner */}
      <div className="h-48 bg-gradient-to-r from-violet-900/40 via-[#1A1A2E] to-amber-900/20 relative overflow-hidden">
        <div className="absolute top-10 right-20 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Profile Info */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="-mt-16 flex flex-col md:flex-row md:items-end gap-6">
          <div className="w-32 h-32 rounded-2xl border-4 border-[#0A0A0F] relative group overflow-hidden flex-shrink-0">
            <img src={currentUser.avatar} alt={user?.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="font-['Bebas_Neue'] text-3xl text-white tracking-wider">{user?.name}</h1>
                <p className="text-gray-500 text-sm">{currentUser.email}</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-400 text-sm">{user?.city}</span>
                </div>
                <p className="text-gray-600 text-xs mt-1">Member since {new Date(user?.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <button className="border border-white/20 hover:border-white/40 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 hover:bg-white/5 hidden md:block">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="max-w-4xl mx-auto px-6 mt-8 grid grid-cols-3 gap-4">
        {[
          { number: currentUser.eventsAttended, label: "Events Attended" },
          { number: currentUser.ticketsBooked, label: "Tickets Booked" },
          { number: currentUser.reviews, label: "Reviews" }
        ].map(stat => (
          <div key={stat.label} className="bg-[#12121A] border border-white/10 rounded-2xl p-6 text-center">
            <p className="font-['Bebas_Neue'] text-3xl font-bold text-white tracking-wider">{stat.number}</p>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="max-w-4xl mx-auto px-6 mt-8">
        <h3 className="text-white font-semibold mb-4">Achievements</h3>
        <div className="flex gap-4 flex-wrap">
          {achievements.map(badge => (
            <div key={badge.name} className={`bg-[#12121A] border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center w-28 relative ${!badge.earned ? 'opacity-40' : ''}`}>
              <span className="text-3xl">{badge.emoji}</span>
              <p className="text-white text-xs mt-2">{badge.name}</p>
              {badge.earned ? (
                <span className="text-[#06FFA5] text-xs mt-1">Earned</span>
              ) : (
                <Lock className="w-4 h-4 text-gray-600 mt-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-6 mt-8">
        <div className="flex gap-6 border-b border-white/10">
          <span className="text-white border-b-2 border-violet-500 pb-3 text-sm font-semibold cursor-pointer">My Reviews</span>
         
        </div>
      </div>

      {/* My Reviews */}
      <div className="max-w-4xl mx-auto px-6 mt-6 space-y-4">
        {comments.slice(0, 2).map(c => (
          <div key={c.id} className="bg-[#12121A] border border-white/10 rounded-2xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex gap-0.5 mb-2">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3 h-3 ${s <= c.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-700'}`} />
                  ))}
                </div>
                <p className="text-gray-300 text-sm">{c.text}</p>
                <p className="text-gray-600 text-xs mt-2">{c.date}</p>
              </div>
              <div className="flex gap-2">
                <Edit className="w-4 h-4 text-gray-600 cursor-pointer hover:text-white transition-colors" />
                <Trash2 className="w-4 h-4 text-gray-600 cursor-pointer hover:text-red-400 transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>

    


      {/* Edit Profile Panel */}
      <div className="max-w-4xl mx-auto px-6 mt-8 mb-20">
        <h3 className="text-white font-semibold mb-4">Edit Profile</h3>
        <div className="bg-[#12121A] border border-white/10 rounded-2xl p-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" defaultValue="Arjun Sharma" placeholder="Full Name" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm" />
            <input type="tel" placeholder="Phone" defaultValue="+91 98765 43210" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm" />
            <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm appearance-none">
              <option>Mumbai</option>
              <option>Delhi</option>
              <option>Bangalore</option>
              <option>Goa</option>
            </select>
            <div></div>
            <textarea placeholder="Bio" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm h-24 resize-none col-span-1 md:col-span-2" defaultValue="Event enthusiast. Music lover. Always looking for the next great experience."></textarea>
          </div>

          <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center mt-4">
            <Upload className="w-8 h-8 text-gray-600 mx-auto" />
            <p className="text-gray-500 text-sm mt-2">Drop your photo here or click to browse</p>
          </div>

          <div className="flex gap-3 mt-6">
            <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20 text-sm">Save Changes</button>
            <button className="border border-white/20 hover:border-white/40 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 hover:bg-white/5 text-sm">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Calendar, MapPin, Star, Share2, Heart, CheckCircle, ThumbsUp, Link2, MessageCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { events, comments } from '../data/mockData'

const event = events[0]

const galleryImages = [
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400",
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400"
]

const included = ["Security", "Parking", "Food Court", "Medical", "WiFi", "Water"]

const ratingBars = [
  { stars: 5, pct: 68, width: "w-[68%]" },
  { stars: 4, pct: 20, width: "w-[20%]" },
  { stars: 3, pct: 8, width: "w-[8%]" },
  { stars: 2, pct: 3, width: "w-[3%]" },
  { stars: 1, pct: 1, width: "w-[1%]" }
]

export default function EventDetail() {
  return (
    <div className="bg-[#0A0A0F] min-h-screen text-white font-['DM_Sans']">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[500px] overflow-hidden">
        <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F]/60 via-transparent"></div>

        <div className="absolute top-24 left-8 z-10">
          <p className="text-gray-400 text-sm">
            <Link to="/" className="hover:text-white">Home</Link> &gt;{' '}
            <Link to="/events" className="hover:text-white">Events</Link> &gt;{' '}
            <span className="text-white">{event.title}</span>
          </p>
        </div>

        <div className="absolute top-24 right-8 z-10 flex gap-3">
          <button className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 hover:bg-white/20 transition-colors">
            <Share2 className="w-4 h-4 text-white" />
          </button>
          <button className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 hover:bg-white/20 transition-colors">
            <Heart className="w-4 h-4 text-white" />
          </button>
          <Link to={`/book/${event.id}`} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20 text-sm hidden md:block">
            Book Ticket →
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Column */}
          <div className="lg:col-span-2">
            <span className="bg-[#06FFA5]/10 text-[#06FFA5] text-xs px-3 py-1 rounded-full border border-[#06FFA5]/20">{event.category}</span>
            <h1 className="font-['Bebas_Neue'] text-5xl text-white mt-2 tracking-wider">{event.title}</h1>

            <div className="flex flex-wrap gap-6 mt-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400 text-sm">{event.date} at {event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400 text-sm">{event.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-gray-400 text-sm">{event.rating} (2,841 reviews)</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-white/10 mt-8 flex gap-8">
              <span className="text-white border-b-2 border-violet-500 -mb-px pb-3 text-sm font-semibold cursor-pointer">About</span>
              <span className="text-gray-500 pb-3 text-sm cursor-pointer hover:text-gray-300">Lineup</span>
              <span className="text-gray-500 pb-3 text-sm cursor-pointer hover:text-gray-300">Reviews</span>
              <span className="text-gray-500 pb-3 text-sm cursor-pointer hover:text-gray-300">Gallery</span>
            </div>

            {/* About */}
            <div className="mt-8">
              <p className="text-gray-300 leading-relaxed">{event.description}</p>

              <h3 className="text-white font-semibold mt-8 mb-4">What's Included</h3>
              <div className="grid grid-cols-2 gap-3">
                {included.map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#06FFA5]" />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 flex-wrap mt-6">
                {event.tags.map(tag => (
                  <span key={tag} className="bg-white/5 text-gray-400 text-xs px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>

            {/* Lineup */}
            <div className="mt-12">
              <h3 className="text-white font-semibold text-lg mb-4">Performing Artists</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.performers.map((p, i) => (
                  <div key={p} className="bg-[#12121A] rounded-2xl border border-white/10 p-4 text-center">
                    <img src={`https://i.pravatar.cc/64?img=${20 + i}`} alt={p} className="w-16 h-16 rounded-full mx-auto border-2 border-white/10" />
                    <p className="text-white font-semibold mt-3 text-sm">{p}</p>
                    <span className={`text-xs px-3 py-1 rounded-full mt-2 inline-block ${i === 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-gray-400'}`}>
                      {i === 0 ? 'Headliner' : 'Supporting'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-12">
              <h3 className="text-white font-semibold text-lg mb-4">Reviews & Ratings</h3>
              <div className="flex items-center gap-6 mb-6">
                <div>
                  <p className="text-5xl font-bold text-white">{event.rating}</p>
                </div>
                <div>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm mt-1">2,841 reviews</p>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                {ratingBars.map(bar => (
                  <div key={bar.stars} className="flex items-center gap-3">
                    <span className="text-gray-400 text-xs w-4">{bar.stars}★</span>
                    <div className="bg-white/10 rounded-full h-1.5 flex-1">
                      <div className={`bg-amber-400 rounded-full h-1.5 ${bar.width}`}></div>
                    </div>
                    <span className="text-gray-500 text-xs w-8">{bar.pct}%</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {comments.map(c => (
                  <div key={c.id} className="bg-[#12121A] border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={c.avatar} alt={c.user} className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="text-white text-sm font-semibold">{c.user}</p>
                          <p className="text-gray-600 text-xs">{c.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-3 h-3 ${s <= c.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-700'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mt-3">{c.text}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <ThumbsUp className="w-3.5 h-3.5 text-gray-600 cursor-pointer hover:text-white" />
                      <span className="text-gray-600 text-xs">{c.likes}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Review */}
              <div className="mt-8">
                <h4 className="text-white font-semibold mb-3">Write a Review</h4>
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-6 h-6 cursor-pointer ${s <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-700'}`} />
                  ))}
                </div>
                <textarea placeholder="Share your experience..." className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm h-24 resize-none"></textarea>
                <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20 text-sm mt-3">Submit Review</button>
              </div>
            </div>

            {/* Gallery */}
            <div className="mt-12">
              <h3 className="text-white font-semibold text-lg mb-4">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {galleryImages.map((img, i) => (
                  <div key={i} className="rounded-xl overflow-hidden aspect-square">
                    <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Ticket Card */}
            <div className="bg-[#12121A] border border-white/10 rounded-2xl p-6">
              <p className="text-gray-500 text-xs">From</p>
              <p className="text-amber-400 text-3xl font-bold">₹{event.price.toLocaleString()}</p>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{event.soldTickets.toLocaleString()} / {event.totalTickets.toLocaleString()} sold</span>
                </div>
                <div className="bg-white/10 h-1.5 rounded-full">
                  <div className="bg-violet-600 h-1.5 rounded-full w-[84%]"></div>
                </div>
              </div>
              <Link to={`/book/${event.id}`} className="block mt-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20 text-sm text-center w-full">
                Book Now →
              </Link>
              <p className="text-[#06FFA5] text-xs text-center mt-2">Only {event.totalTickets - event.soldTickets} tickets left!</p>
            </div>

            {/* Countdown */}
            <div className="bg-[#12121A] border border-white/10 rounded-2xl p-6 mt-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider">Event Starts In</p>
              <div className="flex gap-4 justify-center mt-3">
                {[
                  { val: "14", label: "Days" },
                  { val: "06", label: "Hours" },
                  { val: "30", label: "Mins" },
                  { val: "00", label: "Secs" }
                ].map(unit => (
                  <div key={unit.label} className="bg-[#1A1A2E] rounded-xl p-3 text-center min-w-[60px]">
                    <p className="text-2xl font-bold text-white">{unit.val}</p>
                    <p className="text-gray-600 text-xs">{unit.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="bg-[#12121A] border border-white/10 rounded-2xl p-4 mt-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Share Event</p>
              <div className="flex gap-2">
                {[Link2, MessageCircle, Share2].map((Icon, i) => (
                  <button key={i} className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl transition-colors">
                    <Icon className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Organizer */}
            <div className="bg-[#12121A] border border-white/10 rounded-2xl p-4 mt-4">
              <div className="flex items-center gap-3">
                <img src="https://i.pravatar.cc/40?img=30" alt="Percept Live" className="w-10 h-10 rounded-full" />
                <div>
                  <p className="text-white font-semibold text-sm">Percept Live</p>
                  <p className="text-[#06FFA5] text-xs">Verified Organizer ✓</p>
                </div>
              </div>
              <p className="text-violet-400 text-xs mt-3 cursor-pointer hover:underline">View Profile →</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0D0D15] border-t border-white/10 p-4 flex items-center justify-between md:hidden z-50">
        <span className="text-amber-400 font-bold text-lg">₹{event.price.toLocaleString()}</span>
        <Link to={`/book/${event.id}`} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-8 py-3 font-semibold transition-all duration-200 text-sm">
          Book Ticket →
        </Link>
      </div>

      <Footer />
    </div>
  )
}

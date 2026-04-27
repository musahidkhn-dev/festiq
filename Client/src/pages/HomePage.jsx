import { Link } from 'react-router-dom'
import { MapPin, Search, Flame } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import EventCard from '../components/EventCard'
// import { events } from '../data/mockData'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getEvents } from '../features/event/eventSlice'
import LoadingScreen from '../components/LoadingScreen'



export default function HomePage() {

  const {events , eventLoading, eventSuccess, eventError, eventErrorMessage} = useSelector(state => state.event)

  const dispatch  = useDispatch()





  useEffect(() => {
//Fetch Events
dispatch(getEvents())

  },[])


  if(eventLoading){
    return <LoadingScreen/>
  }


  return (
    <div className="bg-[#0A0A0F] min-h-screen text-white font-['DM_Sans']">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-10 w-64 h-64 bg-[#06FFA5]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <span className="bg-violet-600/20 text-violet-400 border border-violet-500/30 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest inline-block">
            ✨ AI-Powered Event Discovery
          </span>

          <h1 className="font-['Bebas_Neue'] text-5xl md:text-[80px] leading-none text-white mt-6 tracking-wider">
            Find Events That Match Your Mood
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-6">
            From concerts to comedy nights — MoodGo uses AI to recommend events perfect for how you're feeling today.
          </p>

          <div className="mt-8 flex gap-4 justify-center flex-wrap">
            <Link to="/events" className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20 text-sm">
              Explore Events →
            </Link>
            <button className="border border-white/20 hover:border-white/40 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 hover:bg-white/5 text-sm">
              How It Works
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-10 bg-[#12121A] border border-white/10 rounded-2xl p-2 flex flex-col md:flex-row items-center gap-2 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 flex-1 px-3 w-full">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <input type="text" placeholder="Search city or venue..." className="bg-transparent text-white placeholder-gray-500 outline-none text-sm w-full py-2" />
            </div>
            <div className="border-r border-white/10 h-8 hidden md:block"></div>
            <select className="bg-transparent text-gray-400 text-sm outline-none px-3 py-2 w-full md:w-auto">
              <option>All Categories</option>
              <option>Music</option>
              <option>Comedy</option>
              <option>Sports</option>
              <option>Art</option>
              <option>Food</option>
            </select>
            <div className="border-r border-white/10 h-8 hidden md:block"></div>
            <input type="text" placeholder="Any Date" className="bg-transparent text-gray-400 placeholder-gray-500 outline-none text-sm px-3 py-2 w-full md:w-auto" />
            <button className="bg-violet-600 rounded-xl px-6 py-3 flex items-center gap-2 text-white text-sm font-semibold hover:bg-violet-700 transition-colors w-full md:w-auto justify-center">
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>

          {/* Mood Selector */}
          {/* <div className="mt-6">
            <p className="text-gray-500 text-sm mb-3">What's your mood today?</p>
            <div className="flex gap-3 justify-center flex-wrap">
              {moods.map(mood => (
                <span
                  key={mood.label}
                  className={`border rounded-full px-5 py-2 text-sm cursor-pointer transition-all duration-200 ${
                    mood.active
                      ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  {mood.emoji} {mood.label}
                </span>
              ))}
            </div>
          </div> */}
        </div>
      </section>

      {/* Stats Row */}
      <section className="max-w-4xl mx-auto grid grid-cols-3 gap-6 mt-16 px-6">
        {[
          { number: "10K+", label: "Events" },
          { number: "500+", label: "Cities" },
          { number: "2M+", label: "Tickets" }
        ].map(stat => (
          <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <p className="font-['Bebas_Neue'] text-3xl font-bold text-white tracking-wider">{stat.number}</p>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Trending Events */}
      <section className="max-w-7xl mx-auto mt-20 px-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white">Trending Near You</h2>
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <Link to="/events" className="text-violet-400 text-sm hover:underline">View All →</Link>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4" id="trending-scroll">
          {events.map(event => (
            <div key={event._id} className="min-w-[320px] flex-shrink-0">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {/* <section className="max-w-7xl mx-auto mt-16 px-6">
        <h2 className="text-2xl font-bold text-white mb-6">Browse by Category</h2>
        <div className="flex gap-3 flex-wrap">
          {categories.map((cat, i) => (
            <span
              key={cat}
              className={`bg-white/5 border rounded-full px-5 py-2.5 text-sm cursor-pointer transition-all duration-200 ${
                i === 0
                  ? 'border-violet-500 text-white bg-violet-600/20'
                  : 'border-white/10 text-gray-300 hover:border-violet-500 hover:text-white'
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
      </section> */}

      {/* All Events Grid */}
      <section className="max-w-7xl mx-auto mt-16 px-6">
        <h2 className="text-2xl font-bold text-white mb-6">All Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </section>

      {/* Featured Event Banner */}
      <section className="max-w-7xl mx-auto mt-20 px-6">
        <div className="relative rounded-3xl overflow-hidden h-[400px]">
          <img src={events[0]?.eventImage} alt={events[0]?.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
          <div className="absolute left-8 bottom-8 z-10">
            <span className="bg-[#06FFA5]/10 text-[#06FFA5] text-xs px-3 py-1 rounded-full border border-[#06FFA5]/20">{events[0]?.status}</span>
            <h3 className="font-['Bebas_Neue'] text-5xl text-white mt-2 tracking-wider">{events[0]?.title}</h3>
            <p className="text-gray-300 text-sm mt-2">{events[0]?.eventDate} • {events[0]?.eventLocation}</p>
            <p className="text-amber-400 text-2xl font-bold mt-2">₹{events[0]?.ticketPrice?.toLocaleString()}</p>
            <Link to={`/book/${events[0]?._id}`} className="inline-block mt-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20 text-sm">
              Book Tickets →
            </Link>
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Featuring</p>
            {/* <div className="flex flex-col gap-2">
              {events[0]?.performers?.map(p => (
                <span key={p} className="bg-white/10 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full border border-white/10">{p}</span>
              ))}
            </div> */}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

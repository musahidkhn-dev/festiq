import { Link } from 'react-router-dom'
import { Search, LayoutGrid, List, ChevronLeft, ChevronRight, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import EventCard from '../components/EventCard'
// import { events } from '../data/mockData'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getEvents } from '../features/event/eventSlice'
import LoadingScreen from '../components/LoadingScreen'


export default function EventsPage() {
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

      {/* Page Header */}
      <div className="bg-[#12121A] border-b border-white/10 py-10 px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600 text-xs mb-2">Home &gt; Events</p>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-['Bebas_Neue'] text-4xl text-white tracking-wider">Events in Mumbai</h1>
            <span className="bg-white/5 text-gray-400 text-sm px-3 py-1 rounded-full">6 Events Found</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 px-8 py-8 max-w-7xl mx-auto">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-[#12121A] rounded-2xl border border-white/10 p-6 lg:sticky lg:top-24 h-fit">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search events..." className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm" />
            </div>

           

            

            <div className="border-t border-white/10 pt-4 mb-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Price Range</p>
              <div className="flex gap-2">
                <input type="text" placeholder="Min ₹" className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 w-full text-sm" />
                <input type="text" placeholder="Max ₹" className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 w-full text-sm" />
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 mb-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Distance</p>
              <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-gray-400 focus:outline-none focus:border-violet-500 w-full text-sm appearance-none">
                <option>5km</option>
                <option>10km</option>
                <option>25km</option>
                <option>50km</option>
              </select>
            </div>

            <div className="border-t border-white/10 pt-4 mb-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Sort By</p>
              <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-gray-400 focus:outline-none focus:border-violet-500 w-full text-sm appearance-none">
                <option>Date</option>
                <option>Price ↑</option>
                <option>Price ↓</option>
                <option>Popularity</option>
              </select>
            </div>

            <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 w-full text-sm mt-2 shadow-lg shadow-violet-500/20">Apply Filters</button>
            <p className="text-gray-500 text-sm text-center mt-2 cursor-pointer hover:text-gray-300">Reset All</p>

            {/* Active Filters */}
            <div className="mt-4 flex gap-2 flex-wrap">
              <span className="bg-violet-600/20 text-violet-400 text-xs px-3 py-1 rounded-full inline-flex items-center gap-1">Music <X className="w-3 h-3 cursor-pointer" /></span>
              <span className="bg-violet-600/20 text-violet-400 text-xs px-3 py-1 rounded-full inline-flex items-center gap-1">This Week <X className="w-3 h-3 cursor-pointer" /></span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400 text-sm">Showing 6 results</span>
            <div className="flex items-center gap-3">
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-gray-400 text-sm outline-none">
                <option>Date</option>
                <option>Price ↑</option>
                <option>Price ↓</option>
              </select>
              <LayoutGrid className="w-5 h-5 text-violet-400 cursor-pointer" />
              <List className="w-5 h-5 text-gray-600 cursor-pointer" />
            </div>
          </div>

          {/* Skeleton Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/5 rounded-2xl animate-pulse overflow-hidden">
                <div className="h-48 bg-white/10"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2"></div>
                  <div className="h-3 bg-white/10 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Event Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-8">
            <button className="text-gray-700 px-3 py-2 rounded-lg text-sm cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
            <button className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">1</button>
            <button className="text-gray-400 hover:bg-white/5 px-4 py-2 rounded-lg text-sm">2</button>
            <button className="text-gray-400 hover:bg-white/5 px-4 py-2 rounded-lg text-sm">3</button>
            <button className="text-gray-400 hover:bg-white/5 px-3 py-2 rounded-lg text-sm"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

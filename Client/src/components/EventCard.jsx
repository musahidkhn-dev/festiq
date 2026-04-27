import { Link } from 'react-router-dom'
import { Calendar, MapPin, Star, Heart } from 'lucide-react'


export default function EventCard({ event }) {
 


  return (
    <Link to={`/events/${event._id}`} className="bg-[#12121A] rounded-2xl border border-white/10 overflow-hidden cursor-pointer group hover:ring-1 hover:ring-violet-500/30 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 block">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={event.eventImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-[#06FFA5]/10 text-[#06FFA5] border border-[#06FFA5]/20 text-xs px-3 py-1 rounded-full backdrop-blur-sm">
          {event.status}
        </span>
        {event.duration && (
          <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/10">
            {event.duration}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 pb-3">
          <span className="text-white text-xs font-medium">View Details →</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-white font-semibold text-base leading-snug line-clamp-2">{event.title}</h3>

        <div className="mt-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-gray-400 text-xs">{event.eventDate} • {event.imgae}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-gray-400 text-xs truncate">{event.eventLocation}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-gray-600 text-xs">From </span>
            <span className="text-amber-400 font-bold text-base">₹{event.ticketPrice?.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-gray-400 text-xs">{event.rating}</span>
            </div>
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-400 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}

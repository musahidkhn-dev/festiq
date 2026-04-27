import { Armchair, Calendar, Download, MapPin, QrCode, Share2, Tag, X } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const TicketCard = ({ order }) => {

  if (!order?.event) return null

  return (
    <div className="bg-[#12121A] border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row mb-10">

      {/* Image */}
      <div className="w-full md:w-36 flex-shrink-0">
        <img 
          src={order.event.eventImage} 
          alt={order.event.title} 
          className="w-full h-40 md:h-full object-cover" 
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-6">

        <Link to={`/events/order.event._id`}> 
           <h2 className="text-white text-lg font-semibold">
          {order.event.title}
        </h2>
        </Link>

        <div className="grid grid-cols-2 gap-y-2 mt-3">

          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-gray-400 text-sm">
              {new Date(order.event.createdAt).toLocaleDateString('en-IN')}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-gray-400 text-sm">
              {order.event.eventLocation}
            </span>
          </div>

          {/* Seats */}
          {order.seats && (
            <div className="flex items-center gap-2">
              <Armchair className="w-3.5 h-3.5 text-gray-600" />
              <span className="text-gray-400 text-sm">
                {order.seats} Seats
              </span>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-gray-600" />
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              order.status === 'confirmed'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-white/10 text-gray-400'
            }`}>
              {order.status}
            </span>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
          <span className="text-xs text-gray-600">
            {order._id.slice(-6)} {/* short id */}
          </span>
          <span className="text-amber-400 font-semibold">
            ₹{order.billedAmount?.toLocaleString()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-baseline">

         <div className='space-x-3'>
           <button className="btn"> <Download size={12}/> Download</button>
          <button className="btn"> <Share2 size={12}/> Share</button>

          {order.status === 'confirmed' && (
            <button className="text-red-400 btn">
              <X size={12}/> Cancel
            </button>
          )}

         </div>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${order._id}`} alt="" />

        </div>

      </div>
    </div>
  )
}

export default TicketCard
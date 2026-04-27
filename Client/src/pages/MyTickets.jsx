import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Ticket, Calendar, MapPin, Armchair, Tag, Download, Share2, X, QrCode } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useOrders } from '../hooks/queries/useOrders'
import TicketCard from '../components/TicketCard'
import LoadingScreen from '../components/LoadingScreen'



export default function MyTickets() {

  const {user} = useSelector(state => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if(!user){
      navigate("/login")
    }
  },[user])

  const { data, isLoading, isError } = useOrders()
  const orders = data || []

  if(isLoading){
    return <LoadingScreen text='Loading Tickets...'/> 
  }

  if (isError) {
      return (
          <div className="bg-[#0A0A0F] min-h-screen text-white flex items-center justify-center">
              <p className="text-red-400">Failed to load tickets.</p>
          </div>
      )
  }

  return (
    <div className="bg-[#0A0A0F] min-h-screen text-white font-['DM_Sans']">
      <Navbar />

      <div className="max-w-4xl mx-auto pt-8 px-6">
        <div className="flex items-center gap-3">
          <Ticket className="w-6 h-6 text-violet-400" />
          <h1 className="font-['Bebas_Neue'] text-4xl text-white tracking-wider">My Tickets</h1>
        </div>
        <p className="text-gray-500 text-sm mt-1">Manage your event passes</p>
      </div>


      {/* Upcoming Tickets */}
   <div className="max-w-4xl mx-auto px-6 mt-6 flex flex-col gap-4">

  {orders?.length === 0 ? (
    <p className="text-center text-gray-500 mt-10">
      No Tickets Found 🎟️
    </p>
  ) : (
    orders.map((order) => (
      <TicketCard key={order._id} order={order} />
    ))
  )}

</div>
   

      {/* Empty State Example */}
      <div className="max-w-4xl mx-auto px-6 pb-20 hidden">
        <div className="flex flex-col items-center justify-center py-20">
          <Calendar className="w-16 h-16 text-gray-700" />
          <p className="text-gray-500 text-lg mt-4">No cancelled tickets</p>
          <Link to="/events" className="mt-6 bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20 text-sm">Browse Events →</Link>
        </div>
      </div>
    </div>
  )
}



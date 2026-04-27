import { Calendar, TrendingUp, Users, Ticket } from 'lucide-react'

import { barHeights } from './constants/badgeStyles'


import LoadingScreen from '../../components/LoadingScreen'
import { useAdminUsers, useAdminEvents, useAdminOrders } from '../../hooks/queries/useAdmin'
import { adminStats, revenueChart } from '../../data/mockData'

export default function AdminDashboard() {

  const { data: users, isLoading: usersLoading } = useAdminUsers()
  const { data: events, isLoading: eventsLoading } = useAdminEvents()
  const { data: orders, isLoading: ordersLoading } = useAdminOrders()
  if(usersLoading || eventsLoading || ordersLoading){
    return <LoadingScreen/>
  }

  // Safe fallbacks if backend array structures mismatch
  const SafeUsersCount = users ? users.totalUsers : 0;
  const SafeEventsCount = events ? events.totalEvents : 0;

  return (
    <div>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8">
        {[
          { icon: Calendar, value: SafeEventsCount, label: "Total Events", color: "bg-violet-600/20 text-violet-400", growth: "12% ↑" },
          { icon: TrendingUp, value: adminStats.totalRevenue, label: "Total Revenue", color: "bg-emerald-500/20 text-emerald-400", growth: "8% ↑" },
          { icon: Users, value: SafeUsersCount?.toLocaleString(), label: "Total Users", color: "bg-blue-500/20 text-blue-400", growth: "15% ↑" },
          { icon: Ticket, value: adminStats.ticketsSold.toLocaleString(), label: "Tickets Sold", color: "bg-amber-500/20 text-amber-400", growth: "22% ↑" }
        ].map(card => (
          <div key={card.label} className="bg-[#12121A] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center`}>
                <card.icon className="w-5 h-5" />
              </div>
              <span className="text-[#06FFA5] text-xs bg-[#06FFA5]/10 px-2 py-1 rounded-full">{card.growth}</span>
            </div>
            <p className="font-['Bebas_Neue'] text-3xl font-bold text-white mt-3 tracking-wider">{card.value}</p>
            <p className="text-gray-500 text-sm mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="px-8 pb-8">
        <div className="bg-[#12121A] border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white font-semibold">Revenue Overview</h2>
            <span className="text-gray-500 text-xs">Last 6 months</span>
          </div>
          <div className="flex items-end gap-4 h-40 border-b border-white/10 pb-0">
            {revenueChart.map((bar, i) => (
              <div key={bar.month} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                <div className={`bg-violet-600 hover:bg-violet-500 rounded-t-lg w-full transition-colors cursor-pointer ${barHeights[i]}`}></div>
              </div>
            ))}
          </div>
          <div className="flex justify-around mt-2">
            {revenueChart.map(bar => (
              <span key={bar.month} className="text-gray-600 text-xs text-center flex-1">{bar.month}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

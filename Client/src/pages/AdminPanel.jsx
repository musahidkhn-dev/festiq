// import { LayoutDashboard, Calendar, Users, ShoppingBag, Tag, Star, Settings, Bell, LogOut, TrendingUp, Ticket, Eye, Trash2, Pencil, Ban, Plus } from 'lucide-react'
// import { adminStats, adminUsers, adminOrders, coupons, revenueChart, events } from '../data/mockData'
// import { Link, useNavigate } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import { useEffect } from 'react'

// const navItems = [
//   { icon: LayoutDashboard, label: "Dashboard", active: true },
//   { icon: Calendar, label: "Events", active: false },
//   { icon: Users, label: "Users", active: false },
//   { icon: ShoppingBag, label: "Orders", active: false },
//   { icon: Tag, label: "Coupons", active: false },
//   { icon: Star, label: "Ratings", active: false },
//   { icon: Settings, label: "Settings", active: false }
// ]

// const statusBadge = {
//   confirmed: "bg-emerald-500/20 text-emerald-400",
//   cancelled: "bg-red-500/20 text-red-400",
//   pending: "bg-amber-500/20 text-amber-400"
// }

// const roleBadge = {
//   admin: "bg-violet-600/20 text-violet-400",
//   organizer: "bg-blue-500/20 text-blue-400",
//   user: "bg-white/10 text-gray-400"
// }

// const statusDot = {
//   active: "bg-[#06FFA5]",
//   banned: "bg-red-500"
// }

// const barHeights = ["h-[65%]", "h-[80%]", "h-[95%]", "h-[70%]", "h-[85%]", "h-[100%]"]

// export default function AdminPanel() {



  
//     const {user} = useSelector(state => state.auth)


//     const navigate = useNavigate()


//     useEffect(() => {
//       if(!user?.isAdmin){
//         navigate("/auth/profile")
//       }
      
//     },[user])
//   return (
//     <div className="flex h-screen bg-[#080810] overflow-hidden font-['DM_Sans']">
//       {/* Left Sidebar */}
//       <aside className="hidden lg:flex w-64 bg-[#0D0D15] border-r border-white/10 flex-col">
//         <div className="p-6 border-b border-white/10">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center">
//               <span className="text-violet-400 text-sm">🛡️</span>
//             </div>
//             <Link to={"/"}>
//               <span className="text-white font-bold text-sm">MoodGo</span>
//               <p className="text-gray-600 text-xs">Admin Panel</p>
//             </Link>
//           </div>
//         </div>

//         <nav className="flex-1 py-4 px-3">
//           {navItems.map(item => (
//             <div key={item.label} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm cursor-pointer mb-1 transition-colors ${
//               item.active
//                 ? 'bg-violet-600/20 text-violet-300 border-l-2 border-violet-500'
//                 : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
//             }`}>
//               <item.icon className="w-4 h-4" />
//               <span>{item.label}</span>
//             </div>
//           ))}
//         </nav>

//         <div className="p-4 border-t border-white/10 flex items-center gap-3">
//           <img src="https://i.pravatar.cc/32?img=16" alt="Admin" className="w-8 h-8 rounded-full" />
//           <span className="text-white text-sm flex-1">Sneha Iyer</span>
//           <LogOut className="w-4 h-4 text-gray-600 cursor-pointer hover:text-white" />
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 overflow-y-auto">
//         {/* Header */}
//         <header className="bg-[#0D0D15] border-b border-white/10 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
//           <h1 className="text-xl font-bold text-white">Dashboard</h1>
//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
//               <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//             </div>
//             <img src="https://i.pravatar.cc/32?img=16" alt="Admin" className="w-8 h-8 rounded-full" />
//           </div>
//         </header>

//         {/* KPI Cards */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8">
//           {[
//             { icon: Calendar, value: adminStats.totalEvents, label: "Total Events", color: "bg-violet-600/20 text-violet-400", growth: "12% ↑" },
//             { icon: TrendingUp, value: adminStats.totalRevenue, label: "Total Revenue", color: "bg-emerald-500/20 text-emerald-400", growth: "8% ↑" },
//             { icon: Users, value: adminStats.totalUsers.toLocaleString(), label: "Total Users", color: "bg-blue-500/20 text-blue-400", growth: "15% ↑" },
//             { icon: Ticket, value: adminStats.ticketsSold.toLocaleString(), label: "Tickets Sold", color: "bg-amber-500/20 text-amber-400", growth: "22% ↑" }
//           ].map(card => (
//             <div key={card.label} className="bg-[#12121A] border border-white/10 rounded-2xl p-6">
//               <div className="flex items-center justify-between">
//                 <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center`}>
//                   <card.icon className="w-5 h-5" />
//                 </div>
//                 <span className="text-[#06FFA5] text-xs bg-[#06FFA5]/10 px-2 py-1 rounded-full">{card.growth}</span>
//               </div>
//               <p className="font-['Bebas_Neue'] text-3xl font-bold text-white mt-3 tracking-wider">{card.value}</p>
//               <p className="text-gray-500 text-sm mt-1">{card.label}</p>
//             </div>
//           ))}
//         </div>

//         {/* Revenue Chart */}
//         <div className="px-8 pb-8">
//           <div className="bg-[#12121A] border border-white/10 rounded-2xl p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-white font-semibold">Revenue Overview</h2>
//               <span className="text-gray-500 text-xs">Last 6 months</span>
//             </div>
//             <div className="flex items-end gap-4 h-40 border-b border-white/10 pb-0">
//               {revenueChart.map((bar, i) => (
//                 <div key={bar.month} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
//                   <div className={`bg-violet-600 hover:bg-violet-500 rounded-t-lg w-full transition-colors cursor-pointer ${barHeights[i]}`}></div>
//                 </div>
//               ))}
//             </div>
//             <div className="flex justify-around mt-2">
//               {revenueChart.map(bar => (
//                 <span key={bar.month} className="text-gray-600 text-xs text-center flex-1">{bar.month}</span>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Recent Orders Table */}
//         <div className="px-8 pb-8">
//           <div className="bg-[#12121A] border border-white/10 rounded-2xl overflow-hidden">
//             <div className="flex justify-between p-6">
//               <h2 className="text-white font-semibold">Recent Orders</h2>
//               <span className="text-violet-400 text-xs cursor-pointer hover:underline">View All →</span>
//             </div>
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-white/5">
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Order ID</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">User</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden md:table-cell">Event</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Amount</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Status</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden lg:table-cell">Date</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-white/5">
//                 {adminOrders.map(order => (
//                   <tr key={order.id} className="hover:bg-white/5 transition-colors">
//                     <td className="px-6 py-4 text-gray-400 font-['JetBrains_Mono'] text-xs">{order.id}</td>
//                     <td className="px-6 py-4 text-white text-sm">{order.user}</td>
//                     <td className="px-6 py-4 text-gray-300 text-sm hidden md:table-cell">{order.event}</td>
//                     <td className="px-6 py-4 text-amber-400 font-medium text-sm">{order.amount}</td>
//                     <td className="px-6 py-4">
//                       <span className={`text-xs px-3 py-1 rounded-full capitalize ${statusBadge[order.status]}`}>{order.status}</span>
//                     </td>
//                     <td className="px-6 py-4 text-gray-500 text-xs hidden lg:table-cell">{order.date}</td>
//                     <td className="px-6 py-4">
//                       <div className="flex gap-2">
//                         <Eye className="w-4 h-4 text-gray-600 cursor-pointer hover:text-white transition-colors" />
//                         <Trash2 className="w-4 h-4 text-gray-600 cursor-pointer hover:text-red-400 transition-colors" />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Users Table */}
//         <div className="px-8 pb-8">
//           <div className="bg-[#12121A] border border-white/10 rounded-2xl overflow-hidden">
//             <div className="flex justify-between items-center p-6">
//               <h2 className="text-white font-semibold">Users</h2>
//               <div className="flex gap-3">
//                 <input type="text" placeholder="Search users..." className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 text-sm w-48" />
//                 <button className="bg-white/5 border border-white/10 text-gray-300 text-xs px-4 py-2 rounded-xl hover:bg-white/10">Export</button>
//               </div>
//             </div>
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-white/5">
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">User</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden md:table-cell">Email</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Role</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Status</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden lg:table-cell">Tickets</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden lg:table-cell">Joined</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-white/5">
//                 {adminUsers.map(user => (
//                   <tr key={user.id} className="hover:bg-white/5 transition-colors">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
//                         <span className="text-white text-sm">{user.name}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">{user.email}</td>
//                     <td className="px-6 py-4">
//                       <span className={`text-xs px-3 py-1 rounded-full capitalize ${roleBadge[user.role]}`}>{user.role}</span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <span className={`w-2 h-2 rounded-full ${statusDot[user.status] || 'bg-gray-500'}`}></span>
//                         <span className="text-gray-400 text-xs capitalize">{user.status}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-gray-400 text-sm hidden lg:table-cell">{user.tickets}</td>
//                     <td className="px-6 py-4 text-gray-500 text-xs hidden lg:table-cell">{user.joined}</td>
//                     <td className="px-6 py-4">
//                       <div className="flex gap-2">
//                         <Pencil className="w-4 h-4 text-gray-600 cursor-pointer hover:text-white transition-colors" />
//                         <Ban className="w-4 h-4 text-gray-600 cursor-pointer hover:text-amber-400 transition-colors" />
//                         <Trash2 className="w-4 h-4 text-gray-600 cursor-pointer hover:text-red-400 transition-colors" />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Events Table */}
//         <div className="px-8 pb-8">
//           <div className="bg-[#12121A] border border-white/10 rounded-2xl overflow-hidden">
//             <div className="flex justify-between items-center p-6">
//               <h2 className="text-white font-semibold">Events</h2>
//               <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors flex items-center gap-2"><Plus className="w-4 h-4" /> Add Event</button>
//             </div>
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-white/5">
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Event</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden md:table-cell">Category</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Date</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden lg:table-cell">Price</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden lg:table-cell">Sold</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-white/5">
//                 {events.map(ev => (
//                   <tr key={ev.id} className="hover:bg-white/5 transition-colors">
//                     <td className="px-6 py-4 text-white text-sm">{ev.title}</td>
//                     <td className="px-6 py-4 hidden md:table-cell"><span className="bg-white/10 text-gray-400 text-xs px-3 py-1 rounded-full">{ev.category}</span></td>
//                     <td className="px-6 py-4 text-gray-400 text-sm">{ev.date}</td>
//                     <td className="px-6 py-4 text-amber-400 text-sm hidden lg:table-cell">₹{ev.price.toLocaleString()}</td>
//                     <td className="px-6 py-4 text-gray-400 text-sm hidden lg:table-cell">{ev.soldTickets.toLocaleString()}</td>
//                     <td className="px-6 py-4">
//                       <div className="flex gap-2">
//                         <Pencil className="w-4 h-4 text-gray-600 cursor-pointer hover:text-white transition-colors" />
//                         <Trash2 className="w-4 h-4 text-gray-600 cursor-pointer hover:text-red-400 transition-colors" />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Coupons Table */}
//         <div className="px-8 pb-8">
//           <div className="bg-[#12121A] border border-white/10 rounded-2xl overflow-hidden">
//             <div className="flex justify-between items-center p-6">
//               <h2 className="text-white font-semibold">Coupons</h2>
//               <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors flex items-center gap-2"><Plus className="w-4 h-4" /> Create Coupon</button>
//             </div>
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-white/5">
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Code</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Discount</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden md:table-cell">Type</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden md:table-cell">Used</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden lg:table-cell">Expires</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Active</th>
//                   <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-white/5">
//                 {coupons.map(coupon => (
//                   <tr key={coupon.id} className="hover:bg-white/5 transition-colors">
//                     <td className="px-6 py-4 font-['JetBrains_Mono'] text-white text-xs">{coupon.code}</td>
//                     <td className="px-6 py-4 text-amber-400 text-sm">{coupon.discount}</td>
//                     <td className="px-6 py-4 text-gray-400 text-xs capitalize hidden md:table-cell">{coupon.type}</td>
//                     <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">{coupon.used}</td>
//                     <td className="px-6 py-4 text-gray-500 text-xs hidden lg:table-cell">{coupon.expires}</td>
//                     <td className="px-6 py-4">
//                       <span className={`w-2 h-2 rounded-full inline-block ${coupon.active ? 'bg-[#06FFA5]' : 'bg-gray-600'}`}></span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex gap-2">
//                         <Pencil className="w-4 h-4 text-gray-600 cursor-pointer hover:text-white transition-colors" />
//                         <Trash2 className="w-4 h-4 text-gray-600 cursor-pointer hover:text-red-400 transition-colors" />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Settings */}
//         <div className="px-8 pb-8">
//           <div className="bg-[#12121A] border border-white/10 rounded-2xl p-8 max-w-2xl">
//             <h2 className="text-white font-semibold mb-6">Settings</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="text-gray-500 text-xs uppercase tracking-wider">Platform Name</label>
//                 <input type="text" defaultValue="MoodGo" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm mt-1" />
//               </div>
//               <div>
//                 <label className="text-gray-500 text-xs uppercase tracking-wider">Default City</label>
//                 <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 focus:outline-none focus:border-violet-500 w-full text-sm mt-1 appearance-none">
//                   <option>Mumbai</option>
//                   <option>Delhi</option>
//                   <option>Bangalore</option>
//                 </select>
//               </div>
//             </div>

//             <div className="mt-8 space-y-0">
//               {[
//                 { label: "Email Notifications", desc: "Receive booking confirmations via email", on: true },
//                 { label: "Push Notifications", desc: "Get notified about events near you", on: true },
//                 { label: "Maintenance Mode", desc: "Temporarily disable the platform", on: false },
//                 { label: "Auto-Approve Events", desc: "Automatically approve new event submissions", on: false }
//               ].map(toggle => (
//                 <div key={toggle.label} className="flex justify-between items-center py-4 border-b border-white/10">
//                   <div>
//                     <p className="text-white text-sm">{toggle.label}</p>
//                     <p className="text-gray-500 text-xs">{toggle.desc}</p>
//                   </div>
//                   <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${toggle.on ? 'bg-violet-600' : 'bg-white/10'}`}>
//                     <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${toggle.on ? 'left-6' : 'left-0.5'}`}></div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20 text-sm mt-6">Save Settings</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

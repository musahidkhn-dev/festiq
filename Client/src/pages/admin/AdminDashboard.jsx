import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  Zap, 
  Sparkles,
  Search,
  MoreHorizontal,
  ChevronRight,
  IndianRupee
} from "lucide-react";
import { useAdminAnalytics } from "../../hooks/queries/useAdmin";
import LoadingScreen from "../../components/LoadingScreen";
import SafeAvatar from "../../components/SafeAvatar";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

export default function AdminDashboard() {
  const { data, isLoading, isError, refetch } = useAdminAnalytics();
  
  const stats = data?.stats || {
    totalEvents: 0,
    totalRevenue: 0,
    totalUsers: 0,
    ticketsSold: 0
  };

  const chartData = data?.monthlyRevenue || [];
  const topEvents = data?.topEvents || [];
  const recentActivity = data?.recentActivity || [];

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="space-y-10 pb-20">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-violet-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
            <Activity className="w-3 h-3" /> Live
          </div>
          <h1 className="font-bebas text-5xl sm:text-7xl text-white tracking-wider">ADMIN <span className="text-violet-500">DASHBOARD</span></h1>
          <p className="text-gray-500 font-medium">Real-time overview of the Festiq platform.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/5 p-2 rounded-2xl">
           <button 
             onClick={() => refetch()}
             className="px-6 py-3 rounded-xl bg-violet-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-violet-600/20"
           >
             Refresh
           </button>
           <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"><Search className="w-5 h-5 text-gray-500" /></button>
        </div>
      </div>

      {/* Quick Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Platform Revenue", val: `₹${stats.totalRevenue.toLocaleString()}`, icon: ShoppingBag, color: "violet", trend: "Live" },
          { label: "Platform Profit", val: `₹${(stats.platformRevenue || 0).toLocaleString()}`, icon: IndianRupee, color: "emerald", trend: "Live" },
          { label: "Active Users", val: stats.activeUsers, icon: Users, color: "blue", trend: "Live" },
          { label: "Live Events", val: stats.totalEvents, icon: Calendar, color: "amber", trend: "Live" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-[#12121A] border border-white/5 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden hover:border-violet-500/30 transition-all duration-500"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-600/5 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2`}></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-8">
                 <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-600/10 border border-${stat.color}-600/20 flex items-center justify-center`}>
                    <stat.icon className={`w-7 h-7 text-${stat.color}-500`} />
                 </div>
                 <div className="flex items-center gap-1 text-emerald-500 font-bold text-[8px] tracking-widest uppercase">
                    <Activity className="w-3 h-3" /> {stat.trend}
                 </div>
              </div>
              
              <div>
                <p className="text-gray-500 text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl sm:text-4xl font-bebas text-white tracking-wider">{stat.val}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-[#12121A] border border-white/5 rounded-[3rem] p-10">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="font-bebas text-3xl text-white tracking-widest">Revenue <span className="text-blue-500">Flow</span></h3>
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest mt-1">Monthly performance trend</p>
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 border border-white/10 px-4 py-2 rounded-xl">
              Last 6 Months
            </div>
          </div>
          
          <div className="h-[400px] w-full min-h-[400px] min-w-0">
            {chartData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#4b5563" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                    tickFormatter={(val) => val?.toUpperCase() || ""}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#12121A', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      fontSize: '10px',
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8b5cf6" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorVal)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                 <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Insufficient analytics data for visualization</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#12121A] border border-white/5 rounded-[3rem] p-10">
          <h3 className="font-bebas text-3xl text-white tracking-widest mb-10">Top <span className="text-emerald-500">Events</span></h3>
          <div className="space-y-6">
            {topEvents.length > 0 ? topEvents.map((event, i) => (
              <div key={i} className="flex items-center gap-5 group cursor-pointer">
                 <div className="relative">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white/5 group-hover:ring-violet-500 transition-all">
                       <SafeAvatar src={event.image} name={event.title} className="w-full h-full rounded-none" />
                    </div>
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-violet-600 text-white text-[8px] font-black rounded-lg flex items-center justify-center border border-[#050508] shadow-lg">#{i+1}</div>
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-bold truncate group-hover:text-violet-400 transition-colors">{event.title}</p>
                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest mt-0.5">{event.category || "General"}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-white font-bebas text-lg">₹{(event.price || 0).toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-emerald-500 text-[8px] font-black tracking-widest justify-end">
                       <TrendingUp className="w-2.5 h-2.5" /> {event.sold} Sold
                    </div>
                 </div>
              </div>
            )) : (
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest text-center py-20">No sales data yet</p>
            )}
          </div>
          
          <button className="w-full mt-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">View All Events</button>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-[#12121A] border border-white/5 rounded-[3rem] overflow-hidden">
        <div className="p-10 border-b border-white/5 flex items-center justify-between">
           <div>
             <h3 className="font-bebas text-4xl text-white tracking-widest">Recent <span className="text-amber-500">Activity</span></h3>
             <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest mt-1">Latest bookings and platform activity</p>
           </div>
           <MoreHorizontal className="w-6 h-6 text-gray-700 cursor-pointer hover:text-white transition-colors" />
        </div>
        <div className="divide-y divide-white/5">
            { recentActivity.length > 0 ? recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-4 sm:gap-8 px-6 sm:px-10 py-6 hover:bg-white/[0.01] transition-all group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center font-bebas text-base sm:text-xl text-gray-500 group-hover:bg-violet-600 group-hover:text-white transition-all shrink-0">
                  {activity.user?.name?.[0] || "?"}
                </div>
                <div className="flex-1">
                   <div className="flex items-center gap-3">
                      <span className="text-white text-xs font-bold">{activity.user?.name || "Deleted User"}</span>
                      <span className="text-gray-700 text-xs">•</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${activity.status === 'confirmed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {activity.status}
                      </span>
                   </div>
                   <p className="text-gray-600 text-[10px] font-bold mt-1 uppercase tracking-widest">{activity.event?.title || "Unknown Event"}</p>
                </div>
                <div className="text-right">
                   <p className="text-gray-500 text-[10px] font-black tracking-widest mb-1">
                     {new Date(activity.createdAt).toLocaleDateString()}
                   </p>
                   <div className="flex items-center gap-2 justify-end">
                      <div className={`w-1.5 h-1.5 rounded-full ${activity.status === 'confirmed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                      <span className="text-gray-500 text-[8px] font-black tracking-widest uppercase">Verified</span>
                   </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )) : (
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest text-center py-20">No recent activity</p>
            )}
        </div>
      </div>
    </div>
  );
}

import { LayoutDashboard, Calendar, Users, ShoppingBag, Tag, Star, Settings, LogOut } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", route: "/admin" },
  { icon: Calendar, label: "Events", route: "/admin/events" },
  { icon: Users, label: "Users", route: "/admin/users" },
  { icon: ShoppingBag, label: "Orders", route: "/admin/orders" },
  { icon: Tag, label: "Coupons", route: "/admin/coupons" },
  { icon: Star, label: "Ratings", route: "/admin/ratings" },
  { icon: Settings, label: "Settings", route: "/admin/settings" }
]

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="hidden lg:flex w-64 bg-[#0D0D15] border-r border-white/10 flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center">
            <span className="text-violet-400 text-sm">🛡️</span>
          </div>
          <div>
            <span className="text-white font-bold text-sm">MoodGo</span>
            <p className="text-gray-600 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3">
        {navItems.map(item => {
          const isActive = currentPath === item.route;
          return (
            <Link to={item.route} key={item.label} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm cursor-pointer mb-1 transition-colors ${
              isActive
                ? 'bg-violet-600/20 text-violet-300 border-l-2 border-violet-500'
                : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
            }`}>
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10 flex items-center gap-3">
        <img src="https://i.pravatar.cc/32?img=16" alt="Admin" className="w-8 h-8 rounded-full" />
        <span className="text-white text-sm flex-1">Sneha Iyer</span>
        <LogOut className="w-4 h-4 text-gray-600 cursor-pointer hover:text-white" />
      </div>
    </aside>
  )
}

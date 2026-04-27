import { Bell } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-[#0D0D15] border-b border-white/10 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-xl font-bold text-white">Dashboard</h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>
        <img src="https://i.pravatar.cc/32?img=16" alt="Admin" className="w-8 h-8 rounded-full" />
      </div>
    </header>
  )
}

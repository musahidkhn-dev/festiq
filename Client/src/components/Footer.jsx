import { Link } from 'react-router-dom'
import { Globe, AtSign, Play } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0D0D15] border-t border-white/10 mt-20 py-16 font-['DM_Sans']">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-1 mb-4">
              <span className="font-['Bebas_Neue'] text-2xl text-white tracking-wider">MoodGo</span>
              <span className="w-2 h-2 rounded-full bg-[#06FFA5]"></span>
            </div>
            <p className="text-gray-500 text-sm mb-6">AI-Powered Event Discovery. Find events that match your mood.</p>
            <div className="flex items-center gap-4">
              <Globe className="w-4 h-4 text-gray-600 hover:text-white cursor-pointer transition-colors" />
              <AtSign className="w-4 h-4 text-gray-600 hover:text-white cursor-pointer transition-colors" />
              <Play className="w-4 h-4 text-gray-600 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Home</Link>
              <Link to="/events" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Events</Link>
              <Link to="/tickets" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">My Tickets</Link>
              <Link to="/chat" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Chat</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <div className="flex flex-col gap-3">
              <span className="text-gray-500 hover:text-gray-300 text-sm transition-colors cursor-pointer">About</span>
              <span className="text-gray-500 hover:text-gray-300 text-sm transition-colors cursor-pointer">Blog</span>
              <span className="text-gray-500 hover:text-gray-300 text-sm transition-colors cursor-pointer">Careers</span>
              <span className="text-gray-500 hover:text-gray-300 text-sm transition-colors cursor-pointer">Press</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Support</h4>
            <div className="flex flex-col gap-3">
              <span className="text-gray-500 hover:text-gray-300 text-sm transition-colors cursor-pointer">Help</span>
              <span className="text-gray-500 hover:text-gray-300 text-sm transition-colors cursor-pointer">Privacy</span>
              <span className="text-gray-500 hover:text-gray-300 text-sm transition-colors cursor-pointer">Terms</span>
              <span className="text-gray-500 hover:text-gray-300 text-sm transition-colors cursor-pointer">Contact</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 mt-8 text-center">
          <p className="text-gray-600 text-xs">© 2025 MoodGo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

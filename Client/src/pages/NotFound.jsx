import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="bg-[#0A0A0F] min-h-screen flex items-center justify-center relative overflow-hidden font-['DM_Sans']">
      {/* Decorative Background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* 404 Background Text */}
      <span className="absolute text-[200px] md:text-[300px] font-black text-white/[0.02] select-none pointer-events-none font-['Bebas_Neue'] leading-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        404
      </span>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <span className="text-7xl">🎭</span>
        <h1 className="font-['Bebas_Neue'] text-5xl text-white mt-4 tracking-wider">The Event Has Left the Building</h1>
        <p className="text-gray-500 text-base mt-3 max-w-md mx-auto">
          Looks like this page took the night off. Let's get you back to the show.
        </p>

        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <Link to="/" className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20 text-sm">
            Go Home
          </Link>
          <Link to="/events" className="border border-white/20 hover:border-white/40 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 hover:bg-white/5 text-sm">
            Browse Events
          </Link>
          <button className="text-gray-500 hover:text-white hover:bg-white/5 rounded-xl px-4 py-2 transition-all duration-200 text-sm">
            Contact Support
          </button>
        </div>

        {/* Floating ticket stub */}
        <div className="mt-12 inline-block animate-bounce">
          <div className="bg-[#12121A] border border-dashed border-white/20 rounded-xl p-4 text-left flex items-center gap-4">
            <div>
              <p className="text-white text-xs font-semibold">Event 404</p>
              <p className="text-gray-500 text-xs">Page Not Found</p>
              <p className="text-gray-600 text-xs mt-1">Seat: Lost</p>
            </div>
            <div className="w-12 h-8 flex flex-col gap-0.5">
              <div className="bg-white/20 h-full rounded-sm"></div>
              <div className="bg-transparent h-full"></div>
              <div className="bg-white/20 h-full rounded-sm"></div>
              <div className="bg-white/10 h-full rounded-sm"></div>
              <div className="bg-white/20 h-full rounded-sm"></div>
              <div className="bg-transparent h-full"></div>
              <div className="bg-white/15 h-full rounded-sm"></div>
              <div className="bg-white/20 h-full rounded-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Mail, Lock, Eye, User, MapPin } from 'lucide-react'


export default function AuthPage() {



  return (
    <div className="bg-[#0A0A0F] min-h-screen flex font-['DM_Sans']">
      {/* Left Panel */}
      <div className="hidden md:flex w-1/2 bg-[#0D0D15] relative overflow-hidden flex-col justify-between p-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

        <div className="relative z-10 flex items-center gap-1">
          <span className="font-['Bebas_Neue'] text-2xl text-white tracking-wider">MoodGo</span>
          <span className="w-2 h-2 rounded-full bg-[#06FFA5]"></span>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h1 className="font-['Bebas_Neue'] text-5xl text-white leading-tight">Experiences<br />Worth Living For</h1>
          <p className="text-gray-400 text-sm mt-4 max-w-sm">Discover events that match your mood, powered by AI</p>

          <div className="flex flex-wrap gap-3 mt-8">
            <span className="bg-white/5 border border-white/10 text-gray-300 text-xs px-4 py-2 rounded-full">✨ AI Recommendations</span>
            <span className="bg-white/5 border border-white/10 text-gray-300 text-xs px-4 py-2 rounded-full">🎟️ Easy Booking</span>
            <span className="bg-white/5 border border-white/10 text-gray-300 text-xs px-4 py-2 rounded-full">🔴 Live Events</span>
          </div>
        </div>

        <p className="relative z-10 text-gray-600 text-xs">Trusted by 15,000+ event lovers 🎉</p>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 bg-[#0A0A0F] flex items-center justify-center p-8">
        <div className="bg-[#12121A] rounded-2xl border border-white/10 p-8 w-full max-w-md">
          {/* Tab Toggle */}
          <div className="flex gap-6 mb-8">
            <button className="text-white border-b-2 border-violet-500 pb-2 text-sm font-semibold">Login</button>
            <button className="text-gray-500 pb-2 text-sm font-semibold">Register</button>
          </div>

          {/* Login Form */}
          <div>
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to your MoodGo account</p>

            <div className="mt-6 flex flex-col gap-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="email" placeholder="Email address" className="bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="password" placeholder="Password" className="bg-white/5 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm" />
                <Eye className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 cursor-pointer" />
              </div>
              <div className="text-right">
                <span className="text-violet-400 text-xs cursor-pointer hover:underline">Forgot password?</span>
              </div>
              <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20 w-full text-sm">Login</button>
            </div>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 border-t border-white/10"></div>
              <span className="text-gray-600 text-xs">or continue with</span>
              <div className="flex-1 border-t border-white/10"></div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-white/10 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button className="flex-1 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-white/10 transition-colors">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Apple
              </button>
            </div>
          </div>

          {/* Register Form (shown below for completeness) */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <div className="flex gap-6 mb-6">
              <span className="text-gray-500 pb-2 text-sm font-semibold">Login</span>
              <span className="text-white border-b-2 border-violet-500 pb-2 text-sm font-semibold">Register</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Create your account</h2>
            <p className="text-gray-500 text-sm mt-1">Join MoodGo and discover amazing events</p>

            <div className="mt-6 flex flex-col gap-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Full Name" className="bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm" />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="email" placeholder="Email address" className="bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm" />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select className="bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm appearance-none">
                  <option>Select City</option>
                  <option>Mumbai</option>
                  <option>Delhi</option>
                  <option>Bangalore</option>
                  <option>Goa</option>
                  <option>Hyderabad</option>
                  <option>Chennai</option>
                </select>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="password" placeholder="Password" className="bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="password" placeholder="Confirm Password" className="bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="w-4 h-4 rounded border border-white/20 bg-white/5 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-sm bg-violet-500"></div>
                </div>
                <span className="text-gray-500 text-xs">I agree to Terms & Privacy Policy</span>
              </label>
              <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20 w-full text-sm">Register</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Loader } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="bg-[#0A0A0F] min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-['DM_Sans']">
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-1">
          <h1 className="font-['Bebas_Neue'] text-6xl text-white tracking-widest">MoodGo</h1>
          <span className="w-2 h-2 rounded-full bg-[#06FFA5]"></span>
        </div>

         
        <div className="w-64 h-1 bg-white/10 rounded-full mt-8">
          <div className="bg-violet-600 h-full rounded-full w-3/4"></div>
        </div>

        <Loader className="w-6 h-6 text-violet-400 animate-spin mt-6" />

        <p className="text-gray-700 text-xs mt-4">v2.0 — Beta</p>
      </div>
    </div>
  )
}

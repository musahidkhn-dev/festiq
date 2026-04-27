export default function AdminSettings() {
  return (
    <div className="px-8 pb-8 pt-8">
      <div className="bg-[#12121A] border border-white/10 rounded-2xl p-8 max-w-2xl">
        <h2 className="text-white font-semibold mb-6">Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="text-gray-500 text-xs uppercase tracking-wider">Platform Name</label>
            <input type="text" defaultValue="MoodGo" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm mt-1" />
          </div>
          <div>
            <label className="text-gray-500 text-xs uppercase tracking-wider">Default City</label>
            <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 focus:outline-none focus:border-violet-500 w-full text-sm mt-1 appearance-none">
              <option>Mumbai</option>
              <option>Delhi</option>
              <option>Bangalore</option>
            </select>
          </div>
        </div>

        <div className="mt-8 space-y-0">
          {[
            { label: "Email Notifications", desc: "Receive booking confirmations via email", on: true },
            { label: "Push Notifications", desc: "Get notified about events near you", on: true },
            { label: "Maintenance Mode", desc: "Temporarily disable the platform", on: false },
            { label: "Auto-Approve Events", desc: "Automatically approve new event submissions", on: false }
          ].map(toggle => (
            <div key={toggle.label} className="flex justify-between items-center py-4 border-b border-white/10">
              <div>
                <p className="text-white text-sm">{toggle.label}</p>
                <p className="text-gray-500 text-xs">{toggle.desc}</p>
              </div>
              <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${toggle.on ? 'bg-violet-600' : 'bg-white/10'}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${toggle.on ? 'left-6' : 'left-0.5'}`}></div>
              </div>
            </div>
          ))}
        </div>

        <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20 text-sm mt-6">Save Settings</button>
      </div>
    </div>
  )
}

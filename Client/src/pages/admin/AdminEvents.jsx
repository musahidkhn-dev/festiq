import { Plus, Pencil, Trash2 } from 'lucide-react'
import { events } from '../../data/mockData'

export default function AdminEvents() {
  return (
    <div className="px-8 pb-8 pt-8">
      <div className="bg-[#12121A] border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6">
          <h2 className="text-white font-semibold">Events</h2>
          <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors flex items-center gap-2"><Plus className="w-4 h-4" /> Add Event</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-white/5">
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Event</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden md:table-cell">Category</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Date</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden lg:table-cell">Price</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden lg:table-cell">Sold</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {events.map(ev => (
              <tr key={ev.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-white text-sm">{ev.title}</td>
                <td className="px-6 py-4 hidden md:table-cell"><span className="bg-white/10 text-gray-400 text-xs px-3 py-1 rounded-full">{ev.category}</span></td>
                <td className="px-6 py-4 text-gray-400 text-sm">{ev.date}</td>
                <td className="px-6 py-4 text-amber-400 text-sm hidden lg:table-cell">₹{ev.price.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-400 text-sm hidden lg:table-cell">{ev.soldTickets.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Pencil className="w-4 h-4 text-gray-600 cursor-pointer hover:text-white transition-colors" />
                    <Trash2 className="w-4 h-4 text-gray-600 cursor-pointer hover:text-red-400 transition-colors" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import { Eye, Trash2 } from 'lucide-react'
import { adminOrders } from '../../data/mockData'
import { statusBadge } from './constants/badgeStyles'

export default function AdminOrders() {
  return (
    <div className="px-8 pb-8 pt-8">
      <div className="bg-[#12121A] border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex justify-between p-6">
          <h2 className="text-white font-semibold">Recent Orders</h2>
          <span className="text-violet-400 text-xs cursor-pointer hover:underline">View All →</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-white/5">
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Order ID</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">User</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden md:table-cell">Event</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Amount</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Status</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden lg:table-cell">Date</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {adminOrders.map(order => (
              <tr key={order.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-gray-400 font-['JetBrains_Mono'] text-xs">{order.id}</td>
                <td className="px-6 py-4 text-white text-sm">{order.user}</td>
                <td className="px-6 py-4 text-gray-300 text-sm hidden md:table-cell">{order.event}</td>
                <td className="px-6 py-4 text-amber-400 font-medium text-sm">{order.amount}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-3 py-1 rounded-full capitalize ${statusBadge[order.status]}`}>{order.status}</span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs hidden lg:table-cell">{order.date}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Eye className="w-4 h-4 text-gray-600 cursor-pointer hover:text-white transition-colors" />
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

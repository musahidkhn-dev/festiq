import { Pencil, Ban, Trash2 } from 'lucide-react'
import { adminUsers } from '../../data/mockData'
import { roleBadge, statusDot } from './constants/badgeStyles'

export default function AdminUsers() {
  return (
    <div className="px-8 pb-8 pt-8">
      <div className="bg-[#12121A] border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6">
          <h2 className="text-white font-semibold">Users</h2>
          <div className="flex gap-3">
            <input type="text" placeholder="Search users..." className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 text-sm w-48" />
            <button className="bg-white/5 border border-white/10 text-gray-300 text-xs px-4 py-2 rounded-xl hover:bg-white/10">Export</button>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-white/5">
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">User</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden md:table-cell">Email</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Role</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Status</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden lg:table-cell">Tickets</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden lg:table-cell">Joined</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {adminUsers.map(user => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                    <span className="text-white text-sm">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-3 py-1 rounded-full capitalize ${roleBadge[user.role]}`}>{user.role}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${statusDot[user.status] || 'bg-gray-500'}`}></span>
                    <span className="text-gray-400 text-xs capitalize">{user.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm hidden lg:table-cell">{user.tickets}</td>
                <td className="px-6 py-4 text-gray-500 text-xs hidden lg:table-cell">{user.joined}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Pencil className="w-4 h-4 text-gray-600 cursor-pointer hover:text-white transition-colors" />
                    <Ban className="w-4 h-4 text-gray-600 cursor-pointer hover:text-amber-400 transition-colors" />
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

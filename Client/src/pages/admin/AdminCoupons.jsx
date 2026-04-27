import { Plus, Pencil, Trash2 } from 'lucide-react'
import { coupons } from '../../data/mockData'

export default function AdminCoupons() {
  return (
    <div className="px-8 pb-8 pt-8">
      <div className="bg-[#12121A] border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6">
          <h2 className="text-white font-semibold">Coupons</h2>
          <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors flex items-center gap-2"><Plus className="w-4 h-4" /> Create Coupon</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-white/5">
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Code</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Discount</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden md:table-cell">Type</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden md:table-cell">Used</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left hidden lg:table-cell">Expires</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Active</th>
              <th className="text-gray-500 text-xs uppercase tracking-wider px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {coupons.map(coupon => (
              <tr key={coupon.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-['JetBrains_Mono'] text-white text-xs">{coupon.code}</td>
                <td className="px-6 py-4 text-amber-400 text-sm">{coupon.discount}</td>
                <td className="px-6 py-4 text-gray-400 text-xs capitalize hidden md:table-cell">{coupon.type}</td>
                <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">{coupon.used}</td>
                <td className="px-6 py-4 text-gray-500 text-xs hidden lg:table-cell">{coupon.expires}</td>
                <td className="px-6 py-4">
                  <span className={`w-2 h-2 rounded-full inline-block ${coupon.active ? 'bg-[#06FFA5]' : 'bg-gray-600'}`}></span>
                </td>
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

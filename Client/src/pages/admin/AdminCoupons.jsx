import { Plus, Pencil, Trash2, Tag, X, Calendar, Users, Percent, CreditCard, Lock, Globe, ShieldCheck, Zap } from 'lucide-react'
import { useState } from 'react'
import { useAdminCoupons, useDeleteCoupon, useCreateCoupon, useUpdateCoupon } from '../../hooks/queries/useAdmin'
import LoadingScreen from '../../components/LoadingScreen'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminCoupons() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  
  const initialForm = { 
    couponCode: '', 
    couponDiscount: '', 
    discountType: 'percentage',
    maxDiscountAmount: '',
    minPurchaseAmount: '',
    usageLimit: '',
    expiresAt: '',
    isPublic: true,
    isActive: true
  }
  
  const [formData, setFormData] = useState(initialForm)

  const { data, isLoading, isError } = useAdminCoupons()
  const couponsList = data?.coupons || []

  const deleteCouponMutation = useDeleteCoupon()
  const createCouponMutation = useCreateCoupon()
  const updateCouponMutation = useUpdateCoupon()

  if (isLoading && !data) return <LoadingScreen />
  if (isError) return <div className="p-8 text-red-500 font-medium">Error loading coupons. Please try again.</div>

  const handleDelete = (cid) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      deleteCouponMutation.mutate(cid)
    }
  }

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      couponCode: coupon.couponCode,
      couponDiscount: coupon.couponDiscount,
      discountType: coupon.discountType,
      maxDiscountAmount: coupon.maxDiscountAmount || '',
      minPurchaseAmount: coupon.minPurchaseAmount || '',
      usageLimit: coupon.usageLimit || '',
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
      isPublic: coupon.isPublic,
      isActive: coupon.isActive
    })
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingCoupon) {
      updateCouponMutation.mutate({ cid: editingCoupon._id, couponData: formData }, {
        onSuccess: () => {
          setIsModalOpen(false)
          setEditingCoupon(null)
          setFormData(initialForm)
        }
      })
    } else {
      createCouponMutation.mutate(formData, {
        onSuccess: () => {
          setIsModalOpen(false)
          setFormData(initialForm)
        }
      })
    }
  }

  return (
    <div className="px-8 pb-8 pt-8 space-y-6">
      {/* Header Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-[#12121A] border border-white/5 p-6 rounded-3xl">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Coupons</p>
            <h3 className="text-3xl font-bebas text-white tracking-widest">{couponsList.length}</h3>
         </div>
         <div className="bg-[#12121A] border border-white/5 p-6 rounded-3xl">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Usage</p>
            <h3 className="text-3xl font-bebas text-emerald-500 tracking-widest">
               {couponsList.reduce((acc, curr) => acc + (curr.usedCount || 0), 0)}
            </h3>
         </div>
         <div className="bg-[#12121A] border border-white/5 p-6 rounded-3xl">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Active Promotions</p>
            <h3 className="text-3xl font-bebas text-violet-500 tracking-widest">
               {couponsList.filter(c => c.isActive).length}
            </h3>
         </div>
      </div>

      <div className="bg-[#12121A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-violet-600/20 rounded-2xl">
              <Tag className="w-6 h-6 text-violet-400" />
            </div>
            <div>
               <h2 className="text-white text-xl font-bold tracking-tight">Coupon Management</h2>
               <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Authorize & Configure Discounts</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setEditingCoupon(null)
              setFormData(initialForm)
              setIsModalOpen(true)
            }}
            className="bg-white text-black hover:bg-violet-600 hover:text-white rounded-2xl px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="text-gray-500 text-[9px] uppercase tracking-[0.2em] px-8 py-6 text-left font-black">Coupon Protocol</th>
                <th className="text-gray-500 text-[9px] uppercase tracking-[0.2em] px-8 py-6 text-left font-black">Configuration</th>
                <th className="text-gray-500 text-[9px] uppercase tracking-[0.2em] px-8 py-6 text-left font-black">Usage Data</th>
                <th className="text-gray-500 text-[9px] uppercase tracking-[0.2em] px-8 py-6 text-left font-black">Availability</th>
                <th className="text-gray-500 text-[9px] uppercase tracking-[0.2em] px-8 py-6 text-right font-black">System Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {couponsList.map(coupon => (
                <tr key={coupon._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                       <span className="font-mono text-white text-sm bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 uppercase w-fit tracking-widest">{coupon.couponCode}</span>
                       <div className="flex items-center gap-2">
                          {coupon.isPublic ? (
                            <span className="flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase tracking-widest"><Globe className="w-2.5 h-2.5" /> Public</span>
                          ) : (
                            <span className="flex items-center gap-1 text-[8px] font-black text-amber-500 uppercase tracking-widest"><Lock className="w-2.5 h-2.5" /> Authorized ({coupon.allowedUsers?.length || 0})</span>
                          )}
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <span className="text-white text-sm font-bold">{coupon.discountType === 'percentage' ? `${coupon.couponDiscount}% OFF` : `₹${coupon.couponDiscount} OFF`}</span>
                           <span className="text-[9px] text-gray-500 uppercase font-black">{coupon.discountType}</span>
                        </div>
                        <div className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                           Min: ₹{coupon.minPurchaseAmount} {coupon.maxDiscountAmount ? `| Max: ₹${coupon.maxDiscountAmount}` : ''}
                        </div>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                           <span className="text-gray-300 font-bold">{coupon.usedCount || 0}</span>
                           <span className="text-gray-600 font-black text-[9px] uppercase tracking-tighter">/ {coupon.usageLimit || '∞'} USED</span>
                        </div>
                        <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                           <div 
                             className="h-full bg-violet-500" 
                             style={{ width: `${coupon.usageLimit ? (coupon.usedCount / coupon.usageLimit) * 100 : 0}%` }}
                           ></div>
                        </div>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                       <div className="flex items-center gap-2">
                         <span className={`w-2 h-2 rounded-full ${coupon.isActive ? 'bg-[#06FFA5] shadow-[0_0_8px_rgba(6,255,165,0.4)]' : 'bg-gray-600'}`}></span>
                         <span className="text-white text-[10px] font-black uppercase tracking-widest">{coupon.isActive ? 'Active' : 'Offline'}</span>
                       </div>
                       {coupon.expiresAt && (
                         <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" /> {new Date(coupon.expiresAt).toLocaleDateString()}
                         </span>
                       )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(coupon)}
                        className="p-2 bg-white/5 hover:bg-violet-600/20 text-gray-400 hover:text-violet-400 rounded-xl transition-all"
                      >
                         <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(coupon._id)}
                        className="p-2 bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-500 rounded-xl transition-all"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Coupon Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0A0A0F] border border-white/10 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center p-8 border-b border-white/5 bg-white/[0.02]">
                <div>
                   <h3 className="text-white text-2xl font-bebas tracking-widest">{editingCoupon ? 'UPGRADE' : 'NEW'} PROTOCOL</h3>
                   <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Configure Coupon Authorization Parameters</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-rose-500 transition-all">
                   <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-violet-500" /> Coupon Identity</label>
                          <input 
                            type="text" 
                            value={formData.couponCode}
                            onChange={(e) => setFormData({...formData, couponCode: e.target.value.toUpperCase()})}
                            className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white w-full outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all font-mono tracking-widest text-sm" 
                            placeholder="E.G. MOODBOT2024"
                            required
                          />
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em]">Discount Type</label>
                             <select 
                               value={formData.discountType}
                               onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                               className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white w-full outline-none focus:border-violet-500 transition-all text-xs"
                             >
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em]">Value</label>
                             <div className="relative">
                                <input 
                                  type="number" 
                                  value={formData.couponDiscount}
                                  onChange={(e) => setFormData({...formData, couponDiscount: e.target.value})}
                                  className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white w-full outline-none focus:border-violet-500 transition-all text-xs" 
                                  placeholder="0"
                                  required
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                   {formData.discountType === 'percentage' ? <Percent className="w-3.5 h-3.5" /> : <CreditCard className="w-3.5 h-3.5" />}
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-blue-500" /> Expiry Timeline</label>
                          <input 
                            type="date" 
                            value={formData.expiresAt}
                            onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                            className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white w-full outline-none focus:border-violet-500 transition-all text-xs" 
                          />
                       </div>
                    </div>

                    {/* Advanced Limits */}
                    <div className="space-y-6">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em]">Min Purchase</label>
                             <input 
                               type="number" 
                               value={formData.minPurchaseAmount}
                               onChange={(e) => setFormData({...formData, minPurchaseAmount: e.target.value})}
                               className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white w-full outline-none focus:border-violet-500 transition-all text-xs" 
                               placeholder="₹0"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em]">Max Discount</label>
                             <input 
                               type="number" 
                               value={formData.maxDiscountAmount}
                               onChange={(e) => setFormData({...formData, maxDiscountAmount: e.target.value})}
                               className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white w-full outline-none focus:border-violet-500 transition-all text-xs" 
                               placeholder="Unlimited"
                               disabled={formData.discountType === 'fixed'}
                             />
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em]">Total Usage Limit</label>
                          <input 
                            type="number" 
                            value={formData.usageLimit}
                            onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                            className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white w-full outline-none focus:border-violet-500 transition-all text-xs" 
                            placeholder="Infinite"
                          />
                       </div>

                       <div className="pt-4 space-y-4">
                          <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                             <div>
                                <p className="text-white text-xs font-bold">Public Visibility</p>
                                <p className="text-[9px] text-gray-500 font-medium">Allow any user to apply this code.</p>
                             </div>
                             <button 
                               type="button"
                               onClick={() => setFormData({...formData, isPublic: !formData.isPublic})}
                               className={`w-12 h-6 rounded-full transition-all relative ${formData.isPublic ? 'bg-emerald-500' : 'bg-gray-800'}`}
                             >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isPublic ? 'left-7' : 'left-1'}`}></div>
                             </button>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                             <div>
                                <p className="text-white text-xs font-bold">Active Status</p>
                                <p className="text-[9px] text-gray-500 font-medium">Enable/Disable this protocol instantly.</p>
                             </div>
                             <button 
                               type="button"
                               onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                               className={`w-12 h-6 rounded-full transition-all relative ${formData.isActive ? 'bg-violet-600' : 'bg-gray-800'}`}
                             >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isActive ? 'left-7' : 'left-1'}`}></div>
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>

                 <button 
                   type="submit"
                   disabled={createCouponMutation.isPending || updateCouponMutation.isPending}
                   className="bg-white text-black hover:bg-violet-600 hover:text-white rounded-[1.5rem] w-full py-5 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                 >
                   <ShieldCheck className="w-4 h-4" />
                   {editingCoupon ? 'Synchronize Protocol' : 'Deploy Coupon Protocol'}
                 </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

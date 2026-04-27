import { Link } from 'react-router-dom'
import { Check, CheckCircle, Minus, Plus, CreditCard, Eye, Lock, ShieldCheck, Wifi } from 'lucide-react'
import Navbar from '../components/Navbar'
import { events, ticketTiers } from '../data/mockData'
import EventCard from '../components/EventCard'

const event = events[0]

const steps = [
  { label: "Tickets", done: true },
  { label: "Seats", done: true },
  { label: "Details", done: true },
  { label: "Payment", active: true },
  { label: "Confirm", done: false }
]

const seatRows = [
  [1,1,1,0,1,1,1,1,0,1],
  [1,1,0,1,1,1,1,1,1,0],
  [1,1,1,2,2,1,1,0,1,1],
  [0,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,0,0,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1],
  [1,0,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,1]
]

export default function BookTicket() {
  return (
    <div className="bg-[#0A0A0F] min-h-screen text-white font-['DM_Sans']">
      <Navbar />

      {/* Step Progress Bar */}
      <div className="max-w-2xl mx-auto flex items-center justify-between mt-8 px-8">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                step.done ? 'bg-violet-600 text-white' :
                step.active ? 'bg-violet-600 ring-4 ring-violet-500/30 text-white' :
                'bg-white/10 text-gray-500'
              }`}>
                {step.done ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs mt-1 ${step.active ? 'text-white' : step.done ? 'text-gray-400' : 'text-gray-600'}`}>{step.label}</span>
            </div>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-white/10 mx-2"></div>}
          </div>
        ))}
      </div>

      {/* Event Mini Summary */}
      <div className="bg-[#12121A] border border-white/10 rounded-2xl p-4 max-w-2xl mx-auto mt-6 flex items-center gap-4">
        <img src={event.image} alt={event.title} className="w-20 h-16 rounded-xl object-cover" />
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">{event.title}</p>
          <p className="text-gray-500 text-xs">{event.date} • {event.venue}</p>
        </div>
        <span className="text-amber-400 font-bold">₹{event.price.toLocaleString()}</span>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">

        {/* Step 1 — Ticket Selection */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6">Choose Your Ticket</h2>
          <div className="grid grid-cols-1 gap-4">
            {ticketTiers.map((tier, i) => (
              <div key={tier.id} className={`border-2 rounded-2xl p-6 cursor-pointer transition-all relative ${
                i === 1 ? 'border-violet-500 bg-violet-600/5' : 'border-white/10 bg-[#12121A]'
              }`}>
                {i === 1 && <CheckCircle className="w-5 h-5 text-violet-400 absolute top-4 right-4" />}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-bold text-lg">{tier.name}</p>
                    <div className="mt-2 space-y-1">
                      {tier.perks.map(perk => (
                        <div key={perk} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-[#06FFA5]" />
                          <span className="text-gray-400 text-sm">{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 font-bold text-xl">₹{tier.price.toLocaleString()}</p>
                    <p className="text-gray-600 text-xs mt-1">{tier.available} available</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <p className="text-gray-400 text-sm mb-2">Quantity</p>
            <div className="flex items-center gap-4">
              <button className="bg-white/10 rounded-lg p-2 hover:bg-white/20 transition-colors"><Minus className="w-4 h-4 text-white" /></button>
              <span className="text-white font-bold text-xl">2</span>
              <button className="bg-violet-600 rounded-lg p-2 hover:bg-violet-700 transition-colors"><Plus className="w-4 h-4 text-white" /></button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-[#1A1A2E] border border-white/10 rounded-2xl p-6 mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">VIP × 2</span>
              <span className="text-white">₹5,998</span>
            </div>
            <div className="flex gap-2 my-3">
              <input type="text" placeholder="Coupon code" defaultValue="MOODGO20" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 text-sm flex-1" />
              <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors">Apply</button>
            </div>
            <p className="text-[#06FFA5] text-xs mb-3">MOODGO20 applied ✓</p>
            <div className="border-t border-white/10 pt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#06FFA5]">Discount</span><span className="text-[#06FFA5]">-₹1,200</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span className="text-white">₹4,798</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Convenience Fee</span><span className="text-white">+₹120</span></div>
              <div className="flex justify-between"><span className="text-gray-400">GST (18%)</span><span className="text-white">+₹863</span></div>
            </div>
            <div className="border-t border-white/10 pt-3 mt-3 flex justify-between">
              <span className="text-white font-bold">Total</span>
              <span className="text-white font-bold text-xl">₹5,781</span>
            </div>
          </div>

          <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20 text-sm w-full mt-4">Next: Seat Selection →</button>
        </section>

        {/* Step 2 — Seat Selection */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6">Select Your Seats</h2>
          <div className="bg-white/10 text-gray-400 text-xs rounded-lg py-2 text-center w-1/3 mx-auto mb-6">STAGE</div>

          <div className="grid grid-cols-10 gap-1.5 max-w-lg mx-auto">
            {seatRows.flat().map((seat, i) => (
              <div key={i} className={`w-7 h-7 rounded-md text-xs flex items-center justify-center ${
                seat === 2 ? 'bg-violet-600 text-white cursor-pointer' :
                seat === 0 ? 'bg-gray-800 cursor-not-allowed' :
                'bg-white/10 hover:bg-violet-600/50 cursor-pointer'
              }`}></div>
            ))}
          </div>

          <div className="flex gap-6 justify-center mt-4">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-white/10"></div><span className="text-gray-500 text-xs">Available</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-gray-800"></div><span className="text-gray-500 text-xs">Taken</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-violet-600"></div><span className="text-gray-500 text-xs">Selected</span></div>
          </div>

          <div className="bg-violet-600/20 text-violet-400 border border-violet-500/30 rounded-lg px-4 py-2 text-sm text-center mt-4">
            Selected: C4, C5
          </div>

          <div className="flex gap-3 mt-4">
            <button className="border border-white/20 hover:border-white/40 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 hover:bg-white/5 text-sm flex-1">← Back</button>
            <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20 text-sm flex-1">Next: Details →</button>
          </div>
        </section>

        {/* Step 3 — Details */}
        <section className="mb-12 max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">Your Details</h2>
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">👤</span>
              <input type="text" defaultValue="Arjun Sharma" className="bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm" />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">✉️</span>
              <input type="email" defaultValue="arjun@moodgo.in" className="bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm" />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">📱</span>
              <input type="tel" defaultValue="+91 98765 43210" className="bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm" />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">📍</span>
              <input type="text" defaultValue="Mumbai" className="bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm" />
            </div>
          </div>

          {/* OTP */}
          <div className="bg-[#12121A] border border-white/10 rounded-2xl p-6 mt-6">
            <p className="text-white font-semibold">Verify your phone number</p>
            <p className="text-gray-400 text-sm mt-1">+91 98765 43210</p>
            <button className="border border-white/20 hover:border-white/40 text-white rounded-xl px-6 py-2.5 font-semibold transition-all duration-200 hover:bg-white/5 text-sm mt-3">Send OTP</button>
            <div className="flex gap-3 justify-center mt-4">
              {["4", "2", "7", "", "", ""].map((v, i) => (
                <div key={i} className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl text-center text-white text-xl font-bold flex items-center justify-center">
                  {v}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Step 4 — Payment */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6">Payment</h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              {/* Payment method tabs */}
              <div className="flex border-b border-white/10 mb-6 gap-4">
                <span className="text-white border-b-2 border-violet-500 pb-3 text-sm font-semibold cursor-pointer">💳 Card</span>
                <span className="text-gray-500 pb-3 text-sm cursor-pointer">UPI</span>
                <span className="text-gray-500 pb-3 text-sm cursor-pointer">Wallet</span>
                <span className="text-gray-500 pb-3 text-sm cursor-pointer">Net Banking</span>
              </div>

              {/* Card Preview */}
              <div className="bg-gradient-to-br from-violet-900 to-[#1A1A2E] rounded-2xl p-6 h-44 relative overflow-hidden mb-6">
                <div className="absolute top-6 right-6 w-16 h-16 rounded-full bg-white/5"></div>
                <div className="absolute top-10 right-10 w-12 h-12 rounded-full bg-white/5"></div>
                <Wifi className="absolute top-6 right-6 w-5 h-5 text-white/40 rotate-90" />
                <p className="text-white text-lg tracking-widest mt-12 font-['JetBrains_Mono']">•••• •••• •••• 4242</p>
                <div className="absolute bottom-6 left-6">
                  <p className="text-gray-400 text-xs">ARJUN SHARMA</p>
                </div>
                <div className="absolute bottom-6 right-6">
                  <p className="text-gray-400 text-xs">12/28</p>
                </div>
              </div>

              {/* Card Form */}
              <div className="space-y-4">
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="text" defaultValue="4242 4242 4242 4242" className="bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm" />
                </div>
                <input type="text" defaultValue="Arjun Sharma" placeholder="Name on Card" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" defaultValue="12 / 28" placeholder="Expiry" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm" />
                  <div className="relative">
                    <input type="password" defaultValue="123" placeholder="CVV" className="bg-white/5 border border-white/10 rounded-xl px-4 pr-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm" />
                    <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* UPI Section */}
              <div className="mt-8 border-t border-white/10 pt-8">
                <p className="text-white font-semibold text-sm mb-3">Or pay with UPI</p>
                <input type="text" placeholder="yourname@upi" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full text-sm mb-3" />
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-around">
                  {["GPay", "PhonePe", "Paytm"].map(app => (
                    <div key={app} className="rounded-xl bg-white/5 p-3 text-xs text-gray-300 text-center cursor-pointer hover:bg-white/10 transition-colors px-6">
                      {app}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-[#12121A] border border-white/10 rounded-2xl p-6 lg:sticky lg:top-24">
                <h3 className="text-white font-semibold mb-4">Order Summary</h3>
                <p className="text-gray-300 text-sm mb-4">{event.title}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">VIP × 2</span><span className="text-white">₹5,998</span></div>
                  <div className="flex justify-between"><span className="text-[#06FFA5]">MOODGO20</span><span className="text-[#06FFA5]">-₹1,200</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Conv. Fee</span><span className="text-white">+₹120</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">GST</span><span className="text-white">+₹863</span></div>
                </div>
                <div className="border-t border-white/10 pt-3 mt-3 flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-amber-400 text-xl font-bold">₹5,781</span>
                </div>
                <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20 text-sm w-full mt-4 flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> Pay ₹5,781 →
                </button>
                <div className="flex items-center gap-2 justify-center mt-3">
                  <ShieldCheck className="w-4 h-4 text-[#06FFA5]" />
                  <span className="text-gray-500 text-xs">100% Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 5 — Confirmation */}
        <section className="max-w-lg mx-auto text-center py-12 border-t border-white/10">
          <div className="w-20 h-20 bg-[#06FFA5]/10 border border-[#06FFA5]/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-[#06FFA5] animate-bounce" />
          </div>
          <h2 className="font-['Bebas_Neue'] text-4xl text-white mt-6 tracking-wider">Booking Confirmed!</h2>
          <p className="text-gray-400 text-sm mt-2">Your tickets are on their way to arjun@moodgo.in</p>

          {/* Ticket Card */}
          <div className="bg-[#12121A] border-2 border-dashed border-white/20 rounded-2xl overflow-hidden mt-8 max-w-md mx-auto text-left">
            <div className="p-6">
              <h3 className="text-white font-bold">{event.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{event.date} • {event.venue}</p>
              <div className="flex gap-4 mt-3">
                <span className="text-gray-500 text-xs">Seat: C4, C5</span>
                <span className="text-gray-500 text-xs">Type: VIP</span>
              </div>
            </div>
            <div className="relative border-t border-dashed border-white/20">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#0A0A0F] rounded-full"></div>
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#0A0A0F] rounded-full"></div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="font-['JetBrains_Mono'] text-xs text-gray-500">MOODGO-SUB-2025-001</span>
              <div className="w-16 h-16 bg-white/5 rounded-lg grid grid-cols-4 gap-0.5 p-1">
                {Array(16).fill(0).map((_, i) => (
                  <div key={i} className={`rounded-sm ${i % 3 === 0 ? 'bg-white/20' : 'bg-transparent'}`}></div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3 justify-center flex-wrap">
            <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20 text-sm">Download</button>
            <Link to="/tickets" className="border border-white/20 hover:border-white/40 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 hover:bg-white/5 text-sm">View Tickets</Link>
            <button className="text-gray-400 hover:text-white hover:bg-white/5 rounded-xl px-4 py-2 transition-all duration-200 text-sm">Share</button>
          </div>

          {/* You Might Also Like */}
          <div className="mt-12 text-left">
            <h3 className="text-white font-semibold mb-4">You Might Also Like</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EventCard event={events[1]} />
              <EventCard event={events[5]} />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

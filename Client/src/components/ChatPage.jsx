import { Bot, Plus, MessageSquare, Send, Mic, Settings, MoreVertical } from 'lucide-react'
import { currentUser, events, chatMessages, chatHistory } from '../data/mockData'

const quickChips = ["Events near me 📍", "Surprise me 🎲", "This weekend 📅", "Under ₹500 💰"]

export default function ChatPage() {
  return (
    <div className="flex h-screen bg-[#0A0A0F] overflow-hidden font-['DM_Sans']">
      {/* Left Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#0D0D15] border-r border-white/10 flex-col">
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-violet-400" />
          </div>
          <span className="text-white font-semibold text-sm">MoodBot</span>
          <span className="w-2 h-2 bg-[#06FFA5] rounded-full animate-pulse"></span>
        </div>

        <button className="mx-4 mt-4 bg-violet-600 text-white rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm hover:bg-violet-700 transition-colors">
          <Plus className="w-4 h-4" /> New Chat
        </button>

        <p className="text-gray-600 text-xs uppercase tracking-wider px-4 mt-6 mb-2">Recent Chats</p>

        {chatHistory.map((chat, i) => (
          <div key={chat.id} className={`px-4 py-3 rounded-xl mx-2 cursor-pointer flex items-center gap-3 mb-1 ${
            i === 0 ? 'bg-violet-600/10 border border-violet-500/20' : 'hover:bg-white/5'
          }`}>
            <MessageSquare className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <div className="overflow-hidden">
              <p className="text-gray-300 text-sm truncate">{chat.title}</p>
              <p className="text-gray-600 text-xs">{chat.date}</p>
            </div>
          </div>
        ))}

        <div className="mt-auto p-4 border-t border-white/10 flex items-center gap-3">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full" />
          <span className="text-gray-300 text-sm flex-1 truncate">{currentUser.name}</span>
          <Settings className="w-4 h-4 text-gray-600 cursor-pointer hover:text-white" />
        </div>
      </aside>

      {/* Right Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">MoodBot</p>
              <p className="text-[#06FFA5] text-xs">Online • Powered by AI</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4 text-gray-500 cursor-pointer hover:text-white" />
            <MoreVertical className="w-4 h-4 text-gray-500 cursor-pointer hover:text-white" />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Bot Message 1 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-violet-400" />
            </div>
            <div className="max-w-[70%]">
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 text-gray-200 text-sm">
                {chatMessages[0].message}
              </div>
              <p className="text-gray-600 text-xs mt-1">{chatMessages[0].time}</p>
              <div className="mt-3 flex gap-2 flex-wrap">
                {chatMessages[0].suggestions.map(s => (
                  <span key={s} className="border border-violet-500/30 bg-violet-600/10 text-violet-300 text-xs px-4 py-2 rounded-full cursor-pointer hover:bg-violet-600/20 transition-colors">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* User Message */}
          <div className="flex items-start gap-3 flex-row-reverse">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="max-w-[70%]">
              <div className="bg-violet-600 text-white rounded-2xl rounded-tr-none p-4 text-sm">
                {chatMessages[1].message}
              </div>
              <p className="text-gray-600 text-xs mt-1 text-right">{chatMessages[1].time}</p>
            </div>
          </div>

          {/* Bot Message with Event Cards */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-violet-400" />
            </div>
            <div className="max-w-[70%]">
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 text-gray-200 text-sm">
                {chatMessages[2].message}
              </div>
              <p className="text-gray-600 text-xs mt-1">{chatMessages[2].time}</p>
              <div className="grid grid-cols-1 gap-3 mt-3 max-w-sm">
                {[events[0], events[5]].map(event => (
                  <div key={event.id} className="bg-[#12121A] border border-white/10 rounded-xl overflow-hidden flex">
                    <img src={event.image} alt={event.title} className="w-20 h-16 object-cover flex-shrink-0" />
                    <div className="p-3 flex-1 min-w-0">
                      <p className="text-sm text-white font-semibold truncate">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.date}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-amber-400 text-xs">₹{event.price.toLocaleString()}</span>
                        <span className="text-xs bg-violet-600 text-white px-2 py-1 rounded-lg cursor-pointer">Book →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Typing Indicator */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-violet-400" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:75ms]"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="border-t border-white/10 px-6 pt-4 flex gap-2 flex-wrap">
          {quickChips.map(chip => (
            <span key={chip} className="border border-white/10 bg-white/5 text-gray-400 text-xs px-4 py-2 rounded-full hover:text-white hover:border-white/30 cursor-pointer transition-colors">
              {chip}
            </span>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 bg-[#12121A] border border-white/10 rounded-2xl p-3">
            <button className="bg-white/5 p-2 rounded-xl hover:bg-white/10 transition-colors">
              <Mic className="w-4 h-4 text-gray-400" />
            </button>
            <input type="text" placeholder="Ask MoodBot anything..." className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-sm" />
            <button className="bg-violet-600 p-2.5 rounded-xl hover:bg-violet-700 transition-colors">
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

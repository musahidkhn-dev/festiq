import { useState, useEffect, useRef } from 'react';
import { Bot, Plus, MessageSquare, Send, Mic, Settings, MoreVertical, Sparkles, Zap, ShieldCheck, ArrowLeft, RefreshCw, Calendar, MapPin, Ticket, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import SafeAvatar from './SafeAvatar';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function ChatPage() {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  // Load initial messages from localStorage if available
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(`festiq_nova_chat_${user?._id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load Nova chat history", e);
      }
    }
    return [
      {
        id: 1,
        sender: 'bot',
        message: `Festiq Protocol initialized! 🎭 Nova is online. How can I help you discover the perfect event today?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Persist messages to localStorage
  useEffect(() => {
    if (user?._id) {
      localStorage.setItem(`festiq_nova_chat_${user._id}`, JSON.stringify(messages));
    }
  }, [messages, user?._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (textOverride) => {
    const textToSend = typeof textOverride === 'string' ? textOverride : inputText;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      message: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (typeof textOverride !== 'string') {
        setMessages(prev => [...prev, userMsg]);
        setInputText("");
    }
    
    setIsTyping(true);

    try {
      // Use "message" key as per backend requirement
      const { data } = await axiosInstance.post('/chat', { message: userMsg.message });
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        message: data.reply,
        events: data.events || [],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Nova is recalibrating. Try again later!";
      toast.error(errorMsg);
      
      // Add error state to messages for retry
      const errorStateMsg = {
        id: Date.now() + 2,
        sender: 'bot',
        message: "Arey arey! Something went wrong. Click to retry? 🔄",
        isError: true,
        originalText: userMsg.message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorStateMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    const initialMsg = [
      {
        id: 1,
        sender: 'bot',
        message: `Chat cleared! Ohooo, fresh start Musahid ji! Kya plan hai aaj ka?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(initialMsg);
  };

  return (
    <div className="flex h-screen bg-[#050508] overflow-hidden font-outfit selection:bg-violet-500/30">
      <div className="noise-overlay"></div>

      {/* Left Sidebar */}
      <aside className="hidden lg:flex w-80 bg-[#0A0A10] border-r border-white/5 flex-col p-8 relative z-10">
        <div className="mb-12">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-white transition-all mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Close</span>
          </button>
          
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
               <span className="font-bebas text-3xl text-white tracking-widest leading-none">Nova</span>
               <span className="text-violet-500 text-[8px] font-black uppercase tracking-[0.2em] mt-1">v3.0 Hybrid Sync</span>
            </div>
          </div>
        </div>

        <button 
          onClick={clearChat}
          className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 group shadow-xl shadow-black"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> New Session
        </button>

        <div className="flex-1 mt-10 space-y-2 overflow-y-auto no-scrollbar">
          <p className="text-gray-700 text-[8px] font-black uppercase tracking-[0.3em] mb-4">Memory Nodes</p>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-violet-500/30 flex items-center gap-4 group cursor-pointer transition-all">
             <div className="w-10 h-10 rounded-xl bg-violet-600/10 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-violet-500" />
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-white text-[10px] font-bold uppercase tracking-widest truncate">Persistence Enabled</p>
                <p className="text-gray-700 text-[8px] font-black uppercase tracking-widest mt-0.5">{messages.length} Nodes Stored</p>
             </div>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-white/5">
           <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-[2rem]">
              <SafeAvatar src={null} name={user?.name || 'User'} className="w-10 h-10 ring-2 ring-violet-500/20" />
              <div className="flex-1 min-w-0">
                 <p className="text-white text-[10px] font-bold uppercase tracking-widest truncate">{user?.name}</p>
                 <p className="text-gray-700 text-[8px] font-black uppercase tracking-widest mt-0.5">Verified Admin</p>
              </div>
              <Settings className="w-4 h-4 text-gray-700 cursor-pointer hover:text-white transition-colors" />
           </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10 bg-[#050508]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

        <header className="h-24 sticky top-0 z-50 flex items-center justify-between px-10 bg-[#050508]/80 backdrop-blur-2xl border-b border-white/5">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative">
                 <Bot className="w-6 h-6 text-violet-500" />
                 <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-[#050508] rounded-full animate-pulse"></div>
              </div>
              <div>
                 <h2 className="text-white font-black text-xs uppercase tracking-widest leading-none mb-1">NOVA AI</h2>
                 <p className="text-emerald-500 text-[8px] font-black uppercase tracking-[0.2em] leading-none">Online • Markdown Sync Active</p>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-gray-500 text-[8px] font-black uppercase tracking-widest">
                 <ShieldCheck className="w-3.5 h-3.5 text-violet-500" /> AES-256 Memory
              </div>
              <MoreVertical className="w-5 h-5 text-gray-700 cursor-pointer hover:text-white transition-colors" />
           </div>
        </header>

        <div className="flex-1 overflow-y-auto px-10 py-12 space-y-10 custom-scrollbar">
           <AnimatePresence>
             {messages.map((msg) => (
               <motion.div 
                 key={msg.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className={`flex items-start gap-6 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
               >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 border ${
                    msg.sender === 'bot' ? 'bg-white/5 border-white/10' : 'bg-violet-600/10 border-violet-500/20 shadow-2xl'
                  }`}>
                    {msg.sender === 'bot' ? <Bot className="w-5 h-5 text-violet-500" /> : <SafeAvatar src={null} name={user?.name || ''} className="w-full h-full rounded-2xl" />}
                  </div>
                  
                  <div className={`max-w-[75%] space-y-2 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                     <div className={`p-6 text-sm font-medium leading-relaxed shadow-2xl relative group ${
                        msg.sender === 'bot' 
                          ? 'bg-white/[0.03] border border-white/5 rounded-[2rem] rounded-tl-none text-gray-300' 
                          : 'bg-violet-600 text-white rounded-[2rem] rounded-tr-none shadow-[0_10px_30px_rgba(124,58,237,0.3)]'
                      }`}>
                        {msg.isError ? (
                          <button 
                            onClick={() => handleSendMessage(msg.originalText)}
                            className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" /> {msg.message}
                          </button>
                        ) : (
                          <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-violet-400 prose-blockquote:border-violet-500 prose-blockquote:bg-white/[0.03] prose-blockquote:p-4 prose-blockquote:rounded-xl prose-hr:border-white/10">
                             <ReactMarkdown
                               components={{
                                 hr: ({node, ...props}) => <hr className="my-6 border-white/5" {...props} />,
                                 blockquote: ({node, ...props}) => <div className="border-l-4 border-violet-500 bg-white/[0.02] p-4 my-4 rounded-r-2xl italic text-gray-400 shadow-inner" {...props} />,
                                 strong: ({node, ...props}) => <strong className="text-violet-400 font-black tracking-tight" {...props} />,
                                 p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                                 a: ({node, ...props}) => <a className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest no-underline hover:bg-white hover:text-black transition-all mt-2" {...props} />
                               }}
                             >
                               {msg.message}
                             </ReactMarkdown>
                          </div>
                        )}
                      </div>

                      {/* AI Event Recommendation Cards */}
                      {msg.sender === 'bot' && Array.isArray(msg.events) && msg.events.length > 0 && (
                        <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x max-w-full">
                           {msg.events.map((ev) => (
                             <motion.div
                               key={ev?._id || Math.random()}
                               whileHover={{ y: -5 }}
                               onClick={() => ev?._id && navigate(`/events/${ev._id}`)}
                               className="min-w-[300px] max-w-[300px] bg-white/[0.03] border border-white/5 rounded-[2rem] overflow-hidden cursor-pointer group hover:border-violet-500/30 transition-all snap-start shadow-2xl"
                             >
                                <div className="h-40 relative overflow-hidden">
                                   <img src={ev?.eventImage || '/default-event.jpg'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                   <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
                                      <p className="text-emerald-400 font-bebas text-lg tracking-widest leading-none">{ev?.ticketPrice ? `₹${ev.ticketPrice}` : 'FREE'}</p>
                                   </div>
                                </div>
                                <div className="p-6 space-y-4">
                                   <div className="flex items-center justify-between">
                                      <p className="text-violet-500 text-[8px] font-black uppercase tracking-widest">{ev?.category || 'General'}</p>
                                      <div className="flex items-center gap-1 text-gray-500">
                                         <Calendar className="w-3 h-3" />
                                         <p className="text-[8px] font-black uppercase tracking-widest">{ev?.date ? new Date(ev.date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'TBA'}</p>
                                      </div>
                                   </div>
                                   <h5 className="text-white font-bold text-sm truncate uppercase tracking-widest group-hover:text-violet-400 transition-colors">{ev?.title || 'Unknown Event'}</h5>
                                   <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-[0.2em] group-hover:bg-violet-600 transition-all flex items-center justify-center gap-2">
                                      Explore Experience <ChevronRight className="w-3.5 h-3.5" />
                                   </button>
                                </div>
                             </motion.div>
                           ))}
                        </div>
                      )}

                      <p className="text-gray-800 text-[8px] font-black uppercase tracking-[0.2em] px-2">{msg.time}</p>
                   </div>
                </motion.div>
              ))}

              {messages.length === 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-3 justify-center mt-8"
                >
                  {[
                    "🔥 Trending Events Mumbai",
                    "🎵 Music Concerts this weekend",
                    "🚀 Tech & Startup Meetups",
                    "🎮 Gaming Tournaments"
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSendMessage(chip)}
                      className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-violet-500/50 hover:text-white transition-all hover:-translate-y-1"
                    >
                      {chip}
                    </button>
                  ))}
                </motion.div>
              )}

             {isTyping && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-6">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-violet-500" />
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] rounded-tl-none px-6 py-4">
                     <div className="flex gap-2 items-center">
                        <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
                        <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
                     </div>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
           <div ref={scrollRef} />
        </div>

        <div className="p-10 bg-[#050508]/80 backdrop-blur-2xl">
           <form 
             onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
             className="max-w-4xl mx-auto flex items-center gap-4 bg-[#12121A] border border-white/5 rounded-[2.5rem] p-4 focus-within:border-violet-500/50 transition-all shadow-2xl"
           >
              <button type="button" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors group">
                 <Mic className="w-5 h-5 text-gray-600 group-hover:text-violet-400 transition-colors" />
              </button>
              
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask me anything about events... 🎤" 
                className="flex-1 bg-transparent text-white placeholder-gray-800 outline-none text-sm font-bold tracking-tight" 
              />

              <div className="hidden md:flex items-center gap-2 mr-2">
                 <div className="px-2 py-1 bg-white/5 border border-white/5 rounded-md text-[8px] font-black text-gray-700 uppercase tracking-widest">Enter</div>
              </div>

              <button 
                disabled={isTyping}
                type="submit" 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  inputText.trim() ? 'bg-violet-600 text-white shadow-xl shadow-violet-600/20' : 'bg-white/5 text-gray-700'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
           </form>
           <p className="text-center text-gray-800 text-[8px] font-black uppercase tracking-[0.4em] mt-6">
              Nova V3.0 — Persistence & Markdown Enabled
           </p>
        </div>
      </div>
    </div>
  );
}

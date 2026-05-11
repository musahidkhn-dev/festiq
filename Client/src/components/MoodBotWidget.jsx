import { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare, RefreshCw, Minus, Maximize2, Trash2, Zap, Calendar, MapPin, Ticket, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import axiosInstance from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import SafeAvatar from './SafeAvatar';

export default function MoodBotWidget() {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(`festiq_nova_chat_${user?._id || 'guest'}`);
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
        message: `Nova is here! 🎭 How can I help you discover the perfect event today?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const scrollRef = useRef(null);

  // Persist messages
  useEffect(() => {
    localStorage.setItem(`festiq_nova_chat_${user?._id || 'guest'}`, JSON.stringify(messages));
  }, [messages, user?._id]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen, isMinimized]);

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
      const errorMsg = err.response?.data?.message || "Nova is temporarily unavailable. Try again later!";
      toast.error(errorMsg);
      
      const errorStateMsg = {
        id: Date.now() + 2,
        sender: 'bot',
        message: "Arey arey! Something went wrong. Retry? 🔄",
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
    setMessages([{
      id: 1,
      sender: 'bot',
      message: `Chat reset! Back to action. 😎`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-8 sm:right-8 z-[1000] font-outfit pb-[env(safe-area-inset-bottom)]">
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="w-11 h-11 sm:w-16 sm:h-16 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.5)] relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Bot className="w-5 h-5 sm:w-8 sm:h-8 text-white relative z-10" />
            <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-5 sm:h-5 bg-emerald-500 border-2 sm:border-4 border-dark-bg rounded-full animate-pulse"></div>
            
            {/* Pulsing Outer Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-violet-500/30 animate-ping opacity-20"></div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              filter: 'blur(0px)',
              height: isMinimized ? '50px' : (window.innerWidth < 640 ? '55vh' : '600px')
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8, filter: 'blur(10px)' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`w-[82vw] sm:w-[400px] max-w-[320px] sm:max-w-[400px] bg-[#0A0A10]/95 backdrop-blur-2xl border border-white/10 rounded-[1.25rem] md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col`}
          >
            {/* Header */}
            <div className="px-3 py-2.5 md:p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="w-7 h-7 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-gradient-to-tr from-violet-600/20 to-blue-600/20 border border-white/10 flex items-center justify-center relative">
                  <Sparkles className="w-3.5 h-3.5 md:w-6 md:h-6 text-violet-500" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 border-2 border-[#0A0A10] rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-white font-black text-[9px] md:text-sm uppercase tracking-widest leading-none">Nova</h3>
                  <p className="text-gray-500 text-[6px] md:text-[9px] font-black uppercase tracking-[0.2em] mt-0.5">Nova by Festiq</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-gray-500 hover:text-white"
                >
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-gray-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Message List */}
                <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-6 custom-scrollbar scroll-smooth">
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-start gap-2.5 md:gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`w-5 h-5 md:w-8 md:h-8 rounded-md md:rounded-xl flex items-center justify-center flex-shrink-0 border ${
                          msg.sender === 'bot' ? 'bg-white/5 border-white/10' : 'bg-violet-600/10 border-violet-500/20'
                        }`}>
                          {msg.sender === 'bot' ? <Bot className="w-2.5 h-2.5 md:w-4 md:h-4 text-violet-500" /> : <SafeAvatar src={null} name={user?.name || ''} className="w-full h-full rounded-md" />}
                        </div>
                        
                        <div className={`max-w-[80%] space-y-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                          <div className={`p-2 md:p-4 text-[9px] md:text-xs font-medium leading-relaxed rounded-lg md:rounded-2xl relative ${
                            msg.sender === 'bot' 
                              ? 'bg-white/[0.03] border border-white/5 rounded-tl-none text-gray-300' 
                              : 'bg-violet-600 text-white rounded-tr-none'
                          }`}>
                            {msg.isError ? (
                              <button 
                                onClick={() => handleSendMessage(msg.originalText)}
                                className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors"
                              >
                                <RefreshCw className="w-3 h-3" /> {msg.message}
                              </button>
                            ) : (
                              <div className="prose prose-invert prose-xs max-w-none">
                                <ReactMarkdown 
                                  components={{
                                    p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />
                                  }}
                                >
                                  {msg.message}
                                </ReactMarkdown>
                              </div>
                            )}
                          </div>

                          {/* Event Cards */}
                          {msg.sender === 'bot' && Array.isArray(msg.events) && msg.events.length > 0 && (
                            <div className="mt-2 flex gap-2 overflow-x-auto pb-2 no-scrollbar snap-x">
                              {msg.events.map((ev) => (
                                <div
                                  key={ev?._id || Math.random()}
                                  onClick={() => ev?._id && navigate(`/events/${ev._id}`)}
                                  className="min-w-[160px] bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden cursor-pointer hover:border-violet-500/30 transition-all snap-start"
                                >
                                  <div className="h-20 relative">
                                    <img src={ev?.eventImage || '/default-event.jpg'} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="p-2.5">
                                    <h5 className="text-white font-bold text-[8px] uppercase truncate">{ev?.title || 'Event'}</h5>
                                    <p className="text-[7px] text-gray-500 mt-0.5">{ev?.date ? new Date(ev.date).toLocaleDateString() : 'TBA'}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <span className="text-[7px] text-gray-700 font-black tracking-[0.1em] block px-1">{msg.time}</span>
                        </div>
                      </motion.div>
                    ))}

                    {isTyping && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          <Bot className="w-3 h-3 text-violet-500" />
                        </div>
                        <div className="bg-white/[0.03] border border-white/5 rounded-xl rounded-tl-none px-3 py-2.5">
                          <div className="flex gap-1">
                            <span className="w-1 h-1 bg-violet-500 rounded-full animate-bounce"></span>
                            <span className="w-1 h-1 bg-violet-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
                            <span className="w-1 h-1 bg-violet-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={scrollRef} />
                </div>

                {/* Input Area */}
                <div className="p-2 md:p-6 border-t border-white/5 bg-white/[0.02]">
                  <form 
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                    className="flex items-center gap-1.5 md:gap-3 bg-white/5 border border-white/5 rounded-lg md:rounded-2xl p-1 md:p-2 focus-within:border-violet-500/30 transition-all shadow-inner"
                  >
                    <input 
                      type="text" 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Ask..." 
                      className="flex-1 bg-transparent text-white placeholder-gray-700 outline-none text-[10px] md:text-[10px] font-bold tracking-widest px-2 md:px-4 h-8 md:h-10 uppercase" 
                    />
                    <div className="flex items-center gap-1">
                      <button 
                        type="button"
                        onClick={clearChat}
                        className="p-1.5 md:p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-700 hover:text-rose-500"
                        title="Clear Chat"
                      >
                        <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                      <button 
                        disabled={isTyping || !inputText.trim()}
                        type="submit" 
                        className={`w-7 h-7 md:w-10 md:h-10 rounded-md md:rounded-xl flex items-center justify-center transition-all ${
                          inputText.trim() ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'bg-white/5 text-gray-800'
                        }`}
                      >
                        <Send className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    </div>
                  </form>
                  <div className="flex justify-between items-center mt-3 md:mt-4">
                     <div className="flex items-center gap-1 text-emerald-500/50 text-[6px] md:text-[7px] font-black uppercase tracking-[0.2em]">
                        <Zap className="w-2 md:w-2.5 h-2 md:h-2.5 fill-current" /> Sync Active
                     </div>
                     <span className="text-gray-800 text-[6px] md:text-[7px] font-black uppercase tracking-[0.2em]">Festiq Nova Assistant v3.0</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

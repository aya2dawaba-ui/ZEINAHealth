
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, CheckCircle, Calendar, Clock, XCircle, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '../types';
import { ZeinaChat } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';
import { ZEINA_AVATAR } from '../constants';
import { useAuth } from '../context/AuthContext';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: language === 'ar' ? "أهلاً بك! أنا زينة. كيف يمكنني مساعدتك في رحلتك الصحية اليوم؟" : "Hello! I'm Zeina. How can I support your health journey today?", timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session once to maintain history
  const [chatSession] = useState(() => new ZeinaChat(language));

  // Update language and user profile in chat session
  useEffect(() => {
    chatSession.setLanguage(language);
    chatSession.setUserProfile(user);
  }, [language, user, chatSession]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isLoading]);

  // Reset welcome message when language changes
  useEffect(() => {
    setMessages(prev => {
      // Replace the first message if it's the welcome message
      if (prev.length > 0 && prev[0].role === 'model' && prev.length === 1) {
          const newWelcome = language === 'ar' ? "أهلاً بك! أنا زينة. كيف يمكنني مساعدتك في رحلتك الصحية اليوم؟" : "Hello! I'm Zeina. How can I support your health journey today?";
         return [{ ...prev[0], text: newWelcome }, ...prev.slice(1)];
      }
      return prev;
    });
  }, [language]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = { role: 'user', text: inputText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await chatSession.sendMessage(inputText);
      
      const botMsg: Message = { 
        role: 'model', 
        text: response.text, 
        timestamp: new Date(),
        bookingDetails: response.bookingDetails,
        appointmentList: response.appointmentList,
        cancellationDetails: response.cancellationDetails
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
       const errorMsg: Message = { role: 'model', text: language === 'ar' ? "عذراً، واجهت مشكلة تقنية." : "I'm sorry, I encountered an issue.", timestamp: new Date() };
       setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 ltr:right-6 rtl:left-6 w-96 max-w-[90vw] bg-white rounded-2xl shadow-2xl z-50 border border-zeina-100 flex flex-col overflow-hidden"
            style={{ height: '500px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-zeina-600 to-zeina-400 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Sparkles size={18} />
                <h3 className="font-serif font-bold">{language === 'ar' ? 'مساعدة زينة' : 'Zeina Assistant'}</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-6 bg-slate-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar for Bot */}
                  {msg.role === 'model' && (
                     <div className="w-8 h-8 rounded-full overflow-hidden border border-zeina-200 flex-shrink-0 bg-white shadow-sm">
                        <img src={ZEINA_AVATAR} alt="Zeina" className="w-full h-full object-cover" />
                     </div>
                  )}

                  <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                      msg.role === 'user' 
                        ? 'bg-zeina-600 text-white rounded-tr-none rtl:rounded-tr-2xl rtl:rounded-tl-none' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none'
                    }`}>
                      {msg.text}
                    </div>

                    {/* Compact Booking Card */}
                    {msg.bookingDetails && (
                       <div className="bg-white rounded-xl p-3 border border-zeina-200 shadow-md w-full mt-2">
                          <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs mb-2 border-b border-slate-50 pb-1">
                             <CheckCircle size={12} /> {msg.text.includes('Reschedule') ? 'Rescheduled' : 'Confirmed'}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                             <img src={msg.bookingDetails.expertImage} alt="Expert" className="w-8 h-8 rounded-full object-cover" />
                             <div>
                                <div className="font-bold text-slate-900 text-xs">{msg.bookingDetails.expertName}</div>
                                <div className="text-[10px] text-slate-500">Video Call</div>
                             </div>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-2 space-y-1 text-xs">
                             <div className="flex items-center gap-2 text-slate-700">
                                <Calendar size={12} className="text-zeina-500" /> 
                                <span className="font-semibold">{msg.bookingDetails.date}</span>
                             </div>
                             <div className="flex items-center gap-2 text-slate-700">
                                <Clock size={12} className="text-zeina-500" /> 
                                <span className="font-semibold">{msg.bookingDetails.time}</span>
                             </div>
                          </div>
                       </div>
                    )}

                    {/* Compact Appointment List */}
                    {msg.appointmentList && msg.appointmentList.length > 0 && (
                       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden w-full mt-2">
                          <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-100 font-semibold text-slate-700 text-xs">
                             Your Appointments
                          </div>
                          <div className="divide-y divide-slate-100">
                             {msg.appointmentList.map((appt) => (
                                <div key={appt.id} className="p-2 flex gap-2 hover:bg-slate-50">
                                   <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                                     <img src={appt.expertImage} alt="Expert" className="w-full h-full object-cover" />
                                   </div>
                                   <div className="min-w-0">
                                      <div className="font-bold text-slate-800 text-xs truncate">{appt.expertName}</div>
                                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                                         <span className="flex items-center gap-0.5"><Calendar size={10} /> {appt.date}</span>
                                         <span className="flex items-center gap-0.5"><Clock size={10} /> {appt.time}</span>
                                      </div>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}

                    {/* Compact Cancellation Card */}
                    {msg.cancellationDetails && (
                       <div className="bg-white rounded-xl p-3 border border-red-100 shadow-md w-full mt-2">
                          <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs mb-1">
                             <XCircle size={12} /> Cancelled
                          </div>
                          <p className="text-xs text-slate-600">
                             Appointment with <span className="font-bold">{msg.cancellationDetails.expertName}</span> cancelled.
                          </p>
                       </div>
                    )}

                    {/* Timestamp */}
                    <motion.span 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 0.7 }} 
                      className={`text-[10px] text-slate-400 mt-1 px-1 font-medium ${msg.role === 'user' ? 'text-right rtl:text-left' : 'text-left rtl:text-right'}`}
                    >
                      {formatTime(msg.timestamp)}
                    </motion.span>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                   <div className="w-8 h-8 rounded-full overflow-hidden border border-zeina-200 flex-shrink-0 bg-white shadow-sm">
                      <img src={ZEINA_AVATAR} alt="Zeina" className="w-full h-full object-cover" />
                   </div>
                   <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none shadow-sm flex gap-1.5 h-10 items-center">
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                      className="w-1.5 h-1.5 bg-zeina-400 rounded-full"
                    />
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                      className="w-1.5 h-1.5 bg-zeina-400 rounded-full"
                    />
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                      className="w-1.5 h-1.5 bg-zeina-400 rounded-full"
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={language === 'ar' ? "اسألي عن الصحة، البشرة..." : "Ask about health, skin..."}
                  className="flex-grow bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zeina-200 rtl:text-right"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !inputText.trim()}
                  className="bg-zeina-600 text-white p-2 rounded-full hover:bg-zeina-700 transition disabled:opacity-50 rtl:rotate-180"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 ltr:right-6 rtl:left-6 bg-zeina-600 text-white p-4 rounded-full shadow-lg shadow-zeina-600/30 z-50 hover:bg-zeina-700 transition-colors flex items-center justify-center"
      >
         {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>
    </>
  );
};

export default ChatWidget;

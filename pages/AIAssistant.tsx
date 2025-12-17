
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, RefreshCcw, Calendar, Clock, CheckCircle, XCircle, MapPin, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZeinaChat } from '../services/geminiService';
import { Message } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ZEINA_AVATAR } from '../constants';
import { useAuth } from '../context/AuthContext';

const SUGGESTIONS = [
  "Book a consultation",
  "View my appointments",
  "Workouts for luteal phase",
  "Healthy Saudi meal plan",
  "Mental wellness tips",
  "Visualize a healthy meal",
  "Postpartum exercises",
  "Anxiety relief tips",
  "Hydration guide"
];

const SUGGESTIONS_AR = [
  "حجز استشارة",
  "عرض مواعيدي",
  "تمارين المرحلة الأصفرية",
  "خطة وجبات صحية سعودية",
  "نصائح للصحة النفسية",
  "تصور وجبة صحية",
  "تمارين ما بعد الولادة",
  "تخفيف القلق والتوتر",
  "دليل شرب الماء"
];

const AIAssistant: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: language === 'ar' 
        ? "أهلاً بك! أنا زينة. يمكنني مساعدتك في حجز المواعيد، إدارة جدولك، والإجابة على أسئلتك الصحية. كيف يمكنني خدمتك اليوم؟" 
        : "Ahlan! I'm Zeina. I can help you book appointments, manage your schedule, and answer your health questions. How can I assist you?", 
      timestamp: new Date() 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [chatSession] = useState(() => new ZeinaChat(language));

  useEffect(() => {
     chatSession.setLanguage(language);
     chatSession.setUserProfile(user);
  }, [language, user, chatSession]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string = inputText) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: 'user', text: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await chatSession.sendMessage(text);
      
      const botMsg: Message = { 
        role: 'model', 
        text: response.text, 
        timestamp: new Date(),
        bookingDetails: response.bookingDetails,
        appointmentList: response.appointmentList,
        cancellationDetails: response.cancellationDetails,
        generatedImage: response.generatedImage
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
       const errorMsg: Message = { role: 'model', text: t('error'), timestamp: new Date() };
       setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const currentSuggestions = language === 'ar' ? SUGGESTIONS_AR : SUGGESTIONS;

  return (
    <div className="pt-20 min-h-screen bg-warm-50 flex flex-col">
      <div className="bg-white border-b border-slate-100 py-6 px-6 shadow-sm sticky top-0 z-10">
         <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="bg-zeina-100 p-2 rounded-xl">
                  <Sparkles className="text-zeina-600" size={24} />
               </div>
               <div>
                  <h1 className="text-xl font-serif font-bold text-slate-900">{language === 'ar' ? 'اسأل زينة' : 'Ask Zeina'}</h1>
                  <p className="text-xs text-slate-500">{language === 'ar' ? 'رفيقتك الصحية الذكية • خصوصية تامة' : 'Your AI Health Companion • Always Private'}</p>
               </div>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="text-slate-400 hover:text-zeina-600 transition-colors"
              title="Reset Chat"
            >
               <RefreshCcw size={20} />
            </button>
         </div>
      </div>

      <div className="flex-grow max-w-5xl mx-auto w-full p-4 md:p-6 flex flex-col gap-6">
        {/* Chat Area */}
        <div className="flex-grow flex flex-col gap-6 pb-4">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                 {/* Avatar */}
                 <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm overflow-hidden border ${
                    msg.role === 'user' ? 'bg-slate-900 text-white border-slate-900' : 'bg-zeina-100 border-zeina-200'
                 }`}>
                    {msg.role === 'user' ? (
                       <User size={18} />
                    ) : (
                       <img src={ZEINA_AVATAR} alt="Zeina" className="w-full h-full object-cover" />
                    )}
                 </div>
                 
                 <div className={`flex flex-col gap-1 max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {/* Text Bubble */}
                    {msg.text && (
                       <div className={`p-5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                          msg.role === 'user' 
                            ? 'bg-white text-slate-800 rounded-tr-none rtl:rounded-tr-2xl rtl:rounded-tl-none border border-slate-100' 
                            : 'bg-white text-slate-700 rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none border border-zeina-100 shadow-zeina-100'
                       }`}>
                          {msg.text}
                       </div>
                    )}

                    {/* Generated Image */}
                    {msg.generatedImage && (
                       <div className="bg-white rounded-2xl p-2 border border-zeina-200 shadow-md mt-2 w-full max-w-sm overflow-hidden">
                          <div className="flex items-center gap-2 text-zeina-600 font-bold text-xs px-2 py-1.5">
                             <ImageIcon size={14} /> AI Generated Visualization
                          </div>
                          <img 
                             src={`data:image/png;base64,${msg.generatedImage}`} 
                             alt="AI Generated" 
                             className="w-full h-auto rounded-xl"
                          />
                       </div>
                    )}

                    {/* Rich UI Cards (Booking, etc) */}
                    {msg.bookingDetails && (
                       <div className="bg-white rounded-2xl p-5 border border-zeina-200 shadow-lg shadow-zeina-50 w-full max-w-sm mt-2">
                          <div className="flex items-center gap-2 text-green-600 font-bold mb-3 border-b border-slate-50 pb-2">
                             <CheckCircle size={18} /> {msg.text.includes('Reschedule') ? (language === 'ar' ? 'تم تغيير الموعد' : 'Rescheduled') : (language === 'ar' ? 'تم تأكيد الحجز' : 'Confirmed')}
                          </div>
                          <div className="flex items-center gap-3 mb-4">
                             <img src={msg.bookingDetails.expertImage} alt="Expert" className="w-12 h-12 rounded-full object-cover" />
                             <div>
                                <div className="font-bold text-slate-900">{msg.bookingDetails.expertName}</div>
                                <div className="text-xs text-slate-500">{language === 'ar' ? 'استشارة فيديو' : 'Video Consultation'}</div>
                             </div>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3 space-y-2 text-sm">
                             <div className="flex items-center gap-2 text-slate-700">
                                <Calendar size={16} className="text-zeina-500" /> 
                                <span className="font-semibold">{msg.bookingDetails.date}</span>
                             </div>
                             <div className="flex items-center gap-2 text-slate-700">
                                <Clock size={16} className="text-zeina-500" /> 
                                <span className="font-semibold">{msg.bookingDetails.time}</span>
                             </div>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-3 text-center">Reference: {msg.bookingDetails.id}</div>
                       </div>
                    )}

                    {msg.appointmentList && msg.appointmentList.length > 0 && (
                       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full max-w-md mt-2">
                          <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 font-semibold text-slate-700 text-sm">
                             {language === 'ar' ? 'مواعيدك القادمة' : 'Your Appointments'}
                          </div>
                          <div className="divide-y divide-slate-100">
                             {msg.appointmentList.map((appt) => (
                                <div key={appt.id} className="p-4 flex gap-3 hover:bg-slate-50 transition-colors">
                                   <img src={appt.expertImage} alt="Expert" className="w-10 h-10 rounded-full object-cover" />
                                   <div className="flex-grow">
                                      <div className="font-bold text-slate-800 text-sm">{appt.expertName}</div>
                                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                         <span className="flex items-center gap-1"><Calendar size={12} /> {appt.date}</span>
                                         <span className="flex items-center gap-1"><Clock size={12} /> {appt.time}</span>
                                      </div>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}

                    {msg.cancellationDetails && (
                       <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-lg shadow-red-50 w-full max-w-sm mt-2">
                          <div className="flex items-center gap-2 text-red-600 font-bold mb-3 border-b border-red-50 pb-2">
                             <XCircle size={18} /> {language === 'ar' ? 'تم إلغاء الموعد' : 'Appointment Cancelled'}
                          </div>
                          <p className="text-sm text-slate-600 mb-2">
                             {language === 'ar' ? 'تم إلغاء موعدك مع' : 'Your appointment with'} <span className="font-bold">{msg.cancellationDetails.expertName}</span> {language === 'ar' ? 'بنجاح.' : 'has been cancelled.'}
                          </p>
                          <div className="text-xs text-slate-400">ID: {msg.cancellationDetails.id}</div>
                       </div>
                    )}

                    {/* Timestamp */}
                    <div className={`text-[10px] text-slate-400 px-1 mt-1 opacity-70 font-medium ${msg.role === 'user' ? 'text-right rtl:text-left' : 'text-left rtl:text-right'}`}>
                      {formatTime(msg.timestamp)}
                    </div>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Typing Indicator */}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
               <div className="w-10 h-10 rounded-full bg-zeina-100 border border-zeina-200 flex-shrink-0 flex items-center justify-center shadow-sm overflow-hidden">
                  <img src={ZEINA_AVATAR} alt="Zeina" className="w-full h-full object-cover" />
               </div>
               <div className="bg-white p-4 rounded-2xl rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none border border-zeina-100 shadow-sm flex gap-1.5 items-center h-12">
                  <motion.div 
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                    className="w-2 h-2 bg-zeina-400 rounded-full"
                  />
                  <motion.div 
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                    className="w-2 h-2 bg-zeina-400 rounded-full"
                  />
                  <motion.div 
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    className="w-2 h-2 bg-zeina-400 rounded-full"
                  />
               </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4 md:p-6 shadow-lg">
         <div className="max-w-3xl mx-auto space-y-4">
            {/* Suggestions */}
            {messages.length < 3 && (
               <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {currentSuggestions.map((s, i) => (
                     <button
                        key={i}
                        onClick={() => handleSend(s)}
                        className="flex-shrink-0 bg-warm-50 border border-slate-200 text-slate-600 px-4 py-2 rounded-full text-xs hover:bg-zeina-50 hover:border-zeina-200 hover:text-zeina-700 transition-colors whitespace-nowrap"
                     >
                        {s}
                     </button>
                  ))}
               </div>
            )}

            <div className="relative flex items-center gap-2">
               <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={language === 'ar' ? "اكتب رسالتك..." : "Type a message..."}
                  className="w-full bg-slate-50 border border-slate-200 rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-zeina-200 shadow-inner rtl:pr-6 rtl:pl-14 ltr:pl-6 ltr:pr-14"
               />
               <button 
                  onClick={() => handleSend()}
                  disabled={isLoading || !inputText.trim()}
                  className="absolute ltr:right-2 rtl:left-2 bg-zeina-600 text-white p-2.5 rounded-full hover:bg-zeina-700 transition-all disabled:opacity-50 disabled:scale-95 shadow-lg shadow-zeina-200 rtl:rotate-180"
               >
                  <Send size={20} />
               </button>
            </div>
            <p className="text-center text-[10px] text-slate-400">
               {language === 'ar' ? 'زينة هي مساعد ذكي ولا تغني عن الاستشارة الطبية المتخصصة.' : 'Zeina is an AI companion and does not replace professional medical advice.'}
            </p>
         </div>
      </div>
    </div>
  );
};

export default AIAssistant;

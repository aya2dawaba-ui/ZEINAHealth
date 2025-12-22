import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getServices } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { X, MessageCircle, Send, Stethoscope, Star, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RatingModal from '../components/RatingModal';
import { StorageService } from '../services/storage';

const sectionFadeIn = {
  hidden: { opacity: 0, y: 100 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } 
  }
};

const Services: React.FC = () => {
  const { t, language, dir } = useLanguage();
  const services = getServices(language);
  const navigate = useNavigate();
  
  // Rating State
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<{id: string, title: string} | null>(null);
  
  // Force update trigger to refresh ratings after submission
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Guidance Form State
  const [isGuidanceOpen, setIsGuidanceOpen] = useState(false);
  const [formType, setFormType] = useState<'guidance' | 'expert'>('guidance');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    concern: 'Skin',
    notes: ''
  });

  const handleGuidanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let text = '';
    
    if (formType === 'guidance') {
      text = language === 'ar' 
        ? `مرحباً زينة، أرغب في طلب توجيه شخصي.\n\nالاسم: ${formData.name}\nالعمر: ${formData.age}\nالاهتمام: ${t(('opt' + formData.concern) as any)}\nملاحظات: ${formData.notes}`
        : `Hello Zeina, I would like to request personalized guidance.\n\nName: ${formData.name}\nAge: ${formData.age}\nConcern: ${t(('opt' + formData.concern) as any)}\nNotes: ${formData.notes}`;
    } else {
      text = language === 'ar'
        ? `مرحباً زينة، أرغب في حجز استشارة طبية متخصصة.\n\nالاسم: ${formData.name}\nالعمر: ${formData.age}\nالتخصص المطلوب: ${t(('opt' + formData.concern) as any)}\nملاحظات: ${formData.notes}`
        : `Hello Zeina, I would like to request an expert consultation.\n\nName: ${formData.name}\nAge: ${formData.age}\nRequested Specialty: ${t(('opt' + formData.concern) as any)}\nNotes: ${formData.notes}`;
    }
    
    const encodedText = encodeURIComponent(text);
    const whatsappNumber = "966549446825"; // Saudi Number
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');
    setIsGuidanceOpen(false);
    setFormData({ name: '', age: '', concern: 'Skin', notes: '' });
  };

  const handleServiceClick = (index: number) => {
    if (index === 0) {
       setFormType('guidance');
       setIsGuidanceOpen(true);
    } else if (index === 1) {
       setFormType('expert');
       setIsGuidanceOpen(true);
    } else if (index === 2) {
       navigate('/blog');
    }
  };

  const openRating = (service: any) => {
     setSelectedService({ id: service.id || 'unknown', title: service.title });
     setRatingModalOpen(true);
  };

  return (
    <div className="pt-20 pb-40">
      <section className="text-center px-6 mb-32">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl font-serif font-bold text-slate-900 mb-8 tracking-tighter"
        >
          {t('ourServices')}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed"
        >
          {t('servicesPageDesc')}
        </motion.p>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-60">
        {services.map((service, idx) => {
          // Calculate dynamic rating
          const { rating, count } = StorageService.getAverageRating(service.id || '', service.rating || 5, service.reviewCount || 0);

          // Custom images for services: High quality conceptual
          const serviceImages = [
             'https://images.unsplash.com/photo-1516549655169-df83a0929519?auto=format&fit=crop&q=80&w=1000', // Wellness Guidance
             'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000', // Medical consultation
             'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=1000', // Education/Reading
          ];

          return (
            <motion.div 
              key={idx} 
              variants={sectionFadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className={`grid md:grid-cols-2 gap-24 items-center ${idx % 2 !== 0 ? 'md:grid-flow-col-dense' : ''}`}
            >
              <div className={idx % 2 !== 0 ? 'md:col-start-2' : ''}>
                 <div className="flex items-start justify-between mb-10">
                    <div className="w-20 h-20 bg-zeina-50 rounded-[2rem] flex items-center justify-center text-zeina-600 shadow-xl shadow-zeina-100/50">
                      <service.icon size={40} />
                    </div>
                    <div className="flex flex-col items-end">
                       <div className="flex items-center gap-2 text-yellow-500 font-bold text-2xl">
                          <Star size={24} fill="currentColor" /> {rating}
                       </div>
                       <button onClick={() => openRating(service)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 underline hover:text-zeina-600 mt-2">
                          {t('rate')} ({count})
                       </button>
                    </div>
                 </div>
                 
                 <h2 className="text-5xl md:text-6xl font-serif font-bold mb-10 text-slate-900 tracking-tight leading-tight">{service.title}</h2>
                 <p className="text-2xl text-slate-500 leading-relaxed mb-12 font-light">{service.description}</p>
                 <ul className="space-y-6 mb-16">
                   <li className="flex items-center gap-5 text-xl text-slate-700 font-light"><CheckCircle className="text-zeina-500" size={24}/> {t('certifiedExpertise')}</li>
                   <li className="flex items-center gap-5 text-xl text-slate-700 font-light"><CheckCircle className="text-zeina-500" size={24}/> {t('access247')}</li>
                   <li className="flex items-center gap-5 text-xl text-slate-700 font-light"><CheckCircle className="text-zeina-500" size={24}/> {t('privacyGuaranteed')}</li>
                 </ul>
                 <button 
                   onClick={() => handleServiceClick(idx)}
                   className="group relative bg-slate-900 text-white px-12 py-6 rounded-full font-black uppercase tracking-widest text-sm hover:bg-zeina-600 transition-all duration-700 overflow-hidden shadow-2xl"
                 >
                   <span className="relative z-10">{t('getStarted')}</span>
                 </button>
              </div>
              
              <motion.div 
                whileHover={{ scale: 1.02, rotate: idx % 2 === 0 ? 1 : -1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className={`relative rounded-[4rem] overflow-hidden h-[650px] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.15)] bg-slate-100 ${idx % 2 !== 0 ? 'md:col-start-1' : ''}`}
              >
                <img 
                  src={serviceImages[idx % serviceImages.length]} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s]" 
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* GUIDANCE / EXPERT FORM MODAL */}
      <AnimatePresence>
        {isGuidanceOpen && (
          <>
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               onClick={() => setIsGuidanceOpen(false)}
               className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[60]"
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 50 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 50 }}
               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className="fixed inset-0 m-auto max-w-xl h-fit bg-white rounded-[3rem] p-12 z-[70] shadow-2xl overflow-hidden border border-white/20"
             >
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-zeina-400 to-zeina-600" />
                
                <div className="flex justify-between items-start mb-10">
                   <div>
                      <h2 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-4">
                         {formType === 'guidance' ? <MessageCircle className="text-zeina-600" size={32} /> : <Stethoscope className="text-zeina-600" size={32} />}
                         {formType === 'guidance' ? t('guidanceFormTitle') : t('expertFormTitle')}
                      </h2>
                      <p className="text-lg text-slate-500 mt-4 leading-relaxed">
                        {formType === 'guidance' ? t('guidanceFormDesc') : t('expertFormDesc')}
                      </p>
                   </div>
                   <button onClick={() => setIsGuidanceOpen(false)} className="p-3 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                      <X size={28} />
                   </button>
                </div>

                <form onSubmit={handleGuidanceSubmit} className="space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div>
                         <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{t('lblName')}</label>
                         <input 
                           type="text" 
                           required
                           value={formData.name}
                           onChange={e => setFormData({...formData, name: e.target.value})}
                           className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-zeina-200 focus:bg-white transition-all"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{t('lblAge')}</label>
                         <input 
                           type="number" 
                           required
                           value={formData.age}
                           onChange={e => setFormData({...formData, age: e.target.value})}
                           className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-zeina-200 focus:bg-white transition-all"
                         />
                      </div>
                   </div>

                   <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{t('lblConcern')}</label>
                      <select 
                         value={formData.concern}
                         onChange={e => setFormData({...formData, concern: e.target.value})}
                         className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-zeina-200 focus:bg-white transition-all appearance-none"
                      >
                         <option value="Skin">{t('optSkin')}</option>
                         <option value="Hair">{t('optHair')}</option>
                         <option value="Nutrition">{t('optNutrition')}</option>
                         <option value="Hormonal">{t('optHormonal')}</option>
                         <option value="General">{t('optGeneral')}</option>
                      </select>
                   </div>

                   <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{t('lblNotes')}</label>
                      <textarea 
                         rows={4}
                         value={formData.notes}
                         onChange={e => setFormData({...formData, notes: e.target.value})}
                         className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-zeina-200 focus:bg-white transition-all resize-none"
                      />
                   </div>

                   <button 
                     type="submit" 
                     className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#128C7E] transition-all flex items-center justify-center gap-3 mt-4 shadow-xl shadow-green-200"
                   >
                      <Send size={20} /> {t('sendWhatsApp')}
                   </button>
                </form>
             </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Rating Modal */}
      {selectedService && (
         <RatingModal 
            isOpen={ratingModalOpen}
            onClose={() => setRatingModalOpen(false)}
            itemId={selectedService.id}
            itemName={selectedService.title}
            onSuccess={() => setUpdateTrigger(prev => prev + 1)}
         />
      )}
    </div>
  );
};

export default Services;
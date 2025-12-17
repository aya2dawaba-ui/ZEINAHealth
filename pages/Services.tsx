
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getServices } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { X, MessageCircle, Send, Stethoscope, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RatingModal from '../components/RatingModal';
import { StorageService } from '../services/storage';

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
    <div className="pt-10 pb-20">
      <section className="text-center px-6 mb-20">
        <h1 className="text-5xl font-serif font-bold text-slate-900 mb-6">{t('ourServices')}</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">{t('servicesPageDesc')}</p>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-32">
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
            <div key={idx} className={`grid md:grid-cols-2 gap-16 items-center ${idx % 2 !== 0 ? 'md:grid-flow-col-dense' : ''}`}>
              <motion.div 
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={idx % 2 !== 0 ? 'md:col-start-2' : ''}
              >
                 <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-zeina-100 rounded-2xl flex items-center justify-center text-zeina-700">
                      <service.icon size={32} />
                    </div>
                    <div className="flex flex-col items-end">
                       <div className="flex items-center gap-1 text-yellow-500 font-bold text-lg">
                          <Star size={20} fill="currentColor" /> {rating}
                       </div>
                       <button onClick={() => openRating(service)} className="text-xs text-slate-400 underline hover:text-zeina-600">
                          {t('rate')} ({count})
                       </button>
                    </div>
                 </div>
                 
                 <h2 className="text-4xl font-serif font-bold mb-6">{service.title}</h2>
                 <p className="text-lg text-slate-600 leading-relaxed mb-8">{service.description}</p>
                 <ul className="space-y-4 mb-8">
                   <li className="flex items-center gap-3 text-slate-700"><span className="w-2 h-2 rounded-full bg-zeina-500"/> {t('certifiedExpertise')}</li>
                   <li className="flex items-center gap-3 text-slate-700"><span className="w-2 h-2 rounded-full bg-zeina-500"/> {t('access247')}</li>
                   <li className="flex items-center gap-3 text-slate-700"><span className="w-2 h-2 rounded-full bg-zeina-500"/> {t('privacyGuaranteed')}</li>
                 </ul>
                 <button 
                   onClick={() => handleServiceClick(idx)}
                   className="bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-zeina-600 transition-colors"
                 >
                   {t('getStarted')}
                 </button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`relative rounded-[3rem] overflow-hidden h-[500px] shadow-2xl shadow-purple-100 ${idx % 2 !== 0 ? 'md:col-start-1' : ''}`}
              >
                <img 
                  src={serviceImages[idx % serviceImages.length]} 
                  alt={service.title} 
                  className="w-full h-full object-cover" 
                />
              </motion.div>
            </div>
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
               className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 50 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 50 }}
               className="fixed inset-0 m-auto max-w-lg h-fit bg-white rounded-3xl p-8 z-50 shadow-2xl overflow-hidden"
             >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-zeina-400 to-zeina-600" />
                
                <div className="flex justify-between items-start mb-6">
                   <div>
                      <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
                         {formType === 'guidance' ? <MessageCircle className="text-zeina-600" /> : <Stethoscope className="text-zeina-600" />}
                         {formType === 'guidance' ? t('guidanceFormTitle') : t('expertFormTitle')}
                      </h2>
                      <p className="text-sm text-slate-500 mt-2">
                        {formType === 'guidance' ? t('guidanceFormDesc') : t('expertFormDesc')}
                      </p>
                   </div>
                   <button onClick={() => setIsGuidanceOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600">
                      <X size={20} />
                   </button>
                </div>

                <form onSubmit={handleGuidanceSubmit} className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">{t('lblName')}</label>
                         <input 
                           type="text" 
                           required
                           value={formData.name}
                           onChange={e => setFormData({...formData, name: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-zeina-200"
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">{t('lblAge')}</label>
                         <input 
                           type="number" 
                           required
                           value={formData.age}
                           onChange={e => setFormData({...formData, age: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-zeina-200"
                         />
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t('lblConcern')}</label>
                      <select 
                         value={formData.concern}
                         onChange={e => setFormData({...formData, concern: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-zeina-200"
                      >
                         <option value="Skin">{t('optSkin')}</option>
                         <option value="Hair">{t('optHair')}</option>
                         <option value="Nutrition">{t('optNutrition')}</option>
                         <option value="Hormonal">{t('optHormonal')}</option>
                         <option value="General">{t('optGeneral')}</option>
                      </select>
                   </div>

                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t('lblNotes')}</label>
                      <textarea 
                         rows={3}
                         value={formData.notes}
                         onChange={e => setFormData({...formData, notes: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-zeina-200 resize-none"
                      />
                   </div>

                   <button 
                     type="submit" 
                     className="w-full bg-[#25D366] text-white py-3.5 rounded-xl font-bold hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg shadow-green-100"
                   >
                      <Send size={18} /> {t('sendWhatsApp')}
                   </button>
                   
                   <p className="text-center text-[10px] text-slate-400">
                      {language === 'ar' ? 'سيتم توجيهك إلى تطبيق واتساب.' : 'You will be redirected to WhatsApp to send the message.'}
                   </p>
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

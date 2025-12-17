
import React, { useState } from 'react';
import { getExperts } from '../constants';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import RatingModal from '../components/RatingModal';
import { StorageService } from '../services/storage';

const Experts: React.FC = () => {
  const { t, language } = useLanguage();
  const experts = getExperts(language);
  const [filter, setFilter] = useState<string>('All');
  
  // Rating State
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<{id: string, name: string} | null>(null);
  
  // Update trigger for re-render
  const [updateTrigger, setUpdateTrigger] = useState(0);
  
  const filteredExperts = filter === 'All' ? experts : experts.filter(e => e.category === filter);

  const openRating = (expert: any) => {
     setSelectedExpert({ id: expert.id, name: expert.name });
     setRatingModalOpen(true);
  };

  return (
    <div className="py-20 max-w-7xl mx-auto px-6">
       <div className="text-center mb-16">
         <h1 className="text-5xl font-serif font-bold text-slate-900 mb-6">{t('ourSpecialists')}</h1>
         <p className="text-xl text-slate-600">{t('expertsSub')}</p>
       </div>

       {/* Filters */}
       <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {['All', 'Skin', 'Hair', 'Nutrition', 'Dental', 'Gynecology'].map(cat => (
             <button
               key={cat}
               onClick={() => setFilter(cat)}
               className={`px-6 py-2 rounded-full border transition-all ${
                 filter === cat 
                   ? 'bg-slate-900 text-white border-slate-900' 
                   : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
               }`}
             >
               {cat === 'All' ? t('filterAll') : cat}
             </button>
          ))}
       </div>

       {/* Grid */}
       <div className="grid md:grid-cols-4 gap-8">
          {filteredExperts.map((expert, i) => {
             // Calculate dynamic rating
             const { rating } = StorageService.getAverageRating(expert.id, expert.rating, 25); // Assume 25 base reviews

             return (
               <motion.div
                 key={expert.id}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.3, delay: i * 0.1 }}
                 className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all group flex flex-col"
               >
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-100">
                     <img src={expert.image} alt={expert.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                        <Star size={12} className="text-yellow-400 fill-current" /> {rating}
                     </div>
                  </div>
                  <div className="p-2 flex flex-col flex-grow">
                     <div className="flex justify-between items-center mb-1">
                       <span className="text-xs font-bold text-zeina-600 uppercase">{expert.category}</span>
                       <button onClick={(e) => { e.preventDefault(); openRating(expert); }} className="text-xs text-slate-400 underline hover:text-zeina-600">
                          {t('rate')}
                       </button>
                     </div>
                     <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{expert.name}</h3>
                     <p className="text-slate-500 text-sm mb-4">{expert.title}</p>
                     
                     <div className="mt-auto flex items-center justify-between gap-4 pt-2">
                       <span className="font-serif font-bold text-lg">{expert.price} SAR</span>
                       <NavLink 
                         to={`/book/${expert.id}`}
                         className="flex-grow bg-slate-50 text-slate-900 py-2 rounded-lg text-sm font-semibold hover:bg-slate-900 hover:text-white transition-colors text-center"
                       >
                         {t('bookNow')}
                       </NavLink>
                     </div>
                  </div>
               </motion.div>
             );
          })}
       </div>

       {/* Rating Modal */}
       {selectedExpert && (
          <RatingModal 
             isOpen={ratingModalOpen}
             onClose={() => setRatingModalOpen(false)}
             itemId={selectedExpert.id}
             itemName={selectedExpert.name}
             onSuccess={() => setUpdateTrigger(prev => prev + 1)}
          />
       )}
    </div>
  );
};

export default Experts;

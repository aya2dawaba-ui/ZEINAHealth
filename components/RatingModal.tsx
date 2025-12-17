
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { StorageService } from '../services/storage';
import { useAuth } from '../context/AuthContext';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemName: string;
  onSuccess?: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, itemId, itemName, onSuccess }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setLoading(true);
    await StorageService.addReview({
      itemId,
      userId: user?.id || 'guest',
      userName: user?.name || 'Guest',
      userAvatar: user?.avatar,
      rating,
      comment
    });
    setLoading(false);
    if (onSuccess) onSuccess();
    onClose();
    setRating(0);
    setComment('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 m-auto max-w-sm h-fit bg-white rounded-[2rem] p-8 z-50 shadow-2xl">
             <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-50 rounded-full text-slate-400"><X size={20} /></button>
             <h3 className="text-xl font-serif font-bold text-center mb-2">{t('rate')} {itemName}</h3>
             <p className="text-center text-slate-500 text-sm mb-6">{t('ratingTitle')}</p>
             
             <form onSubmit={handleSubmit}>
                <div className="flex justify-center gap-2 mb-6">
                   {[1,2,3,4,5].map(star => (
                      <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                         <Star size={32} className={`${star <= rating ? 'text-yellow-400 fill-current' : 'text-slate-200'} transition-colors`} />
                      </button>
                   ))}
                </div>
                
                <textarea 
                   value={comment}
                   onChange={e => setComment(e.target.value)}
                   placeholder={t('writeReview')}
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-zeina-200 mb-4 resize-none"
                   rows={3}
                />
                
                <button 
                  type="submit" 
                  disabled={loading || rating === 0}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-zeina-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                   {loading ? '...' : t('submitReview')} <Send size={16} />
                </button>
             </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RatingModal;

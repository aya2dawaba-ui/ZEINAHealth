import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { EXPERTS } from '../constants';
import { Expert } from '../types';
import { ChevronLeft, Calendar as CalendarIcon, Clock, CreditCard, CheckCircle, Shield, Lock, MapPin, Video, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';

const steps = [
  { number: 1, title: 'Time' },
  { number: 2, title: 'Details' },
  { number: 3, title: 'Payment' },
];

const Booking: React.FC = () => {
  const { expertId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expert, setExpert] = useState<Expert | undefined>(undefined);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    zip: ''
  });

  useEffect(() => {
    const found = EXPERTS.find(e => e.id === expertId);
    if (!found) {
      navigate('/experts'); // Redirect if invalid ID
    }
    setExpert(found);
    window.scrollTo(0, 0);

    // Pre-fill form if user is logged in
    if (user) {
      setFormData(prev => ({
         ...prev,
         name: user.name,
         email: user.email
      }));
    }
  }, [expertId, navigate, user]);

  if (!expert) return null;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleBook = async () => {
    if (!user) {
       alert("Please log in to complete your booking.");
       navigate('/login');
       return;
    }

    setLoading(true);
    
    try {
      await StorageService.createAppointment({
         userId: user.id,
         expertId: expert.id,
         expertName: expert.name,
         expertImage: expert.image,
         date: selectedDate!,
         time: selectedTime!,
         notes: formData.notes
      });
      
      setLoading(false);
      nextStep(); // Go to step 4 (Success)
    } catch (error) {
      console.error(error);
      alert("Failed to book appointment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-50/50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-zeina-600 mb-8 font-medium transition-colors"
        >
          <ChevronLeft size={20} /> Back to Experts
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
             {/* Progress Bar */}
             <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 flex justify-between items-center relative overflow-hidden">
                <div className="absolute bottom-0 left-0 h-1 bg-zeina-100 w-full">
                   <motion.div 
                     className="h-full bg-zeina-600"
                     initial={{ width: '0%' }}
                     animate={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                   />
                </div>
                {steps.map((step) => (
                   <div key={step.number} className={`flex items-center gap-2 relative z-10 ${currentStep >= step.number ? 'text-zeina-700 font-bold' : 'text-slate-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 ${
                        currentStep >= step.number ? 'border-zeina-600 bg-zeina-50' : 'border-slate-200 bg-white'
                      }`}>
                         {currentStep > step.number ? <CheckCircle size={16} /> : step.number}
                      </div>
                      <span className="hidden sm:inline">{step.title}</span>
                   </div>
                ))}
             </div>

             <div className="bg-white rounded-[2rem] shadow-xl shadow-zeina-100/50 overflow-hidden min-h-[500px] relative">
               <AnimatePresence mode="wait">
                 {/* Step 1: Date & Time */}
                 {currentStep === 1 && (
                   <motion.div 
                     key="step1"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="p-8 md:p-10"
                   >
                     <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-2">
                       <CalendarIcon className="text-zeina-600" /> Select Date & Time
                     </h2>
                     
                     <div className="mb-8">
                        <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Available Dates</label>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                           {Array.from({ length: 14 }).map((_, i) => {
                             const d = new Date();
                             d.setDate(d.getDate() + i + 1);
                             const dateStr = d.toDateString();
                             const isSelected = selectedDate === dateStr;
                             return (
                               <button
                                 key={i}
                                 onClick={() => setSelectedDate(dateStr)}
                                 className={`flex-shrink-0 w-24 p-4 rounded-2xl border transition-all text-center ${
                                   isSelected 
                                     ? 'bg-zeina-600 text-white border-zeina-600 shadow-lg shadow-zeina-200' 
                                     : 'bg-white border-slate-100 text-slate-600 hover:border-zeina-300'
                                 }`}
                               >
                                 <div className="text-xs opacity-70 mb-1">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                 <div className="text-xl font-bold">{d.getDate()}</div>
                               </button>
                             );
                           })}
                        </div>
                     </div>

                     {selectedDate && (
                       <div className="mb-8">
                          <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Available Slots</label>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                             {['09:00 AM', '10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'].map((time) => (
                               <button
                                 key={time}
                                 onClick={() => setSelectedTime(time)}
                                 className={`py-3 px-2 rounded-xl text-sm font-medium border transition-all ${
                                   selectedTime === time 
                                     ? 'bg-zeina-100 text-zeina-800 border-zeina-200' 
                                     : 'bg-white border-slate-100 text-slate-600 hover:border-zeina-300'
                                 }`}
                               >
                                 {time}
                               </button>
                             ))}
                          </div>
                       </div>
                     )}

                     <div className="flex justify-end mt-8">
                       <button
                         onClick={nextStep}
                         disabled={!selectedDate || !selectedTime}
                         className="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zeina-700 transition-colors"
                       >
                         Continue
                       </button>
                     </div>
                   </motion.div>
                 )}

                 {/* Step 2: Details */}
                 {currentStep === 2 && (
                   <motion.div 
                     key="step2"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="p-8 md:p-10"
                   >
                     <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Your Information</h2>
                     {!user && (
                        <div className="bg-amber-50 text-amber-800 p-4 rounded-xl text-sm mb-6 flex items-center justify-between">
                           <span>Already have an account? Log in to save your booking history.</span>
                           <button onClick={() => navigate('/login')} className="font-bold underline">Log In</button>
                        </div>
                     )}

                     <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                           <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                              <input 
                                type="text" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zeina-200"
                                placeholder="Amira Ahmed"
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                              <input 
                                type="email" 
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zeina-200"
                                placeholder="amira@example.com"
                              />
                           </div>
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                           <input 
                              type="tel" 
                              value={formData.phone}
                              onChange={e => setFormData({...formData, phone: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zeina-200"
                              placeholder="+966 5X XXX XXXX"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-slate-700 mb-2">Reason for Visit (Optional)</label>
                           <textarea 
                              rows={3}
                              value={formData.notes}
                              onChange={e => setFormData({...formData, notes: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zeina-200"
                              placeholder="Briefly describe your symptoms or questions..."
                           />
                        </div>
                     </div>

                     <div className="flex justify-between mt-10">
                       <button onClick={prevStep} className="text-slate-500 hover:text-slate-800 font-medium px-4">Back</button>
                       <button
                         onClick={nextStep}
                         disabled={!formData.name || !formData.email}
                         className="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zeina-700 transition-colors"
                       >
                         Continue to Payment
                       </button>
                     </div>
                   </motion.div>
                 )}

                 {/* Step 3: Payment */}
                 {currentStep === 3 && (
                   <motion.div 
                     key="step3"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="p-8 md:p-10"
                   >
                     <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-2">
                       <Shield className="text-zeina-600" /> Secure Payment
                     </h2>
                     
                     <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-200">
                        <div className="flex justify-between mb-2 text-sm text-slate-600">
                           <span>Consultation Fee</span>
                           <span>{expert.price.toFixed(2)} SAR</span>
                        </div>
                        <div className="flex justify-between mb-4 text-sm text-slate-600">
                           <span>Service Fee</span>
                           <span>20.00 SAR</span>
                        </div>
                        <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-slate-900 text-lg">
                           <span>Total</span>
                           <span>{(expert.price + 20).toFixed(2)} SAR</span>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div>
                           <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
                           <div className="relative">
                              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                              <input 
                                type="text" 
                                value={paymentData.cardNumber}
                                onChange={e => setPaymentData({...paymentData, cardNumber: e.target.value})}
                                placeholder="0000 0000 0000 0000"
                                className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-zeina-200 font-mono"
                              />
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                              <input 
                                type="text" 
                                value={paymentData.expiry}
                                onChange={e => setPaymentData({...paymentData, expiry: e.target.value})}
                                placeholder="MM/YY"
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zeina-200 font-mono"
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">CVC</label>
                              <div className="relative">
                                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                 <input 
                                    type="text" 
                                    value={paymentData.cvc}
                                    onChange={e => setPaymentData({...paymentData, cvc: e.target.value})}
                                    placeholder="123"
                                    className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-zeina-200 font-mono"
                                 />
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="flex justify-between mt-10 items-center">
                       <button onClick={prevStep} className="text-slate-500 hover:text-slate-800 font-medium px-4">Back</button>
                       <button
                         onClick={handleBook}
                         disabled={loading || !paymentData.cardNumber}
                         className="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium disabled:opacity-50 min-w-[160px] flex justify-center items-center hover:bg-zeina-700 transition-colors"
                       >
                         {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : `Pay ${(expert.price + 20).toFixed(2)} SAR`}
                       </button>
                     </div>
                   </motion.div>
                 )}

                 {/* Step 4: Success */}
                 {currentStep === 4 && (
                   <motion.div 
                     key="step4"
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="p-12 text-center flex flex-col items-center justify-center h-full min-h-[500px]"
                   >
                     <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                        <CheckCircle size={48} />
                     </div>
                     <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Booking Confirmed!</h2>
                     <p className="text-slate-600 max-w-md mx-auto mb-8">
                       Your consultation with {expert.name} is scheduled for <strong>{selectedDate} at {selectedTime}</strong>.
                     </p>
                     
                     <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                        <button
                           onClick={() => navigate('/profile')}
                           className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                        >
                           View in Profile
                        </button>
                        <NavLink 
                           to="/"
                           className="flex-1 bg-zeina-600 text-white py-3 rounded-xl font-medium hover:bg-zeina-700 transition-colors flex items-center justify-center"
                        >
                           Back Home
                        </NavLink>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-slate-50 sticky top-24">
                <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-6">
                   <img src={expert.image} alt={expert.name} className="w-16 h-16 rounded-full object-cover" />
                   <div>
                      <h3 className="font-bold text-slate-900">{expert.name}</h3>
                      <p className="text-xs text-slate-500">{expert.title}</p>
                      <div className="flex items-center gap-1 text-xs font-bold text-yellow-500 mt-1">
                         <Star size={10} fill="currentColor" /> {expert.rating}
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-start gap-3 text-sm text-slate-600">
                      <CalendarIcon size={16} className="mt-0.5 text-zeina-500" />
                      <div>
                         <span className="block font-bold text-slate-900">Date</span>
                         {selectedDate || 'Select a date'}
                      </div>
                   </div>
                   <div className="flex items-start gap-3 text-sm text-slate-600">
                      <Clock size={16} className="mt-0.5 text-zeina-500" />
                      <div>
                         <span className="block font-bold text-slate-900">Time</span>
                         {selectedTime || 'Select a time'}
                      </div>
                   </div>
                   <div className="flex items-start gap-3 text-sm text-slate-600">
                      <Video size={16} className="mt-0.5 text-zeina-500" />
                      <div>
                         <span className="block font-bold text-slate-900">Format</span>
                         Video Consultation
                      </div>
                   </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                   <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
                      <Lock size={12} /> Secure Booking
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
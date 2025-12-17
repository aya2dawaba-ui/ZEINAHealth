import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { Mail, Lock, User, Stethoscope, CheckCircle, FileText, Calendar, Heart, Baby, ChevronRight, ChevronLeft, UserPlus } from 'lucide-react';
import { UserRole } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Register: React.FC = () => {
  const { t, language } = useLanguage();
  const [role, setRole] = useState<UserRole>('user');
  const [step, setStep] = useState(1);
  
  // Step 1: Account Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Step 2 (User): Personal Profile
  const [age, setAge] = useState('');
  const [maritalStatus, setMaritalStatus] = useState<'single' | 'married' | 'divorced' | 'widowed'>('single');
  const [lifeStage, setLifeStage] = useState<'general' | 'tryingToConceive' | 'pregnant' | 'postpartum' | 'menopause'>('general');
  const [childrenCount, setChildrenCount] = useState(0);

  // Step 3 (User): Period Tracking
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  
  // Expert Info
  const [specialization, setSpecialization] = useState('Skin');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [experience, setExperience] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
       // Validation for step 1
       if (!name || !email || !password) {
         setError(language === 'ar' ? "يرجى ملء جميع الحقول." : "Please fill in all account fields.");
         return;
       }
       if (password.length < 8) {
         setError(language === 'ar' ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل." : "Password must be at least 8 characters.");
         return;
       }
       setStep(2);
    } else if (step === 2 && role === 'user') {
       // Go to step 3 (User only)
       if (!age) {
          setError(language === 'ar' ? "يرجى إدخال العمر." : "Please enter your age.");
          return;
       }
       setStep(3);
    } else {
       // Submit final form (Expert from step 2 OR User from step 3)
       handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const userData: any = {
        name,
        email,
        role,
      };

      if (role === 'user') {
         // Personal Profile
         userData.age = parseInt(age);
         userData.maritalStatus = maritalStatus;
         userData.lifeStage = lifeStage;
         userData.childrenCount = childrenCount;
         
         // Cycle Data
         userData.cycleLength = cycleLength;
         userData.periodDuration = periodDuration;
         userData.lastPeriodDate = lastPeriodDate;
         userData.isTryingToConceive = lifeStage === 'tryingToConceive';
         userData.healthInterests = [];
      } else {
         // Expert Data
         userData.specialization = specialization;
         userData.isVerified = false;
         userData.licenseNumber = licenseNumber;
         userData.experience = experience;
      }
      
      const user = await StorageService.register(userData, password);
      login(user);
      navigate('/verify-email');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      setIsLoading(false);
    }
  };

  const totalSteps = role === 'user' ? 3 : 2;

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-warm-50 px-6">
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl w-full max-w-lg border border-slate-100 relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
           <motion.div 
             className="h-full bg-zeina-600"
             initial={{ width: '33%' }}
             animate={{ width: `${(step / totalSteps) * 100}%` }}
           />
        </div>

        <div className="text-center mb-8 pt-4">
          <h1 className="text-3xl font-serif font-bold text-slate-900">
             {step === 1 ? (language === 'ar' ? 'إنشاء حساب' : 'Create Account') : 
              step === 2 ? (role === 'user' ? (language === 'ar' ? 'ملفك الشخصي' : 'Your Profile') : (language === 'ar' ? 'بيانات مهنية' : 'Professional Details')) :
              (language === 'ar' ? 'تتبع دورتك' : 'Track Your Cycle')
             }
          </h1>
          <p className="text-slate-500 mt-2">
             {step === 1 ? (language === 'ar' ? 'انضمي لمجتمع زينة اليوم' : 'Join the Zeina community today') : 
              step === 2 ? (role === 'user' ? (language === 'ar' ? 'ساعدينا في فهم احتياجاتك' : 'Help us personalize your care') : (language === 'ar' ? 'أخبرينا عن خبراتك' : 'Tell us about your expertise')) :
              (language === 'ar' ? 'للحصول على نصائح دقيقة' : 'For accurate health predictions')
             }
          </p>
        </div>

        {error && (
           <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-6 text-center animate-pulse">
             {error}
           </div>
        )}

        <form onSubmit={handleNextStep} className="space-y-6">
          
          <AnimatePresence mode="wait">
             {/* STEP 1: BASIC AUTH */}
             {step === 1 && (
                <motion.div
                   key="step1"
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   className="space-y-5"
                >
                   {/* Role Toggle */}
                   <div className="flex bg-slate-50 p-1.5 rounded-xl mb-6">
                      <button 
                        type="button"
                        onClick={() => setRole('user')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all ${role === 'user' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <User size={18} /> {language === 'ar' ? 'مستخدمة' : 'Patient'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setRole('expert')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all ${role === 'expert' ? 'bg-white shadow-sm text-zeina-700' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <Stethoscope size={18} /> {language === 'ar' ? 'أخصائية' : 'Specialist'}
                      </button>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">{t('lblName')}</label>
                     <div className="relative">
                       <User className="absolute rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input 
                         type="text" 
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl rtl:pr-12 ltr:pl-12 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zeina-200"
                         placeholder={role === 'expert' ? "Dr. Amira Ahmed" : "Amira Ahmed"}
                       />
                     </div>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">{t('email')}</label>
                     <div className="relative">
                       <Mail className="absolute rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input 
                         type="email" 
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl rtl:pr-12 ltr:pl-12 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zeina-200"
                         placeholder="you@example.com"
                       />
                     </div>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">{t('password')}</label>
                     <div className="relative">
                       <Lock className="absolute rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input 
                         type="password" 
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl rtl:pr-12 ltr:pl-12 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zeina-200"
                         placeholder="Min 8 characters"
                       />
                     </div>
                   </div>
                </motion.div>
             )}

             {/* STEP 2 */}
             {step === 2 && (
                <motion.div
                   key="step2"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-6"
                >
                   {role === 'user' ? (
                      // USER PERSONAL PROFILE
                      <div className="space-y-5">
                          <div className="bg-zeina-50 p-4 rounded-2xl flex items-start gap-3">
                             <UserPlus className="text-zeina-600 flex-shrink-0 mt-1" size={20} />
                             <p className="text-sm text-slate-600 leading-relaxed">
                                {language === 'ar' ? 'هذه المعلومات تساعد زينة (الذكاء الاصطناعي) في تقديم نصائح مخصصة لحالتك الاجتماعية والصحية.' : 'This info allows Zeina (AI) to customize advice based on your life stage and needs.'}
                             </p>
                          </div>
                          
                          <div>
                             <label className="block text-sm font-medium text-slate-700 mb-2">{t('lblAge')}</label>
                             <input 
                               type="number"
                               value={age}
                               onChange={(e) => setAge(e.target.value)}
                               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zeina-200"
                               placeholder="e.g. 28"
                             />
                          </div>

                          <div>
                             <label className="block text-sm font-medium text-slate-700 mb-2">{t('lblMaritalStatus')}</label>
                             <select
                                value={maritalStatus}
                                onChange={(e) => setMaritalStatus(e.target.value as any)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zeina-200"
                             >
                                <option value="single">{t('optSingle')}</option>
                                <option value="married">{t('optMarried')}</option>
                                <option value="divorced">{t('optDivorced')}</option>
                                <option value="widowed">{t('optWidowed')}</option>
                             </select>
                          </div>

                          <div>
                             <label className="block text-sm font-medium text-slate-700 mb-2">{t('lblLifeStage')}</label>
                             <select
                                value={lifeStage}
                                onChange={(e) => setLifeStage(e.target.value as any)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zeina-200"
                             >
                                <option value="general">{t('optStageGeneral')}</option>
                                <option value="tryingToConceive">{t('optStageTTC')}</option>
                                <option value="pregnant">{t('optStagePregnant')}</option>
                                <option value="postpartum">{t('optStagePostpartum')}</option>
                                <option value="menopause">{t('optStageMenopause')}</option>
                             </select>
                          </div>

                          {(maritalStatus === 'married' || maritalStatus === 'divorced' || maritalStatus === 'widowed' || lifeStage === 'postpartum') && (
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">{t('lblChildren')}</label>
                                <input 
                                  type="number"
                                  value={childrenCount}
                                  onChange={(e) => setChildrenCount(Number(e.target.value))}
                                  min={0}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zeina-200"
                                />
                             </div>
                          )}
                      </div>
                   ) : (
                      // EXPERT PROFESSIONAL FORM (UNCHANGED)
                      <div className="space-y-4">
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Specialization</label>
                            <select 
                               value={specialization}
                               onChange={(e) => setSpecialization(e.target.value)}
                               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zeina-200"
                            >
                               <option value="Skin">Dermatology (Skin)</option>
                               <option value="Hair">Trichology (Hair)</option>
                               <option value="Nutrition">Nutrition</option>
                               <option value="Dental">Dental</option>
                               <option value="Gynecology">Gynecology</option>
                            </select>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">License No.</label>
                               <div className="relative">
                                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                  <input 
                                    type="text"
                                    value={licenseNumber}
                                    onChange={(e) => setLicenseNumber(e.target.value)}
                                    placeholder="MED-12345"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zeina-200"
                                  />
                               </div>
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Experience (Yrs)</label>
                               <input 
                                 type="number"
                                 value={experience}
                                 onChange={(e) => setExperience(e.target.value)}
                                 placeholder="e.g. 5"
                                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zeina-200"
                               />
                            </div>
                         </div>
                         <p className="text-xs text-slate-500 flex items-start gap-2 bg-blue-50 text-blue-700 p-3 rounded-lg">
                           <CheckCircle size={14} className="mt-0.5 flex-shrink-0" />
                           <span>Your profile will be marked as "Pending Verification" until our team reviews your credentials.</span>
                         </p>
                      </div>
                   )}
                </motion.div>
             )}

             {/* STEP 3 (USER ONLY): CYCLE TRACKING */}
             {step === 3 && role === 'user' && (
                <motion.div
                   key="step3"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-6"
                >
                   <div className="space-y-6">
                      <div className="bg-lavender-50 p-4 rounded-2xl flex items-start gap-3">
                         <Heart className="text-zeina-600 flex-shrink-0 mt-1" size={20} />
                         <p className="text-sm text-slate-600 leading-relaxed">
                            {language === 'ar' ? 'نستخدم هذه المعلومات للتنبؤ بدورتك القادمة وأيام التبويض. يمكنك تخطي هذا أو تحديثه لاحقاً.' : 'Zeina uses this info to predict your next cycle, ovulation, and provide personalized health tips. You can update this anytime.'}
                         </p>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">{language === 'ar' ? 'متى كان أول يوم في آخر دورة؟' : 'When was the first day of your last period?'}</label>
                        <div className="relative">
                           <Calendar className="absolute rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2 text-zeina-600" size={18} />
                           <input 
                             type="date"
                             value={lastPeriodDate}
                             onChange={(e) => setLastPeriodDate(e.target.value)}
                             className="w-full bg-white border border-slate-200 rounded-xl rtl:pr-12 ltr:pl-12 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zeina-200"
                           />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{language === 'ar' ? 'طول الدورة' : 'Cycle Length'}</label>
                            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between">
                               <input 
                                 type="number"
                                 min="21"
                                 max="40"
                                 value={cycleLength}
                                 onChange={(e) => setCycleLength(Number(e.target.value))}
                                 className="bg-transparent w-full focus:outline-none font-bold text-slate-900"
                               />
                               <span className="text-xs text-slate-400">{language === 'ar' ? 'أيام' : 'Days'}</span>
                            </div>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{language === 'ar' ? 'مدة الدورة' : 'Period Duration'}</label>
                            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between">
                               <input 
                                 type="number"
                                 min="1"
                                 max="10"
                                 value={periodDuration}
                                 onChange={(e) => setPeriodDuration(Number(e.target.value))}
                                 className="bg-transparent w-full focus:outline-none font-bold text-slate-900"
                               />
                               <span className="text-xs text-slate-400">{language === 'ar' ? 'أيام' : 'Days'}</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </motion.div>
             )}
          </AnimatePresence>

          <div className="flex gap-4 pt-2">
             {step > 1 && (
                <button 
                   type="button" 
                   onClick={() => setStep(step - 1)} 
                   className="flex-1 bg-slate-100 text-slate-600 py-3.5 rounded-xl font-bold hover:bg-slate-200 transition-colors flex justify-center items-center gap-2"
                >
                   {language === 'ar' ? <><ChevronRight size={18}/> رجوع</> : <><ChevronLeft size={18} /> Back</>}
                </button>
             )}
             <button 
               type="submit" 
               disabled={isLoading}
               className="flex-[2] bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-zeina-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-zeina-200"
             >
               {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               ) : (
                  (role === 'user' ? step === 3 : step === 2) 
                    ? (language === 'ar' ? 'إتمام التسجيل' : 'Complete Sign Up') 
                    : (language === 'ar' ? <>التالي <ChevronLeft size={18}/></> : <>Continue <ChevronRight size={18}/></>)
               )}
             </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          {t('noAccount')} <NavLink to="/login" className="text-zeina-600 font-bold hover:underline">{t('signIn')}</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Register;
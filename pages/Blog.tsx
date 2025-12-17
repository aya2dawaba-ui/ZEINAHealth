
import React, { useState } from 'react';
import { getArticles, getCourses, getBundles } from '../constants';
import { ArrowRight, Lock, BookOpen, Clock, Video, Layers, CheckCircle, Play, Pause, Maximize, X, Star, Send, Sparkles, ImageIcon, Loader, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Course, CourseSession } from '../types';
import { ZeinaChat } from '../services/geminiService';

const Blog: React.FC = () => {
  const { t, language, dir } = useLanguage();
  const articles = getArticles(language);
  const courses = getCourses(language);
  const bundles = getBundles(language);
  
  const [activeTab, setActiveTab] = useState<'articles' | 'courses' | 'bundles'>('articles');
  
  // Course Viewer State
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeSession, setActiveSession] = useState<CourseSession | null>(null);
  
  // Review State
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // AI Image Generation State
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [genPrompt, setGenPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOpenCourse = (course: Course) => {
    setSelectedCourse(course);
    if (course.sessions && course.sessions.length > 0) {
      setActiveSession(course.sessions[0]);
    }
  };

  const handleCloseCourse = () => {
    setSelectedCourse(null);
    setActiveSession(null);
    setIsReviewOpen(false);
    setReviewSubmitted(false);
    setReviewText('');
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, send to backend
    setReviewSubmitted(true);
    setTimeout(() => {
        setIsReviewOpen(false);
    }, 2000);
  };

  // AI Image Gen Logic
  const openGenModal = (articleTitle: string) => {
     setGenPrompt(articleTitle);
     setGeneratedImage(null);
     setIsGenModalOpen(true);
  };

  const handleGenerateImage = async () => {
     if (!genPrompt.trim()) return;
     setIsGenerating(true);
     setGeneratedImage(null);

     try {
        const chat = new ZeinaChat(language);
        // We structure the prompt to trigger the tool usage defined in system instructions
        const response = await chat.sendMessage(`generate_health_image prompt="${genPrompt}"`);
        
        if (response.generatedImage) {
           setGeneratedImage(response.generatedImage);
        } else {
           // Fallback if the tool wasn't triggered or failed strictly
           alert(language === 'ar' ? 'عذراً، لم نتمكن من إنشاء الصورة.' : 'Sorry, could not generate image. Please try a different prompt.');
        }
     } catch (error) {
        console.error(error);
     } finally {
        setIsGenerating(false);
     }
  };

  return (
    <div className="py-20 max-w-7xl mx-auto px-6">
       
       {/* Header */}
       <div className="text-center mb-16">
         <span className="text-zeina-600 font-bold uppercase tracking-wider text-sm">{t('eduHub')}</span>
         <h1 className="text-5xl font-serif font-bold text-slate-900 mt-4 mb-6">{t('eduDesc')}</h1>
       </div>

       {/* Pricing Tiers */}
       <div id="pricing" className="grid md:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
             <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">{t('planFree')}</h3>
                <div className="text-3xl font-serif font-bold text-zeina-600 mt-2">{t('priceFree')}</div>
             </div>
             <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-zeina-500" /> {t('featAccess')}</li>
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-zeina-500" /> {t('featCommunity')}</li>
             </ul>
             <button className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">{t('currentPlan')}</button>
          </div>

          {/* Gold Tier */}
          <div className="bg-white p-8 rounded-[2rem] border-2 border-zeina-200 shadow-lg relative overflow-hidden transform md:-translate-y-4 group hover:shadow-2xl transition-all">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-zeina-300 to-zeina-500" />
             <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">{t('planGold')}</h3>
                <div className="text-3xl font-serif font-bold text-zeina-600 mt-2">{t('priceGold')}</div>
             </div>
             <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-zeina-500" /> {t('featExclusive')}</li>
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-zeina-500" /> {t('featPriority')}</li>
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-zeina-500" /> 10% Off Courses</li>
             </ul>
             <button className="w-full py-3 rounded-xl bg-zeina-100 text-zeina-700 font-bold hover:bg-zeina-200 transition-colors">{t('subscribeBtn')}</button>
          </div>

          {/* Platinum Tier */}
          <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group hover:scale-105 transition-transform duration-500">
             <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-zeina-500 blur-[60px] opacity-40 rounded-full pointer-events-none" />
             <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white">{t('planPlatinum')}</h3>
                <div className="text-3xl font-serif font-bold text-zeina-300 mt-2">{t('pricePlatinum')}</div>
             </div>
             <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle size={16} className="text-zeina-400" /> {t('featCourses')}</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle size={16} className="text-zeina-400" /> {t('featExclusive')}</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle size={16} className="text-zeina-400" /> VIP Support</li>
             </ul>
             <button className="w-full py-3 rounded-xl bg-zeina-600 text-white font-bold hover:bg-zeina-500 transition-colors shadow-lg shadow-zeina-500/30">{t('subscribeBtn')}</button>
          </div>
       </div>

       {/* Tabs */}
       <div className="flex justify-center mb-12">
          <div className="bg-slate-50 p-1.5 rounded-full inline-flex">
             {(['articles', 'courses', 'bundles'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${
                     activeTab === tab ? 'bg-white shadow-md text-zeina-700' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                   {t(('tab' + tab.charAt(0).toUpperCase() + tab.slice(1)) as any)}
                </button>
             ))}
          </div>
       </div>

       {/* Content Grid */}
       <AnimatePresence mode="wait">
          {/* ARTICLES TAB */}
          {activeTab === 'articles' && (
             <motion.div 
               key="articles"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="grid md:grid-cols-3 gap-10"
             >
                {articles.map((article) => (
                   <article key={article.id} className="group cursor-pointer relative bg-white rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-lg transition-all p-3">
                      <div className="rounded-[1.5rem] overflow-hidden mb-4 h-56 shadow-sm relative">
                         <img src={article.image} alt={article.title} className={`w-full h-full object-cover transition-transform duration-700 ${article.isPremium ? 'grayscale group-hover:grayscale-0' : 'group-hover:scale-105'}`} />
                         {article.isPremium && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                               <div className="bg-white/90 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
                                  <Lock size={14} className="text-zeina-600" /> Premium
                               </div>
                            </div>
                         )}
                         
                         {/* AI Generate Button Overlay */}
                         <button 
                           onClick={(e) => { e.stopPropagation(); openGenModal(article.title); }}
                           className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full text-zeina-600 hover:bg-zeina-600 hover:text-white transition-colors shadow-md z-10"
                           title="Visualize with AI"
                         >
                            <Sparkles size={16} />
                         </button>
                      </div>
                      <div className="px-3 pb-3">
                         <div className="flex justify-between items-center text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">
                            <span>{article.category}</span>
                            <span>{article.date}</span>
                         </div>
                         <h3 className="text-xl font-bold font-serif text-slate-900 mb-2 group-hover:text-zeina-600 transition-colors line-clamp-2">
                            {article.title}
                         </h3>
                         <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
                            {article.excerpt}
                         </p>
                         <span className="text-zeina-600 font-medium text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                            {t('readArticle')} <ArrowRight size={14} className={dir === 'rtl' ? 'rotate-180' : ''} />
                         </span>
                      </div>
                   </article>
                ))}
             </motion.div>
          )}

          {/* COURSES TAB */}
          {activeTab === 'courses' && (
             <motion.div 
               key="courses"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="grid md:grid-cols-3 gap-8"
             >
                {courses.map((course) => (
                   <div key={course.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col cursor-pointer" onClick={() => handleOpenCourse(course)}>
                      <div className="h-48 relative overflow-hidden">
                         <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                         {course.isPremium && (
                            <div className="absolute top-4 right-4 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                               <Lock size={10} /> Premium
                            </div>
                         )}
                         <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="bg-white/30 backdrop-blur-md p-3 rounded-full text-white">
                                <Play size={32} fill="currentColor" />
                             </div>
                         </div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                         <div className="flex items-center gap-2 text-xs font-bold text-zeina-600 mb-3">
                            <span className="bg-zeina-50 px-2 py-1 rounded-md">{course.level}</span>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-1"><Clock size={12}/> {course.duration}</span>
                         </div>
                         <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{course.title}</h3>
                         <p className="text-sm text-slate-500 mb-4 line-clamp-2">{course.description}</p>
                         
                         <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                            <div>
                               <div className="text-xs text-slate-400 mb-0.5">{t('instructor')}</div>
                               <div className="text-sm font-bold text-slate-800">{course.instructor}</div>
                            </div>
                            <div className="text-right">
                               <div className="text-lg font-serif font-bold text-zeina-700">{course.price} SAR</div>
                               {course.isPremium && <div className="text-[10px] text-zeina-500 font-medium">{t('includedInPlatinum')}</div>}
                            </div>
                         </div>
                         <button className="w-full mt-4 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-zeina-600 transition-colors">
                            {t('enrollNow')}
                         </button>
                      </div>
                   </div>
                ))}
             </motion.div>
          )}

          {/* BUNDLES TAB */}
          {activeTab === 'bundles' && (
             <motion.div 
               key="bundles"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="grid md:grid-cols-2 gap-8"
             >
                {bundles.map((bundle) => (
                   <div key={bundle.id} className="bg-gradient-to-br from-zeina-50 to-white rounded-[2.5rem] p-8 border border-zeina-100 shadow-md hover:shadow-xl transition-all flex flex-col md:flex-row gap-8 items-center">
                      <div className="w-full md:w-2/5 aspect-[4/5] rounded-2xl overflow-hidden shadow-lg relative">
                         <img src={bundle.image} alt={bundle.title} className="w-full h-full object-cover" />
                         <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                            {t('save')} {Math.round(((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100)}%
                         </div>
                      </div>
                      <div className="w-full md:w-3/5">
                         <div className="flex items-center gap-2 text-zeina-600 text-xs font-bold uppercase tracking-wider mb-2">
                            <Layers size={14} /> {bundle.coursesCount} Courses Bundle
                         </div>
                         <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3">{bundle.title}</h3>
                         <p className="text-slate-600 mb-6 text-sm leading-relaxed">{bundle.description}</p>
                         
                         <ul className="space-y-2 mb-8">
                            {bundle.features.map((feat, i) => (
                               <li key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                  <CheckCircle size={16} className="text-green-500" /> {feat}
                               </li>
                            ))}
                         </ul>

                         <div className="flex items-end gap-3 mb-6">
                            <div className="text-3xl font-bold text-slate-900">{bundle.price} SAR</div>
                            <div className="text-lg text-slate-400 line-through decoration-red-400 decoration-2">{bundle.originalPrice} SAR</div>
                         </div>

                         <button className="w-full bg-zeina-600 text-white py-3.5 rounded-xl font-bold hover:bg-zeina-700 transition-colors shadow-lg shadow-zeina-200">
                            {t('viewBundle')}
                         </button>
                      </div>
                   </div>
                ))}
             </motion.div>
          )}
       </AnimatePresence>

       {/* AI Image Generation Modal */}
       <AnimatePresence>
          {isGenModalOpen && (
             <>
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsGenModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50" />
               <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 50 }} className="fixed inset-0 m-auto max-w-lg h-fit bg-white rounded-[2rem] p-8 z-50 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="text-zeina-600" /> AI Visualizer
                     </h2>
                     <button onClick={() => setIsGenModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><X size={20} /></button>
                  </div>
                  
                  <div className="space-y-4">
                     <p className="text-sm text-slate-500">Generate a custom image for this topic using Zeina AI.</p>
                     
                     <textarea 
                        value={genPrompt}
                        onChange={(e) => setGenPrompt(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-zeina-200 resize-none text-sm"
                        rows={3}
                        placeholder="Describe the image you want..."
                     />

                     {generatedImage ? (
                        <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-inner group">
                           <img src={`data:image/png;base64,${generatedImage}`} className="w-full h-auto" alt="Generated" />
                           <a href={`data:image/png;base64,${generatedImage}`} download="zeina-ai-image.png" className="absolute bottom-4 right-4 bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-slate-100">
                              <Download size={14} /> Download
                           </a>
                        </div>
                     ) : (
                        <div className="h-48 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                           {isGenerating ? (
                              <>
                                 <Loader size={32} className="animate-spin text-zeina-500 mb-2" />
                                 <p className="text-xs animate-pulse">Creating masterpiece...</p>
                              </>
                           ) : (
                              <>
                                 <ImageIcon size={32} className="mb-2 opacity-50" />
                                 <p className="text-xs">Image preview will appear here</p>
                              </>
                           )}
                        </div>
                     )}

                     <button 
                        onClick={handleGenerateImage} 
                        disabled={isGenerating || !genPrompt.trim()}
                        className="w-full bg-zeina-600 text-white py-3 rounded-xl font-bold hover:bg-zeina-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-zeina-200"
                     >
                        {isGenerating ? 'Generating...' : (generatedImage ? 'Generate New Version' : 'Generate Image')}
                        {!isGenerating && <Sparkles size={16} />}
                     </button>
                  </div>
               </motion.div>
             </>
          )}
       </AnimatePresence>

       {/* Course Viewer Modal */}
       <AnimatePresence>
         {selectedCourse && (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
               onClick={handleCloseCourse}
            >
               <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-white rounded-[2rem] w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
                  onClick={e => e.stopPropagation()}
               >
                  <button onClick={handleCloseCourse} className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors">
                     <X size={20} />
                  </button>

                  {/* Left: Video Player */}
                  <div className="w-full md:w-2/3 bg-slate-900 flex flex-col">
                     <div className="flex-grow relative flex items-center justify-center bg-black">
                        {activeSession && activeSession.isFree ? (
                           // Simulated Video Player for Free Content
                           <div className="relative w-full h-full">
                              <video 
                                 key={activeSession.id}
                                 src={activeSession.videoUrl} 
                                 className="w-full h-full object-contain"
                                 controls
                                 autoPlay
                                 playsInline
                                 poster={selectedCourse.image}
                              />
                           </div>
                        ) : (
                           // Locked Content Placeholder
                           <div className="text-center p-8">
                              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                                 <Lock size={32} />
                              </div>
                              <h3 className="text-xl font-bold text-white mb-2">{t('locked')}</h3>
                              <p className="text-slate-400 mb-6">{t('subscribeToWatch')}</p>
                              <button 
                                onClick={() => { handleCloseCourse(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }}
                                className="bg-zeina-600 text-white px-8 py-3 rounded-full font-bold hover:bg-zeina-700 transition-colors"
                              >
                                 {t('subscribeBtn')}
                              </button>
                           </div>
                        )}
                     </div>
                     <div className="p-6 bg-slate-800 text-white flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold mb-1">{activeSession?.title || selectedCourse.title}</h2>
                            <p className="text-slate-400 text-sm flex items-center gap-2">
                               {activeSession?.isFree ? (
                                  <span className="text-green-400 flex items-center gap-1 font-bold text-xs bg-green-900/30 px-2 py-0.5 rounded-full"><Play size={10} fill="currentColor" /> {t('playingNow')}</span>
                               ) : (
                                  <span className="text-slate-500 flex items-center gap-1 text-xs bg-slate-700 px-2 py-0.5 rounded-full"><Lock size={10} /> {t('locked')}</span>
                               )}
                               <span>• {activeSession?.duration}</span>
                            </p>
                        </div>
                        
                        {activeSession?.isFree && (
                            <button onClick={() => setIsReviewOpen(true)} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                                <Star size={14} className="text-yellow-400" /> Rate Session
                            </button>
                        )}
                     </div>
                  </div>

                  {/* Right: Playlist */}
                  <div className="w-full md:w-1/3 bg-white flex flex-col border-l border-slate-100 relative">
                     <div className="p-6 border-b border-slate-100">
                        <h3 className="font-serif font-bold text-xl text-slate-900 mb-2">{t('courseContent')}</h3>
                        <p className="text-sm text-slate-500">{selectedCourse.title}</p>
                     </div>
                     <div className="flex-grow overflow-y-auto">
                        {selectedCourse.sessions?.map((session, idx) => (
                           <button 
                              key={session.id}
                              onClick={() => setActiveSession(session)}
                              className={`w-full text-left p-4 border-b border-slate-50 transition-colors flex items-start gap-3 hover:bg-slate-50 ${
                                 activeSession?.id === session.id ? 'bg-zeina-50/50' : ''
                              }`}
                           >
                              <div className="mt-1">
                                 {session.isFree ? (
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                                       activeSession?.id === session.id ? 'bg-zeina-600 border-zeina-600 text-white' : 'border-slate-300 text-slate-400'
                                    }`}>
                                       {activeSession?.id === session.id ? <Pause size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" />}
                                    </div>
                                 ) : (
                                    <Lock size={20} className="text-slate-300" />
                                 )}
                              </div>
                              <div className="flex-grow">
                                 <div className={`font-medium text-sm mb-1 ${activeSession?.id === session.id ? 'text-zeina-900 font-bold' : 'text-slate-700'}`}>
                                    {idx + 1}. {session.title}
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={10} /> {session.duration}</span>
                                    {session.isFree && (
                                       <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md border border-green-100 uppercase tracking-wide">{t('freePreview')}</span>
                                    )}
                                 </div>
                              </div>
                           </button>
                        ))}
                     </div>

                     {/* Review Form Overlay */}
                     <AnimatePresence>
                        {isReviewOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 50 }} 
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                className="absolute bottom-0 left-0 w-full bg-white border-t border-slate-100 shadow-negative p-6 z-20"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-slate-900">Rate this Session</h4>
                                    <button onClick={() => setIsReviewOpen(false)}><X size={18} className="text-slate-400" /></button>
                                </div>
                                {reviewSubmitted ? (
                                    <div className="text-center py-8 text-green-600">
                                        <CheckCircle size={32} className="mx-auto mb-2" />
                                        <p className="font-bold">Thank you for your feedback!</p>
                                    </div>
                                ) : (
                                    <form onSubmit={submitReview}>
                                        <div className="flex justify-center gap-2 mb-4">
                                            {[1,2,3,4,5].map(star => (
                                                <button key={star} type="button" onClick={() => setReviewRating(star)} className="focus:outline-none">
                                                    <Star size={24} className={star <= reviewRating ? "text-yellow-400 fill-current" : "text-slate-200"} />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea 
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                            placeholder="Write your review here..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-zeina-200 mb-4 resize-none"
                                            rows={3}
                                        />
                                        <button type="submit" className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-zeina-700 transition-colors flex items-center justify-center gap-2">
                                            Submit Review <Send size={14} />
                                        </button>
                                    </form>
                                )}
                            </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </motion.div>
            </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};

export default Blog;

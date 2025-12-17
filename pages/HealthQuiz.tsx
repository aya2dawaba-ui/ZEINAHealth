
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHealthQuiz } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { ChevronRight, RefreshCcw, Activity, Brain, CheckCircle, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const HealthQuiz: React.FC = () => {
  const { t, language, dir } = useLanguage();
  const quizData = getHealthQuiz(language);
  
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (points: number) => {
    setScore(prev => prev + points);
    
    if (currentQuestion < quizData.length - 1) {
       setCurrentQuestion(prev => prev + 1);
    } else {
       setFinished(true);
    }
  };

  const restartQuiz = () => {
    setStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setFinished(false);
  };

  const getResultFeedback = () => {
    const maxScore = quizData.length * 3;
    const percentage = (score / maxScore) * 100;

    if (percentage > 75) return { text: t('quizScoreHigh'), color: 'text-green-600', bg: 'bg-green-50' };
    if (percentage > 40) return { text: t('quizScoreMed'), color: 'text-amber-600', bg: 'bg-amber-50' };
    return { text: t('quizScoreLow'), color: 'text-red-600', bg: 'bg-red-50' };
  };

  const feedback = getResultFeedback();

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-gradient-to-br from-warm-50 to-white">
       <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
             {!started ? (
                <motion.div 
                   key="intro"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="text-center py-12"
                >
                   <div className="w-24 h-24 bg-zeina-100 rounded-full flex items-center justify-center mx-auto mb-8 text-zeina-600 shadow-lg shadow-zeina-100">
                      <Activity size={40} />
                   </div>
                   <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">{t('quizTitle')}</h1>
                   <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg mx-auto">
                      {t('quizDesc')}
                   </p>
                   <button 
                     onClick={() => setStarted(true)}
                     className="bg-zeina-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-zeina-700 transition-all shadow-xl hover:shadow-zeina-200 hover:-translate-y-1 flex items-center gap-2 mx-auto"
                   >
                      {t('quizStart')} {language === 'ar' ? <ChevronRight className="rotate-180" /> : <ChevronRight />}
                   </button>
                </motion.div>
             ) : !finished ? (
                <motion.div
                   key="question"
                   initial={{ opacity: 0, x: 50 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -50 }}
                   className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100"
                >
                   <div className="mb-8 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <span>Question {currentQuestion + 1} / {quizData.length}</span>
                      <span>{quizData[currentQuestion].category}</span>
                   </div>
                   
                   {/* Progress Bar */}
                   <div className="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
                      <motion.div 
                        className="h-full bg-zeina-500"
                        initial={{ width: `${((currentQuestion) / quizData.length) * 100}%` }}
                        animate={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
                      />
                   </div>

                   <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-8 leading-tight">
                      {quizData[currentQuestion].question}
                   </h2>

                   <div className="space-y-4">
                      {quizData[currentQuestion].options.map((opt, idx) => (
                         <button
                           key={idx}
                           onClick={() => handleAnswer(opt.score)}
                           className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-zeina-300 hover:bg-zeina-50 transition-all font-medium text-slate-700 flex items-center justify-between group"
                         >
                            {opt.text}
                            <div className="w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-zeina-500 group-hover:bg-zeina-500 transition-colors" />
                         </button>
                      ))}
                   </div>
                </motion.div>
             ) : (
                <motion.div
                   key="result"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="text-center"
                >
                   <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 relative overflow-hidden">
                      <div className={`absolute top-0 left-0 w-full h-3 ${feedback.bg.replace('bg-', 'bg-gradient-to-r from-white via-')}`} />
                      
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${feedback.bg} ${feedback.color}`}>
                         <CheckCircle size={40} />
                      </div>
                      
                      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{t('quizResult')}</h2>
                      <h3 className={`text-3xl font-serif font-bold mb-6 ${feedback.color}`}>{feedback.text}</h3>
                      
                      <p className="text-slate-600 mb-8 leading-relaxed max-w-md mx-auto">
                        Based on your answers, we recommend focusing on specialized care to maintain or improve your well-being.
                      </p>

                      <div className="grid gap-4 max-w-sm mx-auto">
                         <NavLink to="/experts" className="bg-zeina-600 text-white py-4 rounded-xl font-bold hover:bg-zeina-700 transition-colors shadow-lg">
                            {t('quizConsult')}
                         </NavLink>
                         <button onClick={restartQuiz} className="text-slate-500 font-bold py-2 hover:text-zeina-600 flex items-center justify-center gap-2">
                            <RefreshCcw size={16} /> {t('quizRetake')}
                         </button>
                      </div>
                   </div>
                </motion.div>
             )}
          </AnimatePresence>
       </div>
    </div>
  );
};

export default HealthQuiz;

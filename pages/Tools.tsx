
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, Brain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Tools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bf' | 'period'>('bf');
  const { t } = useLanguage();

  return (
    <div className="py-16 bg-gradient-to-br from-warm-50 to-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">{t('tools')}</h1>
          <p className="text-slate-600">Smart calculators to track your body's wellness metrics.</p>
        </div>

        {/* Quiz Banner */}
        <NavLink to="/quiz" className="block mb-12 group">
           <div className="bg-gradient-to-r from-zeina-600 to-zeina-500 rounded-[2rem] p-8 text-white shadow-xl shadow-zeina-200/50 relative overflow-hidden transition-transform group-hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="text-center md:text-left rtl:md:text-right">
                    <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-sm">
                       <Brain size={14} /> {t('quizTitle')}
                    </div>
                    <h2 className="text-3xl font-serif font-bold mb-2">How healthy are you, really?</h2>
                    <p className="text-white/80 max-w-md">{t('quizDesc')}</p>
                 </div>
                 <span className="bg-white text-zeina-600 px-8 py-3 rounded-full font-bold shadow-lg group-hover:bg-zeina-50 transition-colors">
                    {t('quizStart')}
                 </span>
              </div>
           </div>
        </NavLink>

        <div className="flex justify-center mb-10">
          <div className="bg-white p-1 rounded-full shadow-sm border border-slate-100 inline-flex">
            <button
              onClick={() => setActiveTab('bf')}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === 'bf' ? 'bg-zeina-600 text-white shadow-md' : 'text-slate-500 hover:text-zeina-600'
              }`}
            >
              Body Fat Calc
            </button>
            <button
              onClick={() => setActiveTab('period')}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === 'period' ? 'bg-zeina-600 text-white shadow-md' : 'text-slate-500 hover:text-zeina-600'
              }`}
            >
              Period Tracker
            </button>
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-zeina-100/50"
        >
          {activeTab === 'bf' ? <BodyFatCalculator /> : <PeriodTracker />}
        </motion.div>
      </div>
    </div>
  );
};

const BodyFatCalculator: React.FC = () => {
  const [waist, setWaist] = useState<number | ''>('');
  const [neck, setNeck] = useState<number | ''>('');
  const [hip, setHip] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    if (!waist || !neck || !hip || !height) return;
    // US Navy Method for Females
    // Simple Approximation Logic for demo purposes
    // 163.205 x log10(waist + hip - neck) - 97.684 x log10(height) - 78.387
    
    const w = Number(waist);
    const n = Number(neck);
    const h = Number(hip);
    const ht = Number(height);

    if (w + h - n <= 0) return; // invalid calculation

    const term1 = 163.205 * Math.log10(w + h - n);
    const term2 = 97.684 * Math.log10(ht);
    const bf = term1 - term2 - 78.387;

    setResult(Math.max(2, Math.min(bf, 60))); // Clamp between 2 and 60
  };

  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h3 className="text-2xl font-bold font-serif mb-6 flex items-center gap-2">
          <Activity className="text-zeina-600" /> Body Fat Estimator
        </h3>
        <p className="text-slate-500 mb-8 text-sm">
          Using the U.S. Navy method for women. Enter your measurements to get an estimate of your body fat percentage.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
            <input 
              type="number" 
              value={height} 
              onChange={e => setHeight(Number(e.target.value))} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-zeina-200 focus:outline-none" 
              placeholder="e.g. 165"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Waist (cm)</label>
            <input 
              type="number" 
              value={waist} 
              onChange={e => setWaist(Number(e.target.value))} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-zeina-200 focus:outline-none" 
              placeholder="At narrowest point"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Neck (cm)</label>
            <input 
              type="number" 
              value={neck} 
              onChange={e => setNeck(Number(e.target.value))} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-zeina-200 focus:outline-none" 
              placeholder="Below larynx"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hip (cm)</label>
            <input 
              type="number" 
              value={hip} 
              onChange={e => setHip(Number(e.target.value))} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-zeina-200 focus:outline-none" 
              placeholder="At widest point"
            />
          </div>
          <button onClick={calculate} className="w-full bg-slate-900 text-white py-4 rounded-xl font-medium mt-4 hover:bg-zeina-700 transition-colors">
            Calculate Result
          </button>
        </div>
      </div>

      <div className="bg-zeina-50 rounded-[2rem] p-8 h-full flex flex-col items-center justify-center text-center">
         {result !== null ? (
           <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
             <p className="text-slate-500 uppercase tracking-widest text-sm mb-2">Your Estimate</p>
             <div className="text-6xl font-bold text-zeina-700 font-serif mb-4">{result.toFixed(1)}%</div>
             <p className="text-slate-600 max-w-xs text-sm mx-auto">
               This is an estimate. For precise measurements, please consult with one of our specialists.
             </p>
             <div className="mt-6">
                <div className="h-2 w-full bg-white rounded-full overflow-hidden max-w-[200px] mx-auto border border-zeina-200">
                   <div className="h-full bg-zeina-500" style={{ width: `${Math.min(result, 100)}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 max-w-[200px] mx-auto mt-1">
                   <span>Athletes</span>
                   <span>Fitness</span>
                   <span>Average</span>
                </div>
             </div>
           </motion.div>
         ) : (
           <div className="opacity-40">
              <Activity size={64} className="mx-auto mb-4" />
              <p>Enter your details to see the result</p>
           </div>
         )}
      </div>
    </div>
  );
};

const PeriodTracker: React.FC = () => {
  const { user } = useAuth();
  const [lastDate, setLastDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [nextPeriod, setNextPeriod] = useState<string | null>(null);

  // Auto-fill from user profile if available
  useEffect(() => {
    if (user && user.lastPeriodDate) {
      setLastDate(user.lastPeriodDate);
      if (user.cycleLength) setCycleLength(user.cycleLength);
      // Automatically calculate if data is present
      const date = new Date(user.lastPeriodDate);
      date.setDate(date.getDate() + (user.cycleLength || 28));
      setNextPeriod(date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    }
  }, [user]);

  const calculatePeriod = () => {
    if (!lastDate) return;
    const date = new Date(lastDate);
    date.setDate(date.getDate() + cycleLength);
    setNextPeriod(date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  };

  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
       <div className="bg-lavender-50 rounded-[2rem] p-8 h-full flex flex-col items-center justify-center text-center order-last md:order-first">
         {nextPeriod ? (
           <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
             <p className="text-slate-500 uppercase tracking-widest text-sm mb-2">Next Period Starts</p>
             <div className="text-3xl font-bold text-lavender-900 font-serif mb-4">{nextPeriod}</div>
             <p className="text-slate-600 max-w-xs text-sm mx-auto">
               Stay prepared. Tracking your cycle helps you understand your body better.
             </p>
             {user && (
               <div className="mt-4 bg-white/50 px-4 py-2 rounded-lg text-xs text-slate-500">
                  Calculated based on your profile data
               </div>
             )}
             <div className="mt-8 grid grid-cols-7 gap-1 max-w-xs mx-auto text-xs text-slate-400">
                {['S','M','T','W','T','F','S'].map((d,i) => <div key={i}>{d}</div>)}
                {Array.from({length: 30}).map((_,i) => (
                  <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center ${i === 15 ? 'bg-lavender-500 text-white' : 'bg-white'}`}>{i+1}</div>
                ))}
             </div>
           </motion.div>
         ) : (
           <div className="opacity-40">
              <Calendar size={64} className="mx-auto mb-4 text-lavender-900" />
              <p>Enter your dates to predict your next cycle</p>
           </div>
         )}
      </div>

      <div>
        <h3 className="text-2xl font-bold font-serif mb-6 flex items-center gap-2">
          <Calendar className="text-zeina-600" /> Cycle Tracker
        </h3>
        <p className="text-slate-500 mb-8 text-sm">
          A simple tool to predict your next period based on your history.
        </p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">First day of last period</label>
            <input 
              type="date" 
              value={lastDate} 
              onChange={e => setLastDate(e.target.value)} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-zeina-200 focus:outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Average Cycle Length (Days)</label>
            <input 
              type="range" 
              min="21" 
              max="35" 
              value={cycleLength} 
              onChange={e => setCycleLength(Number(e.target.value))} 
              className="w-full accent-zeina-600 mb-2" 
            />
            <div className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
               <span className="text-xs text-slate-400">Short (21)</span>
               <div className="font-bold text-zeina-700">{cycleLength} Days</div>
               <span className="text-xs text-slate-400">Long (35)</span>
            </div>
          </div>
          
          <button onClick={calculatePeriod} className="w-full bg-slate-900 text-white py-4 rounded-xl font-medium mt-4 hover:bg-zeina-700 transition-colors">
            {nextPeriod ? 'Update Prediction' : 'Predict Next Cycle'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tools;

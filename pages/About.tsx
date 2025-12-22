
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, ShieldCheck, Users, Sparkles, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
// Added NavLink import to fix errors on lines 109, 111, 112, 114
import { NavLink } from 'react-router-dom';

const About: React.FC = () => {
  const { t, language, dir } = useLanguage();
  const { scrollYProgress } = useScroll();

  return (
    <div className="bg-white">
      {/* HEADER SECTION */}
      <section className="relative pt-32 pb-24 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <span className="text-zeina-600 font-black uppercase tracking-[0.3em] text-[10px] mb-8 block">{t('aboutTagline')}</span>
          <h1 className="text-6xl md:text-8xl font-serif font-black text-slate-900 mb-10 leading-tight tracking-tighter">
            {t('aboutTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-light leading-relaxed max-w-3xl mx-auto">
            {t('aboutDesc')}
          </p>
        </motion.div>
      </section>

      {/* VALUES WITH SCROLL ANIMATION */}
      <section className="py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
           {[
             { icon: Heart, title: t('value1Title'), desc: t('value1Desc'), color: 'bg-zeina-50 text-zeina-600' },
             { icon: ShieldCheck, title: t('value2Title'), desc: t('value2Desc'), color: 'bg-green-50 text-green-600' },
             { icon: Globe, title: t('value3Title'), desc: t('value3Desc'), color: 'bg-lavender-50 text-lavender-600' }
           ].map((item, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.15 }}
               className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group"
             >
                <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <item.icon size={30} />
                </div>
                <h3 className="text-2xl font-bold font-serif mb-4 text-slate-900">{item.title}</h3>
                <p className="text-slate-500 font-light leading-relaxed">{item.desc}</p>
             </motion.div>
           ))}
        </div>
      </section>

      {/* STORY SECTION - SPLIT DESIGN */}
      <section className="py-40">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
               <motion.div 
                 initial={{ opacity: 0, clipPath: 'inset(10% 10% 10% 10% round 4rem)' }}
                 whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 4rem)' }}
                 transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                 className="relative h-[700px] overflow-hidden shadow-2xl"
               >
                  <img src="https://images.unsplash.com/photo-1576091160550-2187d80aeff2?auto=format&fit=crop&q=80&w=1000" alt="Zeina Vision" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-zeina-900/10" />
               </motion.div>
               
               <div>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                  >
                    <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 mb-8">
                       <Sparkles size={14} className="text-zeina-600" /> OUR STORY
                    </div>
                    <h2 className="text-5xl font-serif font-bold mb-10 text-slate-900">{t('ourStory')}</h2>
                    <div className="space-y-8 text-xl text-slate-500 font-light leading-relaxed">
                       <p>{t('storyP1')}</p>
                       <p>{t('storyP2')}</p>
                    </div>
                    
                    <div className="mt-16 flex items-center gap-5 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 max-w-fit">
                       <img src="https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&q=80&w=200" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" alt="Founder" />
                       <div>
                         <h4 className="font-bold text-slate-900 text-xl leading-tight">Dr. Aya Mohamed</h4>
                         <p className="text-sm text-zeina-600 font-bold uppercase tracking-widest mt-1">{t('founderRole')}</p>
                       </div>
                    </div>
                  </motion.div>
               </div>
            </div>
         </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-40 bg-slate-900 text-white overflow-hidden relative">
         <motion.div 
           style={{ opacity: useTransform(scrollYProgress, [0.8, 1], [0.3, 0.1]) }}
           className="absolute top-0 right-0 w-[800px] h-[800px] bg-zeina-500 rounded-full blur-[160px] translate-x-1/2 -translate-y-1/2" 
         />
         <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-serif font-black mb-10 leading-none">Join the movement toward better health.</h2>
            <p className="text-xl text-white/60 mb-12 font-light">Whether you're starting your journey or looking for expert medical advice, Zeina is here for you.</p>
            <div className="flex flex-wrap justify-center gap-4">
               <NavLink to="/register" className="bg-zeina-600 text-white px-12 py-5 rounded-full font-bold hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-zeina-900/20">
                  {t('join')}
               </NavLink>
               <NavLink to="/contact" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-12 py-5 rounded-full font-bold hover:bg-white/20 transition-all">
                  Contact Team
               </NavLink>
            </div>
         </div>
      </section>
    </div>
  );
};

export default About;

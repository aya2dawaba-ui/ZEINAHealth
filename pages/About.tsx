
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="pt-10">
      {/* Hero */}
      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <motion.span 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-zeina-600 font-medium tracking-wider uppercase text-sm"
        >
          {t('aboutTagline')}
        </motion.span>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mt-6 mb-8"
        >
          {t('aboutTitle')}
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-xl text-slate-600 leading-relaxed"
        >
          {t('aboutDesc')}
        </motion.p>
      </section>

      {/* Values */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
           {[
             { icon: Heart, title: t('value1Title'), desc: t('value1Desc') },
             { icon: ShieldCheck, title: t('value2Title'), desc: t('value2Desc') },
             { icon: Users, title: t('value3Title'), desc: t('value3Desc') }
           ].map((item, i) => (
             <div key={i} className="text-center p-8 bg-warm-50/50 rounded-3xl">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md text-zeina-600">
                  <item.icon size={32} />
                </div>
                <h3 className="text-xl font-bold font-serif mb-4">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
         <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-[3rem] overflow-hidden h-[600px] shadow-2xl shadow-zeina-100/50">
               {/* Updated to a collaborative team image */}
               <img src="https://images.unsplash.com/photo-1576091160550-2187d80aeff2?auto=format&fit=crop&q=80&w=1000" alt="Zeina Team" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div>
               <h2 className="text-4xl font-serif font-bold mb-6">{t('ourStory')}</h2>
               <p className="text-slate-600 leading-relaxed text-lg mb-6">
                 {t('storyP1')}
               </p>
               <p className="text-slate-600 leading-relaxed text-lg mb-8">
                 {t('storyP2')}
               </p>
               <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 inline-flex">
                  {/* Updated Founder Headshot: Professional Hijab */}
                  <img src="https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&q=80&w=200" className="w-16 h-16 rounded-full object-cover" alt="Dr. Aya Mohamed" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Dr. Aya Mohamed PhD</h4>
                    <p className="text-sm text-zeina-600 font-medium">{t('founderRole')}</p>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default About;

import React from 'react';
import { motion, useScroll, useTransform, useSpring, Variants } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Star, Sparkles, Activity, Heart, Stethoscope, BookOpen } from 'lucide-react';
import { getServices, getExperts } from '../constants';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 80, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const Home: React.FC = () => {
  const { t, language, dir } = useLanguage();
  const services = getServices(language);
  const experts = getExperts(language);
  
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 15 });
  
  // Parallax transformations
  const heroY = useTransform(smoothProgress, [0, 0.4], [0, -120]);
  const heroScale = useTransform(smoothProgress, [0, 0.4], [1, 1.08]);
  const textOpacity = useTransform(smoothProgress, [0, 0.25], [1, 0]);

  return (
    <div className="bg-warm-50 selection:bg-zeina-200">
      {/* HERO SECTION */}
      <section className="relative min-h-[110vh] flex items-center justify-center pt-24 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            style={{ y: useTransform(smoothProgress, [0, 1], [0, -400]), scale: 1.5 }}
            className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-zeina-100/40 rounded-full blur-[160px]" 
          />
          <motion.div 
            style={{ y: useTransform(smoothProgress, [0, 1], [0, 400]) }}
            className="absolute bottom-[-10%] left-[-15%] w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[140px]" 
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 relative z-10 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            style={{ opacity: textOpacity }}
            className="flex flex-col"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full border border-zeina-100 mb-10 self-start shadow-sm">
               <Sparkles className="text-zeina-500 w-4 h-4" />
               <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zeina-600">{t('heroTagline')}</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-7xl md:text-[10rem] font-serif font-black text-slate-900 leading-[0.85] mb-10 tracking-tighter">
              {t('heroTitle').split('\n').map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-2xl text-slate-500 leading-relaxed mb-14 max-w-lg font-light italic">
              {t('heroDesc')}
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-6">
               <NavLink to="/quiz" className="group flex items-center gap-4 bg-zeina-600 text-white px-12 py-6 rounded-full font-bold hover:bg-zeina-700 transition-all shadow-[0_25px_50px_-12px_rgba(204,51,102,0.3)]">
                  {t('ctaFreeCheck')} <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </NavLink>
               <NavLink to="/about" className="flex items-center gap-2 bg-white text-slate-800 border border-slate-200 px-12 py-6 rounded-full font-bold hover:bg-slate-50 transition-all">
                  {t('ctaMission')}
               </NavLink>
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: heroY, scale: heroScale }}
            initial={{ opacity: 0, x: 100, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative rounded-[5rem] overflow-hidden shadow-[0_80px_150px_-30px_rgba(0,0,0,0.2)] bg-white aspect-[4/5.5] border-[16px] border-white">
               <img 
                 src="https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=2070&auto=format&fit=crop" 
                 alt="Premium Care" 
                 className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-[2s]" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-zeina-900/30 via-transparent to-transparent" />
               
               {/* Floating Glass Widget */}
               <motion.div 
                 animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                 transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute bottom-12 -left-12 glass-card p-10 rounded-[3rem] shadow-2xl max-w-[320px]"
               >
                  <div className="flex items-center gap-5 mb-5">
                     <div className="bg-zeina-600 p-4 rounded-2xl shadow-lg">
                        <Activity className="text-white w-7 h-7" />
                     </div>
                     <div>
                        <div className="text-[11px] font-black text-zeina-700 uppercase tracking-[0.3em] mb-1">Wellness Sync</div>
                        <div className="text-xl font-serif font-bold text-slate-900">Health Audit</div>
                     </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full mb-5 overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '92%' }}
                        transition={{ duration: 2.5, delay: 0.8 }}
                        className="h-full bg-zeina-500"
                     />
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium italic">Empowering your choices through precision metrics.</p>
               </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CURATED SERVICES WITH STAGGERED REVEAL */}
      <section className="py-56 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-40"
          >
            <h2 className="text-7xl md:text-8xl font-serif font-black text-slate-900 mb-10 tracking-tighter">{t('ourServices')}</h2>
            <p className="text-2xl text-slate-400 font-light max-w-2xl mx-auto italic">{t('servicesPageDesc')}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-16">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1, delay: i * 0.2 }}
                className="p-14 rounded-[4rem] bg-white border border-slate-50 hover:border-zeina-100 hover:shadow-[0_60px_100px_-30px_rgba(204,51,102,0.15)] transition-all group relative overflow-hidden"
              >
                <div className="bg-zeina-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mb-12 group-hover:bg-zeina-600 transition-all duration-700">
                  <service.icon className="text-zeina-600 group-hover:text-white group-hover:scale-110 transition-transform" size={42} />
                </div>
                
                <h3 className="text-4xl font-serif font-bold text-slate-900 mb-8 tracking-tight">{service.title}</h3>
                <p className="text-xl text-slate-500 leading-relaxed font-light mb-12">{service.description}</p>
                
                <NavLink to={service.link} className="text-zeina-600 font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-4 group-hover:gap-6 transition-all">
                   {t('learnMore')} <ArrowRight size={20} />
                </NavLink>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALISTS SECTION */}
      <section className="py-56 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-40 gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-7xl md:text-8xl font-serif font-black text-slate-900 mb-10 tracking-tighter">{t('meetSpecialists')}</h2>
              <p className="text-2xl text-slate-400 font-light italic">{t('specialistsDesc')}</p>
            </motion.div>
            <NavLink to="/experts" className="group flex items-center gap-6 text-zeina-600 font-black uppercase tracking-[0.4em] text-[10px] border-b-2 border-zeina-100 pb-5 hover:border-zeina-500 transition-all">
              {t('viewAllExperts')} <ArrowRight size={24} className={dir === 'rtl' ? 'rotate-180' : ''} />
            </NavLink>
          </div>

          <div className="grid md:grid-cols-3 gap-20">
            {experts.slice(0,3).map((expert, i) => (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: i * 0.2 }}
                className="group flex flex-col items-center text-center"
              >
                 <div className="aspect-[3/4.5] w-full rounded-[5rem] overflow-hidden mb-12 relative shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)]">
                    <img src={expert.image} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 grayscale-[40%] group-hover:grayscale-0" alt={expert.name} />
                    <div className="absolute top-10 right-10 glass-card px-6 py-3 rounded-2xl flex items-center gap-2 shadow-xl">
                       <Star className="text-yellow-500 fill-current" size={18} />
                       <span className="font-black text-sm text-slate-800">{expert.rating}</span>
                    </div>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zeina-500 mb-5">{expert.category}</span>
                 <h3 className="text-5xl font-serif font-bold text-slate-900 mb-4">{expert.name}</h3>
                 <p className="text-slate-400 text-xl font-light italic mb-12">{expert.title}</p>
                 <NavLink to={`/book/${expert.id}`} className="bg-slate-900 text-white px-14 py-6 rounded-full font-bold text-sm hover:bg-zeina-600 transition-all shadow-2xl hover:-translate-y-1">
                    {t('bookConsultation')}
                 </NavLink>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA MISSION */}
      <section className="py-64 bg-zeina-600 relative overflow-hidden">
        <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
           className="absolute top-[-30%] left-[-20%] w-[1200px] h-[1200px] border border-white/5 rounded-full pointer-events-none" 
        />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 text-white">
           <motion.h2 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="text-7xl md:text-9xl font-serif font-black mb-16 tracking-tighter leading-none"
           >
             Empowering your journey, every step of the way.
           </motion.h2>
           <p className="text-3xl text-white/70 font-light mb-20 italic max-w-3xl mx-auto">Discover the intersection of medical science and human empathy.</p>
           <div className="flex flex-wrap justify-center gap-8">
              <NavLink to="/register" className="bg-white text-zeina-600 px-16 py-7 rounded-full font-black uppercase tracking-widest text-xs hover:bg-warm-50 transition-all shadow-2xl">
                 Join the Platform
              </NavLink>
              <NavLink to="/contact" className="bg-transparent border-2 border-white/20 text-white px-16 py-7 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                 Inquire Directly
              </NavLink>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
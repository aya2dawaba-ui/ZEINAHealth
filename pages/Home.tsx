
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Star } from 'lucide-react';
import { getServices, getExperts } from '../constants';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Home: React.FC = () => {
  const { t, language, dir } = useLanguage();
  const services = getServices(language);
  const experts = getExperts(language);

  return (
    <div className="overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-10 pb-20">
        <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] right-[-5%] rtl:right-auto rtl:left-[-5%] w-[600px] h-[600px] bg-zeina-100/50 rounded-full blur-[100px]" />
            <div className="absolute bottom-[10%] left-[-10%] rtl:left-auto rtl:right-[-10%] w-[500px] h-[500px] bg-lavender-100/50 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 relative z-10 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6 border border-zeina-100">
               <span className="flex h-2 w-2 rounded-full bg-zeina-500"></span>
               <span className="text-xs font-semibold tracking-wide uppercase text-slate-500">{t('heroTagline')}</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-serif font-bold text-slate-900 leading-[1.1] mb-6 whitespace-pre-line">
              {t('heroTitle')}
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              {t('heroDesc')}
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
               <NavLink to="/tools" className="group flex items-center gap-2 bg-zeina-600 text-white px-8 py-4 rounded-full font-medium transition-all hover:bg-zeina-700 hover:shadow-lg hover:shadow-zeina-300/40">
                  {t('ctaFreeCheck')} <ArrowUpRight className={`transition-transform ${dir === 'rtl' ? 'group-hover:-rotate-45' : 'group-hover:rotate-45'}`} />
               </NavLink>
               <NavLink to="/about" className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-medium transition-all hover:bg-slate-50 hover:border-slate-300">
                  {t('ctaMission')}
               </NavLink>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-12 flex items-center gap-6">
               <div className="flex -space-x-4 rtl:space-x-reverse">
                  {/* Testimonial Avatars */}
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" className="w-12 h-12 rounded-full border-4 border-white object-cover" alt="user" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" className="w-12 h-12 rounded-full border-4 border-white object-cover" alt="user" />
                  <img src="https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&q=80&w=100" className="w-12 h-12 rounded-full border-4 border-white object-cover" alt="user" />
                  <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100" className="w-12 h-12 rounded-full border-4 border-white object-cover" alt="user" />
               </div>
               <div>
                  <div className="flex items-center gap-1 text-yellow-400">
                     {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-sm text-slate-500 font-medium">{t('trustedBy')}</p>
               </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-zeina-100 bg-slate-100">
               {/* Updated Hero Image: Warm, confident professional woman in hijab */}
               <img src="https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?auto=format&fit=crop&q=80&w=1000" alt="Arab Woman Professional in Hijab" className="w-full h-full object-cover aspect-[4/5]" />
               
               {/* Floating Card */}
               <motion.div 
                 initial={{ y: 50, opacity: 0 }}
                 whileInView={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.5, duration: 0.5 }}
                 className="absolute bottom-8 right-8 rtl:right-auto rtl:left-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl max-w-xs"
               >
                  <div className="flex items-start justify-between mb-4">
                     <div>
                        <h3 className="text-3xl font-bold font-serif text-slate-900">7+</h3>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">{t('yearsService')}</p>
                     </div>
                     <div className="bg-zeina-100 p-2 rounded-full">
                        <Star className="text-zeina-600 w-5 h-5" />
                     </div>
                  </div>
                  <p className="text-sm text-slate-700">{t('awardWinning')}</p>
               </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PARTNERS / TRUST */}
      <section className="py-10 border-y border-slate-100 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-slate-400 text-sm mb-8 tracking-widest uppercase">{t('certifiedBy')}</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               {['Ministry of Health', 'Saudi German Health', 'King Faisal Hospital', 'WHO'].map((brand, i) => (
                  <h3 key={i} className="text-xl md:text-2xl font-serif font-bold text-slate-800 text-center">{brand}</h3>
               ))}
            </div>
         </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-24 bg-gradient-to-b from-white to-warm-50/50">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
               <div className="sticky top-32">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-6 whitespace-pre-line"
                  >
                    {t('servicesTitle')}
                  </motion.h2>
                  <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                    {t('servicesDesc')}
                  </p>
                  <NavLink to="/services" className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zeina-600 text-white hover:scale-110 transition-transform shadow-lg">
                     <ArrowRight size={24} className={dir === 'rtl' ? 'rotate-180' : ''} />
                  </NavLink>
               </div>

               <div className="space-y-8">
                  {services.map((service, idx) => (
                     <motion.div
                       key={idx}
                       initial={{ opacity: 0, y: 30 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: idx * 0.1 }}
                       className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-slate-50 group"
                     >
                        <div className="bg-zeina-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-zeina-600 transition-colors">
                           <service.icon className="text-zeina-600 group-hover:text-white transition-colors" size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.title}</h3>
                        <p className="text-slate-500 leading-relaxed mb-6">{service.description}</p>
                        <NavLink to={service.link} className="text-sm font-semibold text-zeina-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                           {t('learnMore')} <ArrowRight size={16} className={dir === 'rtl' ? 'rotate-180' : ''} />
                        </NavLink>
                     </motion.div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* BIG IMAGE / CTA */}
      <section className="py-20 px-6">
         <div className="max-w-7xl mx-auto rounded-[3rem] overflow-hidden relative min-h-[500px] flex items-center">
            {/* New Big Feature Image: Wellness Lifestyle */}
            <img src="https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover" alt="Saudi Woman Lifestyle" />
            <div className={`absolute inset-0 bg-gradient-to-r ${dir === 'rtl' ? 'from-transparent to-slate-900/80' : 'from-slate-900/80 to-transparent'}`} />
            
            <div className="relative z-10 max-w-2xl p-12 lg:p-20 text-white">
               <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6">{t('bigImageTitle')}</h2>
               <p className="text-slate-200 text-lg mb-8">
                  {t('bigImageDesc')}
               </p>
               <NavLink to="/contact" className="bg-white text-slate-900 px-8 py-4 rounded-full font-medium hover:bg-zeina-50 transition-colors inline-block">
                  {t('ctaStartJourney')}
               </NavLink>
            </div>
         </div>
      </section>

      {/* EXPERTS PREVIEW */}
      <section className="py-24 bg-zeina-50/50">
         <div className="max-w-7xl mx-auto px-6">
             <div className="flex justify-between items-end mb-16">
               <div>
                  <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">{t('meetSpecialists')}</h2>
                  <p className="text-slate-500">{t('specialistsDesc')}</p>
               </div>
               <NavLink to="/experts" className="hidden md:flex items-center gap-2 text-slate-900 font-medium hover:text-zeina-600 transition-colors">
                  {t('viewAllExperts')} <ArrowRight size={18} className={dir === 'rtl' ? 'rotate-180' : ''} />
               </NavLink>
             </div>

             <div className="grid md:grid-cols-3 gap-8">
                {experts.slice(0,3).map((expert, i) => (
                   <motion.div
                     key={expert.id}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-lg transition-all"
                   >
                      <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 bg-slate-100">
                         <img src={expert.image} alt={expert.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                         <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                            <Star size={12} className="text-yellow-400 fill-current" /> {expert.rating}
                         </div>
                      </div>
                      <div className="px-2 pb-2">
                         <span className="text-xs font-semibold text-zeina-600 uppercase tracking-wider">{expert.category}</span>
                         <h3 className="text-xl font-bold text-slate-900 mt-2">{expert.name}</h3>
                         <p className="text-slate-500 text-sm mb-4">{expert.title}</p>
                         <button className="w-full border border-slate-200 py-3 rounded-xl font-medium hover:bg-slate-900 hover:text-white transition-colors">
                            {t('bookConsultation')}
                         </button>
                      </div>
                   </motion.div>
                ))}
             </div>
         </div>
      </section>
    </div>
  );
};

export default Home;

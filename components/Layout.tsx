
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Instagram, Twitter, Linkedin, Facebook, HeartHandshake, Sparkles, User as UserIcon, LogOut, Settings, Globe } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Layout: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language, setLanguage, t, dir } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800 bg-warm-50/30" dir={dir}>
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 group">
             <div className="bg-zeina-100 p-2 rounded-full group-hover:bg-zeina-200 transition-colors">
                <HeartHandshake className="w-6 h-6 text-zeina-700" />
             </div>
            <span className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
              Zeina
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-zeina-600 ${
                    isActive ? 'text-zeina-700 font-semibold' : 'text-slate-600'
                  }`
                }
              >
                {t(item.label.toLowerCase().replace(' ', '') as any) || item.label}
              </NavLink>
            ))}
            
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-zeina-600 px-2 py-1 rounded-md hover:bg-white/50 transition-colors"
            >
              <Globe size={16} />
              <span>{language === 'en' ? 'AR' : 'EN'}</span>
            </button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-white/50 transition-colors"
                >
                  <span className="text-sm font-medium text-slate-700">{user.name.split(' ')[0]}</span>
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200">
                    <img src={user.avatar || "https://via.placeholder.com/150"} alt="User" className="w-full h-full object-cover" />
                  </div>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 overflow-hidden ${
                         dir === 'rtl' ? 'left-0' : 'right-0'
                      }`}
                    >
                      <div className="px-4 py-3 border-b border-slate-50">
                        <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <NavLink to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <UserIcon size={16} /> {t('myProfile')}
                      </NavLink>
                      <NavLink to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <Settings size={16} /> {t('settings')}
                      </NavLink>
                      <button onClick={handleLogout} className="w-full text-start flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 mt-1">
                        <LogOut size={16} /> {t('logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <NavLink to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  {t('login')}
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-zeina-700 transition-all shadow-lg hover:shadow-zeina-300/50"
                >
                  {t('join')}
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                {/* Mobile Language Toggle */}
                <button 
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 text-slate-700 font-bold self-start mb-2"
                >
                  <Globe size={18} />
                  <span>{language === 'en' ? 'Switch to Arabic' : 'Switch to English'}</span>
                </button>

                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `text-base font-medium py-2 border-b border-slate-50 ${
                        isActive ? 'text-zeina-600' : 'text-slate-600'
                      }`
                    }
                  >
                    {t(item.label.toLowerCase().replace(' ', '') as any) || item.label}
                  </NavLink>
                ))}
                {!user ? (
                   <div className="flex flex-col gap-3 mt-4">
                      <NavLink to="/login" className="text-center py-2 text-slate-600 font-medium">{t('login')}</NavLink>
                      <NavLink to="/register" className="text-center bg-slate-900 text-white py-3 rounded-xl font-medium">{t('join')}</NavLink>
                   </div>
                ) : (
                   <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-100">
                      <NavLink to="/profile" className="flex items-center gap-2 text-slate-700 font-medium"><UserIcon size={18}/> {t('myProfile')}</NavLink>
                      <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 font-medium text-start"><LogOut size={18}/> {t('logout')}</button>
                   </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-24">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white pt-20 pb-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6 col-span-1 md:col-span-1">
               <div className="flex items-center gap-2">
                 <div className="bg-zeina-50 p-1.5 rounded-full">
                    <HeartHandshake className="w-5 h-5 text-zeina-700" />
                 </div>
                <span className="text-xl font-serif font-bold">Zeina</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Empowering women through science-based health guidance and expert care. Your wellness journey starts here.
              </p>
              <div className="flex gap-4">
                {[
                  { Icon: Instagram, href: "https://www.instagram.com/zeina_wellness/" },
                  { Icon: Twitter, href: "#" },
                  { Icon: Linkedin, href: "https://www.linkedin.com/company/zeina-health/?viewAsMember=true" },
                  { Icon: Facebook, href: "https://www.facebook.com/ZeinaHealth" }
                ].map((item, i) => (
                  <a 
                    key={i} 
                    href={item.href} 
                    target={item.href !== '#' ? "_blank" : undefined}
                    rel={item.href !== '#' ? "noopener noreferrer" : undefined}
                    className="text-slate-400 hover:text-zeina-600 transition-colors"
                  >
                    <item.Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-serif font-bold mb-6">{t('company')}</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><NavLink to="/about" className="hover:text-zeina-600">{t('about')}</NavLink></li>
                <li><NavLink to="/services" className="hover:text-zeina-600">{t('services')}</NavLink></li>
                <li><NavLink to="/experts" className="hover:text-zeina-600">{t('experts')}</NavLink></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-bold mb-6">{t('resources')}</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><NavLink to="/blog" className="hover:text-zeina-600">{t('blog')}</NavLink></li>
                <li><NavLink to="/tools" className="hover:text-zeina-600">{t('tools')}</NavLink></li>
                <li><NavLink to="/contact" className="hover:text-zeina-600">FAQs</NavLink></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-bold mb-6">{t('subscribe')}</h4>
              <p className="text-sm text-slate-500 mb-4">{t('subscribeDesc')}</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-zeina-200"
                />
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zeina-700 transition-colors">
                  {dir === 'rtl' ? 'اشترك' : 'Join'}
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>{t('copyright')}</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-zeina-600">{t('privacy')}</a>
              <a href="#" className="hover:text-zeina-600">{t('terms')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

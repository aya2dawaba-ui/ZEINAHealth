
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, AlertCircle, Mail, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const VerifyEmail: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { language } = useLanguage();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        navigate('/login');
        return;
    }

    setIsLoading(true);
    setError('');

    try {
      const isValid = await StorageService.verifyEmail(user.id, code);
      if (isValid) {
        setSuccess(true);
        refreshUser();
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        setError(language === 'ar' ? 'رمز التحقق غير صحيح' : 'Invalid verification code');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-warm-50 px-6">
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-slate-100 text-center">
        
        {success ? (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">
              {language === 'ar' ? 'تم التحقق بنجاح!' : 'Verified Successfully!'}
            </h2>
            <p className="text-slate-500 mb-8">
              {language === 'ar' ? 'جاري تحويلك إلى ملفك الشخصي...' : 'Redirecting to your profile...'}
            </p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-zeina-100 rounded-full flex items-center justify-center mx-auto mb-6 text-zeina-600">
              <Mail size={32} />
            </div>
            
            <h1 className="text-2xl font-serif font-bold text-slate-900 mb-2">
              {language === 'ar' ? 'تحقق من بريدك الإلكتروني' : 'Check your inbox'}
            </h1>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">
              {language === 'ar' 
                ? `لقد أرسلنا رمز تحقق مكون من 6 أرقام إلى ${user?.email || 'بريدك'}. يرجى إدخاله أدناه.`
                : `We've sent a 6-digit code to ${user?.email || 'your email'}. Please enter it below.`}
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-6 flex items-center gap-2 justify-center">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <input 
                  type="text" 
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-zeina-200 font-mono"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading || code.length < 6}
                className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-medium hover:bg-zeina-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {language === 'ar' ? 'تأكيد الحساب' : 'Verify Account'} 
                    {language !== 'ar' && <ArrowRight size={18} />}
                  </>
                )}
              </button>
            </form>

            <div className="mt-8">
              <button className="text-sm text-zeina-600 font-bold hover:underline">
                {language === 'ar' ? 'إعادة إرسال الرمز' : 'Resend Code'}
              </button>
            </div>
            
            <p className="mt-4 text-xs text-slate-400">
               {language === 'ar' ? 'رمز تجريبي: 123456' : 'Demo Code: 123456'}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

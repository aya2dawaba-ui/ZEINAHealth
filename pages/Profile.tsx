import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { BookingDetails, User } from '../types';
import { Calendar, Clock, Video, Camera, Heart, Baby, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { t, language } = useLanguage();
  const [appointments, setAppointments] = useState<BookingDetails[]>([]);
  const [activeTab, setActiveTab] = useState<'appointments' | 'settings'>('appointments');
  const [isEditing, setIsEditing] = useState(false);
  
  const [editForm, setEditForm] = useState({ 
    name: '', bio: '', avatar: '', age: '',
    maritalStatus: 'single', lifeStage: 'general',
    childrenCount: '', activityLevel: 'moderate'
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      let data = user.role === 'expert' 
        ? StorageService.getAppointmentsForExpert(user.id) 
        : StorageService.getAppointmentsForUser(user.id);
      setAppointments(data);
      
      setEditForm({ 
        name: user.name || '', 
        bio: user.bio || '', 
        avatar: user.avatar || '',
        age: user.age ? user.age.toString() : '',
        maritalStatus: user.maritalStatus || 'single',
        lifeStage: user.lifeStage || 'general',
        childrenCount: user.childrenCount !== undefined ? user.childrenCount.toString() : '',
        activityLevel: user.activityLevel || 'moderate'
      });
    };

    loadData();
  }, [user, navigate]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      const updates: Partial<User> = {
        name: editForm.name, bio: editForm.bio, avatar: editForm.avatar,
      };

      if (user.role === 'user') {
        updates.age = editForm.age ? parseInt(editForm.age) : undefined;
        updates.maritalStatus = editForm.maritalStatus as any;
        updates.lifeStage = editForm.lifeStage as any;
        updates.activityLevel = editForm.activityLevel as any;
        updates.childrenCount = parseInt(editForm.childrenCount) || 0;
      }

      await StorageService.updateProfile(user.id, updates);
      refreshUser();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (id: string, status: BookingDetails['status']) => {
     await StorageService.updateAppointmentStatus(id, status);
     if (user) {
        setAppointments(user.role === 'expert' 
          ? StorageService.getAppointmentsForExpert(user.id) 
          : StorageService.getAppointmentsForUser(user.id));
     }
  };

  const getLifeStageKey = (stage: string) => {
    if (stage === 'tryingToConceive') return 'optStageTTC';
    return ('optStage' + stage.charAt(0).toUpperCase() + stage.slice(1)) as any;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-warm-50/50 px-6">
       <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
             <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                   <img src={user.avatar || "https://via.placeholder.com/150"} alt={user.name} className="w-full h-full object-cover" />
                </div>
                {isEditing && (
                   <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer">
                      <Camera className="text-white" />
                   </div>
                )}
             </div>
             <div className="flex-grow text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                   <h1 className="text-3xl font-serif font-bold text-slate-900">{user.name}</h1>
                   <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      user.role === 'expert' ? 'bg-zeina-100 text-zeina-700' : 'bg-slate-100 text-slate-600'
                   }`}>
                      {user.role === 'expert' ? user.specialization : 'Member'}
                   </span>
                </div>
                <p className="text-slate-500 max-w-lg mb-4">{user.bio || "No bio added yet."}</p>
                
                {user.role === 'user' && !isEditing && (
                   <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                      {user.age && <div className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-xs text-slate-600"><b>{t('lblAge')}:</b> {user.age}</div>}
                      {user.lifeStage && (
                        <div className="bg-lavender-50 border border-lavender-100 px-3 py-1 rounded-full text-xs text-lavender-700 flex items-center gap-1 font-medium">
                           <Heart size={12} className="fill-current" /> {t(getLifeStageKey(user.lifeStage))}
                        </div>
                      )}
                      {user.maritalStatus && <div className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-xs text-slate-600">{t(('opt' + user.maritalStatus.charAt(0).toUpperCase() + user.maritalStatus.slice(1)) as any)}</div>}
                      {user.childrenCount !== undefined && user.childrenCount > 0 && <div className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-xs text-slate-600 flex items-center gap-1"><Baby size={12} /> {user.childrenCount} {language === 'ar' ? 'أطفال' : 'Children'}</div>}
                   </div>
                )}
             </div>
             <button onClick={() => setIsEditing(!isEditing)} className="border border-slate-200 px-6 py-2.5 rounded-full font-medium text-sm hover:bg-slate-50 transition-colors">
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
             </button>
          </div>

          <AnimatePresence>
             {isEditing && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-3xl p-8 mb-8 border border-slate-100 overflow-hidden">
                   <h3 className="font-bold text-lg mb-6">Update Profile</h3>
                   <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div><label className="block text-sm font-medium text-slate-700 mb-2">Display Name</label><input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2" /></div>
                      <div><label className="block text-sm font-medium text-slate-700 mb-2">Avatar URL</label><input type="text" value={editForm.avatar} onChange={e => setEditForm({...editForm, avatar: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2" /></div>
                      <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-2">Bio</label><textarea value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2" rows={3} /></div>
                      {user.role === 'user' && (
                         <div className="md:col-span-2 bg-zeina-50/50 p-6 rounded-2xl border border-zeina-100">
                             <h4 className="font-bold text-zeina-700 mb-4 flex items-center gap-2"><Heart size={18} /> Health Profile</h4>
                             <div className="grid md:grid-cols-2 gap-6">
                                 <div><label className="block text-sm font-medium text-slate-700 mb-2">{t('lblAge')}</label><input type="number" value={editForm.age} onChange={e => setEditForm({...editForm, age: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2" /></div>
                                 <div><label className="block text-sm font-medium text-slate-700 mb-2">{t('lblMaritalStatus')}</label><select value={editForm.maritalStatus} onChange={e => setEditForm({...editForm, maritalStatus: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2">
                                    <option value="single">{t('optSingle')}</option><option value="married">{t('optMarried')}</option><option value="divorced">{t('optDivorced')}</option><option value="widowed">{t('optWidowed')}</option>
                                 </select></div>
                                 <div><label className="block text-sm font-medium text-slate-700 mb-2">{t('lblLifeStage')}</label><select value={editForm.lifeStage} onChange={e => setEditForm({...editForm, lifeStage: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2">
                                    <option value="general">{t('optStageGeneral')}</option><option value="tryingToConceive">{t('optStageTTC')}</option><option value="pregnant">{t('optStagePregnant')}</option><option value="postpartum">{t('optStagePostpartum')}</option><option value="menopause">{t('optStageMenopause')}</option>
                                 </select></div>
                             </div>
                         </div>
                      )}
                   </div>
                   <button onClick={handleUpdateProfile} className="bg-zeina-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-zeina-700 transition-colors shadow-lg">Save Changes</button>
                </motion.div>
             )}
          </AnimatePresence>

          <div className="flex gap-8 border-b border-slate-200 mb-8">
             <button onClick={() => setActiveTab('appointments')} className={`pb-4 text-sm font-bold relative ${activeTab === 'appointments' ? 'text-zeina-700' : 'text-slate-400'}`}>
                {user.role === 'expert' ? 'Booking Requests' : 'My Appointments'}
                {activeTab === 'appointments' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-zeina-600" />}
             </button>
             <button onClick={() => setActiveTab('settings')} className={`pb-4 text-sm font-bold relative ${activeTab === 'settings' ? 'text-zeina-700' : 'text-slate-400'}`}>
                Settings
                {activeTab === 'settings' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-zeina-600" />}
             </button>
          </div>

          {activeTab === 'appointments' && (
             <div className="space-y-4">
                {appointments.length === 0 ? (
                   <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200"><p className="text-slate-500">No appointments found.</p></div>
                ) : (
                   appointments.map(appt => (
                      <div key={appt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
                         <img src={user.role === 'expert' ? "https://via.placeholder.com/150" : appt.expertImage} className="w-16 h-16 rounded-full object-cover" />
                         <div className="flex-grow">
                            <h4 className="font-bold text-slate-900 text-lg">{user.role === 'expert' ? `Patient Consultation` : `Consultation with ${appt.expertName}`}</h4>
                            <div className="flex gap-4 mt-2 text-sm text-slate-500"><span>{appt.date}</span><span>{appt.time}</span></div>
                         </div>
                         <div className="flex gap-3">
                            {appt.status === 'confirmed' && <button onClick={() => navigate(`/consultation/${appt.id}`)} className="bg-zeina-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium">Join Call</button>}
                            {appt.status === 'pending' && user.role === 'expert' && <button onClick={() => handleStatusChange(appt.id, 'confirmed')} className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm">Accept</button>}
                            <button onClick={() => handleStatusChange(appt.id, 'cancelled')} className="text-slate-400 text-sm hover:text-red-500">Cancel</button>
                         </div>
                      </div>
                   ))
                )}
             </div>
          )}
       </div>
    </div>
  );
};

export default Profile;
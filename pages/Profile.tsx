
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { BookingDetails, User } from '../types';
import { Calendar, Clock, Video, User as UserIcon, MapPin, Camera, Settings, CheckCircle, XCircle, Heart, Baby, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { t, language } = useLanguage();
  const [appointments, setAppointments] = useState<BookingDetails[]>([]);
  const [activeTab, setActiveTab] = useState<'appointments' | 'settings'>('appointments');
  const [isEditing, setIsEditing] = useState(false);
  
  // Expanded form state to include health profile
  // Storing numbers as strings for better input handling
  const [editForm, setEditForm] = useState({ 
    name: '', 
    bio: '', 
    avatar: '',
    age: '',
    maritalStatus: 'single',
    lifeStage: 'general',
    childrenCount: '',
    activityLevel: 'moderate'
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load data
    const loadData = async () => {
      let data: BookingDetails[] = [];
      if (user.role === 'expert') {
        data = StorageService.getAppointmentsForExpert(user.id);
      } else {
        data = StorageService.getAppointmentsForUser(user.id);
      }
      setAppointments(data);
      
      // Initialize form with user data
      setEditForm({ 
        name: user.name, 
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
        name: editForm.name,
        bio: editForm.bio,
        avatar: editForm.avatar,
      };

      // Only update health fields for regular users
      if (user.role === 'user') {
        updates.age = editForm.age ? parseInt(editForm.age) : undefined;
        updates.maritalStatus = editForm.maritalStatus as any;
        updates.lifeStage = editForm.lifeStage as any;
        updates.activityLevel = editForm.activityLevel as any;
        
        const childrenVal = parseInt(editForm.childrenCount);
        updates.childrenCount = isNaN(childrenVal) ? 0 : childrenVal;
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
     // Reload
     if (user) {
        setAppointments(user.role === 'expert' ? StorageService.getAppointmentsForExpert(user.id) : StorageService.getAppointmentsForUser(user.id));
     }
  };

  if (!user) return null;

  const showChildrenInput = 
    editForm.maritalStatus === 'married' || 
    editForm.maritalStatus === 'divorced' || 
    editForm.maritalStatus === 'widowed' || 
    editForm.lifeStage === 'postpartum';

  return (
    <div className="min-h-screen pt-24 pb-12 bg-warm-50/50 px-6">
       <div className="max-w-6xl mx-auto">
          {/* Header Card */}
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
                
                {/* Health Profile Badges (View Mode) */}
                {user.role === 'user' && !isEditing && (
                   <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                      {user.age && (
                        <div className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-xs text-slate-600 flex items-center gap-1">
                           <span className="font-bold">{t('lblAge')}:</span> {user.age}
                        </div>
                      )}
                      {user.lifeStage && (
                        <div className="bg-lavender-50 border border-lavender-100 px-3 py-1 rounded-full text-xs text-lavender-700 flex items-center gap-1 font-medium">
                           <Heart size={12} className="fill-current" /> {t(('optStage' + user.lifeStage.charAt(0).toUpperCase() + user.lifeStage.slice(1).replace('ToConceive','TTC')) as any)}
                        </div>
                      )}
                      {user.maritalStatus && (
                        <div className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-xs text-slate-600">
                           {t(('opt' + user.maritalStatus.charAt(0).toUpperCase() + user.maritalStatus.slice(1)) as any)}
                        </div>
                      )}
                      {user.childrenCount !== undefined && user.childrenCount > 0 && (
                        <div className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-xs text-slate-600 flex items-center gap-1">
                           <Baby size={12} /> {user.childrenCount} {language === 'ar' ? 'أطفال' : 'Children'}
                        </div>
                      )}
                      {user.activityLevel && (
                        <div className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-xs text-slate-600 flex items-center gap-1">
                           <Activity size={12} /> {t(('opt' + user.activityLevel.charAt(0).toUpperCase() + user.activityLevel.slice(1)) as any)}
                        </div>
                      )}
                   </div>
                )}

                <div className="flex gap-4 justify-center md:justify-start border-t border-slate-50 pt-4">
                   <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar size={16} className="text-zeina-500" /> Member since 2025
                   </div>
                </div>
             </div>
             <div>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="border border-slate-200 px-6 py-2.5 rounded-full font-medium text-sm hover:bg-slate-50 transition-colors"
                >
                   {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
             </div>
          </div>

          {/* Edit Form */}
          <AnimatePresence>
             {isEditing && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-3xl p-8 mb-8 border border-slate-100 overflow-hidden">
                   <h3 className="font-bold text-lg mb-6">Update Profile</h3>
                   <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Display Name</label>
                         <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2" />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Avatar URL</label>
                         <input type="text" value={editForm.avatar} onChange={e => setEditForm({...editForm, avatar: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2" />
                      </div>
                      <div className="md:col-span-2">
                         <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                         <textarea value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2" rows={3} />
                      </div>

                      {/* Health Profile Fields (User Only) */}
                      {user.role === 'user' && (
                         <div className="md:col-span-2 bg-zeina-50/50 p-6 rounded-2xl border border-zeina-100">
                             <h4 className="font-bold text-zeina-700 mb-4 flex items-center gap-2"><Heart size={18} /> Health Profile</h4>
                             <div className="grid md:grid-cols-2 gap-6">
                                 <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('lblAge')}</label>
                                    <input type="number" value={editForm.age} onChange={e => setEditForm({...editForm, age: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2" />
                                 </div>
                                 <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('lblMaritalStatus')}</label>
                                    <select value={editForm.maritalStatus} onChange={e => setEditForm({...editForm, maritalStatus: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2">
                                       <option value="single">{t('optSingle')}</option>
                                       <option value="married">{t('optMarried')}</option>
                                       <option value="divorced">{t('optDivorced')}</option>
                                       <option value="widowed">{t('optWidowed')}</option>
                                    </select>
                                 </div>
                                 <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('lblLifeStage')}</label>
                                    <select value={editForm.lifeStage} onChange={e => setEditForm({...editForm, lifeStage: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2">
                                       <option value="general">{t('optStageGeneral')}</option>
                                       <option value="tryingToConceive">{t('optStageTTC')}</option>
                                       <option value="pregnant">{t('optStagePregnant')}</option>
                                       <option value="postpartum">{t('optStagePostpartum')}</option>
                                       <option value="menopause">{t('optStageMenopause')}</option>
                                    </select>
                                 </div>
                                 <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('lblActivityLevel')}</label>
                                    <select value={editForm.activityLevel} onChange={e => setEditForm({...editForm, activityLevel: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2">
                                       <option value="sedentary">{t('optSedentary')}</option>
                                       <option value="moderate">{t('optModerate')}</option>
                                       <option value="active">{t('optActive')}</option>
                                    </select>
                                 </div>
                                 
                                 {showChildrenInput && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                       <label className="block text-sm font-medium text-slate-700 mb-2">{t('lblChildren')}</label>
                                       <input type="number" value={editForm.childrenCount} onChange={e => setEditForm({...editForm, childrenCount: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2" />
                                    </motion.div>
                                 )}
                             </div>
                         </div>
                      )}
                   </div>
                   <button onClick={handleUpdateProfile} className="bg-zeina-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-zeina-200 hover:bg-zeina-700 transition-colors">Save Changes</button>
                </motion.div>
             )}
          </AnimatePresence>

          {/* Dashboard Tabs */}
          <div className="flex gap-8 border-b border-slate-200 mb-8">
             <button 
                onClick={() => setActiveTab('appointments')}
                className={`pb-4 text-sm font-bold relative ${activeTab === 'appointments' ? 'text-zeina-700' : 'text-slate-400'}`}
             >
                {user.role === 'expert' ? 'Booking Requests' : 'My Appointments'}
                {activeTab === 'appointments' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-zeina-600" />}
             </button>
             <button 
                onClick={() => setActiveTab('settings')}
                className={`pb-4 text-sm font-bold relative ${activeTab === 'settings' ? 'text-zeina-700' : 'text-slate-400'}`}
             >
                Settings
                {activeTab === 'settings' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-zeina-600" />}
             </button>
          </div>

          {/* Content */}
          {activeTab === 'appointments' && (
             <div className="space-y-4">
                {appointments.length === 0 ? (
                   <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                      <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
                      <p className="text-slate-500">No appointments found.</p>
                      {user.role === 'user' && (
                         <button onClick={() => navigate('/experts')} className="mt-4 text-zeina-600 font-bold hover:underline">Book a Consultation</button>
                      )}
                   </div>
                ) : (
                   appointments.map(appt => (
                      <div key={appt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
                         {/* Image of the OTHER party */}
                         <img 
                           src={user.role === 'expert' ? "https://via.placeholder.com/150" : appt.expertImage} 
                           alt="Avatar" 
                           className="w-16 h-16 rounded-full object-cover" 
                         />
                         
                         <div className="flex-grow text-center md:text-left">
                            <h4 className="font-bold text-slate-900 text-lg">
                               {user.role === 'expert' ? `Patient Consultation (ID: ${appt.userId})` : `Consultation with ${appt.expertName}`}
                            </h4>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm text-slate-500">
                               <span className="flex items-center gap-1"><Calendar size={14}/> {appt.date}</span>
                               <span className="flex items-center gap-1"><Clock size={14}/> {appt.time}</span>
                               <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                                  appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                                  appt.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                                  'bg-red-100 text-red-700'
                               }`}>
                                  {appt.status}
                               </span>
                            </div>
                         </div>

                         {/* Actions */}
                         <div className="flex gap-3">
                            {appt.status === 'confirmed' && (
                               <button 
                                 onClick={() => navigate(`/consultation/${appt.id}`)}
                                 className="bg-zeina-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-zeina-700 shadow-lg shadow-zeina-200"
                               >
                                  <Video size={16} /> Join Live Call
                               </button>
                            )}

                            {user.role === 'expert' && appt.status === 'pending' && (
                               <>
                                  <button onClick={() => handleStatusChange(appt.id, 'confirmed')} className="bg-green-600 text-white p-2.5 rounded-xl hover:bg-green-700" title="Accept">
                                     <CheckCircle size={20} />
                                  </button>
                                  <button onClick={() => handleStatusChange(appt.id, 'rejected')} className="bg-red-100 text-red-600 p-2.5 rounded-xl hover:bg-red-200" title="Reject">
                                     <XCircle size={20} />
                                  </button>
                               </>
                            )}

                            {appt.status !== 'cancelled' && appt.status !== 'rejected' && appt.status !== 'completed' && (
                               <button onClick={() => handleStatusChange(appt.id, 'cancelled')} className="border border-slate-200 text-slate-500 px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                                  Cancel
                               </button>
                            )}
                         </div>
                      </div>
                   ))
                )}
             </div>
          )}

          {activeTab === 'settings' && (
             <div className="bg-white p-8 rounded-3xl border border-slate-100">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Settings size={20}/> Account Settings</h3>
                <div className="space-y-4 max-w-md">
                   <div className="flex justify-between items-center py-3 border-b border-slate-50">
                      <span className="text-slate-600">Email Notifications</span>
                      <div className="w-10 h-6 bg-zeina-600 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div></div>
                   </div>
                   <div className="flex justify-between items-center py-3 border-b border-slate-50">
                      <span className="text-slate-600">SMS Reminders</span>
                      <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div></div>
                   </div>
                   <button className="text-red-600 font-bold text-sm mt-4 hover:underline">Delete Account</button>
                </div>
             </div>
          )}
       </div>
    </div>
  );
};

export default Profile;

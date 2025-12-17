import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, MessageCircle, Share2, MoreHorizontal, CheckCircle, Calendar, Plus, Filter, X, HelpCircle, MessageSquare, AlertTriangle, Shield, Trash2, Slash, Flag } from 'lucide-react';
import { COMMUNITY_GROUPS, COMMUNITY_POSTS, UPCOMING_EVENTS } from '../constants';
import { CommunityPost } from '../types';

const Community: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState('Feed');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [joinedGroups, setJoinedGroups] = useState<string[]>(
    COMMUNITY_GROUPS.filter(g => g.isJoined).map(g => g.id)
  );
  
  // Data State
  const [posts, setPosts] = useState<CommunityPost[]>(COMMUNITY_POSTS);
  const [bannedUsers, setBannedUsers] = useState<string[]>([]);
  
  // Admin / Moderation State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState<string | null>(null); // Post ID to report

  // New Post Form State
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostGroup, setNewPostGroup] = useState(COMMUNITY_GROUPS[0].name);
  const [newPostType, setNewPostType] = useState<'discussion' | 'question'>('discussion');

  // --- Logic ---

  // Filter Logic
  const filteredPosts = posts.filter(post => {
    // Exclude deleted posts
    if (post.isHidden) return false;
    // Exclude banned users
    if (bannedUsers.includes(post.authorName)) return false;

    // Admin View: Show only reported posts
    if (isAdminMode) {
       return post.isReported;
    }

    // 1. Filter by Group selection
    if (selectedGroup && post.group !== selectedGroup) return false;

    // 2. Filter by Tab
    if (activeTab === 'Expert Q&A') {
      return post.type === 'question' || post.hasExpertReply;
    }
    if (activeTab === 'My Posts') {
      return post.authorName === 'You'; // Simulating current user
    }
    
    // Default 'Feed' shows everything
    return true;
  });

  const toggleJoinGroup = (groupId: string) => {
    setJoinedGroups(prev => 
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    if (bannedUsers.includes('You')) {
       alert("You have been banned from posting in the community.");
       setIsCreateModalOpen(false);
       return;
    }

    const newPost: CommunityPost = {
      id: `new_${Date.now()}`,
      authorName: 'You', // Current user
      timeAgo: 'Just now',
      group: newPostGroup,
      content: newPostContent,
      likes: 0,
      comments: 0,
      type: newPostType,
      tags: ['New']
    };

    setPosts([newPost, ...posts]);
    setIsCreateModalOpen(false);
    setNewPostContent('');
    setActiveTab('Feed'); 
    setSelectedGroup(null);
  };

  // --- Moderation Functions ---

  const handleReportPost = (postId: string, reason: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, isReported: true, reportReason: reason } : p
    ));
    setReportModalOpen(null);
    setActiveMenuPostId(null);
    alert("Post has been reported to the moderators.");
  };

  const handleAdminAction = (action: 'keep' | 'delete' | 'ban', post: CommunityPost) => {
    if (action === 'keep') {
       // Clear report flag
       setPosts(prev => prev.map(p => p.id === post.id ? { ...p, isReported: false, reportReason: undefined } : p));
    } else if (action === 'delete') {
       // Hide post and clear report
       setPosts(prev => prev.map(p => p.id === post.id ? { ...p, isHidden: true, isReported: false } : p));
    } else if (action === 'ban') {
       // Ban user, hide all their posts
       if (confirm(`Are you sure you want to ban ${post.authorName}?`)) {
          setBannedUsers(prev => [...prev, post.authorName]);
          setPosts(prev => prev.map(p => p.id === post.id ? { ...p, isReported: false } : p)); // Clear report just to clean up view
       }
    }
  };

  // --- Render ---

  return (
    <div className="pt-12 pb-20 bg-warm-50/50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 pb-8 pt-4 px-6 mb-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-end gap-6"
          >
            <div>
              <span className="text-zeina-600 font-bold uppercase tracking-wider text-xs">The Zeina Circle</span>
              <h1 className="text-4xl font-serif font-bold text-slate-900 mt-2">Community Hub</h1>
              <p className="text-slate-500 mt-2 max-w-xl">
                A safe space for women to connect, share experiences, and get insights from our certified experts.
              </p>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto items-center">
               {/* Admin Toggle (Demo Only) */}
               <button 
                 onClick={() => setIsAdminMode(!isAdminMode)}
                 className={`px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-2 ${
                    isAdminMode ? 'bg-red-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                 }`}
               >
                  <Shield size={14} /> {isAdminMode ? 'Mod Mode ON' : 'Mod Mode OFF'}
               </button>

              {!isAdminMode && (
                 <>
                   <div className="relative flex-grow md:flex-grow-0 hidden sm:block">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                     <input 
                       type="text" 
                       placeholder="Search topics..." 
                       className="w-full md:w-56 bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zeina-200"
                     />
                   </div>
                   <button 
                     onClick={() => setIsCreateModalOpen(true)}
                     className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-zeina-700 transition-colors flex items-center gap-2 shadow-lg"
                   >
                     <Plus size={18} /> <span className="hidden sm:inline">Create Post</span>
                   </button>
                 </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT SIDEBAR: GROUPS (Hidden in Admin Mode) */}
        {!isAdminMode && (
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-28">
              <h3 className="font-bold font-serif text-lg mb-4 text-slate-900">Your Circles</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setSelectedGroup(null)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors mb-2 ${
                    selectedGroup === null ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Posts
                </button>
                {COMMUNITY_GROUPS.map((group) => {
                  const isJoined = joinedGroups.includes(group.id);
                  return (
                    <div key={group.id} className={`group relative rounded-xl transition-colors ${
                       selectedGroup === group.name ? 'bg-zeina-50' : 'hover:bg-slate-50'
                    }`}>
                      <button 
                        onClick={() => setSelectedGroup(group.name)}
                        className="w-full flex items-center gap-3 p-3 text-left"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          selectedGroup === group.name ? 'bg-zeina-200 text-zeina-800' : 'bg-slate-50 text-slate-500'
                        }`}>
                          <group.icon size={20} />
                        </div>
                        <div className="flex-grow">
                          <div className={`font-semibold text-sm ${
                            selectedGroup === group.name ? 'text-zeina-900' : 'text-slate-800'
                          }`}>{group.name}</div>
                          <div className="text-xs text-slate-400">{group.members} members</div>
                        </div>
                      </button>
                      <button 
                         onClick={(e) => { e.stopPropagation(); toggleJoinGroup(group.id); }}
                         className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-1 rounded-md border transition-all ${
                           isJoined 
                             ? 'border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200' 
                             : 'border-zeina-600 text-zeina-600 hover:bg-zeina-600 hover:text-white'
                         }`}
                      >
                         {isJoined ? 'Joined' : 'Join'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* CENTER: FEED */}
        <div className={isAdminMode ? "col-span-12 lg:col-span-12" : "lg:col-span-6 space-y-6"}>
          
          {/* Admin Dashboard Header */}
          {isAdminMode ? (
             <div className="bg-red-50 border border-red-100 rounded-3xl p-6 mb-6 flex justify-between items-center">
                <div>
                   <h2 className="text-2xl font-serif font-bold text-red-900 flex items-center gap-2">
                      <Shield /> Moderation Dashboard
                   </h2>
                   <p className="text-red-700 mt-1">Review flagged content and take action.</p>
                </div>
                <div className="flex gap-4 text-center">
                   <div className="bg-white p-3 rounded-xl border border-red-100 shadow-sm">
                      <div className="text-2xl font-bold text-red-600">{posts.filter(p => p.isReported && !p.isHidden).length}</div>
                      <div className="text-xs text-slate-500 uppercase font-bold">Pending</div>
                   </div>
                   <div className="bg-white p-3 rounded-xl border border-red-100 shadow-sm">
                      <div className="text-2xl font-bold text-slate-900">{bannedUsers.length}</div>
                      <div className="text-xs text-slate-500 uppercase font-bold">Banned</div>
                   </div>
                </div>
             </div>
          ) : (
             /* User Mode Filters */
             <>
               <div className="lg:hidden flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                 <button onClick={() => setSelectedGroup(null)} className={`flex-shrink-0 border px-4 py-2 rounded-full text-sm font-medium ${selectedGroup === null ? 'bg-slate-900 text-white' : 'bg-white border-slate-200'}`}>All</button>
                 {COMMUNITY_GROUPS.map(g => (
                   <button key={g.id} onClick={() => setSelectedGroup(g.name)} className={`flex-shrink-0 border px-4 py-2 rounded-full text-sm font-medium ${selectedGroup === g.name ? 'bg-zeina-600 text-white' : 'bg-white border-slate-200'}`}>{g.name}</button>
                 ))}
               </div>

               <div className="flex items-center gap-4 border-b border-slate-200 pb-2 mb-4">
                  {['Feed', 'Expert Q&A', 'My Posts'].map(tab => (
                    <button 
                      key={tab} onClick={() => setActiveTab(tab)}
                      className={`pb-2 text-sm font-medium transition-colors relative ${activeTab === tab ? 'text-zeina-700 font-bold' : 'text-slate-500'}`}
                    >
                      {tab}
                      {activeTab === tab && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-zeina-600 rounded-full" />}
                    </button>
                  ))}
                  <div className="ml-auto"><button className="text-slate-400 hover:text-slate-700"><Filter size={18} /></button></div>
               </div>
             </>
          )}

          {/* Posts List */}
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredPosts.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-slate-400 bg-white rounded-3xl border border-slate-100">
                   {isAdminMode ? <CheckCircle size={48} className="mx-auto mb-4 text-green-500" /> : <MessageCircle size={48} className="mx-auto mb-4 opacity-20" />}
                   <p>{isAdminMode ? "All clean! No pending reports." : "No posts found in this section yet."}</p>
                   {!isAdminMode && <button onClick={() => setIsCreateModalOpen(true)} className="text-zeina-600 font-bold mt-2 hover:underline">Start a conversation</button>}
                </motion.div>
              ) : (
                filteredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative ${
                       isAdminMode ? 'border-l-4 border-l-red-500' : ''
                    }`}
                  >
                     {/* Admin Banner for Reported Post */}
                     {isAdminMode && post.isReported && (
                        <div className="mb-4 bg-red-50 p-3 rounded-xl flex items-start gap-3">
                           <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
                           <div>
                              <span className="font-bold text-red-800 text-sm">Reported for: {post.reportReason}</span>
                              <div className="flex gap-3 mt-3">
                                 <button onClick={() => handleAdminAction('keep', post)} className="bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100">Ignore Report</button>
                                 <button onClick={() => handleAdminAction('delete', post)} className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200 flex items-center gap-1"><Trash2 size={12}/> Delete Post</button>
                                 <button onClick={() => handleAdminAction('ban', post)} className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-black flex items-center gap-1"><Slash size={12}/> Ban User</button>
                              </div>
                           </div>
                        </div>
                     )}

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${post.authorName === 'You' ? 'bg-zeina-600' : 'bg-slate-300'}`}>
                           {post.authorName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{post.authorName}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="text-xs text-slate-400">{post.timeAgo}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-xs text-zeina-600 font-medium bg-zeina-50 px-2 py-0.5 rounded-full">{post.group}</span>
                             {post.type === 'question' && (
                                <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1"><HelpCircle size={10} /> Question</span>
                             )}
                          </div>
                        </div>
                      </div>
                      
                      {!isAdminMode && (
                         <div className="relative">
                           <button onClick={() => setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id)} className="text-slate-300 hover:text-slate-600 p-1">
                              <MoreHorizontal size={20} />
                           </button>
                           {activeMenuPostId === post.id && (
                              <div className="absolute right-0 top-8 bg-white rounded-xl shadow-xl border border-slate-100 py-2 w-40 z-10">
                                 <button onClick={() => setReportModalOpen(post.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                    <Flag size={14} /> Report Post
                                 </button>
                              </div>
                           )}
                         </div>
                      )}
                    </div>

                    <p className="text-slate-700 leading-relaxed mb-4">{post.content}</p>

                    {post.tags && (
                       <div className="flex gap-2 mb-4">
                          {post.tags.map(tag => <span key={tag} className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md">#{tag}</span>)}
                       </div>
                    )}

                    {post.hasExpertReply && (
                      <div className="bg-lavender-50 border border-lavender-100 rounded-xl p-3 mb-4 flex items-start gap-3">
                         <div className="bg-lavender-100 p-1 rounded-full mt-0.5"><CheckCircle size={14} className="text-lavender-600" /></div>
                         <div>
                            <div className="text-xs font-bold text-lavender-700 uppercase tracking-wide">Doctor Verified Reply</div>
                            <p className="text-xs text-slate-600 mt-0.5"><span className="font-semibold">{post.expertReplierName}</span> answered this question.</p>
                         </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors text-sm group"><Heart size={18} className="group-hover:fill-current" /> {post.likes}</button>
                        <button className="flex items-center gap-2 text-slate-500 hover:text-zeina-600 transition-colors text-sm"><MessageCircle size={18} /> {post.comments}</button>
                      </div>
                      <button className="text-slate-400 hover:text-slate-700"><Share2 size={18} /></button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT SIDEBAR: EVENTS & TRENDING (Hidden in Admin Mode) */}
        {!isAdminMode && (
           <div className="hidden lg:block lg:col-span-3 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-28">
                 <h3 className="font-bold font-serif text-lg mb-6 text-slate-900">Upcoming Live AMA</h3>
                 <div className="space-y-6">
                    {UPCOMING_EVENTS.map(event => (
                       <div key={event.id} className="relative pl-4 border-l-2 border-zeina-200">
                          <div className="text-xs text-zeina-600 font-bold mb-1 uppercase flex items-center gap-1"><Calendar size={12} /> {event.date} • {event.time}</div>
                          <h4 className="font-bold text-slate-800 text-sm leading-tight mb-2">{event.title}</h4>
                          <p className="text-xs text-slate-500 mb-2">with {event.expertName}</p>
                          <div className="flex items-center gap-2">
                             <div className="flex -space-x-2">
                                {[1,2,3].map(i => <div key={i} className="w-5 h-5 rounded-full bg-slate-200 border border-white" />)}
                             </div>
                             <span className="text-[10px] text-slate-400">+{event.attendees} going</span>
                          </div>
                          <button className="mt-3 w-full bg-slate-50 text-slate-700 text-xs font-bold py-2 rounded-lg hover:bg-slate-900 hover:text-white transition-colors">Remind Me</button>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="bg-gradient-to-br from-zeina-500 to-zeina-700 rounded-3xl p-6 text-white shadow-lg">
                 <h3 className="font-serif font-bold text-xl mb-2">Invite a Friend</h3>
                 <p className="text-white/80 text-sm mb-4">Know someone who would love Zeina? Invite them to join the circle.</p>
                 <button className="bg-white text-zeina-700 px-4 py-2 rounded-full text-sm font-bold w-full hover:bg-zeina-50 transition-colors">Copy Invite Link</button>
              </div>
           </div>
        )}
      </div>

      {/* CREATE POST MODAL */}
      <AnimatePresence>
         {isCreateModalOpen && (
            <>
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50" onClick={() => setIsCreateModalOpen(false)} />
               <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 50 }} className="fixed inset-0 m-auto max-w-lg h-fit bg-white rounded-3xl p-8 z-50 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-2xl font-serif font-bold text-slate-900">Create Post</h2>
                     <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full"><X size={20} /></button>
                  </div>
                  <div className="space-y-4">
                     <div className="flex gap-4 mb-2">
                        <button onClick={() => setNewPostType('discussion')} className={`flex-1 py-2 rounded-xl text-sm font-bold flex justify-center items-center gap-2 border transition-colors ${newPostType === 'discussion' ? 'bg-zeina-50 border-zeina-200 text-zeina-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}><MessageSquare size={16} /> Discussion</button>
                        <button onClick={() => setNewPostType('question')} className={`flex-1 py-2 rounded-xl text-sm font-bold flex justify-center items-center gap-2 border transition-colors ${newPostType === 'question' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}><HelpCircle size={16} /> Ask Expert</button>
                     </div>
                     <textarea value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} placeholder={newPostType === 'question' ? "Type your question for our medical experts..." : "Share your thoughts with the community..."} className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-zeina-200 resize-none" />
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Select Circle</label>
                        <select value={newPostGroup} onChange={(e) => setNewPostGroup(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zeina-200">{COMMUNITY_GROUPS.map(g => (<option key={g.id} value={g.name}>{g.name}</option>))}</select>
                     </div>
                     <div className="pt-4 flex justify-end gap-3">
                        <button onClick={() => setIsCreateModalOpen(false)} className="px-6 py-2.5 rounded-xl font-medium text-slate-500 hover:bg-slate-50">Cancel</button>
                        <button onClick={handleCreatePost} disabled={!newPostContent.trim()} className="bg-slate-900 text-white px-8 py-2.5 rounded-xl font-medium hover:bg-zeina-700 transition-colors disabled:opacity-50">Post</button>
                     </div>
                  </div>
               </motion.div>
            </>
         )}
      </AnimatePresence>
      
      {/* REPORT MODAL */}
      <AnimatePresence>
         {reportModalOpen && (
            <>
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50" onClick={() => setReportModalOpen(null)} />
               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 m-auto max-w-sm h-fit bg-white rounded-3xl p-6 z-50 shadow-2xl">
                  <h3 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><Flag className="text-red-500" /> Report Post</h3>
                  <p className="text-sm text-slate-500 mb-4">Why are you reporting this post?</p>
                  <div className="space-y-2 mb-6">
                     {['Spam or Advertising', 'Harassment or Hate Speech', 'Misinformation', 'Inappropriate Content'].map(reason => (
                        <button key={reason} onClick={() => handleReportPost(reportModalOpen, reason)} className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-red-50 hover:text-red-700 transition-colors text-sm font-medium">
                           {reason}
                        </button>
                     ))}
                  </div>
                  <button onClick={() => setReportModalOpen(null)} className="w-full text-center text-slate-400 text-sm hover:text-slate-600">Cancel</button>
               </motion.div>
            </>
         )}
      </AnimatePresence>
    </div>
  );
};

export default Community;
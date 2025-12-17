
import { Users, Stethoscope, BookOpen, Heart, Sparkles, Calendar, Activity, MessageCircle, Baby, Sun } from 'lucide-react';
import { Expert, Service, Article, CommunityGroup, CommunityPost, CommunityEvent, Course, Bundle, QuizQuestion } from './types';
import { Language } from './translations';

export const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Community', path: '/community' },
  { label: 'Ask Zeina', path: '/ask-zeina' },
  { label: 'Services', path: '/services' },
  { label: 'Experts', path: '/experts' },
  { label: 'Tools', path: '/tools' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

// High-quality, warm, approachable Arab woman avatar
export const ZEINA_AVATAR = "https://images.unsplash.com/photo-1596245195341-b33a7f275fdb?auto=format&fit=crop&q=80&w=200";

// --- ENGLISH DATA ---
const EXPERTS_EN: Expert[] = [
  {
    id: '1',
    name: 'Dr. Fatima Al-Otaibi',
    title: 'Consultant Dermatologist',
    // Soft lighting, professional lab coat, beige hijab
    image: 'https://images.unsplash.com/photo-1631217868269-df46c6373109?auto=format&fit=crop&q=80&w=400', 
    category: 'Skin',
    rating: 4.9,
    price: 300,
  },
  {
    id: '2',
    name: 'Dr. Noura Al-Qahtani',
    title: 'Clinical Nutritionist',
    // Fresh, modern setting
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    category: 'Nutrition',
    rating: 4.8,
    price: 250,
  },
  {
    id: '3',
    name: 'Dr. Reem Al-Saud',
    title: 'Hair Transplant Specialist',
    // Professional, clean aesthetics
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    category: 'Hair',
    rating: 5.0,
    price: 450,
  },
  {
    id: '4',
    name: 'Dr. Sarah Al-Harbi',
    title: 'Cosmetic Dentist',
    // Warm smile, dental context
    image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=400',
    category: 'Dental',
    rating: 4.9,
    price: 350,
  },
  {
    id: '5',
    name: 'Dr. Amal Al-Jaber',
    title: 'Gynecology Consultant',
    // Trusted, experienced look
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471bc6e?auto=format&fit=crop&q=80&w=400',
    category: 'Gynecology',
    rating: 5.0,
    price: 400,
  },
  {
    id: '6',
    name: 'Dr. Layla Al-Amri',
    title: 'Aesthetic Dermatologist',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    category: 'Skin',
    rating: 4.7,
    price: 280,
  }
];

const SERVICES_EN: Service[] = [
  {
    id: 's1',
    title: 'Personalized Guidance',
    description: 'Daily health insights and symptom understanding tailored to your unique body profile.',
    icon: Sparkles,
    link: '/services',
    rating: 4.8,
    reviewCount: 1240
  },
  {
    id: 's2',
    title: 'Expert Consultations',
    description: 'Connect directly with certified specialists in Skin, Dental, Gynecology, and more.',
    icon: Stethoscope,
    link: '/experts',
    rating: 4.9,
    reviewCount: 890
  },
  {
    id: 's3',
    title: 'Educational Hub',
    description: 'Access a wealth of science-based articles, guides, and tips for your well-being.',
    icon: BookOpen,
    link: '/blog',
    rating: 4.7,
    reviewCount: 560
  },
];

const ARTICLES_EN: Article[] = [
  {
    id: '1',
    title: 'Skincare Routines for the Saudi Climate',
    category: 'Skin Care',
    date: 'October 5, 2025',
    // High aesthetic desert/skin texture
    image: 'https://images.unsplash.com/photo-1556228720-1957be849976?auto=format&fit=crop&q=80&w=800',
    excerpt: 'Protecting your skin barrier against dry heat and AC exposure is essential for radiance.',
    isPremium: false,
  },
  {
    id: '2',
    title: 'Balanced Nutrition During Ramadan',
    category: 'Nutrition',
    date: 'October 4, 2025',
    // Dates, cinematic lighting
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&q=80&w=800',
    excerpt: 'How to maintain energy levels and hydration while fasting, according to our nutritionists.',
    isPremium: true,
  },
  {
    id: '3',
    title: 'Understanding Hormonal Health',
    category: 'Gynecology',
    date: 'October 3, 2025',
    // Soft, feminine abstract
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
    excerpt: 'Dr. Amal explains the signs of hormonal imbalance and when to see a specialist.',
    isPremium: true,
  },
];

const COURSES_EN: Course[] = [
  {
    id: 'c1',
    title: 'Prenatal Yoga & Wellness',
    description: 'A complete guide to staying active and relaxed during pregnancy with safe, modified yoga flows.',
    instructor: 'Aisha Al-Yousef',
    price: 199,
    image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=800',
    modules: 4,
    duration: '4h 30m',
    level: 'Beginner',
    isPremium: true,
    sessions: [
      { id: 's1', title: 'Introduction to Prenatal Yoga', duration: '15:00', isFree: true, videoUrl: 'https://media.istockphoto.com/id/1367508718/video/pregnant-woman-doing-yoga.mp4?s=mp4-640x640-is&k=20&c=sample' },
      { id: 's2', title: 'First Trimester Flow', duration: '45:00', isFree: false },
      { id: 's3', title: 'Breathing Techniques', duration: '30:00', isFree: false },
      { id: 's4', title: 'Relaxation & Meditation', duration: '20:00', isFree: false }
    ]
  },
  {
    id: 'c2',
    title: 'Newborn Care Essentials',
    description: 'Everything you need to know about the first 3 months: feeding, sleeping, and bonding.',
    instructor: 'Dr. Amal Al-Jaber',
    price: 249,
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=800',
    modules: 5,
    duration: '6h',
    level: 'Beginner',
    isPremium: true,
    sessions: [
      { id: 's1', title: 'Welcoming Your Baby', duration: '10:00', isFree: true, videoUrl: 'https://media.istockphoto.com/id/1152206689/video/mother-holding-newborn-baby.mp4?s=mp4-640x640-is&k=20&c=sample' },
      { id: 's2', title: 'Breastfeeding Basics', duration: '40:00', isFree: false },
      { id: 's3', title: 'Sleep Schedules', duration: '35:00', isFree: false },
      { id: 's4', title: 'Diapering & Hygiene', duration: '25:00', isFree: false },
      { id: 's5', title: 'Postpartum Recovery', duration: '50:00', isFree: false }
    ]
  },
  {
    id: 'c3',
    title: 'Skincare Science 101',
    description: 'Understand ingredients, build your routine, and treat common skin concerns.',
    instructor: 'Dr. Fatima Al-Otaibi',
    price: 149,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
    modules: 3,
    duration: '3h',
    level: 'Intermediate',
    isPremium: false,
    sessions: [
      { id: 's1', title: 'Skin Types Explained', duration: '20:00', isFree: true, videoUrl: 'https://media.istockphoto.com/id/1296684705/video/woman-applying-cream.mp4?s=mp4-640x640-is&k=20&c=sample' },
      { id: 's2', title: 'Active Ingredients Guide', duration: '45:00', isFree: false },
      { id: 's3', title: 'Building a Routine', duration: '30:00', isFree: false }
    ]
  }
];

const BUNDLES_EN: Bundle[] = [
  {
    id: 'b1',
    title: 'New Mom Package',
    description: 'Complete preparation for motherhood. Includes Prenatal Yoga and Newborn Care courses.',
    price: 349,
    originalPrice: 448,
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800',
    coursesCount: 2,
    features: ['Lifetime Access', 'Certificate of Completion', 'Downloadable Guides']
  }
];

const HEALTH_QUIZ_EN: QuizQuestion[] = [
  {
    id: 1,
    category: 'Nutrition',
    question: 'How would you describe your daily water intake?',
    options: [
      { text: 'I rarely drink water (Less than 2 cups)', score: 0 },
      { text: 'I try, but often forget (3-4 cups)', score: 1 },
      { text: 'I drink regularly (6-8 cups)', score: 2 },
      { text: 'I stay very hydrated (8+ cups)', score: 3 }
    ]
  },
  {
    id: 2,
    category: 'Fitness',
    question: 'How often do you engage in physical activity?',
    options: [
      { text: 'Rarely / Sedentary lifestyle', score: 0 },
      { text: 'Light walking once or twice a week', score: 1 },
      { text: 'Moderate exercise 3 times a week', score: 2 },
      { text: 'Active daily (Gym, Yoga, etc.)', score: 3 }
    ]
  },
  {
    id: 3,
    category: 'Mental',
    question: 'How do you usually handle stress?',
    options: [
      { text: 'I feel overwhelmed and anxious', score: 0 },
      { text: 'I struggle but manage eventually', score: 1 },
      { text: 'I take breaks or talk to someone', score: 2 },
      { text: 'I use mindfulness/meditation techniques', score: 3 }
    ]
  },
  {
    id: 4,
    category: 'Nutrition',
    question: 'How many servings of fruits/vegetables do you eat daily?',
    options: [
      { text: 'None or very few', score: 0 },
      { text: '1-2 servings', score: 1 },
      { text: '3-4 servings', score: 2 },
      { text: '5 or more servings', score: 3 }
    ]
  },
  {
    id: 5,
    category: 'Mental',
    question: 'How is your sleep quality?',
    options: [
      { text: 'Poor (Insomnia or frequent waking)', score: 0 },
      { text: 'Inconsistent', score: 1 },
      { text: 'Generally good (6-7 hours)', score: 2 },
      { text: 'Excellent and restful (7-8 hours)', score: 3 }
    ]
  }
];

// --- ARABIC DATA ---
const EXPERTS_AR: Expert[] = [
  {
    id: '1',
    name: 'د. فاطمة العتيبي',
    title: 'استشارية جلدية',
    image: 'https://images.unsplash.com/photo-1631217868269-df46c6373109?auto=format&fit=crop&q=80&w=400',
    category: 'Skin',
    rating: 4.9,
    price: 300,
  },
  {
    id: '2',
    name: 'د. نورة القحطاني',
    title: 'أخصائية تغذية علاجية',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    category: 'Nutrition',
    rating: 4.8,
    price: 250,
  },
  {
    id: '3',
    name: 'د. ريم آل سعود',
    title: 'أخصائية زراعة الشعر',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    category: 'Hair',
    rating: 5.0,
    price: 450,
  },
  {
    id: '4',
    name: 'د. سارة الحربي',
    title: 'طبيبة أسنان تجميلية',
    image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=400',
    category: 'Dental',
    rating: 4.9,
    price: 350,
  },
  {
    id: '5',
    name: 'د. أمل الجابر',
    title: 'استشارية نساء وولادة',
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471bc6e?auto=format&fit=crop&q=80&w=400',
    category: 'Gynecology',
    rating: 5.0,
    price: 400,
  },
  {
    id: '6',
    name: 'د. ليلى العمري',
    title: 'أخصائية تجميل وليزر',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    category: 'Skin',
    rating: 4.7,
    price: 280,
  }
];

const SERVICES_AR: Service[] = [
  {
    id: 's1',
    title: 'توجيه صحي شخصي',
    description: 'رؤى صحية يومية وفهم للأعراض مصممة خصيصاً لملفك الصحي الفريد.',
    icon: Sparkles,
    link: '/services',
    rating: 4.8,
    reviewCount: 1240
  },
  {
    id: 's2',
    title: 'استشارات الخبراء',
    description: 'تواصلي مباشرة مع أخصائيات معتمدات في الجلدية، الأسنان، النساء والولادة، والمزيد.',
    icon: Stethoscope,
    link: '/experts',
    rating: 4.9,
    reviewCount: 890
  },
  {
    id: 's3',
    title: 'المركز التعليمي',
    description: 'اكتشفي ثروة من المقالات العلمية، الأدلة، والنصائح لتعزيز عافيتك.',
    icon: BookOpen,
    link: '/blog',
    rating: 4.7,
    reviewCount: 560
  },
];

const ARTICLES_AR: Article[] = [
  {
    id: '1',
    title: 'روتين العناية بالبشرة للمناخ السعودي',
    category: 'Skin Care',
    date: '5 أكتوبر 2025',
    image: 'https://images.unsplash.com/photo-1556228720-1957be849976?auto=format&fit=crop&q=80&w=800',
    excerpt: 'حماية حاجز بشرتك ضد الحرارة الجافة وتكييف الهواء أمر ضروري للنضارة.',
    isPremium: false,
  },
  {
    id: '2',
    title: 'التغذية المتوازنة خلال شهر رمضان',
    category: 'Nutrition',
    date: '4 أكتوبر 2025',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&q=80&w=800',
    excerpt: 'كيفية الحفاظ على مستويات الطاقة والترطيب أثناء الصيام، وفقاً لأخصائيات التغذية لدينا.',
    isPremium: true,
  },
  {
    id: '3',
    title: 'فهم الصحة الهرمونية',
    category: 'Gynecology',
    date: '3 أكتوبر 2025',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
    excerpt: 'د. أمل تشرح علامات الاختلال الهرموني ومتى يجب زيارة الأخصائي.',
    isPremium: true,
  },
];

const COURSES_AR: Course[] = [
  {
    id: 'c1',
    title: 'يوغا الحمل والعافية',
    description: 'دليل كامل للحفاظ على النشاط والاسترخاء أثناء الحمل مع تمارين يوغا آمنة ومعدلة.',
    instructor: 'عائشة اليوسف',
    price: 199,
    image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=800',
    modules: 4,
    duration: '4 ساعات',
    level: 'مبتدئ',
    isPremium: true,
    sessions: [
      { id: 's1', title: 'مقدمة في يوغا الحمل', duration: '15:00', isFree: true, videoUrl: 'https://media.istockphoto.com/id/1367508718/video/pregnant-woman-doing-yoga.mp4?s=mp4-640x640-is&k=20&c=sample' },
      { id: 's2', title: 'تمارين الثلث الأول', duration: '45:00', isFree: false },
      { id: 's3', title: 'تقنيات التنفس', duration: '30:00', isFree: false },
      { id: 's4', title: 'الاسترخاء والتأمل', duration: '20:00', isFree: false }
    ]
  },
  {
    id: 'c2',
    title: 'أساسيات العناية بالمولود الجديد',
    description: 'كل ما تحتاجين معرفته عن الأشهر الثلاثة الأولى: الرضاعة، النوم، والترابط.',
    instructor: 'د. أمل الجابر',
    price: 249,
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=800',
    modules: 5,
    duration: '6 ساعات',
    level: 'مبتدئ',
    isPremium: true,
    sessions: [
      { id: 's1', title: 'الترحيب بمولودك الجديد', duration: '10:00', isFree: true, videoUrl: 'https://media.istockphoto.com/id/1152206689/video/mother-holding-newborn-baby.mp4?s=mp4-640x640-is&k=20&c=sample' },
      { id: 's2', title: 'أساسيات الرضاعة', duration: '40:00', isFree: false },
      { id: 's3', title: 'جدول النوم', duration: '35:00', isFree: false },
      { id: 's4', title: 'النظافة وتغيير الحفاض', duration: '25:00', isFree: false },
      { id: 's5', title: 'التعافي بعد الولادة', duration: '50:00', isFree: false }
    ]
  },
  {
    id: 'c3',
    title: 'علم العناية بالبشرة 101',
    description: 'افهمي المكونات، وابني روتينك، وعالجي مشاكل البشرة الشائعة.',
    instructor: 'د. فاطمة العتيبي',
    price: 149,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
    modules: 3,
    duration: '3 ساعات',
    level: 'متوسط',
    isPremium: false,
    sessions: [
      { id: 's1', title: 'أنواع البشرة', duration: '20:00', isFree: true, videoUrl: 'https://media.istockphoto.com/id/1296684705/video/woman-applying-cream.mp4?s=mp4-640x640-is&k=20&c=sample' },
      { id: 's2', title: 'دليل المكونات النشطة', duration: '45:00', isFree: false },
      { id: 's3', title: 'بناء الروتين', duration: '30:00', isFree: false }
    ]
  }
];

const BUNDLES_AR: Bundle[] = [
  {
    id: 'b1',
    title: 'باقة الأم الجديدة',
    description: 'استعداد كامل للأمومة. تشمل دورات يوغا الحمل والعناية بالمولود.',
    price: 349,
    originalPrice: 448,
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800',
    coursesCount: 2,
    features: ['وصول مدى الحياة', 'شهادة إتمام', 'أدلة قابلة للتحميل']
  }
];

const HEALTH_QUIZ_AR: QuizQuestion[] = [
  {
    id: 1,
    category: 'Nutrition',
    question: 'كيف تصفين كمية شربك للماء يومياً؟',
    options: [
      { text: 'نادراً ما أشرب الماء (أقل من كوبين)', score: 0 },
      { text: 'أحاول لكن أنسى (3-4 أكواب)', score: 1 },
      { text: 'أشرب بانتظام (6-8 أكواب)', score: 2 },
      { text: 'ممتاز جداً (أكثر من 8 أكواب)', score: 3 }
    ]
  },
  {
    id: 2,
    category: 'Fitness',
    question: 'كم مرة تمارسين النشاط البدني؟',
    options: [
      { text: 'نادراً / نمط حياة خامل', score: 0 },
      { text: 'مشي خفيف مرة أو مرتين أسبوعياً', score: 1 },
      { text: 'رياضة متوسطة 3 مرات أسبوعياً', score: 2 },
      { text: 'نشطة يومياً (جيم، يوغا، إلخ)', score: 3 }
    ]
  },
  {
    id: 3,
    category: 'Mental',
    question: 'كيف تتعاملين عادة مع التوتر؟',
    options: [
      { text: 'أشعر بالإرهاق والقلق الشديد', score: 0 },
      { text: 'أعاني قليلاً ولكن أتدبر الأمر', score: 1 },
      { text: 'آخذ استراحة أو أتحدث مع شخص ما', score: 2 },
      { text: 'أستخدم تقنيات التأمل والاسترخاء', score: 3 }
    ]
  },
  {
    id: 4,
    category: 'Nutrition',
    question: 'كم حصة من الفواكه والخضروات تتناولين يومياً؟',
    options: [
      { text: 'قليل جداً أو لا شيء', score: 0 },
      { text: 'حصة إلى حصتين', score: 1 },
      { text: '3-4 حصص', score: 2 },
      { text: '5 حصص أو أكثر', score: 3 }
    ]
  },
  {
    id: 5,
    category: 'Mental',
    question: 'كيف هي جودة نومك؟',
    options: [
      { text: 'سيئة (أرق أو استيقاظ متكرر)', score: 0 },
      { text: 'غير منتظمة', score: 1 },
      { text: 'جيدة بشكل عام (6-7 ساعات)', score: 2 },
      { text: 'ممتازة ومريحة (7-8 ساعات)', score: 3 }
    ]
  }
];

// --- HELPER FUNCTIONS ---

export const EXPERTS = EXPERTS_EN; // Default export for compatibility
export const SERVICES = SERVICES_EN;
export const ARTICLES = ARTICLES_EN;

export const getExperts = (lang: Language): Expert[] => lang === 'ar' ? EXPERTS_AR : EXPERTS_EN;
export const getServices = (lang: Language): Service[] => lang === 'ar' ? SERVICES_AR : SERVICES_EN;
export const getArticles = (lang: Language): Article[] => lang === 'ar' ? ARTICLES_AR : ARTICLES_EN;
export const getCourses = (lang: Language): Course[] => lang === 'ar' ? COURSES_AR : COURSES_EN;
export const getBundles = (lang: Language): Bundle[] => lang === 'ar' ? BUNDLES_AR : BUNDLES_EN;
export const getHealthQuiz = (lang: Language): QuizQuestion[] => lang === 'ar' ? HEALTH_QUIZ_AR : HEALTH_QUIZ_EN;

// --- Community Data (Shared for now, can be localized similarly) ---
export const COMMUNITY_GROUPS: CommunityGroup[] = [
  { id: '1', name: 'Pregnancy Journey', description: 'Support for expecting mothers', members: 1250, icon: Baby, isJoined: true },
  { id: '2', name: 'Skincare Enthusiasts', description: 'Reviews, tips & routines', members: 3400, icon: Sun, isJoined: false },
  { id: '3', name: 'Mental Wellness', description: 'A safe space to breathe', members: 890, icon: Heart, isJoined: true },
  { id: '4', name: 'Healthy Eating', description: 'Recipes & nutrition tips', members: 2100, icon: Activity, isJoined: false },
];

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'p1',
    authorName: 'Hana K.',
    timeAgo: '2 hours ago',
    group: 'Skincare Enthusiasts',
    content: 'Has anyone tried the new hydration treatment at Dr. Fatima\'s clinic? My skin has been so dry with this Riyadh weather lately!',
    likes: 24,
    comments: 8,
    type: 'question',
    hasExpertReply: true,
    expertReplierName: 'Dr. Fatima Al-Otaibi',
    tags: ['Hydration', 'Clinic Review']
  },
  {
    id: 'p2',
    authorName: 'Anonymous',
    timeAgo: '4 hours ago',
    group: 'Pregnancy Journey',
    content: 'I am in my third trimester and experiencing severe back pain. Are there any safe exercises I can do at home?',
    likes: 56,
    comments: 15,
    type: 'question',
    tags: ['Third Trimester', 'Fitness']
  },
];

export const UPCOMING_EVENTS: CommunityEvent[] = [
  {
    id: 'e1',
    title: 'Live Q&A: Postpartum Hair Loss',
    expertName: 'Dr. Reem Al-Saud',
    date: 'Oct 25',
    time: '08:00 PM',
    attendees: 342
  },
];

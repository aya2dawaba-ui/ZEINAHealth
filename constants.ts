import { Users, Shield, Heart, Terminal, Zap, Cpu, Code, Server, Globe, Search, Lock, Stethoscope, BookOpen, Smile } from 'lucide-react';
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

export const ZEINA_AVATAR = "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=200";

const EXPERTS_EN: Expert[] = [
  {
    id: '1',
    name: 'Dr. Sarah Al-Fayed',
    title: 'Senior Dermatologist',
    image: 'https://images.unsplash.com/photo-1594824476969-23362a2fb2bc?auto=format&fit=crop&q=80&w=400', 
    category: 'Skin',
    rating: 5.0,
    price: 350,
  },
  {
    id: '2',
    name: 'Dr. Emily Chen',
    title: 'Clinical Nutritionist',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    category: 'Nutrition',
    rating: 4.9,
    price: 280,
  },
  {
    id: '3',
    name: 'Dr. Nora Mansour',
    title: 'Women\'s Health Specialist',
    image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=400',
    category: 'Gynecology',
    rating: 4.8,
    price: 450,
  }
];

const SERVICES_EN: Service[] = [
  {
    id: 's1',
    title: 'AI Wellness Guidance',
    description: 'Autonomous health suggestions and wellness auditing powered by Zeina Assistant.',
    icon: Heart,
    link: '/services',
    rating: 5.0,
    reviewCount: 4200
  },
  {
    id: 's2',
    title: 'Expert Consultations',
    description: 'Secure video sessions with dedicated medical specialists for health review.',
    icon: Stethoscope,
    link: '/experts',
    rating: 4.9,
    reviewCount: 1540
  },
  {
    id: 's3',
    title: 'Health Education',
    description: 'Evidence-based health documentation and whitepapers for maximum wellness.',
    icon: BookOpen,
    link: '/blog',
    rating: 4.7,
    reviewCount: 980
  },
];

const ARTICLES_EN: Article[] = [
  {
    id: '1',
    title: 'The Impact of Nutrition on Hormonal Balance',
    category: 'Nutrition',
    date: 'Oct 20, 2025',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800',
    excerpt: 'Deep dive into how your diet affects endocrine health and cycle regularity.',
    isPremium: true,
  }
];

const HEALTH_QUIZ_EN: QuizQuestion[] = [
  {
    id: 1,
    category: 'Nutrition',
    question: 'How many servings of leafy greens do you consume daily?',
    options: [
      { text: '0-1 servings', score: 0 },
      { text: '2 servings', score: 1 },
      { text: '3 servings', score: 2 },
      { text: '4+ servings', score: 3 }
    ]
  },
  {
    id: 2,
    category: 'Fitness',
    question: 'How often do you engage in physical activity?',
    options: [
      { text: 'Rarely', score: 0 },
      { text: '1-2 times a week', score: 1 },
      { text: '3-4 times a week', score: 2 },
      { text: 'Daily', score: 3 }
    ]
  },
  {
    id: 3,
    category: 'Mental',
    question: 'Do you practice mindfulness or meditation?',
    options: [
      { text: 'Never', score: 0 },
      { text: 'Occasionally', score: 1 },
      { text: 'Weekly', score: 2 },
      { text: 'Daily', score: 3 }
    ]
  }
];

export const EXPERTS = EXPERTS_EN;
export const SERVICES = SERVICES_EN;
export const ARTICLES = ARTICLES_EN;

export const getExperts = (lang: Language): Expert[] => EXPERTS_EN;
export const getServices = (lang: Language): Service[] => SERVICES_EN;
export const getArticles = (lang: Language): Article[] => ARTICLES_EN;
export const getCourses = (lang: Language): Course[] => [];
export const getBundles = (lang: Language): Bundle[] => [];
export const getHealthQuiz = (lang: Language): QuizQuestion[] => HEALTH_QUIZ_EN;

export const COMMUNITY_GROUPS: CommunityGroup[] = [
  { id: '1', name: 'Maternal Health', description: 'Pregnancy and postpartum support', members: 4200, icon: Users, isJoined: true },
  { id: '2', name: 'Nutrition & Wellness', description: 'Healthy lifestyle tips', members: 3100, icon: Heart, isJoined: false },
];

export const COMMUNITY_POSTS: CommunityPost[] = [];
export const UPCOMING_EVENTS: CommunityEvent[] = [];
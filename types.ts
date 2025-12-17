
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
}

export type UserRole = 'user' | 'expert' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  isEmailVerified?: boolean;
  
  // User Profile Data for AI Customization
  age?: number;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  lifeStage?: 'general' | 'tryingToConceive' | 'pregnant' | 'postpartum' | 'menopause';
  childrenCount?: number;
  healthInterests?: string[];
  activityLevel?: 'sedentary' | 'moderate' | 'active';

  // Period Tracking Data
  cycleLength?: number; // Average length (e.g., 28 days)
  periodDuration?: number; // How long bleeding lasts (e.g., 5 days)
  lastPeriodDate?: string; // YYYY-MM-DD
  isTryingToConceive?: boolean; // Kept for backward compatibility, though lifeStage covers it

  // Expert specific
  specialization?: string;
  isVerified?: boolean;
  licenseNumber?: string;
  experience?: string;
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  image: string;
  category: 'Skin' | 'Hair' | 'Nutrition' | 'Dental' | 'Gynecology';
  rating: number;
  price: number;
  // Backend fields
  email?: string;
  isVerified?: boolean;
  availability?: string[]; // e.g., ["Monday", "Tuesday"]
}

export interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
  id?: string;
  rating?: number;
  reviewCount?: number;
}

export interface Review {
  id: string;
  itemId: string; // Expert ID or Service ID
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  isPremium?: boolean;
}

export interface CourseSession {
  id: string;
  title: string;
  duration: string;
  isFree?: boolean;
  videoUrl?: string; // Mock URL
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  image: string;
  modules: number;
  duration: string;
  level: string;
  isPremium?: boolean;
  sessions?: CourseSession[];
}

export interface Bundle {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  coursesCount: number;
  features: string[];
}

export interface BookingDetails {
  id: string;
  userId: string; // The patient
  expertId: string; // The doctor
  expertName: string;
  expertImage: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
  meetingLink?: string; // For video consultation
  notes?: string;
  createdAt: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  // UI Payloads
  bookingDetails?: BookingDetails; 
  cancellationDetails?: BookingDetails; 
  appointmentList?: BookingDetails[]; 
  generatedImage?: string; // Base64 string for AI generated images
}

// Community Types
export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  icon: LucideIcon;
  isJoined?: boolean;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar?: string; 
  timeAgo: string;
  group: string; 
  content: string;
  likes: number;
  comments: number;
  type: 'discussion' | 'question'; 
  hasExpertReply?: boolean;
  expertReplierName?: string;
  tags?: string[];
  isReported?: boolean;
  reportReason?: string;
  isHidden?: boolean; 
}

export interface CommunityEvent {
  id: string;
  title: string;
  expertName: string;
  date: string;
  time: string;
  attendees: number;
}

export interface QuizQuestion {
  id: number;
  category: 'Nutrition' | 'Fitness' | 'Mental';
  question: string;
  options: { text: string; score: number }[];
}


import { User, Expert, BookingDetails, Review } from '../types';
import { EXPERTS } from '../constants';

// --- Local Storage Keys ---
const USERS_KEY = 'zeina_users';
const APPOINTMENTS_KEY = 'zeina_appointments';
const EXPERTS_KEY = 'zeina_experts';
const CURRENT_USER_KEY = 'zeina_current_user';
const REVIEWS_KEY = 'zeina_reviews';

// --- Initialization (Seeding) ---
const initializeStorage = () => {
  if (!localStorage.getItem(EXPERTS_KEY)) {
    localStorage.setItem(EXPERTS_KEY, JSON.stringify(EXPERTS));
  }
  if (!localStorage.getItem(USERS_KEY)) {
    // Create a mock user for testing
    const mockUser: User = {
      id: 'u_demo',
      name: 'Amira Ahmed',
      email: 'user@demo.com',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
      healthInterests: ['Skincare', 'Nutrition'],
      isEmailVerified: true
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([mockUser]));
  }
};

initializeStorage();

// --- Services ---

export const StorageService = {
  // Auth
  login: async (email: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: User) => u.email === email);
    
    // In a real app, verify password hash. Here we just accept if user exists.
    // For demo purposes, we accept any password for valid emails.
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    throw new Error('Invalid credentials');
  },

  register: async (userData: Partial<User>, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    if (users.find((u: User) => u.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: `u_${Date.now()}`,
      role: 'user', // default
      name: userData.name || 'New User',
      email: userData.email!,
      avatar: userData.avatar,
      healthInterests: userData.healthInterests || [],
      isEmailVerified: false,
      ...userData
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  updateProfile: async (userId: string, updates: Partial<User>): Promise<User> => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const index = users.findIndex((u: User) => u.id === userId);
    
    if (index !== -1) {
      const updatedUser = { ...users[index], ...updates };
      users[index] = updatedUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Update session if it's current user
      const currentUser = StorageService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      }
      return updatedUser;
    }
    throw new Error('User not found');
  },

  verifyEmail: async (userId: string, code: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // For demo purposes, check against a hardcoded code "123456"
    if (code === '123456') {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const index = users.findIndex((u: User) => u.id === userId);
      
      if (index !== -1) {
        users[index].isEmailVerified = true;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        
        // Update current session if applicable
        const currentUser = StorageService.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          currentUser.isEmailVerified = true;
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
        }
        return true;
      }
    }
    return false;
  },

  // Appointments
  createAppointment: async (booking: Omit<BookingDetails, 'id' | 'createdAt' | 'status'>): Promise<BookingDetails> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const appointments = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
    const newBooking: BookingDetails = {
      id: `appt_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      meetingLink: 'https://zoom.us/j/placeholder', // Mock link
      ...booking
    };

    appointments.push(newBooking);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
    return newBooking;
  },

  getAppointmentsForUser: (userId: string): BookingDetails[] => {
    const appointments = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
    return appointments.filter((a: BookingDetails) => a.userId === userId).reverse();
  },

  getAppointmentsForExpert: (expertId: string): BookingDetails[] => {
    const appointments = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
    return appointments.filter((a: BookingDetails) => a.expertId === expertId).reverse();
  },

  getAppointmentById: (apptId: string): BookingDetails | undefined => {
    const appointments = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
    return appointments.find((a: BookingDetails) => a.id === apptId);
  },

  updateAppointmentStatus: async (apptId: string, status: BookingDetails['status']): Promise<void> => {
    const appointments = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
    const index = appointments.findIndex((a: BookingDetails) => a.id === apptId);
    
    if (index !== -1) {
      appointments[index].status = status;
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
    }
  },

  updateAppointment: async (apptId: string, updates: Partial<BookingDetails>): Promise<BookingDetails> => {
    const appointments = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
    const index = appointments.findIndex((a: BookingDetails) => a.id === apptId);
    
    if (index !== -1) {
      const updatedAppt = { ...appointments[index], ...updates };
      appointments[index] = updatedAppt;
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
      return updatedAppt;
    }
    throw new Error('Appointment not found');
  },

  // Reviews & Ratings
  addReview: async (review: Omit<Review, 'id' | 'date'>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
    const newReview: Review = {
      id: `rev_${Date.now()}`,
      date: new Date().toISOString(),
      ...review
    };
    reviews.push(newReview);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  },

  getReviews: (itemId: string): Review[] => {
    const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
    return reviews.filter((r: Review) => r.itemId === itemId);
  },

  getAverageRating: (itemId: string, initialRating: number = 0, initialCount: number = 0): { rating: number, count: number } => {
    const reviews = StorageService.getReviews(itemId);
    if (reviews.length === 0) return { rating: initialRating, count: initialCount };
    
    const totalScore = (initialRating * initialCount) + reviews.reduce((sum: number, r: Review) => sum + r.rating, 0);
    const totalCount = initialCount + reviews.length;
    return { rating: parseFloat((totalScore / totalCount).toFixed(1)), count: totalCount };
  }
};

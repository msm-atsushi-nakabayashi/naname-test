export type UserRole = 'admin' | 'mentor' | 'mentee';

export interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  invitedBy?: string;
  invitedAt?: Date;
  createdAt: Date;
  avatarUrl?: string;
}

export interface MentorProfile {
  id: string;
  userId: string;
  user: User;
  selfIntroduction: string;
  skills: string[];
  specialties: string[];
  experience: string;
  recommendations: Recommendation[];
  rating: number;
  reviewCount: number;
  points: number;
  rank: MentorRank;
  availableForFlash: boolean;
  availableForLongTerm: boolean;
}

export interface Recommendation {
  id: string;
  mentorId: string;
  authorId: string;
  author: User;
  content: string;
  isApproved: boolean;
  createdAt: Date;
}

export type MentorRank = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface MentoringSession {
  id: string;
  mentorId: string;
  menteeId: string;
  mentor: MentorProfile;
  mentee: User;
  type: 'long-term' | 'flash';
  status: 'pending' | 'approved' | 'ongoing' | 'completed' | 'cancelled';
  scheduledAt?: Date;
  duration?: number; // in minutes
  notes?: SessionNote[];
  review?: Review;
  createdAt: Date;
}

export interface SessionNote {
  id: string;
  sessionId: string;
  content: string;
  lastEditedBy: string;
  lastEditedAt: Date;
  createdAt: Date;
}

export interface Review {
  id: string;
  sessionId: string;
  mentorId: string;
  menteeId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: User;
  tags: string[];
  likes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  token: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
}

export interface Schedule {
  id: string;
  mentorId: string;
  dayOfWeek: number; // 0-6 (Sun-Sat)
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isAvailable: boolean;
}
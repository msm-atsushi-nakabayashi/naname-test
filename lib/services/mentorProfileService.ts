import { MentorProfile } from '@/lib/types';
import { mockMentorProfiles } from '@/lib/data/mock';

class MentorProfileService {
  private profiles: Map<string, MentorProfile> = new Map();

  constructor() {
    // Initialize with mock data
    mockMentorProfiles.forEach(profile => {
      this.profiles.set(profile.id, profile);
    });
  }

  getAllMentorProfiles(): MentorProfile[] {
    return Array.from(this.profiles.values());
  }

  getMentorProfile(id: string): MentorProfile | undefined {
    return this.profiles.get(id);
  }

  updateMentorProfile(id: string, updatedProfile: MentorProfile): MentorProfile {
    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  updateMentorAvatar(mentorId: string, avatarUrl: string): boolean {
    const mentor = this.profiles.get(mentorId);
    if (!mentor) return false;

    const updatedMentor = {
      ...mentor,
      user: {
        ...mentor.user,
        avatarUrl
      }
    };

    this.profiles.set(mentorId, updatedMentor);
    return true;
  }

  searchMentors(query: string): MentorProfile[] {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.profiles.values()).filter(mentor =>
      mentor.user.name.toLowerCase().includes(lowercaseQuery) ||
      mentor.skills.some(skill => skill.toLowerCase().includes(lowercaseQuery)) ||
      mentor.specialties.some(specialty => specialty.toLowerCase().includes(lowercaseQuery))
    );
  }

  getMentorsByRank(rank: string): MentorProfile[] {
    return Array.from(this.profiles.values()).filter(mentor => mentor.rank === rank);
  }

  getTopMentors(limit: number = 5): MentorProfile[] {
    return Array.from(this.profiles.values())
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  getMentorStats(mentorId: string): {
    totalSessions: number;
    completedSessions: number;
    averageRating: number;
    totalMentees: number;
  } | null {
    const mentor = this.profiles.get(mentorId);
    if (!mentor) return null;

    return {
      totalSessions: mentor.sessionsCompleted,
      completedSessions: mentor.sessionsCompleted,
      averageRating: mentor.rating,
      totalMentees: mentor.mentees.length
    };
  }

  updateMentorRating(mentorId: string, newRating: number, reviewCount?: number): boolean {
    const mentor = this.profiles.get(mentorId);
    if (!mentor) return false;

    const updatedMentor = {
      ...mentor,
      rating: newRating,
      reviewCount: reviewCount || mentor.reviewCount
    };

    this.profiles.set(mentorId, updatedMentor);
    return true;
  }

  addMentorSkill(mentorId: string, skill: string): boolean {
    const mentor = this.profiles.get(mentorId);
    if (!mentor) return false;

    if (!mentor.skills.includes(skill)) {
      const updatedMentor = {
        ...mentor,
        skills: [...mentor.skills, skill]
      };
      this.profiles.set(mentorId, updatedMentor);
    }

    return true;
  }

  removeMentorSkill(mentorId: string, skill: string): boolean {
    const mentor = this.profiles.get(mentorId);
    if (!mentor) return false;

    const updatedMentor = {
      ...mentor,
      skills: mentor.skills.filter(s => s !== skill)
    };

    this.profiles.set(mentorId, updatedMentor);
    return true;
  }

  toggleMentorAvailability(mentorId: string, type: 'flash' | 'longTerm'): boolean {
    const mentor = this.profiles.get(mentorId);
    if (!mentor) return false;

    const updatedMentor = {
      ...mentor,
      [type === 'flash' ? 'availableForFlash' : 'availableForLongTerm']: 
        !mentor[type === 'flash' ? 'availableForFlash' : 'availableForLongTerm']
    };

    this.profiles.set(mentorId, updatedMentor);
    return true;
  }

  // Bulk operations
  updateMultipleMentors(updates: { id: string; changes: Partial<MentorProfile> }[]): boolean {
    try {
      updates.forEach(({ id, changes }) => {
        const mentor = this.profiles.get(id);
        if (mentor) {
          const updatedMentor = { ...mentor, ...changes };
          this.profiles.set(id, updatedMentor);
        }
      });
      return true;
    } catch (error) {
      console.error('Bulk update failed:', error);
      return false;
    }
  }

  // Export/Import functionality
  exportMentorProfiles(): string {
    const profiles = Array.from(this.profiles.values());
    return JSON.stringify(profiles, null, 2);
  }

  importMentorProfiles(jsonData: string): boolean {
    try {
      const profiles: MentorProfile[] = JSON.parse(jsonData);
      profiles.forEach(profile => {
        this.profiles.set(profile.id, profile);
      });
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }
}

export const mentorProfileService = new MentorProfileService();
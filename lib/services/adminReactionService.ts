import { AdminReaction } from '@/lib/types';

class AdminReactionService {
  private reactions: Map<string, AdminReaction> = new Map();

  saveReaction(sessionId: string, reactionData: Omit<AdminReaction, 'id' | 'createdAt' | 'updatedAt'>): AdminReaction {
    const existing = this.reactions.get(sessionId);
    const now = new Date();
    
    const reaction: AdminReaction = {
      id: existing?.id || `reaction_${Date.now()}`,
      ...reactionData,
      createdAt: existing?.createdAt || now,
      updatedAt: now
    };

    this.reactions.set(sessionId, reaction);
    return reaction;
  }

  getReaction(sessionId: string): AdminReaction | undefined {
    return this.reactions.get(sessionId);
  }

  getAllReactions(): AdminReaction[] {
    return Array.from(this.reactions.values());
  }

  deleteReaction(sessionId: string): boolean {
    return this.reactions.delete(sessionId);
  }

  getReactionsByAdmin(adminId: string): AdminReaction[] {
    return Array.from(this.reactions.values()).filter(r => r.adminId === adminId);
  }

  getAverageRating(): number {
    const reactions = Array.from(this.reactions.values());
    if (reactions.length === 0) return 0;
    
    const sum = reactions.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reactions.length) * 10) / 10;
  }

  getReactionStats(): {
    totalReactions: number;
    averageRating: number;
    tagFrequency: { [key: string]: number };
  } {
    const reactions = Array.from(this.reactions.values());
    const tagFrequency: { [key: string]: number } = {};
    
    reactions.forEach(reaction => {
      reaction.tags.forEach(tag => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });
    });

    return {
      totalReactions: reactions.length,
      averageRating: this.getAverageRating(),
      tagFrequency
    };
  }
}

export const adminReactionService = new AdminReactionService();
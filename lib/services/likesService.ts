interface LikesData {
  [articleId: string]: string[]; // articleId -> userIds[]
}

class LikesService {
  private readonly STORAGE_KEY = 'article_likes';

  private getLikesData(): LikesData {
    if (typeof window === 'undefined') return {};
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }

  private saveLikesData(data: LikesData): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  toggleLike(articleId: string, userId: string): boolean {
    const likesData = this.getLikesData();
    
    if (!likesData[articleId]) {
      likesData[articleId] = [];
    }

    const userIndex = likesData[articleId].indexOf(userId);
    let isLiked: boolean;

    if (userIndex === -1) {
      // Add like
      likesData[articleId].push(userId);
      isLiked = true;
    } else {
      // Remove like
      likesData[articleId].splice(userIndex, 1);
      isLiked = false;
    }

    this.saveLikesData(likesData);
    return isLiked;
  }

  isLiked(articleId: string, userId: string): boolean {
    const likesData = this.getLikesData();
    return likesData[articleId]?.includes(userId) || false;
  }

  getLikesCount(articleId: string): number {
    const likesData = this.getLikesData();
    return likesData[articleId]?.length || 0;
  }

  getAllLikes(): LikesData {
    return this.getLikesData();
  }

  getTotalLikesCount(): number {
    const likesData = this.getLikesData();
    return Object.values(likesData).reduce((total, likes) => total + likes.length, 0);
  }

  getMostLikedArticles(limit: number = 5): Array<{ articleId: string; count: number }> {
    const likesData = this.getLikesData();
    return Object.entries(likesData)
      .map(([articleId, likes]) => ({ articleId, count: likes.length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
}

export const likesService = new LikesService();
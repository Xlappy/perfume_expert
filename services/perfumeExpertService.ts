
import { Perfume, UserPreferences, Recommendation } from "../types";

export class PerfumeExpertService {
  /**
   * Local ranking algorithm for perfumes based on user preferences.
   */
  getRecommendations(
    items: Perfume[],
    preferences: UserPreferences,
    excludedIds: string[] = []
  ): Recommendation[] {
    const candidates = items.filter(item => {
      if (excludedIds.includes(item.id)) return false;

      // Price filter
      if (item.price > preferences.priceRange[1]) return false;

      // Gender filter
      if (preferences.preferredGender.length > 0 && !preferences.preferredGender.includes(item.gender)) return false;

      // Scent family filter
      if (preferences.likedFamilies.length > 0 && !preferences.likedFamilies.includes(item.scentFamily)) return false;
      if (preferences.dislikedFamilies.length > 0 && preferences.dislikedFamilies.includes(item.scentFamily)) return false;

      // Longevity filter
      if (preferences.minLongevity && item.longevity < preferences.minLongevity) return false;

      // Disliked notes filter
      const perfumeDataStr = [...item.topNotes, ...item.middleNotes, ...item.baseNotes, item.scentFamily, item.name].join(' ').toLowerCase();
      const hasDislikedNote = (preferences.dislikedNotes || []).some(note =>
        perfumeDataStr.includes(note.toLowerCase())
      );
      if (hasDislikedNote) return false;

      return true;
    });

    const scoredCandidates = candidates.map(item => {
      let score = 0;
      const dataStr = [...item.topNotes, ...item.middleNotes, ...item.baseNotes, item.brand, item.scentFamily].join(' ').toLowerCase();

      // 1. Favorite notes (Weight: +20 each)
      preferences.favoriteNotes.forEach(note => {
        if (dataStr.includes(note.toLowerCase())) {
          score += 20;
        }
      });

      // 2. Concentration preference (Weight: +25 if match)
      if (preferences.preferredConcentration && preferences.preferredConcentration.includes(item.concentration)) {
        score += 25;
      }

      // 3. Brand bonus
      if (preferences.preferredBrands && preferences.preferredBrands.length > 0) {
        if (preferences.preferredBrands.some(b => item.brand.toLowerCase().includes(b.toLowerCase()))) {
          score += 30;
        }
      }

      // 4. Sillage and Longevity bonus
      score += item.longevity * 5;
      score += item.sillage * 5;

      // Normalize score to 100% (approximate max score 150)
      const finalScore = Math.min(99, Math.round((score / 150) * 100));

      return { item, score: finalScore };
    });

    // Sort by descending relevance
    scoredCandidates.sort((a, b) => b.score - a.score);

    return scoredCandidates.map(res => ({
      perfumeId: res.item.id,
      explanation: this.generateExplanation(res.item, preferences, res.score),
      score: res.score
    }));
  }

  private generateExplanation(item: Perfume, prefs: UserPreferences, score: number): string {
    const matchedNotes = prefs.favoriteNotes.filter(n =>
      [...item.topNotes, ...item.middleNotes, ...item.baseNotes].some(note => note.toLowerCase().includes(n.toLowerCase()))
    );

    const longevityDescriptions: Record<number, string> = {
      1: 'тонкою та легкою',
      2: 'помірною',
      3: 'хорошою',
      4: 'тривалою',
      5: 'вражаючою'
    };

    const intro = score > 80
      ? `Цей аромат — ваше ідеальне втілення! `
      : score > 60
        ? `Чудовий вибір, що ідеально доповнить ваш образ. `
        : `Цікавий варіант з багатогранним звучанням. `;

    let analysis = `Цей ${item.scentFamily.toLowerCase()} аромат має ${longevityDescriptions[item.longevity] || 'приємну'} стійкість. `;

    if (matchedNotes.length > 0) {
      analysis += `Ви точно оціните ваші улюблені ноти: ${matchedNotes.slice(0, 3).join(', ')}. `;
    } else {
      analysis += `Вас може зацікавити поєднання ${item.topNotes.slice(0, 2).join(' та ')} у верхніх нотах. `;
    }

    const occasionDesc = item.occasion === 'Office' ? 'ділових зустрічей' :
      item.occasion === 'Date' ? 'романтичних вечорів' :
        item.occasion === 'Night' ? 'вечірніх виходів' : 'щоденного використання';

    const pairing = `Найкраще підходить для ${occasionDesc}.`;

    return `${intro}${analysis}${pairing}`;
  }
}

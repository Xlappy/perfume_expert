
export interface Perfume {
  id: string;
  name: string;
  brand: string;
  gender: 'Male' | 'Female' | 'Unisex';
  concentration: 'EDP' | 'EDT' | 'EDC' | 'Parfum' | 'Cologne' | 'Extrait';
  scentFamily: string;
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  longevity: number; // 1-5
  sillage: number; // 1-5
  intensity: number; // 1-5
  price: number;
  season: ('Spring' | 'Summer' | 'Autumn' | 'Winter')[];
  occasion: 'Day' | 'Night' | 'Office' | 'Date' | 'Special';
  image?: string;
}

export interface UserPreferences {
  likedFamilies: string[];
  dislikedFamilies: string[];
  priceRange: [number, number];
  preferredGender: string[];
  favoriteNotes: string[];
  dislikedNotes: string[];
  preferredBrands: string[];
  minLongevity: number;
  preferredConcentration: string[];
}

export interface Recommendation {
  perfumeId: string;
  explanation: string;
  score: number;
}

export type AppView = 'expert' | 'database' | 'favorites';

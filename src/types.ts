export interface Game {
  id: string;
  title: string;
  category: string;
  description: string;
  controls?: string;
  thumbnailColor?: string;
  thumbnailImage?: string;
  badge?: string;
  iframe: string;
  rating?: number;
  plays?: string;
  isCustom?: boolean;
}

export type CategoryFilter = 'All' | 'Arcade' | 'Puzzle' | 'Action' | 'Classic' | 'Runner' | 'Favorites';

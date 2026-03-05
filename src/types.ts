export interface Post {
  id: number;
  latitude: number;
  longitude: number;
  caption: string;
  timestamp: string;
  image_paths: string[];
  transportMode?: 'plane' | 'car' | 'bus' | 'motorbike' | 'boat' | 'walk' | 'train' | 'other';
}

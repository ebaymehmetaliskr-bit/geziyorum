export interface Location {
  province: string;
  district: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export type Category = string;

export interface TourListing {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  location: Location;
  coordinates: Coordinates;
  categories: Category[];
  tags: string[];
  price_try: number;
  display_price?: string;
  duration_days: number | string;
  rating: number;
  featured_image: string;
  gallery_images: string[];
  affiliate_link?: string;
}

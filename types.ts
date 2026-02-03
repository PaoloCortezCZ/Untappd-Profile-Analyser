export interface UntappdCheckin {
  beer_name: string;
  brewery_name: string;
  beer_type: string;
  beer_abv: number;
  beer_ibu: number;
  comment: string;
  venue_name: string | null;
  venue_city: string | null;
  venue_state: string | null;
  venue_country: string | null;
  venue_lat: number | null;
  venue_lng: number | null;
  rating_score: number;
  created_at: string;
  checkin_url: string;
  beer_url: string;
  brewery_url: string;
  brewery_country: string;
  brewery_city: string;
  brewery_state: string;
  flavor_profiles: string;
  purchase_venue: string;
  serving_type: string;
  checkin_id: number;
  bid: number;
  brewery_id: number;
  photo_url: string | null;
  global_rating_score: number;
  global_weighted_rating_score: number;
  tagged_friends: string;
  total_toasts: number;
  total_comments: number;
}

export type SortField = 'created_at' | 'rating_score' | 'beer_abv' | 'beer_name' | 'beer_ibu' | 'beer_type';
export type SortOrder = 'asc' | 'desc';

export interface ChartData {
  name: string;
  value: number;
}

export interface TimelineData {
  date: string;
  count: number;
  avgRating: number;
  checkins: UntappdCheckin[];
}

export interface TasteData {
  subject: string;
  A: number;
  fullMark: number;
}

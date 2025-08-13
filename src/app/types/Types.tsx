export interface Commission {
  id: string;
  title: string;
  description: string;
  price: number;
  artist: string;
  image_urls?: string[];
  pfp_url: string;
  rating: number;
  questions?: Question[];
  delivery_days: number;
}

export interface Question {
  id: number;
  type: 'short-answer' | 'paragraph' | 'multiple-choice' | 'checkboxes';
  question_text: string;
  options?: Option[];
  is_required: boolean;
}
export interface Option {
  option_text: string;
  id: number;
  question_id: number;
}

export interface Picture {
  pic: string;
  title: string;
}

export interface Review {
  userImage: string;
  userName: string;
  reviewText: string;
  rating: number;
  date: string;
}
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
export interface Answer {
  question_id: number;
  answer_text?: string;
  selected_option_id?: number | null;
  selected_option_ids?: number[] | null;
}

export interface CommissionRequest {
  status: string;
  payment: "Unpaid" | "Paid";
  submitted: string;
  client: string;
  commission_title: string;
  confirmed: string;
  description: string;
  reference_image_urls: string[] | null;
  submission_urls: string[] | null;
  answers: AnswerDisplay[];
}

export interface Service {
  id: string;
  title: string;
  price: string;
  description?: string;
  deliveryTime?: string;
  image_urls: string[];
  questions?: Question[];
}

export interface AnswerDisplay {
  question_text: string;
  type: 'short-answer' | 'paragraph' | 'multiple-choice' | 'checkboxes';
  answer_text?: string;
  selected_option?: string;
  selected_options?: string[];
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
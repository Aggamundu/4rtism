export interface Commission {
  id: string;
  title: string;
  description: string;
  price: number;
  artist: string;
  image_urls?: string[];
  pfp_url: string;
  rating: number;
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
type ReviewType = {
  id: number;
  created_at: string;
  reviewee: string;
  pfp_url: string;
  image: string;
  reviewer: string;
  comment: string;
  rating: number;
}

export default ReviewType;
type CommissionType = {
  id: number;
  created_at: string;
  user_id: string;
  client_id: string;
  client_name: string;
  email: string;
  title: string;
  description: string;
  price: number;
  status: string;
  dueDate: string;
  client: string;
  reference_images: string[];
  submission_images: string[];
  artist_name: string;
  delivery_days: number;
}

export default CommissionType;

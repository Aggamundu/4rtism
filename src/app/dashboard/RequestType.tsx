type RequestType = {
  id: number,
  created_at: string,
  title: string,
  name: string,
  description: string,
  reference_images: string[],
  email: string,
  user_id: string,
  client_id: string,
}

export default RequestType;
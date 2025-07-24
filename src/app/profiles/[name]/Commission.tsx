export default function Commission({ data }: { data: { title: string, type: string, price: string, description: string, images: string[], thumbnail: string, delivery_days: string } }) {
  const { title, type, price, description, images, thumbnail, delivery_days } = data;
  return <div className="flex flex-row">
    <img src={thumbnail} alt={title} width={100} height={100} />
    <p>{title}</p>
    <p>{type}</p>
    <p>{price}</p>
    <p>{description}</p>
  </div>
}
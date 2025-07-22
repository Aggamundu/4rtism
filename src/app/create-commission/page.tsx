'use client'
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { supabaseClient } from "../../../utils/supabaseClient";
import DeliveryDays from "./DeliveryDays";
import DescribeCommission from "./DescribeCommission";
import ImageInput from "./ImageInput";
import Price from "./Price";
import Title from "./Title";
import Type from "./Type";
type Form = {
  title: string;
  type: string;
  price: number;
  deliveryDays: number;
  description: string;
}
export default function CreateCommission() {
  const [form, setForm] = useState<Form>({
    title: '',
    type: '',
    price: 0,
    deliveryDays: 0,
    description: ''
  })
  const [firstImage, setFirstImage] = useState<File | null>(null);
  const [firstImagePreview, setFirstImagePreview] = useState<string>();
  const [secondImage, setSecondImage] = useState<File | null>(null);
  const [secondImagePreview, setSecondImagePreview] = useState<string>();
  const [thirdImage, setThirdImage] = useState<File | null>(null);
  const [thirdImagePreview, setThirdImagePreview] = useState<string>();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>();

  const uploadImages = async () => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    let files = [firstImage, secondImage, thirdImage]
    if (!files) return;
    const filePaths = files.map(f => user?.id + "/" + uuidv4());

    if (files[0]) {
      const { data, error } = await supabaseClient
        .storage
        .from('commissions')
        .upload(filePaths[0], files[0])

      if (data) {
        const { data: urlData } = supabaseClient
          .storage
          .from('commissions')
          .getPublicUrl(filePaths[0])

        console.log('Image URL:', urlData.publicUrl)
        setThumbnailUrl(urlData.publicUrl)
      }
      if (error) {
        alert(error.message)
      }
    }
    if (files[1]) {
      const { data, error } = await supabaseClient
        .storage
        .from('commissions')
        .upload(filePaths[1], files[1])

      if (data) {
        const { data: urlData } = supabaseClient
          .storage
          .from('commissions')
          .getPublicUrl(filePaths[1])

        setImageUrls([...imageUrls, urlData.publicUrl])
      }
      if (error) {
        alert(error.message)
      }
    }
    if (files[2]) {
      const { data, error } = await supabaseClient
        .storage
        .from('commissions')
        .upload(filePaths[2], files[2])

      if (data) {
        const { data: urlData } = supabaseClient
          .storage
          .from('commissions')
          .getPublicUrl(filePaths[2])

        setImageUrls([...imageUrls, urlData.publicUrl])
      }
      if (error) {
        alert(error.message)
      }
    }
  }
  const handleSubmit = async () => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const res = await fetch('/api/commissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user?.id,
        title: form.title,
        type: form.type,
        price: form.price,
        deliveryDays: form.deliveryDays,
        description: form.description,
        images: imageUrls,
        thumbnail: thumbnailUrl,
        delivery_days: form.deliveryDays,
      })
    })
    if (res.ok) {
      alert('Commission created successfully');
    } else {
      let error;
      if (res.headers.get('content-length') !== '0') {
        error = await res.json();
      } else {
        error = { error: 'Unknown error' };
      }
      console.log(error);
      alert("Error creating commission");
    }
  }


  return (
    <div className="w-[700px] mx-auto p-8 min-h-screen flex flex-col space-y-3">

      <Title form={form} setForm={setForm} />
      <Type form={form} setForm={setForm} />
      <Price form={form} setForm={setForm} />
      <DeliveryDays form={form} setForm={setForm} />
      <DescribeCommission form={form} setForm={setForm} />



      <div className="flex flex-col m-0">
        <p className="text-[14px] font-[700] m-0">Upload Images (Up to 3)</p>
      </div>
      <div className="flex flex-row gap-[10px]">
        <div>
          <ImageInput setImage={setFirstImage} setImagePreview={setFirstImagePreview} imagePreview={firstImagePreview} />
          {!firstImage && (
            <div className="text-[12px] m-0 text-red-400 text-center">
              Thumbnail Required
            </div>
          )}
        </div>

        <ImageInput setImage={setSecondImage} setImagePreview={setSecondImagePreview} imagePreview={secondImagePreview} />
        <ImageInput setImage={setThirdImage} setImagePreview={setThirdImagePreview} imagePreview={thirdImagePreview} />
      </div>
      <div className="flex flex-col justify-center items-center mt-8">
        <button
          className={form.title === '' || form.type === '' || form.price < 30 || form.deliveryDays === 0 || form.deliveryDays > 30 || form.description === ''
            ? "w-[200px] bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            : "w-[200px] bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          }
          disabled={
            form.title === '' ||
            form.type === '' ||
            form.price < 30 ||
            form.deliveryDays === 0 ||
            form.deliveryDays > 30 ||
            form.description === ''
          }
          onClick={async () => {
            await uploadImages().then(() => {
              handleSubmit();
            });
          }}
        >
          Create Commission
        </button>
        {(form.title === '' ||
            form.type === '' ||
            form.price < 30 ||
            form.deliveryDays === 0 ||
            form.deliveryDays > 30 ||
            form.description === '') && (
              <div className="text-xs text-gray-400">
                Please fill in all fields
              </div>
            )}
      </div>
    </div>
  )
}
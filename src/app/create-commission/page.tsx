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


  const uploadImages = async () => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    let files = [firstImage, secondImage, thirdImage]
    if (!files) return;
    const filePaths = files.map(f => user?.id + "/" + uuidv4());
    let uploadedUrls:string[] = [];
    let thumbnail = '';

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        const {data, error} = await supabaseClient.storage.from('commissions').upload(filePaths[i], file);
        if (data) {
          const {data: urlData} = await supabaseClient.storage.from('commissions').getPublicUrl(filePaths[i]);
          if (i === 0) {
            thumbnail = urlData.publicUrl;
          } else {uploadedUrls.push(urlData.publicUrl);
        }
        if (error) {
          console.error('Error uploading file:', error);
          return;
        }
      }
    }
  }
    return {
      thumbnail: thumbnail,
      images: uploadedUrls
    };
}

  const handleSubmit = async (thumbnail: string, images: string[]) => {
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
        images: images,
        thumbnail: thumbnail,
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
          className={!firstImage || form.title === '' || form.type === '' || form.price < 30 || form.deliveryDays === 0 || form.deliveryDays > 30 || form.description === ''
            ? "w-[200px] text-[14px] bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            : "w-[200px] text-[14px] bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          }
          disabled={
            !firstImage ||
            form.title === '' ||
            form.type === '' ||
            form.price < 30 ||
            form.deliveryDays === 0 ||
            form.deliveryDays > 30 ||
            form.description === ''
          }
          onClick={async () => {
            const result = await uploadImages();
            if (result) {
              const {thumbnail, images} = result;
              handleSubmit(thumbnail, images);
            }
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
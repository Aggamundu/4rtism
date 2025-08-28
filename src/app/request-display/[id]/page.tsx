'use client'
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../../../utils/supabaseClient";
import { Request } from "../../types/Types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

interface RequestDisplayPageProps {
  params: Promise<{
    id: number;
  }>;
}
export default function RequestDisplayPage({ params }: RequestDisplayPageProps) {
  const [request, setRequest] = useState<Request | null>(null);
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      const { id } = resolvedParams;
      getRequest(id);
    };

    getParams();
  }, [params]);


  const getRequest = async (id: number) => {
    const { data, error } = await supabaseClient.from('requests').select('*').eq('id', id).single();
    if (error) {
      console.error(error);
      return;
    }
    const requestData = {
      id: data.id,
      title: data.title,
      description: data.description,
      image_urls: data.image_urls,
      user_id: data.user_id
    } as Request
    setRequest(requestData);
    console.log(requestData.image_urls);
  }

  const handleSendMessage = async () => {
    if (!user?.id) {
      toast.error('Please login to send a message');
      return;
    }
    console.log(message);
    const { data, error } = await supabaseClient.from('messages').insert({
      sender_id: user.id,
      receiver_id: request?.user_id,
      content: message.trim(),
    })
    if (error) {
      console.error(error);
      return;
    }
    setMessage('');
    toast.success('Message sent');
  }

  return (
    <div className="flex flex-col pt-16 pb-[1%] min-h-screen items-center justify-center">
      <Header />
      <button
        onClick={() => window.history.back()}
        className="absolute top-14 left-4 text-white hover:text-gray-300 flex items-center gap-2 p-2 rounded-lg transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back
      </button>
      <div className="w-full max-w-md space-y-4">
      <textarea
          placeholder="I can draw this for you"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 bg-custom-darkgray border-2 border-custom-blue focus:bg-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="w-full flex items-center hover:text-white hover:bg-custom-blue hover:border-white justify-center gap-3 bg-white text-gray-900 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:text-black"
          disabled={message.trim() === ''}

        >
          Message
        </button>

        <div className="mb-3 w-full p-3 bg-custom-darkgray border-2 border-white focus:bg-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none">
          {request?.title}
        </div>
        <div className="mb-3 w-full p-3 bg-custom-darkgray border-2 border-white focus:bg-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none">
          {request?.description}
        </div>
                {/* Display uploaded images */}
        {request?.image_urls && request.image_urls.length > 0 && (
          <div className="mt-[1%]">
            <div className="grid grid-cols-3 gap-2 border-[1px] border-dashed border-custom-gray rounded-card p-custom">
              {request?.image_urls.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
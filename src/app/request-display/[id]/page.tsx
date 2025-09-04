'use client'
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { supabaseClient } from "../../../../utils/supabaseClient";
import { Request } from "../../types/Types";
import { useRouter } from "next/navigation";

interface RequestDisplayPageProps {
  params: Promise<{
    id: number;
  }>;
}
export default function RequestDisplayPage({ params }: RequestDisplayPageProps) {
  const [request, setRequest] = useState<Request | null>(null);
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      const { id } = resolvedParams;
      getRequest(id);
    };

    getParams();
  }, [params]);


  const getRequest = async (id: number) => {
    const { data, error } = await supabaseClient.from('requests').select('*, profiles(user_name, pfp_url)').eq('id', id).single();
    if (error) {
      console.error(error);
      return;
    }
    const requestData = {
      id: data.id,
      title: data.title,
      description: data.description,
      image_urls: data.image_urls,
      user_id: data.user_id,
      user_name: data.profiles.user_name,
      pfp_url: data.profiles.pfp_url
    } as Request
    setRequest(requestData);
    console.log(requestData.image_urls);
  }

  const handleSendMessage = async () => {
    if (!user?.id) {
      toast.error('Please login to send a message');
      return;
    }
    if (message.trim() === '') {
      setError('Message cannot be empty');
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
      setError('Error sending message');
      return;
    }
    setMessage('');
    setError('');
    toast.success('Message sent');
  }

  return (
    <div className="flex flex-col pt-16 pb-[1%] min-h-screen items-center justify-center">
      <Header/>
      <button
        onClick={() => window.history.back()}
        className="absolute top-14 left-4 text-white hover:text-gray-300 flex items-center gap-2 p-2 rounded-lg transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back
      </button>
      <div className="w-full max-w-md space-y-4 overflow-y-auto">
        <div className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.push(`/profile/${request?.user_name}`)}
        >
          <img src={request?.pfp_url} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          <h2 className="text-base">{request?.user_name}</h2>
        </div>
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
      <div className="mt-[2rem] max-w-md w-full flex flex-col gap-3">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <textarea
          placeholder={`Enter your message to ${request?.user_name} here`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 bg-custom-darkgray border-2 border-custom-lightgray focus:bg-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="w-full flex items-center hover:bg-custom-blue/90 justify-center gap-3 bg-custom-blue text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Message
        </button>
      </div>
    </div>
  );
}
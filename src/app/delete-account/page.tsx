"use client"
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { supabaseClient } from "../../../utils/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

export default function DeleteAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user, loading } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [confirmUsername, setConfirmUsername] = useState<string>("");
  const router = useRouter();
  const fetchUsername = async () => {
    const { data, error } = await supabaseClient.from('profiles').select('user_name').eq('id', user?.id).single();
    if (error) {
      setError(error.message);
    }
    console.log(data);
    setUsername(data?.user_name || "");
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading])

  useEffect(() => {
    fetchUsername();
  }, [user]);

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="flex flex-col min-h-[100vh] items-center justify-center p-6 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null; // This will trigger the useEffect to redirect
  }




  const handleDeleteAccount = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/delete-user`, {
      method: 'POST',
      body: JSON.stringify({ userId: user?.id })
    })
    if (response.ok) {
      // Sign out the user after successful account deletion
      await supabaseClient.auth.signOut();
      toast.success("Account deleted successfully", {
        duration: 3000
      });
      router.push('/')
    } else {
      setError("Failed to delete account");
    }
    setIsLoading(false);
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-custom">
      <Header />
      {isLoading ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-4">
          <div className="text-center">
            Enter your username to confirm deletion of your account
          </div>
          <input
            type="text"
            placeholder=""
            value={confirmUsername}
            onChange={(e) => setConfirmUsername(e.target.value)}
            className="mb-3 w-full p-3 bg-custom-darkgray border-2 border-white focus:bg-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none"
          />
          <button
            onClick={handleDeleteAccount}
            disabled={(confirmUsername !== username) || confirmUsername.length === 0}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 px-4 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 active:scale-95 transition-all duration-200"
          >
            Delete Account
          </button>
          <div className="text-red-500 text-sm text-center">This action is irreversible.</div>
        </div>
      )}
    </div>
  )
}
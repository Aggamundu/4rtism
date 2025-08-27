'use client'
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ActionPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const action = searchParams.get('action');

  const [isExpired, setIsExpired] = useState(false);
  const [isApproval, setIsApproval] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  console.log(token);

  const validateToken = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/get-responses?token=${token}`, {
        method: "GET",
      });

      const result = await response.json();

      // Check if the response contains an error
      if (result.error) {
        console.error("Token validation error:", result.error);
      } else {
        // Success case - the data is returned directly
        setResponse(result);
        setValidToken(true);
        checkExpiration(result);
        checkStatus(result);
        checkRejectionCount(result);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }
  const checkExpiration = (response: any) => {
    const expiresAt = new Date(response.expiresAt);
    const today = new Date();
    setIsExpired(expiresAt < today);
  }

  const checkStatus = (response: any) => {
    // Check if the response has a status field, or check responses.status
    const status = response.status || response.responses?.status;
    console.log(status);
    setIsApproval(status === "Approval");
    setIsCompleted(status === "Completed");
  }

  const checkRejectionCount = (response: any) => {
    const rejectionCount = response.rejection_count || response.responses?.rejection_count || 0;
    setIsRejected(rejectionCount >= 2);
  }

  useEffect(() => {
    validateToken();
  }, []);

  return (
    <div>
      {isLoading && (
        <div className="flex flex-col min-h-[100vh] items-center justify-center p-6 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      {isExpired && (
        <div className="flex flex-col min-h-[100vh] items-center justify-center p-6 gap-4">
          <h2 className="text-lg font-semibold text-red-600">Token Expired</h2>
          <p className="text-gray-600">This link has expired and is no longer valid.</p>
        </div>
      )}
      {!isApproval && !isCompleted && !isLoading && (
        <div className="flex flex-col min-h-[100vh] items-center justify-center p-6 gap-4">
          <h2 className="text-lg font-semibold text-green-600">Thank you for your response!</h2>
          <p className="text-gray-600">Your response has been recorded successfully.</p>
        </div>
      )}
      {!validToken && !isLoading && (
        <div className="flex flex-col min-h-[100vh] items-center justify-center p-6 gap-4">
          <h2 className="text-lg font-semibold text-red-600">Invalid token</h2>
          <p className="text-gray-600">This link is invalid</p>
        </div>
      )}
      {isCompleted && (
        <div className="flex flex-col min-h-[100vh] items-center justify-center p-6 gap-4">
          <h2 className="text-lg font-semibold text-green-600">Thank you for your response!</h2>
          <p className="text-gray-600">Your commission has been completed successfully.</p>
        </div>
      )}
      {validToken && !isExpired && isApproval && !isRejected && action === 'reject' && (
        <div className="flex flex-col min-h-[100vh] items-center justify-center p-6 gap-4">
          <h2 className="text-lg font-semibold">Reject Work</h2>
          <p className="text-gray-600">Please provide feedback for the artist</p>
          <textarea
            className="w-full max-w-lg p-3 border-2 border-white bg-custom-darkgray rounded-lg text-white focus:bg-white/10 focus:outline-none"
            rows={4}
            placeholder="Enter your feedback here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <p className="text-gray-600">You can reject up to 2 times. You have {2 - response?.responses?.rejection_count} rejections left.</p>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            onClick={async () => {
              try {
                setIsLoading(true);
                const fetchResponse = await fetch('/api/get-responses', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    token: searchParams.get('token'),
                    message: message,
                    action: 'reject',
                    rejections: response?.responses?.rejection_count
                  }),
                });

                if (fetchResponse.ok) {
                  window.location.reload();
                } else {
                  toast.error('Failed to reject work. Please try again.');
                }
              } catch (error) {
                toast.error('Failed to reject work. Please try again.');
              } finally {
                setIsLoading(false);
              }
            }}
          >
            Send Rejection
          </button>
        </div>
      )}
      {isRejected && validToken && !isExpired && isApproval && action === 'reject' && (
        <div className="flex flex-col min-h-[100vh] items-center justify-center p-6 gap-4">
          <h2 className="text-lg font-semibold">Max rejections reached</h2>
          <p className="text-gray-600">Please choose to accept the work or contact your artist if you have any issues.</p>
          
        </div>
      )}
      {((validToken && !isCompleted && !isExpired && isApproval && action === 'accept')) && (
        <div className="flex flex-col min-h-[100vh] items-center justify-center p-6 gap-4">
          <h2 className="text-lg font-semibold">Complete Commission</h2>
          <p className="text-gray-600">Please provide a rating for the artist</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="text-lg"
              >
                <span className={star <= rating ? "text-custom-yellow" : "text-custom-lightgray"}>
                  ★
                </span>
              </button>
            ))}
          </div>
          <input
            type="text"
            className="w-full max-w-lg p-3 border-2 border-white bg-custom-darkgray rounded-lg text-white focus:bg-white/10 focus:outline-none"
            placeholder="Enter your name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <textarea
            className="w-full max-w-lg p-3 border-2 border-white bg-custom-darkgray rounded-lg text-white focus:bg-white/10 focus:outline-none"
            rows={4}
            placeholder="Enter your review here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${username.trim() === ''
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-custom-accent text-white hover:bg-custom-accent/90'
              }`}
            disabled={username.trim() === ''}
            onClick={async () => {
              try {
                setIsLoading(true);
                const fetchResponse = await fetch('/api/get-responses', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    token: searchParams.get('token'),
                    message: message,
                    action: 'accept',
                    rating: rating,
                    username: username
                  }),
                });

                if (fetchResponse.ok) {
                  setIsCompleted(true);
                } else {
                  toast.error('Failed to complete commission. Please try again.');
                }
              } catch (error) {
                toast.error('Failed to complete commission. Please try again.');
              } finally {
                setIsLoading(false);
              }
            }}
          >
            Complete Commission
          </button>
        </div>
      )}
    </div>
  );
}
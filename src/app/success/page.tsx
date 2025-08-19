export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-custom-darkgray flex items-center justify-center p-4">
      <div className="bg-custom-gray rounded-lg shadow-md p-6 max-w-sm w-full text-center">
        <h1 className="text-lg font-semibold text-white mb-3">
          Thank you for your purchase!
        </h1>
        <p className="text-custom-lightgray">
          For questions, contact me at{" "}
          <a 
            // href="mailto:support@artcommissions.com"
            // className="text-custom-lightgray hover:text-custom-accent"
          >
            support@artcommissions.com
          </a>
        </p>
      </div>
    </div>
  );
}
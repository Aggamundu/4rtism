interface AboutProps {
  imageSrc: string;
  displayName: string;
  userName: string;
  bio: string;
}

export default function About({ imageSrc, displayName, userName, bio }: AboutProps) {
  return (
    <div className="flex w-full flex-row items-start justify-left gap-x-6 px-8 mt-[1rem] flex-wrap">
      <img src={imageSrc} alt="Profile" className="w-[10rem] h-[10rem] rounded-full border-2 border-black" />
      <div className="flex flex-col items-left justify-start text-left relative -top-2">
        <div className="flex items-center gap-4">          <div className="text-xl font-bold">{displayName}</div>
        </div>
        <div className="relative -top-2">
          <div className="flex flex-row items-center">
            <div className="text-base mb-0">@{userName}</div>
            <button className="bg-custom-gray w-8 h-8 justify-center text-white rounded-full hover:bg-opacity-80 transition-all flex items-center ml-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>

          <div className="text-sm text-custom-lightgray mb-0 relative top-1">{bio}</div>
        </div>
      </div>
    </div>
  );
}
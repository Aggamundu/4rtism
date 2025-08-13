import type { Question } from "../../../types/Types";

export default function Question({ question }: { question: Question }) {
  const { question_text, type, is_required, options } = question;

  if (type === 'short-answer' || type === 'paragraph') {
    return (
      <div className="mb-[1%]">
        <div className="py-[1%]">
          <span className="text-white text-sm font-medium">
            {question_text}
            {is_required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </div>
        {type === 'paragraph' ? (
          <textarea
            className="sm:w-[90%] w-[100%] bg-custom-gray text-white rounded-lg p-3 resize-none focus:outline-none"
            rows={4}
            placeholder="Enter your answer..."
          />
        ) : (
          <input
            type="text"
            className="sm:w-[90%] w-[100%] bg-custom-gray text-white rounded-lg p-3 focus:outline-none"
            placeholder="Enter your answer..."
          />
        )}
      </div>
    );
  }

  if (type === 'checkboxes') {
    return (
      <div className="mb-[1%]">
        <div className="py-[1%]">
          <span className="text-white text-sm font-medium">
            {question_text}
            {is_required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </div>
        <div className="space-y-2">
          {options?.map((option, index) => (
            <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="appearance-none w-4 h-4 bg-white border-2 rounded border-white checked:bg-custom-blue"
              />
              <span className="text-white text-sm">{option.option_text}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'multiple-choice') {
    return (
      <div className="mb-[1%]">
        <div className="py-[1%]">
          <span className="text-white text-sm font-medium">
            {question_text}
            {is_required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </div>
        <div className="space-y-2">
          {options?.map((option, index) => (
            <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name={`question-${question.id}`}
                className="w-4 h-4 appearance-none bg-white border-2 border-white rounded-full checked:bg-custom-blue"
              />
              <span className="text-white text-sm">{option.option_text}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Question</h1>
    </div>
  );
}
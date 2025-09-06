import { useEffect, useState } from 'react';
import { Question } from '../../../types/Types';

interface CreateFormProps {
  onQuestionChange?: (questions: Question[], deletedIds?: string[]) => void;
  value?: Question[];
}

export default function CreateForm({ onQuestionChange, value }: CreateFormProps) {
  const [questions, setQuestions] = useState<Question[]>(value || []);
  const [deletedQuestionIds, setDeletedQuestionIds] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: 0,
    question_text: '',
    type: 'short-answer',
    is_required: false,
    options: []
  });
  useEffect(() => {
    if (value) {
      setQuestions(value);
      setDeletedQuestionIds([]); // Clear deleted questions when value changes
    }
  }, [value]);

  const questionTypes = [
    { value: 'short-answer', label: 'Short answer', icon: '📝' },
    { value: 'paragraph', label: 'Paragraph', icon: '📄' },
    { value: 'multiple-choice', label: 'Multiple choice', icon: '⭕' },
    { value: 'checkboxes', label: 'Checkboxes', icon: '☑️' }
  ];

  const addQuestion = () => {
    if (currentQuestion.question_text.trim()) {
      const newQuestion = {
        ...currentQuestion,
        id: Date.now()
      };
      const updatedQuestions = [...questions, newQuestion];
      setQuestions(updatedQuestions);
      setCurrentQuestion({
        id: 0,
        question_text: '',
        type: 'short-answer',
        is_required: false,
        options: []
      });
      onQuestionChange?.(updatedQuestions, deletedQuestionIds);
    }
  };

  const updateCurrentQuestion = (field: keyof Question, value: any) => {
    setCurrentQuestion(prev => ({ ...prev, [field]: value }));
  };

  const addOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...(prev.options || []), { id: 0, option_text: '', question_id: 0 }]
    }));
  };

  const updateOption = (index: number, value: string) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options?.map((opt, i) => i === index ? { ...opt, option_text: value } : opt)
    }));
  };

  const removeOption = (index: number) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index)
    }));
  };

  const removeQuestion = (id: number) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);

    // Track deleted question ID if it has a database ID (not a temporary one)
    if (id > 1000000) { // Assuming database IDs are larger than temporary ones
      setDeletedQuestionIds(prev => [...prev, id.toString()]);
    }

    onQuestionChange?.(updatedQuestions, [id.toString()]);
  };

  return (
    <div className="flex flex-col w-full sm:max-w-[60%] bg-custom-gray rounded-card px-custom py-[1%]">

      {/* Current Question Builder */}
      <div className="">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <h2 className="text-base font-semibold text-custom-lightgray">Add Question</h2>
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-custom-lightgray">
                Type:
              </label>
              <select
                value={currentQuestion.type}
                onChange={(e) => updateCurrentQuestion('type', e.target.value)}
                className="px-3 py-1  rounded-lg focus:outline-none text-sm text-black"
              >
                {questionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={addQuestion}
              disabled={
                !currentQuestion.question_text.trim() ||
                ((currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'checkboxes') &&
                  (!currentQuestion.options || currentQuestion.options.length === 0 || currentQuestion.options.some(opt => !opt.option_text.trim())))
              }
              className="bg-custom-accent text-white px-4 py-2 rounded-lg hover:bg-custom-accent/80 disabled:bg-gray-300 disabled:cursor-not-allowed w-[50%] sm:w-auto"
            >
              Add Question
            </button>
          </div>
        </div>

        {/* Question Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-custom-lightgray mb-2">
            Question Title *
          </label>
          <input
            type="text"
            value={currentQuestion.question_text}
            onChange={(e) => updateCurrentQuestion('question_text', e.target.value)}
            placeholder="Enter your question"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none text-black"
          />
        </div>

        {/* Options for Multiple Choice and Checkboxes */}
        {(currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'checkboxes') && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-custom-lightgray mb-2">
              Options
            </label>
            <div className="space-y-2">
              {currentQuestion.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option.option_text}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none "
                  />
                  <button
                    onClick={() => removeOption(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={addOption}
                className="text-custom-accent hover:text-custom-accent/90 text-sm"
              >
                + Add Option
              </button>
            </div>
          </div>
        )}

        {/* Required Toggle */}
        <div className="flex items-center gap-x-2 justify-end">
          <label className="text-sm font-medium text-custom-lightgray">
            Required
          </label>
          <button
            onClick={() => updateCurrentQuestion('is_required', !currentQuestion.is_required)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${currentQuestion.is_required ? 'bg-custom-accent' : 'bg-gray-300'
              }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full transition-transform ${currentQuestion.is_required ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
          </button>
        </div>
      </div>

      {/* Existing Questions */}
      {questions.length > 0 && (
        <div className="">
          <h2 className="text-lg font-semibold mb-4">Form Questions</h2>
          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-custom-lightgray">
                        {questionTypes.find(t => t.value === question.type)?.icon}
                      </span>
                      <span className="text-sm text-custom-lightgray">
                        {questionTypes.find(t => t.value === question.type)?.label}
                      </span>
                      {question.is_required && (
                        <span className="text-red-500 text-sm">*</span>
                      )}
                    </div>
                    <h3 className="font-medium">{question.question_text}</h3>
                    {(question.type === 'multiple-choice' || question.type === 'checkboxes') && question.options && (
                      <div className="mt-2 space-y-1">
                        {question.options.map((option, index) => (
                          <div key={index} className="text-sm text-custom-lightgray">
                            {question.type === 'multiple-choice' ? '○' : '☐'} {option.option_text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeQuestion(question.id)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
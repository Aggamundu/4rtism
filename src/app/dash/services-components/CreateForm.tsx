import { useEffect, useState } from 'react';

interface Question {
  id: string;
  title: string;
  type: 'short-answer' | 'paragraph' | 'multiple-choice' | 'checkboxes';
  required: boolean;
  options?: string[];
}

interface CreateFormProps {
  onQuestionChange?: (questions: Question[], deletedIds?: string[]) => void;
  value?: Question[];
}

export default function CreateForm({ onQuestionChange, value }: CreateFormProps) {
  const [questions, setQuestions] = useState<Question[]>(value || []);
  const [deletedQuestionIds, setDeletedQuestionIds] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: '',
    title: '',
    type: 'short-answer',
    required: false,
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
    if (currentQuestion.title.trim()) {
      const newQuestion = {
        ...currentQuestion,
        id: Date.now().toString()
      };
      const updatedQuestions = [...questions, newQuestion];
      setQuestions(updatedQuestions);
      setCurrentQuestion({
        id: '',
        title: '',
        type: 'short-answer',
        required: false,
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
      options: [...(prev.options || []), '']
    }));
  };

  const updateOption = (index: number, value: string) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options?.map((opt, i) => i === index ? value : opt)
    }));
  };

  const removeOption = (index: number) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index)
    }));
  };

  const removeQuestion = (id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);

    // Track deleted question ID if it has a database ID (not a temporary one)
    if (id.length > 10) { // Assuming database IDs are longer than temporary ones
      setDeletedQuestionIds(prev => [...prev, id]);
    }

    onQuestionChange?.(updatedQuestions, [id]);
  };

  return (
    <div className="flex flex-col w-full sm:max-w-[60%] bg-white rounded-card px-custom py-[1%]">

      {/* Current Question Builder */}
      <div className="">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold">Add Question</h2>
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Type:
              </label>
              <select
                value={currentQuestion.type}
                onChange={(e) => updateCurrentQuestion('type', e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm"
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
              disabled={!currentQuestion.title.trim()}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-black/80 disabled:bg-gray-300 disabled:cursor-not-allowed w-[50%] sm:w-auto"
            >
              Add Question
            </button>
          </div>
        </div>

        {/* Question Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Title *
          </label>
          <input
            type="text"
            value={currentQuestion.title}
            onChange={(e) => updateCurrentQuestion('title', e.target.value)}
            placeholder="Enter your question"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-accent"
          />
        </div>

        {/* Options for Multiple Choice and Checkboxes */}
        {(currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'checkboxes') && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options
            </label>
            <div className="space-y-2">
              {currentQuestion.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-custom-accent"
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
                className="text-custom-accent hover:text-custom-darkAccent text-sm"
              >
                + Add Option
              </button>
            </div>
          </div>
        )}

        {/* Required Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Required
          </label>
          <button
            onClick={() => updateCurrentQuestion('required', !currentQuestion.required)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${currentQuestion.required ? 'bg-custom-accent' : 'bg-gray-300'
              }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${currentQuestion.required ? 'translate-x-6' : 'translate-x-1'
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
                      <span className="text-sm text-gray-500">
                        {questionTypes.find(t => t.value === question.type)?.icon}
                      </span>
                      <span className="text-sm text-gray-500">
                        {questionTypes.find(t => t.value === question.type)?.label}
                      </span>
                      {question.required && (
                        <span className="text-red-500 text-sm">*</span>
                      )}
                    </div>
                    <h3 className="font-medium">{question.title}</h3>
                    {(question.type === 'multiple-choice' || question.type === 'checkboxes') && question.options && (
                      <div className="mt-2 space-y-1">
                        {question.options.map((option, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {question.type === 'multiple-choice' ? '○' : '☐'} {option}
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
"use-client";

type QuestionCardProps = {
  question: string;
  options: string[];
  selectedAnswer: string | null;
  onAnswer: (answer: string) => void;
  isRagu: boolean;
};

export default function QuestionCard({
  question,
  options,
  selectedAnswer,
  onAnswer,
  isRagu,
}: QuestionCardProps) {
  const optionLabels = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="mb-4">{question}</h2>
      {isRagu && (
        <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-4">
          Masih ragu
        </div>
      )}
      <div className="space-y-3">
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-50"
            onClick={() => onAnswer(optionLabels[index])}
          >
            <div className={`flex items-center justify-center h-6 w-6 rounded-full mr-3 
              ${selectedAnswer === optionLabels[index]
                ? 'bg-blue-500 text-white'
                : 'border border-gray-300'}`}>
              {optionLabels[index]}
            </div>
            <span>{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

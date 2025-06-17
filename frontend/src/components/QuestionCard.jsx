function QuestionCard({ question, answered, selected, submitAnswer }) {
  const entries = Object.entries(question.choices);

  return (
    <div className="border rounded-lg p-4 bg-white shadow-md">
      <p className="mb-4 font-medium text-gray-900">{question.stimulus}</p>
      <ul className="space-y-2">
        {entries.map(([letter, text]) => {
          const isCorrect = letter === question.correct_answer;
          const isSelected = letter === selected;

          const className = answered
            ? isCorrect
              ? 'bg-green-100 border-green-600'
              : isSelected
              ? 'bg-red-100 border-red-600'
              : 'bg-white'
            : 'hover:bg-gray-100';

          return (
            <li
              key={letter}
              className={`p-2 border rounded cursor-pointer ${className}`}
              onClick={() => submitAnswer(letter)}
            >
              <strong>{letter}.</strong> {text}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default QuestionCard;

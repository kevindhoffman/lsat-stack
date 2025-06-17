import React from 'react';
import veritasImg from '../assets/professors/veritas.png';
import oakImg from '../assets/professors/oak.png';
import calderImg from '../assets/professors/calder.png';
import stricklandImg from '../assets/professors/strickland.png';

const professorData = {
  veritas: {
    name: "Prof. Veritas",
    image: veritasImg,
  },
  oak: {
    name: "Prof. Oak",
    image: oakImg,
  },
  calder: {
    name: "Prof. Calder",
    image: calderImg,
  },
  strickland: {
    name: "Prof. Strickland",
    image: stricklandImg,
  },
};

function ProfessorAvatar({ professor, answered, correct, question }) {
  if (!answered) return null;

  const data = professorData[professor];
  const feedback = question.professor_feedback?.[professor];
  const message = correct ? feedback?.correct : feedback?.incorrect;

  return (
    <div className="flex flex-col items-center text-center space-y-2">
      <img
        src={data.image}
        alt={data.name}
        className="w-24 h-24 object-contain rounded shadow-md"
      />
      <div className="text-sm text-gray-700 italic max-w-[8rem]">
        {message || "No feedback available."}
      </div>
    </div>
  );
}

export default ProfessorAvatar;

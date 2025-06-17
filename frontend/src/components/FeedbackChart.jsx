import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';

import logicIcon from '../assets/logic.png';
import inferenceIcon from '../assets/inference.png';
import readingIcon from '../assets/reading.png';
import argumentationIcon from '../assets/argumentation.png';
import analyticalIcon from '../assets/analytical.png';
import vocabularyIcon from '../assets/vocabulary.png';

// Converts a time duration into an efficiency percentage
const computeEfficiency = (duration, expected = 30, perfect = 6) => {
  if (duration >= expected) return 0;
  if (duration <= perfect) return 100;
  return Math.round(100 * ((expected - duration) / (expected - perfect)));
};

const getIconByType = (type) => {
  switch (type) {
    case 'logic': return logicIcon;
    case 'inference': return inferenceIcon;
    case 'reading': return readingIcon;
    case 'argumentation': return argumentationIcon;
    case 'analytical': return analyticalIcon;
    case 'vocabulary': return vocabularyIcon;
    default: return null;
  }
};

const renderCustomIcon = ({ x, y, payload }) => {
  const icon = getIconByType(payload.type);
  if (!icon) return null;

  return (
    <g>
      <image
        href={icon}
        x={x - 8}
        y={y - 8}
        width={16}
        height={16}
      />
      <text
        x={x + 4}
        y={y - 4}
        fontSize="12"
        fill={payload.correct ? 'green' : 'red'}
        fontWeight="bold"
      >
        {payload.correct ? '✔' : '✘'}
      </text>
    </g>
  );
};

const FeedbackChart = ({ data, avgTime }) => {
  return (
    <div className="w-full aspect-square">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          {/* Gray shaded region: "faster than average" */}
          <ReferenceArea
            x1={0}
            x2={50}
            y1={0}
            y2={100}
            fill="#e5e7eb"
            fillOpacity={0.2}
          />


          <XAxis
            type="number"
            dataKey="x"
            domain={[0, 100]}
            ticks={[0, 50, 100]}
            axisLine={{ stroke: '#ccc', strokeWidth: 0.5 }}
            tick={{ fill: '#666', fontSize: 10 }}
            label={{
              value: 'Strategic Efficiency',
              position: 'insideBottom',
              offset: -10,
              style: { fill: '#666', fontSize: 14 },
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[0, 100]}
            ticks={[0, 50, 100]}
            axisLine={{ stroke: '#ccc', strokeWidth: 0.5 }}
            tick={{ fill: '#666', fontSize: 10 }}
            label={{
              value: 'Logical Complexity',
              angle: -90,
              position: 'insideLeft',
              offset: 0,
              style: { fill: '#666', fontSize: 14 },
            }}
          />
          <Scatter name="Attempts" data={data} shape={renderCustomIcon} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeedbackChart;

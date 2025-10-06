import React from 'react';

interface ScoreDisplayProps {
  answerHistory: (boolean | null)[];
  total: number;
  animated?: boolean;
  iconSize?: string;
}

type QuillStatus = boolean | null;

const QuillIcon: React.FC<{ status: QuillStatus; className?: string; style?: React.CSSProperties }> = ({ status, className = '', style }) => {
  const getColorClass = () => {
    if (status === true) return 'text-green-500';
    if (status === false) return 'text-red-500';
    return 'text-slate-300';
  };

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill={status !== null ? "currentColor" : "none"} 
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} ${getColorClass()}`}
      style={style}
      aria-hidden="true"
    >
      <path d="M20.72,6.28a2,2,0,0,0-2.83-2.83L15.66,5.66,3.5,17.82a1,1,0,0,0-.29.71V21.5a1,1,0,0,0,1,1H7.17a1,1,0,0,0,.71-.29L20.72,9.11Z"></path>
      <path d="M11,10,21.5,15.5"></path>
      <path d="M3.5,17.82,10,11"></path>
    </svg>
  );
};

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ answerHistory, total, animated = false, iconSize = 'w-8 h-8' }) => {
  const items = Array.from({ length: total }, (_, i) => answerHistory[i] ?? null);

  const score = items.filter(i => i === true).length;

  return (
    <div className="flex flex-wrap justify-center items-center gap-2" role="img" aria-label={`Skóre: ${score} z ${total}`}>
      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-pop-in {
          animation: pop-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
      {items.map((status, index) => (
        <div 
          key={index} 
          className={`${iconSize} ${animated ? 'animate-pop-in' : ''}`}
          style={animated ? { animationDelay: `${index * 100}ms`, opacity: 0 } : {}}
        >
           <QuillIcon 
             status={status}
           />
        </div>
      ))}
    </div>
  );
};

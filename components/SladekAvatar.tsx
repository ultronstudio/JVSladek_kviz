import React from 'react';

interface SladekAvatarProps {
  className?: string;
  isSpeaking?: boolean;
}

export const SladekAvatar: React.FC<SladekAvatarProps> = ({ className = '', isSpeaking = false }) => {
  return (
    <div className={`relative rounded-full shadow-lg bg-slate-200 border-4 border-white ${className}`}>
       <style>{`
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .animate-blink {
          animation: blink 4s infinite;
          transform-origin: 50% 50%;
        }
        @keyframes talk {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(1px); }
        }
        .animate-talk {
          animation: talk 0.4s ease-in-out infinite;
        }
      `}</style>
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0 w-full h-full"
        aria-label="Stylizovaný avatar Josefa Václava Sládka"
      >
        <g transform="translate(0, 10)">
          {/* Suit Jacket */}
          <path fill="#4A5568" d="M50 140 C 30 200, 170 200, 150 140 L 130 150 Q 100 160 70 150 Z" />
          <path fill="#2D3748" d="M100 158 L125 150 C 110 180, 90 180, 75 150 L100 158 Z" />

          {/* Shirt and Cravat */}
          <path fill="#E2E8F0" d="M90 145 L100 165 L110 145 L105 145 Q 100 152 95 145 Z" />
          <path fill="#4A5568" d="M98 156 A 5 5 0 0 1 102 156 Q 100 160 98 156 Z" />

          {/* Neck */}
          <path fill="#e6c4a3" d="M92 140 C 95 150, 105 150, 108 140 Z" />

          {/* Face */}
          <path fill="#f2d5b1" d="M100 40 C 60 40 50 100 100 150 C 150 100 140 40 100 40 Z" />

          {/* Ears */}
          <path fill="#e6c4a3" d="M60 95 C 55 100 55 110 60 115 L 62 110 C 62 105 60 95 60 95 Z" />
          <path fill="#e6c4a3" d="M140 95 C 145 100 145 110 140 115 L 138 110 C 138 105 140 95 140 95 Z" />

          {/* Hair */}
          <path fill="#4a3123" d="M60 95 C 45 60 70 30 100 35 C 130 30 155 60 140 95 C 145 80 130 50 115 45 C 100 40 75 50 65 70 C 60 80 60 95 60 95 Z" />
          <path fill="#5a3d2b" d="M100 35 C 80 30 55 50 65 80 C 70 60 90 45 100 45 C 110 45 130 60 135 80 C 145 50 120 30 100 35 Z" />

          {/* Goatee and Moustache */}
           <g className={isSpeaking ? 'animate-talk' : ''}>
            <path fill="#4a3123" d="M80 118 Q 100 135 120 118 C 115 115 85 115 80 118 Z" />
            <path fill="#4a3123" d="M85 120 C 80 130 100 155 100 155 C 100 155 120 130 115 120 C 105 120 95 120 85 120 Z" />
          </g>
          
          {/* Nose */}
          <path fill="#e6c4a3" d="M100 95 L 97 112 L 103 112 Z" />
          <path fill="#d1b69f" d="M100 100 L 102 112 L 100 112 Z" />

          {/* Eyes and Eyebrows */}
          <g className="animate-blink">
            <path fill="#2D3748" d="M78 92 A 5 3 0 0 1 88 92 A 5 3 0 0 1 78 92 Z" />
            <path fill="#2D3748" d="M112 92 A 5 3 0 0 1 122 92 A 5 3 0 0 1 112 92 Z" />
            <circle cx="83" cy="92" r="1.5" fill="#f2d5b1" opacity="0.7" />
            <circle cx="117" cy="92" r="1.5" fill="#f2d5b1" opacity="0.7" />
          </g>

          <path fill="none" stroke="#4a3123" strokeWidth="4" strokeLinecap="round" d="M75 85 Q 83 80 90 85" />
          <path fill="none" stroke="#4a3123" strokeWidth="4" strokeLinecap="round" d="M110 85 Q 117 80 125 85" />
        </g>
      </svg>
    </div>
  );
};
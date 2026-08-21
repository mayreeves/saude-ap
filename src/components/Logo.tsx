import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  useImage?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  useImage = false,
}) => {
  const sizeMap = {
    sm: { icon: 'w-9 h-9', text: 'text-xl', sub: 'text-[10px]', img: 'w-9 h-9' },
    md: { icon: 'w-11 h-11', text: 'text-2xl', sub: 'text-[11px]', img: 'w-11 h-11' },
    lg: { icon: 'w-16 h-16', text: 'text-3xl', sub: 'text-xs', img: 'w-16 h-16' },
    xl: { icon: 'w-24 h-24', text: 'text-4xl sm:text-5xl', sub: 'text-sm sm:text-base', img: 'w-24 h-24' },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      
      {/* Icon */}
      {useImage ? (
        <img
          src="/logo.jpg"
          alt="Cuidar+ Logo"
          className={`${current.img} rounded-2xl object-cover shadow-md shadow-sky-500/20 border border-sky-100 flex-shrink-0`}
        />
      ) : (
        <div
          className={`${current.icon} rounded-2xl bg-gradient-to-br from-teal-400 via-sky-500 to-blue-600 p-0.5 shadow-lg shadow-sky-500/25 flex items-center justify-center flex-shrink-0 relative overflow-hidden group`}
        >
          <div className="w-full h-full bg-white/10 rounded-[14px] flex items-center justify-center backdrop-blur-xs relative">
            <svg
              viewBox="0 0 100 100"
              className="w-[80%] h-[80%]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Stylized Embracing Heart */}
              <path
                d="M50 82C50 82 18 62 18 38C18 25 28 16 40 16C45.5 16 50 20 50 20C50 20 54.5 16 60 16C72 16 82 25 82 38C82 62 50 82 50 82Z"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow"
              />
              
              {/* Inner Medical Cross (+) */}
              <path
                d="M50 32V56M38 44H62"
                stroke="#38bdf8"
                strokeWidth="9"
                strokeLinecap="round"
                className="drop-shadow"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`${current.text} font-black tracking-tight text-slate-900`}>
              Cuidar<span className="text-sky-600 font-extrabold">+</span>
            </span>
            <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
              Saúde
            </span>
          </div>

          <span className={`${current.sub} text-slate-500 font-bold mt-1 tracking-tight`}>
            Tecnologia para cuidar de quem você ama
          </span>
        </div>
      )}

    </div>
  );
};

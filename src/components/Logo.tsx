import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo icon - arrow in blue square pointing up-right */}
      <div className={`${sizeClasses[size]} bg-primary rounded-lg flex items-center justify-center shadow-elevated`}>
        <svg
          viewBox="0 0 24 24"
          className="w-2/3 h-2/3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17L17 7" className="text-primary-foreground" />
          <path d="M7 7h10v10" className="text-primary-foreground" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-bold tracking-tight text-foreground`}>
            INALTERA
          </span>
          {size !== 'sm' && (
            <span className="text-xs text-muted-foreground -mt-0.5">
              Tu solución NO-VERI*FACTU
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
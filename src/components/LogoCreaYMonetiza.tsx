import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const LogoCreaYMonetiza: React.FC<LogoProps> = ({
  className = '',
  variant = 'dark',
  size = 'md',
  showSubtitle = false
}) => {
  const heightClasses = {
    xs: 'h-6',
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24'
  };

  // The official attached image asset
  const logoSrc = '/Logo crea y monetiza.png';

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <div className={`relative flex items-center justify-center rounded-xl overflow-hidden ${
        variant === 'light' ? 'bg-black p-1.5 shadow-sm' : ''
      }`}>
        <img
          src={logoSrc}
          alt="Crea y Monetiza"
          referrerPolicy="no-referrer"
          className={`${heightClasses[size]} w-auto object-contain transition-transform duration-200`}
          onError={(e) => {
            // Fallback to normalized filename if spaces were encoded differently
            const target = e.currentTarget;
            if (target.src.indexOf('logo-crea-y-monetiza.png') === -1) {
              target.src = '/logo-crea-y-monetiza.png';
            }
          }}
        />
      </div>

      {showSubtitle && (
        <div className="flex flex-col justify-center border-l pl-2.5 border-zinc-700/50">
          <span className="text-[10px] font-black uppercase tracking-wider text-red-500">
            Metodología
          </span>
          <span className={`text-xs font-bold leading-tight ${variant === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>
            Patricia Loaiza
          </span>
        </div>
      )}
    </div>
  );
};

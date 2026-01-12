import React, { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children?: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: boolean;
}

export const Tooltip = ({ content, children, position = 'top', delay = false }: TooltipProps) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  };

  return (
    <div className="group relative flex items-center justify-center">
      {children}
      <div 
        className={`
            absolute z-50 px-2 py-1 text-[10px] font-medium text-zinc-100 bg-zinc-900 
            border border-zinc-800 rounded-sm shadow-sm whitespace-nowrap pointer-events-none 
            opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out
            ${positionClasses[position]}
            ${delay ? 'delay-500' : ''}
        `}
      >
        {content}
      </div>
    </div>
  );
};
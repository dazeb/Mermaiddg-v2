import React, { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children?: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: boolean;
}

export const Tooltip = ({ content, children, position = 'top', delay = false }: TooltipProps) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="group relative flex items-center justify-center">
      {children}
      <div 
        className={`
            absolute z-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-100 bg-slate-800 
            border border-slate-600 rounded-md shadow-xl whitespace-nowrap pointer-events-none 
            opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out
            ${positionClasses[position]}
            ${delay ? 'delay-500' : ''}
        `}
      >
        {content}
        {/* Tiny arrow using CSS borders */}
        <div 
            className={`absolute w-2 h-2 bg-slate-800 border-r border-b border-slate-600 transform rotate-45
            ${position === 'top' ? 'bottom-[-5px] left-1/2 -translate-x-1/2' : ''}
            ${position === 'bottom' ? 'top-[-5px] left-1/2 -translate-x-1/2 rotate-[225deg]' : ''}
            ${position === 'left' ? 'right-[-5px] top-1/2 -translate-y-1/2 -rotate-45' : ''}
            ${position === 'right' ? 'left-[-5px] top-1/2 -translate-y-1/2 rotate-[135deg]' : ''}
            `}
        />
      </div>
    </div>
  );
};
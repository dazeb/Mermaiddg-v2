import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingOverlay = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center flex-col">
      <Loader2 className="w-10 h-10 text-zinc-100 animate-spin mb-4" />
      <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-widest">Designing</h3>
      <p className="text-zinc-500 text-xs mt-1">Generating architecture...</p>
    </div>
  );
};
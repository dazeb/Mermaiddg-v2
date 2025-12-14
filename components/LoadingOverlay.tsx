import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingOverlay = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center flex-col">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
      <h3 className="text-xl font-bold text-white">AI Architect Working...</h3>
      <p className="text-slate-400">Constructing diagram from requirements</p>
    </div>
  );
};

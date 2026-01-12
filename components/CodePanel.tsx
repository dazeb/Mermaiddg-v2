import React from 'react';
import { Copy, Terminal } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface CodePanelProps {
  code: string;
  onChange: (value: string) => void;
  height: number;
}

const CodePanel: React.FC<CodePanelProps> = ({ code, onChange, height }) => {
  return (
    <div 
        className={`bg-zinc-950 flex flex-col transition-all duration-300 overflow-hidden ${height > 0 ? 'border-t border-zinc-800' : ''}`} 
        style={{ height: `${height}px` }}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-950 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Terminal className="w-3.5 h-3.5" />
          <span className="font-mono">Mermaid Syntax</span>
        </div>
        <Tooltip content="Copy Code" position="left">
            <button 
                onClick={() => navigator.clipboard.writeText(code)}
                className="text-xs flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 transition-colors px-2 py-1 hover:bg-zinc-900 rounded-sm"
            >
            <Copy className="w-3 h-3" /> Copy
            </button>
        </Tooltip>
      </div>
      <div className="flex-1 relative">
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-zinc-950 text-zinc-300 font-mono text-xs p-4 resize-none focus:outline-none custom-scrollbar leading-5"
          spellCheck={false}
          placeholder="graph TD..."
        />
      </div>
    </div>
  );
};

export default CodePanel;
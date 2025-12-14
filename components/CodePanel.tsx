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
        className={`bg-slate-950 flex flex-col transition-all duration-300 overflow-hidden ${height > 0 ? 'border-t border-slate-800' : ''}`} 
        style={{ height: `${height}px` }}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Terminal className="w-4 h-4" />
          <span className="font-mono">Mermaid Live Editor</span>
        </div>
        <Tooltip content="Copy code to clipboard" position="left">
            <button 
                onClick={() => navigator.clipboard.writeText(code)}
                className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
            <Copy className="w-3 h-3" /> Copy
            </button>
        </Tooltip>
      </div>
      <div className="flex-1 relative">
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-slate-950 text-slate-300 font-mono text-sm p-4 resize-none focus:outline-none custom-scrollbar"
          spellCheck={false}
          placeholder="graph TD..."
        />
      </div>
    </div>
  );
};

export default CodePanel;
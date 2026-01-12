import React from 'react';
import { AppNode, NodeType } from '../types';
import { COLORS } from '../constants';
import { X, Trash2, ExternalLink, HelpCircle } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface PropertiesPanelProps {
  selectedNode: AppNode | null;
  onUpdate: (id: string, data: Partial<AppNode['data']>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedNode, onUpdate, onDelete, onClose }) => {
  if (!selectedNode) return null;

  const handleChange = (field: string, value: string) => {
    onUpdate(selectedNode.id, { [field]: value });
  };

  return (
    <aside className="w-72 bg-zinc-950 border-l border-zinc-800 flex flex-col h-full absolute right-0 top-0 bottom-0 z-20 shadow-xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <h3 className="font-semibold text-sm text-zinc-100">Properties</h3>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-100 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-5 flex-1 overflow-y-auto custom-scrollbar">
        {/* Node ID */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">ID</label>
          <div className="flex items-center gap-2 bg-zinc-900/50 px-2 py-1.5 rounded-md border border-zinc-800">
             <span className="font-mono text-xs text-zinc-500">#</span>
             <input 
                type="text" 
                value={selectedNode.id} 
                disabled 
                className="w-full bg-transparent text-zinc-400 text-xs font-mono focus:outline-none"
             />
          </div>
        </div>

        {/* Label */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Label</label>
            <Tooltip content="Supports Markdown" position="left">
                <HelpCircle className="w-3 h-3 text-zinc-600" />
            </Tooltip>
          </div>
          <textarea 
            value={selectedNode.data.label}
            onChange={(e) => handleChange('label', e.target.value)}
            className="w-full bg-zinc-900 text-zinc-200 text-xs px-3 py-2 rounded-md border border-zinc-800 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 focus:outline-none transition-all font-mono leading-relaxed resize-none"
            rows={5}
          />
        </div>

        {/* Type */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Shape</label>
          <select 
            value={selectedNode.data.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full bg-zinc-900 text-zinc-200 text-xs px-2 py-2 rounded-md border border-zinc-800 focus:border-zinc-600 focus:outline-none appearance-none cursor-pointer hover:bg-zinc-800 transition-colors"
          >
            <option value={NodeType.RECTANGLE}>Rectangle</option>
            <option value={NodeType.ROUNDED}>Rounded</option>
            <option value={NodeType.STADIUM}>Stadium</option>
            <option value={NodeType.SUBROUTINE}>Subroutine</option>
            <option value={NodeType.CYLINDER}>Database</option>
            <option value={NodeType.RHOMBUS}>Decision</option>
            <option value={NodeType.HEXAGON}>Hexagon</option>
            <option value={NodeType.PARALLELOGRAM}>Parallelogram</option>
            <option value={NodeType.CIRCLE}>Circle</option>
          </select>
        </div>

        {/* Color */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Accent</label>
          <div className="grid grid-cols-6 gap-2">
            {Object.values(COLORS).map((color) => (
              <button
                key={color}
                onClick={() => handleChange('color', color)}
                className={`w-6 h-6 rounded-full border transition-all ${selectedNode.data.color === color ? 'border-zinc-100 ring-1 ring-zinc-500 scale-110' : 'border-transparent hover:scale-110'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* URL */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Link</label>
          <div className="relative">
             <ExternalLink className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-600" />
             <input 
                type="text" 
                value={selectedNode.data.url || ''}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="https://"
                className="w-full bg-zinc-900 text-zinc-300 text-xs pl-8 pr-2 py-1.5 rounded-md border border-zinc-800 focus:border-zinc-600 focus:outline-none placeholder-zinc-700"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
        <button 
          onClick={() => onDelete(selectedNode.id)}
          className="w-full flex items-center justify-center gap-2 bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-900/50 px-3 py-2 rounded-md transition-all font-medium text-xs"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete Node
        </button>
      </div>
    </aside>
  );
};

export default PropertiesPanel;
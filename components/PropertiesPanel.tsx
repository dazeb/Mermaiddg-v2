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
    <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full absolute right-0 top-0 bottom-0 z-20 shadow-2xl backdrop-blur-xl bg-slate-900/95">
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <h3 className="font-bold text-white flex items-center gap-2">
            <span className="w-2 h-6 rounded-full" style={{ backgroundColor: selectedNode.data.color }}></span>
            Properties
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        {/* Node ID (Read Only) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Node ID</label>
            <Tooltip content="Unique identifier used in Mermaid syntax. Cannot be changed." position="right">
                <HelpCircle className="w-3 h-3 text-slate-600 cursor-help" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
             <span className="font-mono text-xs text-blue-400">#</span>
             <input 
                type="text" 
                value={selectedNode.id} 
                disabled 
                className="w-full bg-transparent text-slate-400 text-sm font-mono focus:outline-none"
             />
          </div>
        </div>

        {/* Label */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Content</label>
                <Tooltip content="Text inside the node. Supports Markdown (**bold**, `code`)." position="right">
                    <HelpCircle className="w-3 h-3 text-slate-600 cursor-help" />
                </Tooltip>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">Markdown & Emojis ✨</span>
          </div>
          <textarea 
            value={selectedNode.data.label}
            onChange={(e) => handleChange('label', e.target.value)}
            className="w-full bg-slate-950 text-slate-200 text-sm px-3 py-3 rounded-lg border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all font-mono leading-relaxed"
            rows={6}
            placeholder="**Bold** text, `code`, :rocket: ..."
          />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Shape Style</label>
            <Tooltip content="Changes the geometric shape in the diagram." position="right">
                <HelpCircle className="w-3 h-3 text-slate-600 cursor-help" />
            </Tooltip>
          </div>
          <select 
            value={selectedNode.data.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full bg-slate-950 text-white text-sm px-3 py-2 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer hover:border-slate-600 transition-colors"
          >
            <option value={NodeType.RECTANGLE}>Rectangle [ ]</option>
            <option value={NodeType.ROUNDED}>Rounded Rect ( )</option>
            <option value={NodeType.STADIUM}>Stadium / Pill ([ ])</option>
            <option value={NodeType.SUBROUTINE}>Subroutine [[ ]]</option>
            <option value={NodeType.CYLINDER}>Database [( )]</option>
            <option value={NodeType.RHOMBUS}>Decision {'{ }'}</option>
            <option value={NodeType.HEXAGON}>Hexagon {'{{ }}'}</option>
            <option value={NodeType.PARALLELOGRAM}>Parallelogram [/ /]</option>
            <option value={NodeType.CIRCLE}>Circle (( ))</option>
          </select>
        </div>

        {/* Color */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Accent Color</label>
          <div className="grid grid-cols-6 gap-2">
            {Object.values(COLORS).map((color) => (
              <button
                key={color}
                onClick={() => handleChange('color', color)}
                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 shadow-lg ${selectedNode.data.color === color ? 'border-white scale-110 ring-2 ring-white/20' : 'border-transparent hover:border-slate-500'}`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* URL/Click */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interaction</label>
            <Tooltip content="Opens this URL when the node is clicked." position="right">
                <HelpCircle className="w-3 h-3 text-slate-600 cursor-help" />
            </Tooltip>
          </div>
          <div className="relative">
             <ExternalLink className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
             <input 
                type="text" 
                value={selectedNode.data.url || ''}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-slate-950 text-blue-400 text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none placeholder-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <button 
          onClick={() => onDelete(selectedNode.id)}
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2.5 rounded-lg transition-all font-medium text-sm group"
        >
          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> Delete Component
        </button>
      </div>
    </aside>
  );
};

export default PropertiesPanel;
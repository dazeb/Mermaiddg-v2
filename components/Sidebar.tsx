import React from 'react';
import { Square, Database, Circle, Diamond, Layout, Layers, Spline, Hexagon } from 'lucide-react';
import { NodeType } from '../types';
import { Tooltip } from './Tooltip';

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const DraggableItem = ({ type, label, icon: Icon, help }: { type: NodeType; label: string; icon: any; help: string }) => (
    <Tooltip content={help} position="right">
        <div
        className="flex items-center gap-3 p-3 mb-2 bg-slate-800 rounded-lg cursor-grab hover:bg-slate-700 transition-colors border border-slate-700 hover:border-slate-500 w-full"
        onDragStart={(event) => onDragStart(event, type)}
        draggable
        >
        <Icon className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-medium text-slate-300">{label}</span>
        </div>
    </Tooltip>
  );

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full z-10 custom-scrollbar overflow-y-auto">
      <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-20">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span className="text-blue-500">◆</span> Widget Library
        </h2>
      </div>
      
      <div className="flex-1 p-4">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Core Shapes</h3>
          <DraggableItem type={NodeType.RECTANGLE} label="Rectangle" icon={Square} help="Standard process step or action" />
          <DraggableItem type={NodeType.ROUNDED} label="Rounded Rect" icon={Square} help="Alternate process or event" />
          <DraggableItem type={NodeType.STADIUM} label="Stadium" icon={Layout} help="Start/End terminal or pill" />
          <DraggableItem type={NodeType.SUBROUTINE} label="Subroutine" icon={Layers} help="Predefined process or sub-system" />
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Logic & Data</h3>
          <DraggableItem type={NodeType.RHOMBUS} label="Decision" icon={Diamond} help="Branching point (Yes/No)" />
          <DraggableItem type={NodeType.CYLINDER} label="Database" icon={Database} help="Data storage or repository" />
          <DraggableItem type={NodeType.PARALLELOGRAM} label="Input/Output" icon={Spline} help="Data input or output operation" />
          <DraggableItem type={NodeType.HEXAGON} label="Preparation" icon={Hexagon} help="Setup or initialization step" />
          <DraggableItem type={NodeType.CIRCLE} label="Start / End" icon={Circle} help="Flow terminator or connector" />
        </div>

        <div className="p-4 bg-slate-800/50 rounded-xl border border-dashed border-slate-700 text-center">
            <p className="text-xs text-slate-400 mb-2">Drag shapes onto the canvas. Support for 🚀 emojis and **Markdown** included.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
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
        className="flex items-center gap-3 p-2 mb-1.5 bg-zinc-900/50 hover:bg-zinc-900 rounded-md cursor-grab transition-all border border-transparent hover:border-zinc-800 w-full group"
        onDragStart={(event) => onDragStart(event, type)}
        draggable
        >
        <Icon className="w-4 h-4 text-zinc-500 group-hover:text-zinc-100 transition-colors" />
        <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">{label}</span>
        </div>
    </Tooltip>
  );

  return (
    <aside className="w-60 bg-zinc-950 border-r border-zinc-800 flex flex-col h-full z-10 custom-scrollbar overflow-y-auto">
      <div className="px-4 py-3 border-b border-zinc-800 sticky top-0 bg-zinc-950/95 backdrop-blur z-20">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Library
        </h2>
      </div>
      
      <div className="flex-1 p-3">
        <div className="mb-5">
          <h3 className="text-[10px] font-bold text-zinc-600 uppercase mb-2 px-1">Flow</h3>
          <DraggableItem type={NodeType.RECTANGLE} label="Process" icon={Square} help="Standard process step" />
          <DraggableItem type={NodeType.RHOMBUS} label="Decision" icon={Diamond} help="Decision / Branching" />
          <DraggableItem type={NodeType.CIRCLE} label="Start / End" icon={Circle} help="Terminator" />
          <DraggableItem type={NodeType.ROUNDED} label="Alternate Process" icon={Square} help="Alternate process" />
        </div>

        <div className="mb-5">
          <h3 className="text-[10px] font-bold text-zinc-600 uppercase mb-2 px-1">Data</h3>
          <DraggableItem type={NodeType.CYLINDER} label="Database" icon={Database} help="Storage" />
          <DraggableItem type={NodeType.PARALLELOGRAM} label="Input / Output" icon={Spline} help="I/O Operation" />
        </div>

        <div className="mb-5">
          <h3 className="text-[10px] font-bold text-zinc-600 uppercase mb-2 px-1">Advanced</h3>
          <DraggableItem type={NodeType.HEXAGON} label="Preparation" icon={Hexagon} help="Setup / Prep" />
          <DraggableItem type={NodeType.STADIUM} label="Stadium" icon={Layout} help="Pill shape" />
          <DraggableItem type={NodeType.SUBROUTINE} label="Subroutine" icon={Layers} help="Predefined process" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
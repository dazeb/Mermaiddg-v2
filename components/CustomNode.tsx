import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Database, Circle, Square, Diamond, Box, Hexagon, Globe, Layout, Layers, Spline } from 'lucide-react';
import { MermaidNodeData, NodeType } from '../types';

// Map types to Icons
const ICON_MAP = {
  [NodeType.RECTANGLE]: Box,
  [NodeType.ROUNDED]: Square, 
  [NodeType.STADIUM]: Layout,
  [NodeType.CYLINDER]: Database,
  [NodeType.SUBROUTINE]: Layers,
  [NodeType.RHOMBUS]: Diamond,
  [NodeType.CIRCLE]: Circle,
  [NodeType.HEXAGON]: Hexagon,
  [NodeType.PARALLELOGRAM]: Spline,
};

const CustomNode = ({ data, selected }: NodeProps<MermaidNodeData>) => {
  const { label, type, color = '#71717a' } = data;
  const Icon = ICON_MAP[type] || Square;

  // Reduced Radius & Border Handling
  const wrapperStyle = `
    group relative flex flex-col items-center justify-center transition-all duration-200
    ${selected ? 'ring-1 ring-zinc-400 ring-offset-1 ring-offset-black' : ''}
  `;
  
  // Base card style for simple shapes
  const cardBase = "relative w-full overflow-hidden bg-zinc-900 border border-zinc-800 shadow-sm transition-colors group-hover:border-zinc-700";

  // --- SHAPE RENDERERS ---

  // 1. Diamond (Rhombus)
  if (type === NodeType.RHOMBUS) {
    return (
      <div className={`${wrapperStyle} w-40 h-40`}>
        <Handle type="target" position={Position.Top} className="!bg-zinc-500 !w-2 !h-2 -mt-2 z-10" />
        <div 
          className="absolute inset-0 transform rotate-45 border border-zinc-800 bg-zinc-900 shadow-sm rounded-sm transition-colors group-hover:border-zinc-600"
          style={{ borderColor: selected ? color : undefined }}
        />
        <div className="relative z-10 p-2 text-center flex flex-col items-center justify-center w-28 h-28 pointer-events-none">
          <Icon className="w-4 h-4 mb-1 text-zinc-400" style={{ color }} />
          <div className="prose prose-invert prose-p:text-zinc-400 prose-headings:text-zinc-200 prose-strong:text-zinc-200 max-h-full overflow-hidden text-[10px] leading-tight font-medium">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>{label}</ReactMarkdown>
          </div>
        </div>
        <Handle type="source" position={Position.Bottom} className="!bg-zinc-500 !w-2 !h-2 -mb-2 z-10" />
      </div>
    );
  }

  // 2. Circle
  if (type === NodeType.CIRCLE) {
    return (
      <div className={`${wrapperStyle} w-28 h-28`}>
        <Handle type="target" position={Position.Top} className="!bg-zinc-500 !w-2 !h-2" />
        <div 
            className="absolute inset-0 rounded-full border border-zinc-800 bg-zinc-900 shadow-sm transition-colors group-hover:border-zinc-600 flex items-center justify-center overflow-hidden"
            style={{ borderColor: selected ? color : undefined }}
        >
             <div className="flex flex-col items-center justify-center p-3 text-center pointer-events-none">
                <div className="prose prose-invert prose-p:text-zinc-400 prose-headings:text-zinc-200 prose-strong:text-zinc-200 text-[10px] leading-tight font-medium">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{label}</ReactMarkdown>
                </div>
             </div>
        </div>
        <Handle type="source" position={Position.Bottom} className="!bg-zinc-500 !w-2 !h-2" />
      </div>
    );
  }

  // 3. Hexagon
  if (type === NodeType.HEXAGON) {
      return (
        <div className={`${wrapperStyle} w-44 h-28`}>
          <Handle type="target" position={Position.Top} className="!bg-zinc-500 !w-2 !h-2" />
          <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-sm" viewBox="0 0 100 100" preserveAspectRatio="none">
             <polygon points="15,1 85,1 99,50 85,99 15,99 1,50" 
                   fill="#18181b" 
                   stroke={selected ? color : "#27272a"} 
                   strokeWidth="1" 
                   vectorEffect="non-scaling-stroke"
                   className="transition-colors group-hover:stroke-zinc-600"
             />
          </svg>

          <div className="relative z-10 p-4 text-center flex flex-col items-center justify-center w-32 h-20 pointer-events-none">
            <Icon className="w-4 h-4 mb-1 text-zinc-400" style={{ color }} />
            <div className="prose prose-invert prose-p:text-zinc-400 prose-strong:text-zinc-200 text-[10px] leading-tight font-medium">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>{label}</ReactMarkdown>
            </div>
          </div>
          <Handle type="source" position={Position.Bottom} className="!bg-zinc-500 !w-2 !h-2" />
        </div>
      );
  }

  // 4. Parallelogram
  if (type === NodeType.PARALLELOGRAM) {
    return (
        <div className={`${wrapperStyle} w-44`}>
           <Handle type="target" position={Position.Top} className="!bg-zinc-500 !w-2 !h-2" />
           <div 
             className="transform -skew-x-12 bg-zinc-900 border border-zinc-800 rounded-sm shadow-sm p-3 min-h-[4rem] flex items-center justify-center transition-colors group-hover:border-zinc-600"
             style={{ borderColor: selected ? color : undefined }}
           >
              <div className="transform skew-x-12 w-full text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                     <Icon className="w-3.5 h-3.5 text-zinc-400" style={{ color }} />
                </div>
                <div className="prose prose-invert prose-sm text-[10px] leading-tight font-medium text-zinc-300">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{label}</ReactMarkdown>
                </div>
              </div>
           </div>
           <Handle type="source" position={Position.Bottom} className="!bg-zinc-500 !w-2 !h-2" />
        </div>
    );
  }

  // 5. Default Cards (Rectangle, Cylinder, Stadium, Subroutine, Rounded)
  let containerClasses = cardBase;
  
  // Minimal border radius changes
  if (type === NodeType.CYLINDER) containerClasses += " border-b-[4px] rounded-b-md rounded-t-sm";
  else if (type === NodeType.STADIUM) containerClasses += " rounded-full px-4";
  else if (type === NodeType.ROUNDED) containerClasses += " rounded-md"; // Reduced from xl
  else if (type === NodeType.SUBROUTINE) containerClasses += " rounded-sm border-x-[4px] border-x-zinc-700"; 
  else containerClasses += " rounded-sm"; // Default Rectangle

  return (
    <div className={`${wrapperStyle} w-48`}>
      <Handle type="target" position={Position.Top} className="!bg-zinc-500 !w-2 !h-2" />
      
      <div 
        className={containerClasses}
        style={{ 
            borderColor: selected ? color : undefined,
            borderLeftColor: type === NodeType.SUBROUTINE ? (selected ? color : undefined) : undefined,
            borderRightColor: type === NodeType.SUBROUTINE ? (selected ? color : undefined) : undefined
        }}
      >
        {/* Strip */}
        {(type === NodeType.RECTANGLE || type === NodeType.ROUNDED || type === NodeType.SUBROUTINE) && (
            <div className="h-0.5 w-full opacity-80" style={{ backgroundColor: color }} />
        )}

        <div className="p-3">
            <div className="flex items-start gap-2.5 mb-1">
                <div className="p-1 rounded bg-zinc-950 border border-zinc-800 shrink-0">
                    <Icon className="w-3.5 h-3.5 text-zinc-400" style={{ color }} />
                </div>
                <div className="prose prose-invert prose-sm w-full max-w-none prose-p:text-zinc-300 prose-headings:text-zinc-100 prose-a:text-zinc-100 prose-code:text-zinc-300 prose-code:bg-zinc-800 prose-strong:text-zinc-100 select-none pointer-events-none text-left font-medium text-xs">
                     <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {label}
                     </ReactMarkdown>
                </div>
            </div>
            
            {data.url && (
                <div className="mt-1.5 pt-1.5 border-t border-zinc-800 flex items-center gap-1 text-[9px] text-zinc-500">
                    <Globe className="w-2.5 h-2.5" />
                    <span className="truncate max-w-[140px]">{data.url}</span>
                </div>
            )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-zinc-500 !w-2 !h-2" />
    </div>
  );
};

export default memo(CustomNode);
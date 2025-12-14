import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Database, Circle, Square, Diamond, Box, Hexagon, Globe, Layout, Layers, Spline } from 'lucide-react';
import { MermaidNodeData, NodeType } from '../types';

// Map types to Icons
const ICON_MAP = {
  [NodeType.RECTANGLE]: Box,
  [NodeType.ROUNDED]: Square, // Rounded square
  [NodeType.STADIUM]: Layout, // Pill
  [NodeType.CYLINDER]: Database,
  [NodeType.SUBROUTINE]: Layers,
  [NodeType.RHOMBUS]: Diamond,
  [NodeType.CIRCLE]: Circle,
  [NodeType.HEXAGON]: Hexagon,
  [NodeType.PARALLELOGRAM]: Spline,
};

const CustomNode = ({ data, selected }: NodeProps<MermaidNodeData>) => {
  const { label, type, color = '#3b82f6' } = data;
  const Icon = ICON_MAP[type] || Square;

  // Common wrapper styles (Glassmorphism + GitHub Dark Dimmed aesthetic)
  const wrapperStyle = `
    group relative flex flex-col items-center justify-center transition-all duration-300
    ${selected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900' : ''}
  `;

  // --- SHAPE RENDERERS ---

  // 1. Diamond (Rhombus)
  if (type === NodeType.RHOMBUS) {
    return (
      <div className={`${wrapperStyle} w-40 h-40`}>
        <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-3 !h-3 -mt-2 z-10" />
        <div 
          className="absolute inset-0 transform rotate-45 border-2 border-slate-700 bg-slate-900/90 shadow-xl backdrop-blur-md rounded-lg transition-colors group-hover:border-slate-500"
          style={{ borderColor: selected ? color : undefined }}
        />
        <div className="relative z-10 p-2 text-center flex flex-col items-center justify-center w-28 h-28 pointer-events-none">
          <Icon className="w-5 h-5 mb-1" style={{ color }} />
          <div className="prose prose-invert prose-p:text-xs prose-headings:text-sm prose-strong:text-blue-400 max-h-full overflow-hidden text-[10px] leading-tight">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>{label}</ReactMarkdown>
          </div>
        </div>
        <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-3 !h-3 -mb-2 z-10" />
      </div>
    );
  }

  // 2. Circle
  if (type === NodeType.CIRCLE) {
    return (
      <div className={`${wrapperStyle} w-32 h-32`}>
        <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-3 !h-3" />
        <div 
            className="absolute inset-0 rounded-full border-2 border-slate-700 bg-slate-900/90 shadow-xl backdrop-blur-md transition-colors group-hover:border-slate-500 flex items-center justify-center overflow-hidden"
            style={{ borderColor: selected ? color : undefined }}
        >
             <div className="flex flex-col items-center justify-center p-4 text-center pointer-events-none">
                <div className="prose prose-invert prose-p:text-xs prose-headings:text-sm prose-strong:text-emerald-400 text-xs leading-tight">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{label}</ReactMarkdown>
                </div>
             </div>
        </div>
        <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-3 !h-3" />
      </div>
    );
  }

  // 3. Hexagon
  if (type === NodeType.HEXAGON) {
      return (
        <div className={`${wrapperStyle} w-48 h-32`}>
          <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-3 !h-3" />
          {/* Hexagon Shape using CSS Clip Path is tricky with borders, using pseudo-elements or specific background */}
          <div 
            className="absolute inset-0 bg-slate-900/90 shadow-xl backdrop-blur-md transition-colors group-hover:bg-slate-800"
            style={{ 
                clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)',
                backgroundColor: '#0f172a' // Solid backing for transparency issues
            }}
          >
              <div className={`absolute inset-0 bg-slate-900/50 ${selected ? '' : 'border-y-2 border-slate-700'}`} style={{ borderColor: selected ? color : undefined }}></div>
          </div>
          
          {/* Hexagon Borders (Simulated) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M15,1 L85,1 L99,50 L85,99 L15,99 L1,50 Z" 
                   fill="none" 
                   stroke={selected ? color : "#334155"} 
                   strokeWidth="2" 
                   vectorEffect="non-scaling-stroke"
             />
          </svg>

          <div className="relative z-10 p-4 text-center flex flex-col items-center justify-center w-36 h-24 pointer-events-none">
            <Icon className="w-5 h-5 mb-1" style={{ color }} />
            <div className="prose prose-invert prose-p:text-xs prose-strong:text-purple-400 text-[10px] leading-tight">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>{label}</ReactMarkdown>
            </div>
          </div>
          <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-3 !h-3" />
        </div>
      );
  }

  // 4. Parallelogram
  if (type === NodeType.PARALLELOGRAM) {
    return (
        <div className={`${wrapperStyle} w-48`}>
           <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-3 !h-3" />
           <div 
             className="transform -skew-x-12 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-sm shadow-lg p-4 min-h-[5rem] flex items-center justify-center transition-colors group-hover:border-slate-600"
             style={{ borderColor: selected ? color : undefined }}
           >
              <div className="transform skew-x-12 w-full text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                     <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="prose prose-invert prose-sm text-xs leading-tight">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{label}</ReactMarkdown>
                </div>
              </div>
           </div>
           <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-3 !h-3" />
        </div>
    );
  }

  // 5. Default Cards (Rectangle, Cylinder, Stadium, Subroutine, Rounded)
  let containerClasses = "relative w-full overflow-hidden bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-lg transition-all duration-200 group-hover:border-slate-600";
  
  if (type === NodeType.CYLINDER) containerClasses += " border-b-[6px] rounded-b-xl rounded-t-lg";
  else if (type === NodeType.STADIUM) containerClasses += " rounded-full px-4";
  else if (type === NodeType.ROUNDED) containerClasses += " rounded-xl";
  else if (type === NodeType.SUBROUTINE) containerClasses += " rounded-lg border-x-[6px] border-x-slate-700"; // Double border effect
  else containerClasses += " rounded-lg"; // Default Rectangle

  return (
    <div className={`${wrapperStyle} w-52`}>
      <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-3 !h-3" />
      
      <div 
        className={containerClasses}
        style={{ 
            borderColor: selected ? color : undefined,
            borderLeftColor: type === NodeType.SUBROUTINE ? (selected ? color : undefined) : undefined,
            borderRightColor: type === NodeType.SUBROUTINE ? (selected ? color : undefined) : undefined
        }}
      >
        {/* Header Strip (Only for basic Rect/Rounded/Subroutine to keep it clean) */}
        {(type === NodeType.RECTANGLE || type === NodeType.ROUNDED || type === NodeType.SUBROUTINE) && (
            <div className="h-1 w-full" style={{ backgroundColor: color }} />
        )}

        <div className="p-4">
            <div className="flex items-start gap-3 mb-2">
                <div className="p-1.5 rounded-md bg-slate-800 border border-slate-700 shrink-0">
                    <Icon className="w-4 h-4" style={{ color }} />
                </div>
                {/* Markdown Content */}
                <div className="prose prose-invert prose-sm w-full max-w-none prose-p:text-slate-300 prose-headings:text-slate-100 prose-a:text-blue-400 prose-code:text-amber-400 prose-code:bg-slate-800/50 prose-strong:text-slate-100 select-none pointer-events-none text-left">
                     <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {label}
                     </ReactMarkdown>
                </div>
            </div>
            
            {data.url && (
                <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-1 text-[10px] text-blue-400">
                    <Globe className="w-3 h-3" />
                    <span className="truncate max-w-[150px]">{data.url}</span>
                </div>
            )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-3 !h-3" />
    </div>
  );
};

export default memo(CustomNode);
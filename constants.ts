import { NodeType, AppNode, AppEdge } from './types';

export const INITIAL_NODES: AppNode[] = [
  {
    id: 'start',
    type: 'custom',
    position: { x: 250, y: 50 },
    data: { label: '**Start**\n_Initialize_ `main()`', type: NodeType.CIRCLE, color: '#10b981' }, // Emerald
  },
  {
    id: 'process',
    type: 'custom',
    position: { x: 250, y: 200 },
    data: { label: 'Process **Data**\n> Transform payload', type: NodeType.RECTANGLE, color: '#3b82f6' }, // Blue
  },
  {
    id: 'decision',
    type: 'custom',
    position: { x: 250, y: 350 },
    data: { label: 'Is **Valid**?', type: NodeType.RHOMBUS, color: '#f59e0b' }, // Amber
  },
];

export const INITIAL_EDGES: AppEdge[] = [
  { id: 'e1-2', source: 'start', target: 'process', type: 'smoothstep', animated: true },
  { id: 'e2-3', source: 'process', target: 'decision', type: 'smoothstep' },
];

export const COLORS = {
  blue: '#3b82f6',
  red: '#ef4444',
  green: '#10b981',
  amber: '#f59e0b',
  purple: '#8b5cf6',
  slate: '#64748b',
};

export const DEFAULT_VIEWPORT = { x: 0, y: 0, zoom: 1 };
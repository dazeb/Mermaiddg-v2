import { Node, Edge } from 'reactflow';

export enum NodeType {
  RECTANGLE = 'rectangle',
  ROUNDED = 'rounded',
  STADIUM = 'stadium',
  CYLINDER = 'cylinder',
  SUBROUTINE = 'subroutine',
  RHOMBUS = 'rhombus',
  CIRCLE = 'circle',
  HEXAGON = 'hexagon',
  PARALLELOGRAM = 'parallelogram'
}

export interface MermaidNodeData {
  label: string;
  type: NodeType;
  color?: string;
  url?: string;
}

export type AppNode = Node<MermaidNodeData>;
export type AppEdge = Edge;

export interface GeneratedDiagramResponse {
  nodes: {
    id: string;
    label: string;
    type: string; // approximate to NodeType
  }[];
  edges: {
    source: string;
    target: string;
    label?: string;
  }[];
}

export interface AIState {
  isLoading: boolean;
  error: string | null;
}
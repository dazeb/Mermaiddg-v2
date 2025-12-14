import { AppNode, AppEdge, NodeType } from '../types';

// Map internal types to Mermaid shapes
const SHAPE_MAP: Record<NodeType, { open: string; close: string }> = {
  [NodeType.RECTANGLE]: { open: '[', close: ']' },
  [NodeType.ROUNDED]: { open: '(', close: ')' },
  [NodeType.STADIUM]: { open: '([', close: '])' },
  [NodeType.CYLINDER]: { open: '[(', close: ')]' },
  [NodeType.SUBROUTINE]: { open: '[[', close: ']]' },
  [NodeType.RHOMBUS]: { open: '{', close: '}' },
  [NodeType.CIRCLE]: { open: '((', close: '))' },
  [NodeType.HEXAGON]: { open: '{{', close: '}}' },
  [NodeType.PARALLELOGRAM]: { open: '[/', close: '/]' },
};

/**
 * Visual -> Code
 * Converts React Flow nodes and edges to Mermaid Flowchart TD string
 * Uses Mermaid's Markdown string syntax: id["`Markdown Content`"]
 */
export const generateMermaidCode = (nodes: AppNode[], edges: AppEdge[]): string => {
  const lines: string[] = ['flowchart TD'];

  // Add Nodes
  nodes.forEach((node) => {
    const shape = SHAPE_MAP[node.data.type] || SHAPE_MAP[NodeType.RECTANGLE];
    // Escape backticks for Mermaid Markdown syntax
    const safeLabel = node.data.label.replace(/`/g, "'");
    const id = node.id.replace(/\s+/g, '_');
    
    // Check if label contains characters that require quoting or Markdown syntax
    // We treat almost everything as rich text to support emojis and styling consistently
    const isMarkdown = /[*\n`_\[\]]/.test(safeLabel) || /[\u{1F300}-\u{1F9FF}]/u.test(safeLabel);
    
    if (isMarkdown) {
        // Use Mermaid Markdown string syntax: id["`content`"]
        lines.push(`    ${id}${shape.open}"\`${safeLabel}\`"${shape.close}`);
    } else {
        lines.push(`    ${id}${shape.open}"${safeLabel}"${shape.close}`);
    }
    
    if (node.data.url) {
        lines.push(`    click ${id} "${node.data.url}"`);
    }
  });

  // Add Edges
  edges.forEach((edge) => {
    const source = edge.source.replace(/\s+/g, '_');
    const target = edge.target.replace(/\s+/g, '_');
    lines.push(`    ${source} --> ${target}`);
  });
  
  // Add Styles
  nodes.forEach((node) => {
      // Only add style if color differs from default or exists
      if (node.data.color) {
          // We map the node's accent color to Mermaid's 'fill' and 'stroke' for consistency in other viewers
          // We primarily use stroke in the visual editor to represent the accent
          lines.push(`    style ${node.id.replace(/\s+/g, '_')} fill:${node.data.color},stroke:${node.data.color},stroke-width:4px`);
      }
  });

  return lines.join('\n');
};

/**
 * Code -> Visual
 * Supports standard and Markdown string syntax
 */
export const parseMermaidCode = (code: string): { nodes: AppNode[]; edges: AppEdge[] } => {
  const lines = code.split('\n');
  const nodes: AppNode[] = [];
  const edges: AppEdge[] = [];
  const nodeMap = new Map<string, AppNode>();
  
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('graph') || trimmed.startsWith('flowchart') || trimmed.startsWith('%%')) return;

    // Detect Style: style ID fill:#...,stroke:#...
    // Regex: style\s+(\S+)\s+(.*)
    const styleMatch = trimmed.match(/^style\s+(\S+)\s+(.*)$/);
    if (styleMatch) {
        const id = styleMatch[1];
        const styles = styleMatch[2];
        
        // Simple extraction of fill or stroke to map back to our 'color' prop
        // We prioritize stroke because in our generation we set stroke to the accent color
        const colorMatch = styles.match(/fill:([^,]+)/) || styles.match(/stroke:([^,]+)/);
        
        if (colorMatch && nodeMap.has(id)) {
            nodeMap.get(id)!.data.color = colorMatch[1];
        }
        return; // Skip node processing for style lines
    }

    // Helper to process node definition string
    const processNode = (raw: string): string => {
        // Simple extraction of ID for existing nodes
        // Matches "ID" followed by any bracket opener
        const idMatch = raw.match(/^([A-Za-z0-9_]+)/);
        if (!idMatch) return raw; // Fallback
        
        const id = idMatch[1];
        
        if (!nodeMap.has(id)) {
            // Regex to find content between brackets. 
            // We need to handle nested quotes for markdown: `["`label`"]`
            // and regular strings: `["label"]` or `[label]`
            // Openers: ([ [[ [( (( {{ [/ [ ( {
            const match = raw.match(/(\[\[|\[\(|\[\/|\(\(|\[|{{|\(\||\{|\(\[|\()(?:"`|"`|")?(.*?)(?:`"|`"|")?(\]\]|\)\]|\/\]|\)\)|\]|}}|\)\||\}|\)\]|\))/);
            
            let label = id;
            let type = NodeType.RECTANGLE;
            
            if (match) {
                const open = match[1];
                const content = match[2];
                // const close = match[3];

                // Determine type based on opener (greedy match in regex helps)
                if (open === '{{') type = NodeType.HEXAGON;
                else if (open === '[[') type = NodeType.SUBROUTINE;
                else if (open === '[(') type = NodeType.CYLINDER;
                else if (open === '([') type = NodeType.STADIUM;
                else if (open === '((') type = NodeType.CIRCLE;
                else if (open === '[/') type = NodeType.PARALLELOGRAM;
                else if (open === '{') type = NodeType.RHOMBUS;
                else if (open === '(') type = NodeType.ROUNDED;
                else type = NodeType.RECTANGLE;

                label = content || id;
            }

            const newNode: AppNode = {
                id,
                type: 'custom',
                position: { x: 0, y: 0 },
                data: { label, type },
            };
            nodeMap.set(id, newNode);
            nodes.push(newNode);
        }
        return id;
    };

    // Detect Edge: A --> B
    if (trimmed.includes('-->')) {
      const parts = trimmed.split('-->');
      const sourceRaw = parts[0].trim();
      const targetRaw = parts[1].trim();
      
      const sourceId = processNode(sourceRaw);
      const targetId = processNode(targetRaw);

      edges.push({
        id: `e-${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId,
        type: 'smoothstep'
      });
    } 
    // Detect Node Definition only: A[Label]
    else if (trimmed.match(/^[A-Za-z0-9_]+(\[|\{|\(|\(\()/)) {
        processNode(trimmed);
    }
  });

  // Re-run layout logic only if we parsed new nodes
  if (nodes.length === 0) return { nodes: [], edges: [] };

  // Basic Tree Layout (Preserved from original)
  const incomingEdgeCounts = new Map<string, number>();
  edges.forEach(e => {
      incomingEdgeCounts.set(e.target, (incomingEdgeCounts.get(e.target) || 0) + 1);
  });

  const levels: AppNode[][] = [];
  const visited = new Set<string>();
  
  let currentLevelNodes = nodes.filter(n => (incomingEdgeCounts.get(n.id) || 0) === 0);
  if (currentLevelNodes.length === 0 && nodes.length > 0) currentLevelNodes = [nodes[0]];

  while (currentLevelNodes.length > 0) {
      levels.push(currentLevelNodes);
      currentLevelNodes.forEach(n => visited.add(n.id));
      
      const nextLevelIds = new Set<string>();
      currentLevelNodes.forEach(node => {
          edges.filter(e => e.source === node.id).forEach(e => {
              if (!visited.has(e.target)) nextLevelIds.add(e.target);
          });
      });
      currentLevelNodes = Array.from(nextLevelIds).map(id => nodeMap.get(id)!).filter(Boolean);
  }
  
  const remaining = nodes.filter(n => !visited.has(n.id));
  if (remaining.length > 0) levels.push(remaining);

  levels.forEach((levelNodes, lvlIdx) => {
      const y = lvlIdx * 200 + 50; 
      const totalWidth = levelNodes.length * 240; 
      const startX = 600 - (totalWidth / 2);
      
      levelNodes.forEach((node, nodeIdx) => {
          node.position = {
              x: startX + (nodeIdx * 260),
              y: y
          };
      });
  });

  return { nodes, edges };
};
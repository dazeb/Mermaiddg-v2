import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  ReactFlowProvider,
  BackgroundVariant,
  useReactFlow,
} from 'reactflow';
import { Wand2, Play, Download, Layout, Code, FileCode, Image as ImageIcon, ChevronDown, Plus } from 'lucide-react';
import { toPng } from 'html-to-image';

// Components
import Sidebar from './components/Sidebar';
import PropertiesPanel from './components/PropertiesPanel';
import CodePanel from './components/CodePanel';
import CustomNode from './components/CustomNode';
import { LoadingOverlay } from './components/LoadingOverlay';
import { Tooltip } from './components/Tooltip';

// Logic
import { INITIAL_NODES, INITIAL_EDGES, DEFAULT_VIEWPORT, COLORS } from './constants';
import { generateMermaidCode, parseMermaidCode } from './utils/mermaidHelpers';
import { AppNode, MermaidNodeData, NodeType } from './types';
import { generateDiagramFromPrompt } from './services/geminiService';

// Node Types Registration
const nodeTypes = {
  custom: CustomNode,
};

const MermaidStudio = () => {
  // State
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [mermaidCode, setMermaidCode] = useState<string>('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [presentationMode, setPresentationMode] = useState(false);
  const [isCodePanelOpen, setIsCodePanelOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  
  // Refs
  const isSyncingRef = useRef(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();

  // Initial Sync (Visual -> Code)
  useEffect(() => {
    const code = generateMermaidCode(nodes, edges);
    setMermaidCode(code);
  }, []);

  // Sync: Visual -> Code
  useEffect(() => {
    if (isSyncingRef.current) return;
    
    // Simple debounce via timeout
    const timeout = setTimeout(() => {
        const code = generateMermaidCode(nodes, edges);
        setMermaidCode(code);
    }, 200);

    return () => clearTimeout(timeout);
  }, [nodes, edges]);

  // Sync: Code -> Visual
  const handleCodeChange = (newCode: string) => {
    setMermaidCode(newCode);
    isSyncingRef.current = true;
    
    try {
        const { nodes: newNodes, edges: newEdges } = parseMermaidCode(newCode);
        if (newNodes.length > 0) {
            setNodes(newNodes);
            setEdges(newEdges);
        }
    } catch (e) {
        // Silent fail for syntax errors during typing
    } finally {
        setTimeout(() => { isSyncingRef.current = false; }, 500);
    }
  };

  // Export Functions
  const handleExportCode = () => {
    const blob = new Blob([mermaidCode], { type: 'text/vnd.mermaid' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.mmd';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExportMenuOpen(false);
  };

  const handleExportImage = useCallback(() => {
    if (reactFlowWrapper.current === null) {
      return;
    }

    // Hide controls momentarily for clean screenshot
    toPng(reactFlowWrapper.current, { 
        cacheBust: true, 
        backgroundColor: '#09090b', // zinc-950
        style: { width: '100%', height: '100%' },
        filter: (node) => true
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'mermaid-diagram.png';
        link.href = dataUrl;
        link.click();
        setIsExportMenuOpen(false);
      })
      .catch((err) => {
        console.error("Export Error:", err);
        alert('Failed to export image. Please try again.');
      });
  }, [reactFlowWrapper]);

  // Interactions
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: AppNode = {
        id: `node_${nodes.length + 1}`,
        type: 'custom',
        position,
        data: { label: 'New Node', type, color: COLORS.zinc },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, reactFlowInstance, setNodes]
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  };

  const onPaneClick = () => {
    setSelectedNodeId(null);
    setIsExportMenuOpen(false);
  };

  const handleUpdateNode = (id: string, data: Partial<MermaidNodeData>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      })
    );
  };

  const handleDeleteNode = (id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setSelectedNodeId(null);
  };

  const handleAIBuild = async () => {
    if (!aiPrompt.trim()) return;
    
    // Check for API Key
    const win = window as any;
    if (win.aistudio && !process.env.API_KEY) {
       const hasKey = await win.aistudio.hasSelectedApiKey();
       if (!hasKey) {
          await win.aistudio.openSelectKey();
       }
    }

    setIsAiLoading(true);
    try {
      const data = await generateDiagramFromPrompt(aiPrompt);
      
      const newNodes: AppNode[] = data.nodes.map((n, idx) => ({
        id: n.id,
        type: 'custom',
        position: { x: 250 + (idx % 3) * 200, y: 100 + Math.floor(idx / 3) * 150 },
        data: { 
            label: n.label, 
            type: (n.type as NodeType) || NodeType.RECTANGLE,
            color: COLORS.zinc 
        }
      }));

      const newEdges: Edge[] = data.edges.map(e => ({
        id: `e-${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
        label: e.label,
        type: 'smoothstep',
        animated: true
      }));

      setNodes(newNodes);
      setEdges(newEdges);
      setAiPrompt('');
      
      setTimeout(() => {
         const layoutCode = generateMermaidCode(newNodes, newEdges);
         const layoutResult = parseMermaidCode(layoutCode);
         setNodes(layoutResult.nodes);
         setEdges(layoutResult.edges);
         reactFlowInstance.fitView();
      }, 100);

    } catch (error) {
      console.error("AI Error", error);
      alert("Failed to generate diagram. Please check API Key and try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAutoLayout = () => {
      // 1. Generate code from current nodes to ensure we have the latest structure
      const currentCode = generateMermaidCode(nodes, edges);
      
      // 2. Parse that code to get the calculated layout positions
      const layoutResult = parseMermaidCode(currentCode);
      
      // 3. Merge new positions into existing nodes to preserve all properties (colors, etc.)
      setNodes((prevNodes) => {
          const posMap = new Map(layoutResult.nodes.map(n => [n.id, n.position]));
          
          return prevNodes.map(node => {
              if (posMap.has(node.id)) {
                  return { ...node, position: posMap.get(node.id)! };
              }
              return node;
          });
      });
      
      setTimeout(() => reactFlowInstance.fitView(), 50);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-black overflow-hidden font-sans">
      {/* Top Toolbar */}
      {!presentationMode && (
        <header className="h-14 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 z-20 relative">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-zinc-100 rounded text-zinc-950 flex items-center justify-center font-bold text-sm">M</div>
            <h1 className="font-semibold text-sm text-zinc-100 tracking-tight">Mermaid <span className="text-zinc-500 font-normal">Studio</span></h1>
          </div>

          <div className="flex-1 max-w-xl mx-8 flex gap-2">
            <input 
                type="text" 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAIBuild()}
                placeholder="Describe a system..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-white focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 outline-none transition-all placeholder-zinc-600"
            />
            <Tooltip content="Generate with AI" position="bottom">
                <button 
                    onClick={handleAIBuild}
                    className="bg-zinc-100 hover:bg-white text-zinc-950 px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-colors"
                >
                    <Wand2 className="w-3.5 h-3.5" /> Generate
                </button>
            </Tooltip>
          </div>

          <div className="flex items-center gap-1.5">
             <Tooltip content="Auto Layout" position="bottom">
                <button 
                    onClick={handleAutoLayout}
                    className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
                >
                    <Layout className="w-4 h-4" />
                </button>
             </Tooltip>
             
             <Tooltip content={isCodePanelOpen ? "Hide Code" : "Show Code"} position="bottom">
                <button 
                    onClick={() => setIsCodePanelOpen(!isCodePanelOpen)}
                    className={`p-1.5 rounded-md transition-colors ${isCodePanelOpen ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'}`}
                >
                    <Code className="w-4 h-4" />
                </button>
            </Tooltip>

            <div className="w-px h-4 bg-zinc-800 mx-1"></div>

            <Tooltip content="Present" position="bottom">
                <button 
                    onClick={() => setPresentationMode(true)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
                >
                    <Play className="w-4 h-4" />
                </button>
            </Tooltip>
            
            {/* Export Dropdown */}
            <div className="relative">
                <Tooltip content="Export" position="bottom" delay>
                    <button 
                        onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                        className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 border border-zinc-800 transition-colors"
                    >
                        <Download className="w-3.5 h-3.5" /> <ChevronDown className="w-3 h-3" />
                    </button>
                </Tooltip>
                
                {isExportMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-zinc-900 border border-zinc-800 rounded-md shadow-xl overflow-hidden z-50">
                        <button 
                            onClick={handleExportCode}
                            className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-2"
                        >
                            <FileCode className="w-3.5 h-3.5" /> Mermaid (.mmd)
                        </button>
                        <button 
                            onClick={handleExportImage}
                            className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-2 border-t border-zinc-800"
                        >
                            <ImageIcon className="w-3.5 h-3.5" /> Image (.png)
                        </button>
                    </div>
                )}
            </div>
          </div>
        </header>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        {!presentationMode && <Sidebar />}

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col relative h-full">
            <div ref={reactFlowWrapper} className="flex-1 w-full h-full bg-black" onDragOver={onDragOver} onDrop={onDrop}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    onPaneClick={onPaneClick}
                    nodeTypes={nodeTypes}
                    defaultViewport={DEFAULT_VIEWPORT}
                    fitView
                    snapToGrid
                    snapGrid={[20, 20]}
                >
                    <Background color="#27272a" gap={20} size={1} variant={BackgroundVariant.Dots} />
                    {!presentationMode && <Controls className="!bg-zinc-900 !border-zinc-800 !rounded-md [&>button]:!fill-zinc-400 [&>button:hover]:!fill-white [&>button]:!border-b-zinc-800" />}
                </ReactFlow>

                {presentationMode && (
                    <button 
                        onClick={() => setPresentationMode(false)}
                        className="absolute top-4 right-4 bg-zinc-900/80 hover:bg-zinc-900 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border border-zinc-800 z-50 transition-colors"
                    >
                        Exit Presentation
                    </button>
                )}

                <LoadingOverlay isVisible={isAiLoading} />
            </div>

            {/* Bottom Code Panel */}
            {!presentationMode && (
                <CodePanel 
                    code={mermaidCode} 
                    onChange={handleCodeChange}
                    height={isCodePanelOpen ? 240 : 0}
                />
            )}
        </div>

        {/* Right Properties Panel */}
        {!presentationMode && selectedNodeId && (
            <PropertiesPanel 
                selectedNode={nodes.find(n => n.id === selectedNodeId) || null} 
                onUpdate={handleUpdateNode}
                onDelete={handleDeleteNode}
                onClose={() => setSelectedNodeId(null)}
            />
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <MermaidStudio />
    </ReactFlowProvider>
  );
}
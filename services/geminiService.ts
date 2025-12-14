import { GoogleGenAI, Type, Schema } from '@google/genai';
import { GeneratedDiagramResponse } from '../types';

export const generateDiagramFromPrompt = async (prompt: string): Promise<GeneratedDiagramResponse> => {
  if (!process.env.API_KEY) {
    throw new Error('API Key is missing. Please select an API key to continue.');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      nodes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: "Unique identifier for the node (no spaces, e.g. node_1)" },
            label: { type: Type.STRING, description: "Text displayed inside the node" },
            type: { type: Type.STRING, description: "Shape type: 'rectangle', 'cylinder', 'rhombus', or 'circle'" },
          },
          required: ["id", "label", "type"]
        }
      },
      edges: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                source: { type: Type.STRING, description: "ID of the source node" },
                target: { type: Type.STRING, description: "ID of the target node" },
                label: { type: Type.STRING, description: "Optional text on the connector line" }
            },
            required: ["source", "target"]
        }
      }
    },
    required: ["nodes", "edges"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a Mermaid diagram structure based on this request: "${prompt}". 
      Analyze the entities and relationships. 
      Use 'rhombus' for decisions/conditions, 'cylinder' for databases, 'circle' for start/end, and 'rectangle' for processes/services.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        systemInstruction: "You are an expert system architect and diagram engineer."
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedDiagramResponse;
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

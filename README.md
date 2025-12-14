# Mermaid Visual Studio

**Mermaid Visual Studio** is a professional, "No-Code" interface for building Mermaid.js diagrams. It bridges the gap between visual whiteboarding and code-based diagramming, offering bidirectional synchronization and AI-powered automation.

## 🚀 Features

### 🎨 Visual & Interactive Editor
- **Drag-and-Drop Interface**: Easily construct flowcharts using a comprehensive library of shapes (Process, Decision, Database, I/O, etc.).
- **Rich Text Support**: Nodes support **Markdown** formatting (bold, code blocks) and **Emojis** 🚀.
- **Smart Layouts**: Auto-layout functionality to instantly organize messy diagrams while preserving your custom styles.
- **Glassmorphism UI**: A modern, dark-themed aesthetic designed for long coding sessions.

### 🤖 AI-Powered Generation
- **Text-to-Diagram**: Describe your system (e.g., "Login flow with 2FA and Database verification") and let the **Google Gemini** model generate the diagram structure for you.
- **Intelligent Context**: The AI understands standard flowchart conventions, automatically selecting diamonds for decisions, cylinders for databases, and styling nodes appropriately.

### 🔄 Bidirectional Synchronization
- **Live Code Editor**: Watch the Mermaid code generate in real-time as you draw.
- **Code-to-Visual**: Type or paste existing Mermaid code, and the visual canvas updates instantly.
- **Style Persistence**: Custom colors and node styles are preserved in the code using Mermaid's `style` syntax.

### 🛠️ Professional Tools
- **Presentation Mode**: A clean, full-screen view for sharing diagrams without UI clutter.
- **Export Options**: Download high-quality **PNG** images or **.mmd** source files.
- **Property Editor**: Fine-tune node labels, colors, shapes, and add interactive URLs.
- **Tooltips**: Built-in help system to explain node types and interface functions.

## 📦 Tech Stack

- **Framework**: React 19
- **Visual Engine**: React Flow 11
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini (`gemini-2.5-flash`) via `@google/genai` SDK
- **Icons**: Lucide React
- **Utils**: `html-to-image`, `react-markdown`

## 🏁 Getting Started

### Prerequisites
- Node.js installed (if running locally)
- A valid Google Cloud API Key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mermaid-visual-studio.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## 📖 Usage Guide

### Creating Nodes
Drag shapes from the **Widget Library** on the left sidebar onto the canvas.
- **Rectangle**: Standard process steps.
- **Rhombus**: Decision points (Yes/No branches).
- **Cylinder**: Databases or storage.
- **Hexagon/Stadium**: Preparation or Terminal points.

### Connecting Nodes
Hover over the edge of a node to see a handle (dot). Click and drag to another node to create a connection.

### Using AI Generation
1. Type a prompt in the top search bar (e.g., "E-commerce checkout process with inventory check").
2. Click the **Generate** button.
3. The AI will build the nodes and connections automatically.
4. *Note: You may be prompted to select an API key securely via the interface.*

### Editing Properties
Click on any node to open the **Properties Panel**.
- **Content**: Change text (supports Markdown: `**bold**`, `_italic_`).
- **Shape**: Change the geometric shape of the node on the fly.
- **Color**: Select accent colors (Blue, Red, Green, Amber, etc.).
- **Interaction**: Add a URL to make the node clickable in the exported diagram.

## ⌨️ Shortcuts & Tips

- **Markdown**: Use `**text**` for bold and `` `code` `` for inline code blocks.
- **Copy Code**: Open the Code Panel (bottom) and click the Copy icon to get the raw Mermaid syntax for use in GitHub, Notion, or Obsidian.
- **Auto Layout**: If your diagram gets tangled, click the **Layout** icon in the toolbar to automatically arrange nodes.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
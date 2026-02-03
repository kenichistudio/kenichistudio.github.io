# Kenichi Studio

**Simple Tools. Powerful Stories.**

Kenichi Studio is an advanced educational platform and content creation studio aimed at making learning engaging through interactive components and a dedicated creative environment. It leverages the power of Astro, React, and modern web technologies to deliver a seamless, performant, and visually rich user experience.

## 🌟 Features

- **🎨 Kenichi Studio**: A powerful in-browser content creation tool.
    - **Layer-based Editing**: Manage scenes with a familiar professional workflow.
    - **Animated Components**: Drag-and-drop elements including Progress Bars, Typewriter Code, and Counters.
    - **Client-Side Video Export**: Export creations as WebM/MP4 directly from the browser using Remotion technology.
    - **Real-time Preview**: Smooth playback and scrubbing capabilities.
- **📚 Education Hub**: Structured learning environment with courses, lessons, and progress tracking.
- **✍️ Interactive Blog**: Engaging technical content enhanced with custom interactive components.
- **📊 Rich Visualization**: Integrated charts, diagrams (Mermaid, Markmap), and mathematical rendering (KaTeX).
- **🌓 Dark Mode**: Fully supported dark/light theme toggle with persistent preferences.
- **⚡ Performance**: Built on Astro for blazing fast performance and low TBT.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/kinetix.git
cd kinetix

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to see your site.

## 📁 Project Structure

```text
kinetix/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI library
│   │   ├── studio/          # Studio-specific components (Layers, Timeline)
│   │   ├── charts/          # Data visualization components
│   │   ├── animator/        # Animation logic and wrappers
│   │   ├── scribble/        # Hand-drawn effects
│   │   ├── vox/             # VOX-style documentary components
│   │   └── ui/              # General UI elements
│   ├── content/             # Content collections (Blog, Education)
│   ├── layouts/             # Page layouts
│   ├── pages/               # Application routes
│   ├── styles/              # Global styles and tailwind config
│   └── utils/               # Helper functions and engine logic
└── package.json
```

## 🎨 Design System

### Color Palette

**Primary (Blue):**
- Default: `#3B82F6`
- Hover: `#2563EB`

**Accent (Yellow):**
- Default: `#EAB308`
- Hover: `#CA8A04`

**Surfaces:**
- Dark: `#141414` (Background), `#1C1C1C` (Surface)
- Light: `#FFFFFF` (Background), `#F9FAFB` (Surface)

### Typography

- **Headings/Body**: [Inter](https://fonts.google.com/specimen/Inter)
- **Hand-drawn**: [Kalam](https://fonts.google.com/specimen/Kalam)

## 🔧 Technology Stack

- **Framework**: [Astro v5](https://astro.build/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Nanostores](https://github.com/nanostores/nanostores) & [Zustand](https://github.com/pmndrs/zustand)
- **Video Engine**: [Remotion](https://www.remotion.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Diagrams**: Mermaid, Markmap
- **Math**: KaTeX

## 🌐 Deployment

The site is built to be deployed as a static site or with an SSR adapter.

```bash
# Build the project
npm run build

# Preview locally
npm run preview
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our development workflow, code style, and submission process.

## 📄 License

This project is open source and available under the MIT License.

# Kenichi Studio 🎨

**Simple Tools. Powerful Stories.**

Kenichi Studio is an advanced educational platform and content creation studio designed to make learning engaging through interactive components and a professional creative environment. It leverages Astro, React, and a custom high-performance engine to deliver a seamless, visually rich user experience.

---

## 🌟 Key Features

- **🎨 Advanced Studio Engine**: A professional layer-based content creator.
    - **Animated Objects**: Progress bars, typewriter code, counters, and advanced charts.
    - **📊 Bar Chart Race**: High-performance animated bar races with dynamic data and entity coloring.
    - **Client-Side Export**: Export creations as WebM/MP4 directly from the browser.
- **📚 Education & Blog**: Integrated learning hub and interactive blog enhanced with custom MDX widgets.
- **⚡ Performance First**: Built on Astro for blazing-fast page loads and optimized runtime.
- **🌓 Modern Aesthetics**: Premium dark/light modes with a focus on visual excellence.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/simplearyan/kenichi-studio.git
   cd kenichi-studio
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start development:**
   ```bash
   npm run dev
   ```

Visit `http://localhost:4321/create` to launch the Studio.

---

## 🏗️ Architecture

We use a **Feature-Based Architecture** to ensure modularity and ease of contribution.

```text
src/
├── core/              # Core Engine, Object classes, and Workers
├── features/          # Domain features (Studio, Animator, Website)
├── content-widgets/   # MDX and Blog visual components
├── shared/            # Reusable UI, hooks, and utilities
├── layouts/           # Page layouts
└── pages/             # App routes
```

---

## 🔧 Tech Stack

- **Framework**: [Astro v5](https://astro.build/) & [React 19](https://react.dev/)
- **State**: [Nanostores](https://github.com/nanostores/nanostores) & [Zustand](https://github.com/pmndrs/zustand)
- **Video**: [Remotion](https://www.remotion.dev/) & Custom Engine
- **Styling**: Vanilla CSS & Tailwind CSS
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🤝 Contributing

We welcome additions! Before you start, please read our **[CONTRIBUTING.md](./CONTRIBUTING.md)** for:
- Detailed setup instructions.
- Architecture standards.
- Branching and Git workflow.

---

## 📄 License

Open-source under the MIT License.

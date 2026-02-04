# Kinetix Open Source Strategy

## 1. The Pitch: "The Engine for the Creator Economy"

**Hook:** "Stop rebuilding the video rendering loop. Kinetix Core gives you frame-perfect, 60fps video export in the browser, without the framework lock-in."

**Key Value Propositions:**
1.  **True Independence**: Unlike Remotion (React-only) or PIXI (Renderer-only), Kinetix is a complete *Time-Based* engine that works with any UI framework.
2.  **Offline-First Quality**: We don't just capture the canvas stream. We step through time frame-by-frame (using Web Workers) to guarantee 4K export quality even on a potato laptop.
3.  **Built on Giants**: Powered by the battle-tested **`mediabunny`** for frame-perfect encoding and **`webm-muxer`** for fast intra-browser C++/WASM rendering. We handle the hard low-level math so you don't have to.
4.  **Developer Experience**: Typed, modular, and lightweight.

**Donation Ask (Sponsorware):**
"Kinetix is MIT/MPL licensed and free forever. Creating a video engine is hard work. Sponsors get access to:
- Priority Support
- Early access to plugins (e.g., Chart.js adapter)
- Your logo on our repo"

## 2. Library vs. Framework

To grow, Kinetix needs to evolve from a *Library* (what it is now) into a *Framework* (what it could be).

### Current State: The Library (`@kinetix/core`)
A set of tools you import to build your own app.
- **User Responsibility**: create the canvas, handle the UI, manage the state, call `engine.render()`.
- **Pros**: Flexible, lightweight, can be dropped into existing apps.
- **Cons**: High barrier to entry. User has to build their own Timeline UI.

### Future State: The Framework (`@kinetix/framework`)
A complete system that provides the scaffolding.
- **User Responsibility**: just write the content/script.
- **Features to Add**:
    - **CLI**: `npx create-kinetix-app`.
    - **UI Components**: A pre-built `<Timeline />` and `<PropertiesPanel />` that auto-bind to the engine.
    - **Hot Reloading:** Change a variable, seeking stays at current time.
    - **Cloud Rendering**: A deployable Docker container for server-side rendering.

**Comparison Table for Repo:**

| Feature | Library (`@kinetix/core`) | Framework (`@kinetix/framework`) |
| :--- | :--- | :--- |
| **Philosophy** | "Here are the tools, build your house." | "Here is the house, decorate it." |
| **Entry Point** | `import { Engine }` | `npx create-kinetix` |
| **State Mgmt** | Manual (You update `obj.x`) | Reactive (Bind to React/Vue state) |
| **Ideal For** | Custom tools, embedding in existing SaaS | building a "Canva clone" from scratch |

## 3. NPM Installation Plan

You are already set up for this!

**Current Status:**
- `package.json` is configured with `name: "@kinetix/core"`.
- `exports` are set up for ESM and CJS.

**How a user will use it:**
1.  `npm install @kinetix/core`
2.  Import it:
    ```javascript
    import { Engine, RectObject } from '@kinetix/core';
    const engine = new Engine(document.querySelector('canvas'));
    engine.scene.add(new RectObject(...));
    ```

**Next Steps to Publish:**
1.  Create an account on npmjs.com.
2.  Run `npm login` in terminal.
3.  Run `npm publish --access public` inside `src/open-source-engine`.

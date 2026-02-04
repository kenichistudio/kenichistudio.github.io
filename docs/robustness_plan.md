# Robustness & Performance Plan: Kinetix Core

## 1. Analysis of Current State

### Strengths
- **Simple Architecture**: The `Engine -> Scene -> Object` hierarchy is easy to understand.
- **Offline Reliability**: The `mediabunny` worker pipeline deals with the hardest part of web video (frame perfect export) excellently.
- **Framework Agnostic**: No React/Vue dependencies in the core.

### Weaknesses
1.  **Tight Coupling in Core**: `Core.ts` currently handles the Game Loop, Rendering, Mouse Interaction, *and* Resizing logic. This violates the Single Responsibility Principle.
2.  **Type Safety Gaps**: The resize logic uses `(obj as any).fontSize *= sizeScale` which is brittle. If we rename `fontSize` to `font_size`, this code breaks silently.
3.  **Input Memory Churn**: `_getMousePos` returns a new `{x, y}` object on every event (dozens per second). This causes unnecessary Garbage Collection (GC) pauses.
4.  **Error Fragility**: If `obj.draw()` throws an error (e.g., loading an image fails), the entire `requestAnimationFrame` loop may crash, freezing the canvas.

---

## 2. Refactoring Plan

### Phase 1: Decoupling (The Plugin System)
We will move specialized logic out of `Core.ts` into "Systems" or "Plugins".

-   **Goal**: `Core.ts` should only care about: **Time**, **Loop**, and **calling .render()**.
-   **Action**:
    -   Extract **Interaction** (Mouse/Touch) into `InteractionManager`.
    -   Extract **Resize/Layout** logic into `LayoutManager`.
    -   Core simply initializes these managers.

### Phase 2: Type Robustness
-   **Goal**: Eliminate `any` casting for properties.
-   **Action**:
    -   Define a `Transformable` interface for objects that can be scaled/positioned.
    -   Define a `Styleable` interface for objects with text/visual properties.
    -   Update `Object.ts` to implement these interfaces.

### Phase 3: Performance & Safety
-   **Goal**: Zero GC in the render loop and crash resilience.
-   **Action**:
    -   **Object Pooling**: For `MouseEvent` coordinates, reuse a single `Vector2` instance instead of creating new ones.
    -   **Safe Render Loop**: Wrap `scene.render()` in a `try/catch` block. If an object fails to render, log it once per second (to avoid console flood) and skip it, keeping the rest of the scene alive.

---

## 3. Roadmap for "Library vs Framework"

To keep it **Lightweight** (Library) but capable of **Framework** features:

### The "Core" (Lightweight)
*   **Size Target**: < 40KB (gzipped).
*   **Focus**: Just the Engine, Scene, and Exports.
*   **No UI**: No built-in timelines, property panels, or heavy DOM elements.

### The "Extensions" (Robustness)
We will create a `packages/` monorepo structure in the future (optional for now, but good for planning):

1.  **`@kinetix/core`**: The engine (what we have now).
2.  **`@kinetix/interaction`**: (Optional) Advanced drag-drop, transform gizmos, multi-select.
3.  **`@kinetix/react`**: React hooks (`useEngine`, `useTimeline`).
4.  **`@kinetix/presets`**: Standard object library (Text, Rect, Image, Video).

## 4. Immediate Action Items
1.  **Refactor `Core.ts`**: Move mouse event listeners to a separate method/class.
2.  **Fix Resize Logic**: Use `instanceof` or strict interfaces for scaling props.
3.  **Add Tests**: Set up `vitest` to verify the engine runs without a canvas (headless mode) for CI/CD.


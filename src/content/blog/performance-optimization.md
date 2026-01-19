---
title: 'Optimizing Kinetix Create: A Performance Deep Dive'
description: 'How we analyzed and improved the load time and responsiveness of our browser-based video editor.'
pubDate: 2026-01-14
category: 'Engineering'
tags: ['performance', 'react', 'optimization', 'astro']
priority: 2
---

# The Performance Challenge

Building a full-featured video editor in the browser is no small feat. Kinetix Create pushes the boundaries of what's possible with web technologies, but with great power comes heavy bundles.

Recently, we noticed our `/create` page was sluggish. Lighthouse audits confirmed our suspicions:
- **LCP (Largest Contentful Paint)**: > 4.3s
- **TBT (Total Blocking Time)**: > 5.6s
- **Speed Index**: 7.1s

These numbers are unacceptable for a modern professional tool. Users expect instant interactions, even from complex web apps.

## The Diagnosis

We dove into the codebase and performance profiles to find the culprits. Here's what we found:

### 1. The Monolithic Bundle
Our `EditorLayout.tsx` was the main offender. It largely looked like this:

```tsx
import { Sidebar } from "./panels/Sidebar";
import { Timeline } from "./panels/Timeline";
import { PropertiesPanel } from "./panels/PropertiesPanel";
import { LayersDrawer } from "./drawers/LayersDrawer";
import { ToolsDrawer } from "./drawers/ToolsDrawer";
// ... dozens of other imports
```

Because `EditorLayout` is a client-side React component (`client:only="react"`), simpler bundlers will package *everything* imported here into a single massive JavaScript file. Users had to download the code for the **Timeline**, **Sidebar**, **Properties Panel**, and **Every Single Drawer** just to see the loading spinner.

### 2. Heavy Dependencies Upfront
We use powerful libraries like:
- **Remotion/FFmpeg**: For video rendering.
- **Three.js**: For 3D elements.
- **Chart.js**: For data visualization.
- **Shiki**: For code syntax highlighting.
- **Mermaid**: For diagrams.

The issue? These were all being imported at the top level. Even if a user just wanted to make a simple text video, they were downloading the entire Charting and Code Highlighting engines.

## The Solution Strategy

We devised a three-pronged attack to tackle these issues.

### 1. Route-Based Splitting is Not Enough
Code splitting usually happens at the route level (e.g., `/blog` vs `/create`). But for a Single Page Application (SPA) like our editor, the entire app lives on one route. We needed **Component-Level Splitting**.

### 2. Lazy Loading Everything (Almost)
We decided to defer the loading of any component not immediately visible or critical for the "First Paint".

**Before:**
```tsx
import { Timeline } from "./panels/Timeline";
import { PropertiesPanel } from "./panels/PropertiesPanel";
```

**After:**
```tsx
import { Suspense, lazy } from 'react';

const Timeline = lazy(() => import("./panels/Timeline"));
const PropertiesPanel = lazy(() => import("./panels/PropertiesPanel"));

// In JSX
<Suspense fallback={<div className="h-32 skeleton" />}>
  <Timeline />
</Suspense>
```

By wrapping heavy components in `React.lazy`, we tell the bundler to split them into separate chunks. They are only fetched when the React tree actually attempts to render them.

### 3. Dynamic Imports for Heavy Logic
For libraries used only in specific user actions (like exporting), we moved from static imports to dynamic imports.

**Export Logic:**
```typescript
// Old ❌
import { renderMedia } from '@remotion/renderer';

const handleExport = () => { renderMedia(...) }

// New ✅
const handleExport = async () => {
    const { renderMedia } = await import('@remotion/renderer');
    renderMedia(...);
}
```

This simple change removed megabytes from the initial bundle, as the heavy rendering engine is now only loaded when the user actually clicks "Export".

## Interactive Elements
We also applied this to our specific object types. The `CodeBlock` component, which uses `Shiki`, is now only loaded if a user adds a code block to the timeline.

## Results & Next Steps

After implementing these changes, our initial bundle size dropped by **60%**.
- **FCP**: Down to 1.2s
- **LCP**: Down to 2.5s (mostly waiting for the canvas to init)
- **TBT**: Reduced significantly as hydration is spread out.

Performance is a continuous journey. Our next stops:
1.  **Web Workers**: Offloading geometry calculation to background threads.
2.  **Asset Prefetching**: Smartly downloading templates while the user is idle.
3.  **WASM**: Exploring Rust-based video processing for even faster exports.

Stay tuned for more updates as we continue to build the fastest video editor on the web.

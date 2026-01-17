---
title: "The Plan: Open Sourcing the Kinetix Engine"
description: "A roadmap for extracting the Kinetix video engine into a standalone, framework-agnostic open source library to rival Remotion."
pubDate: 2026-01-16
tags: ["open-source", "roadmap", "monetization", "javascript"]
---

Building **Kinetix** has been a journey into the deep end of web performance. We've built a custom 2D rendering engine, a frame-perfect offline exporter, and a React-based editor harness.

But looking at the landscape of web video, I see a gap.

On one side, we have **Remotion**. It's brilliant, but it's fundamentally tied to React. It uses the DOM (or Canvas via React) for rendering, which is great for UI-style videos but hits performance ceilings with complex particle systems or thousands of moving objects.

On the other side, we have raw libraries like **PixiJS** or **Three.js**. They are powerful renderers but "dumb" about video. They don't know about timelines, sequencing, or offline rendering (encoding 60fps video on a 15fps laptop).

**It's time to set the Kinetix Engine free.**

I am planning to extract the core of Kinetix into a standalone open-source library. Here is the master plan.

## The Vision: `kinetix-core`

The goal is to create a lightweight, high-performance video orchestration library that is **framework agnostic**.

```bash
npm install @kinetix/core
```

It won't care if you use React, Vue, Svelte, or vanilla JS. It will provide:
1.  **The Scene Graph**: A robust object model for 2D graphics, text, and charts.
2.  **The Time Machine**: A precise timeline controller that handles `play()`, `pause()`, and `seek()` with millisecond accuracy.
3.  **The Exporter**: A unified pipeline to export MP4/WebM blobs using Web Workers, handling the complex math of "rendering time" vs "wall-clock time".

### vs. Remotion
Remotion renders *React components*. `kinetix-core` renders *Canvas intent*.
This means Kinetix can be significantly faster for heavy motion graphics, generative art, and data visualization videos. It can also act as a **complement** to Remotion—you could use a `<KinetixPlayer />` inside a Remotion composition!

## The Roadmap

### Phase 1: Extraction (Weeks 1-4)
The current codebase is a bit tailored to the Kinetix UI.
- Move `src/engine` to a monorepo.
- Remove all specific "editor" logic (selection highlights, gizmos) into a separate plugin or layer.
- Ensure 0 dependencies on React.
- **Milestone**: A "Hello World" rotating rectangle rendered in a vanilla HTML file.

### Phase 2: The Plugin System (Weeks 5-8)
To make this a community project, it needs to be extensible.
- **Custom Objects**: Allow users to define their own `GameObject` classes with custom `draw()` methods.
- **Renderer Plugins**: Support WebGL contexts alongside the current Canvas2D context for high-performance shaders.

### Phase 3: Documentation & Demos
A library is only as good as its docs.
- Interactive documentation site (built with Astro Starlight?).
- Copy-paste examples for: "Instagram Story Maker", "Audio Visualizer", "Code Snippet Animator".

## Sustainability & Monetization

Open source is free as in speech, not free as in beer (for the maintainer). To make this sustainable, I'm launching a multi-tiered sponsorship model.

### 💖 Why Sponsor?
Developing a video engine requires deep knowledge of codecs, browser quirks, and math. Your support buys dedicated time for:
- **Bug Fixes**: Video on the web is flaky. I'll smooth it out.
- **Performance Tuning**: Making sure exports are blazing fast.
- **New Features**: ProRes export? Gif export? Lottie support?

### Sponsorship Tiers (GitHub Sponsors / Ko-fi / Patreon)

| Tier | Price | Perks |
| :--- | :--- | :--- |
| **Supporter** | $5/mo | My eternal gratitude + Badge on README |
| **Pro** | $25/mo | **Early Access** to new plugins (e.g. The "Chart.js" adapter) |
| **Insider** | $100/mo | Direct access to me for implementation advice + Logo on website |
| **Sponsorware** | One-time | Specific large features (e.g. "Add MP4 Client-side encoding") will be locked to sponsors for the first 30 days. |

## Conclusion

The web is ready for a professional-grade, framework-agnostic video engine. Kinetix has proven the tech stack works. Now let's share it with the world.

*Star the repo, follow the journey, and let's build the future of video.*

---
title: "Under the Hood: How Kinetix Builds Video on the Web"
description: "A deep dive into the engineering behind Kinetix's browser-based video creation engine, exploring the custom TypeScript engine and its frame-perfect export system."
pubDate: 2026-01-16
tags: ["engineering", "typescript", "canvas", "web-workers", "video"]
---

Building a video editor in the browser is widely considered one of the "final frontiers" of web development. While tools like Figma have conquered vector design, video brings a unique set of challenges: rigorous synchronization, frame-perfect rendering, and heavy resource constraints.

In this deep dive, we'll explore the architecture of **Kinetix**, specifically focusing on the `/create` page—the heart of the application where the magic happens. We'll analyze the custom engine that powers it and the specialized solutions developed to handle video export.

## The Core Architecture

At its heart, Kinetix avoids heavy third-party rendering libraries. Instead of reaching for Three.js or PixiJS, which can introduce significant overhead, Kinetix implements a custom-built, lightweight 2D engine written in strict TypeScript.

The engine follows a classic game loop architecture controlled by `Core.ts`.

### The Render Loop
Instead of relying on React's render cycle (which is optimized for DOM updates, not 60fps graphics), the engine maintains its own loop using `requestAnimationFrame`.

```typescript
// Core.ts (simplified)
private _loop = (now: number) => {
    if (!this.isPlaying) return;

    // Calculate delta time
    const dt = now - this._lastFrameTime;
    
    // Update current time based on playback rate
    this.currentTime += (dt * this.playbackRate);

    // Render the scene at the new time
    this.render();
    
    // Request next frame
    this._rafId = requestAnimationFrame(this._loop);
}
```

This decoupling ensures that the playback is smooth and independent of the UI state. The React interface (`EditorLayout.tsx`) simply subscribes to updates via hooks like `onTimeUpdate` to sync the timeline slider, but it doesn't drive the animation itself.

## The Scene Graph

The `Scene` manages a collection of `KinetixObject` instances. This is an abstract base class that defines the contract for anything that appears on screen:

- **Transform State**: `x`, `y`, `scale`, `rotation`, `opacity`.
- **Animation Config**: `type` (e.g., 'fadeIn', 'slideUp'), `duration`, `delay`.
- **Life Cycle**: `onAdd`, `onRemove`.
- **Drawing**: A pure `draw(ctx, time)` method.

This object-oriented approach allows for highly specialized components. For example, the `ChartObject` contains complex logic to draw bar charts, line graphs, or scatter plots directly onto the canvas. It handles its own animation math—interpolating bar heights or line paths based on the current engine time.

```typescript
// ChartObject.ts
draw(ctx: CanvasRenderingContext2D, time: number) {
    // Calculate local progress (0 to 1) based on object delay
    const progress = Math.min((time - this.delay) / this.duration, 1);
    
    // Interpolate values
    const currentHeight = targetHeight * easeOut(progress);
    
    // Draw directly to context
    ctx.fillRect(x, y, width, currentHeight);
}
```

## The "Export" Challenge

The most critical feature of any video editor is the ability to export the final result. In the browser, the naive approach is to use `Canvas.captureStream()` coupled with a `MediaRecorder`.

While Kinetix supports this "Realtime" mode for quick previews, it has a fatal flaw: **it depends on your computer's speed.** If your browser lags or drops a frame during recording, that stutter ends up in the final video. This is unacceptable for professional work.

### The Solution: Offline Rendering

To guarantee absolute quality, Kinetix implements an "Offline" export mode in `exportVideo`. This method doesn't record the screen; instead, it mathematically steps through the timeline frame by frame.

1.  **Pause the Loop**: The engine stops the realtime playback.
2.  **Seek & Render**: The engine programmatically seeks to `time = 0`, renders the frame, then moves to `time = 1/30s`, renders again, and so on.
3.  **Snapshot**: `createImageBitmap` captures the pixel data.
4.  **Off-Main-Thread Encoding**: This is the secret sauce.

If the main thread tried to encode video, the UI would freeze completely. Kinetix solves this by spawning a dedicated Web Worker (`mediabunny.worker.ts`).

The main engine acts as a producer, generating frames as fast as it can (or as slow as needed), and sending them to the worker. The worker manages the video encoding (likely using modern WebCodecs or WASM-based muxers like `webm-muxer`).

This architecture allows Kinetix to:
*   Export **60 FPS** video even on a slow laptop that can only display 15 FPS in realtime.
*   Export **4K** resolutions without dropping frames.
*   Keep the UI responsive (with a progress bar) while the heavy lifting happens in the background.

## Conclusion

The Kinetix engine demonstrates that with careful architecture, the web is more than capable of handling complex media creation tasks. By sticking to browser fundamentals—Canvas API, RequestAnimationFrame, and Web Workers—it achieves performance and reliability that rivals native desktop applications.

---
title: "The License Dilemma: MIT vs MPL 2.0"
description: "Choosing the right open source license for Kinetix Core. A deep dive into Permissive vs Weak Copyleft."
pubDate: 2026-01-16
tags: ["open-source", "license", "legal", "strategy"]
---

When open-sourcing a foundational library like **Kinetix Core**, the choice of license dictates its future. It controls how businesses use it, how contributors engage with it, and ultimately, whether it thrives or gets forked into oblivion.

We recently released Kinetix Core under the **MIT License**, but many successful modern libraries (including our inspiration, *MediaBunny*) use the **Mozilla Public License 2.0 (MPL-2.0)**. 

Let's break down the difference and decide which is best for the future of Kinetix.

## The Contenders

### 1. The MIT License
**"Do whatever you want, just keep my name on it."**

The MIT license is the most popular license in the JavaScript ecosystem (React, Vue, Vite, and millions of npm packages use it).

*   **Pros**: 
    *   **Maximum Adoption**: No lawyer needed. Corporations feel safe using it because there are zero restrictions on closed-source modifications.
    *   **Simplicity**: It's short and easy to understand.
    *   **Ecosystem Standard**: It's what people expect from an npm package.
*   **Cons**:
    *   **No "Give Back" Clause**: A company can take Kinetix, add a super-fast WebGL renderer to it, and sell it as a closed-source product without sharing that renderer back to us.

### 2. Mozilla Public License 2.0 (MPL-2.0)
**"File-level Copyleft."**

MPL is a "weak copyleft" license. It sits comfortably between MIT (permissive) and GPL (viral).

*   **How it works**:
    *   If you use Kinetix in your app, you **can** keep your app closed source.
    *   **BUT**: If you modify a *file* inside Kinetix itself (e.g., you fix a bug in `Scene.ts` or add a feature to `Core.ts`), you **must** release those changes under MPL.
*   **Pros**:
    *   **Encourages Contribution**: If a big company improves the engine to use it in their product, they are legally required to share those engine improvements back to the community.
    *   **Safe for Business**: Unlike GPL, it doesn't "infect" the proprietary code that *uses* the library. You can link MPL code with closed-source code.
*   **Cons**:
    *   **Slight Friction**: Some strict corporate compliance departments require extra approval for anything "Copyleft", even if it is "Weak".

## Case Study: MediaBunny

MediaBunny uses **MPL-2.0**. Why?
Because it is a complex, hard-to-write library. The authors want to ensure that if someone improves the core transcoding logic, everyone benefits. They don't want a competitor to fork it, make it 2x faster, and keep that performance boost proprietary.

## Recommendation for Kinetix

Kinetix Core is similar to MediaBunny—it's complex infrastructure.

**Verdict: Switch to MPL-2.0**

If our goal is to build a sustainable open-source framework:
1.  We want to allow commercial usage (MPL allows this).
2.  We want to prevent "embrace, extend, extinguish" where a company forks the engine and makes a better, closed version.
3.  We want every bug fix and performance improvement made by users to flow back into the main repo.

MIT is great for small utilities (`lodash`, `date-fns`). But for a substantial engine like Kinetix, **MPL-2.0** offers better protection for the project's long-term health while remaining business-friendly.

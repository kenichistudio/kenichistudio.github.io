# Contributing to Kenichi Studio 🎨

Welcome! We are excited that you want to contribute to **Kenichi Studio**. This document provides guidelines and best practices to help you get started and stay productive.

---

## 🏗️ Project Architecture

Kenichi Studio follows a **Feature-Based Architecture**. This keeps the codebase modular and scalable.

- **`src/core/`**: The engine room. Contains Canvas logic, Workers, and base `Object` classes.
- **`src/features/`**: Domain-specific logic. Each feature (e.g., `studio`, `animator`) should be self-contained.
- **`src/shared/`**: Reusable components, hooks, and utilities used across multiple features.
- **`src/content-widgets/`**: Visual components used in MDX and blog content.

> [!IMPORTANT]
> Always use **Path Aliases** instead of relative imports where possible:
> - `@core/*` -> `src/core/*`
> - `@features/*` -> `src/features/*`
> - `@shared/*` -> `src/shared/*`
> - `@widgets/*` -> `src/content-widgets/*`

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or higher
- **npm**: v9 or higher

### Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/simplearyan/kenichi-studio.git
   cd kenichi-studio
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## �️ Contribution Workflow

### 1. Branching Policy
Create a descriptive branch name from `main`:
- `feat/added-new-chart`
- `fix/bar-chart-race-colors`
- `chore/cleanup-imports`

### 2. Implementation Standards
- **Styling**: Use **Vanilla CSS** or **Standard CSS Modules**. Avoid ad-hoc utility classes.
- **Components**: Group related logic into hooks within the feature directory.
- **Performance**: Ensure properties panels use local `useState` for instant UI feedback (force-update pattern).

### 3. Commit Messages
We follow a concise `type: description` format:
- `feat:` for new features
- `fix:` for bug fixes
- `refactor:` for code changes that neither fix a bug nor add a feature
- `docs:` for documentation changes

### 4. Pull Request Process
- Ensure `npm run build` passes locally.
- Write a clear PR description explaining the **Why** and **How**.
- Link to any related issues.

---

## � For the Owner: Productivity Tips

- **Reviewing**: Look for "Feature Isolation". Logic belonging to `studio` should not leak into `core` unnecessarily.
- **Build Checks**: Use the project's Path Aliases to quickly identify where dependencies are coming from.
- **Syncing**: Keep the main branch clean and use `git pull --rebase` to integrate remote changes smoothly.

---

Thank you for making Kenichi Studio better! 🚀

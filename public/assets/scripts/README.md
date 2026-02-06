# 🔧 Repo Instrumentation: Procedural Assets

This directory contains the internal tooling used to maintain and evolve the **Kenichi Studio** visual identity.

## 🧬 Scripts

### 1. Procedural Generation (`generate.js`)
Instead of maintaining static exports, we treat our branding as code. This script instantly batch-creates logo variations from a single source of truth.

*   **Source**: `assets/logos/source/` (Master Geometry)
*   **Output**: `assets/logos/variations/` (SVG Variations)
*   **Logic**: Applies CSS-like filters, SVG groups, and linear gradients.

### 2. Asset Conversion (`convert_to_png.js`)
Converts the procedurally generated SVGs into high-resolution PNGs for production use.

*   **Input**: `assets/logos/variations/*.svg`
*   **Output**: `assets/logos/png/*.png`
*   **Resolution**: 1024x1024px
*   **Dependency**: `sharp`

---

## 🚀 Usage

Ensure you have [Node.js](https://nodejs.org/) installed.

### Setup
Install dependencies (required for PNG conversion):
```bash
npm install
```

### Run Generators
```bash
# 1. Generate SVGs from source
node scripts/generate.js

# 2. Convert SVGs to High-Res PNGs
node scripts/convert_to_png.js
```

---

## 🎨 Customization
To create a new brand variation:
1.  Open `scripts/generate.js`.
2.  Add a new `<defs>` block for your style.
3.  Invoke `createSVG()` with your parameters.

> [!NOTE]
> This folder is for developer usage. For brand guidelines, see the [Design Docs](../docs/LOGO_DESIGN.md).

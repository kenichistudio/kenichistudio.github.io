---
title: "How to Build and Run Kenichi Desktop in Visual Studio 2022"
description: "A step-by-step guide to setting up the Kenichi Desktop environment using Visual Studio 2022."
pubDate: 2026-01-20
tags: ["tutorial", "tauri", "visual-studio", "rust", "react"]
---

# Building Kenichi Desktop in Visual Studio 2022

While typical web development often happens in VS Code, **Visual Studio 2022** is a powerhouse for systems programming. Since **Kenichi Desktop** is built with **Tauri** (which relies on Rust and C++ build tools), using the full Visual Studio IDE can provide a robust environment for managing the backend dependencies.

Here is how to set up, compile, and run the project from scratch.

## 1. Prerequisites

Before opening the project, ensure you have the following installed:

1.  **Visual Studio 2022** (Community, Pro, or Enterprise)
    *   **Workload Required**: "Desktop development with C++" (This installs the MSVC linker required by Rust).
2.  **Node.js** (LTS version recommended)
3.  **Rust**: Install via [rustup.rs](https://rustup.rs).

## 2. Opening the Project

Visual Studio 2022 supports "Open Folder" mode, which is perfect for mixed-language projects like Tauri.

1.  Launch **Visual Studio 2022**.
2.  Select **"Open a local folder"**.
3.  Navigate to the project root: `d:\Code\Antigravity\design_concepts\Kenichi Desktop`.
4.  Click **Select Folder**.

VS 2022 will load the file structure in the **Solution Explorer** (Folder View).

## 3. Configuration & Dependencies

Open the **Integrated Terminal** in Visual Studio via `View > Terminal` (or `Ctrl + ` ` `).

Run the following commands to install the frontend dependencies:

```powershell
npm install
```

This will read `package.json` and install libraries like React, Tailwind, and the Tauri CLI.

## 4. Running the Application

To run the application in "Development Mode" (Simultaneous Frontend + Backend hot reload):

In the **Terminal**, run:

```powershell
npm run tauri dev
```

### What happens next?
1.  **Vite** starts the frontend server (typically `localhost:1420`).
2.  **Cargo** (Rust package manager) opens `src-tauri` and compiles the Rust backend.
    *   *Note: The first compilation might take a few minutes as it compiles all crates.*
3.  Once compiled, the **Kenichi Desktop** window will launch.

## 5. Troubleshooting Common Issues

### "Linker 'link.exe' not found"
*   **Cause**: You installed Rust but didn't install the C++ Build Tools.
*   **Fix**: Open **Visual Studio Installer**, modify your VS 2022 installation, and ensure **"Desktop development with C++"** is checked. Then reinstall Rust (or run `rustup update`) to pick up the toolchain.

### "Webview2Loader.dll not found"
*   **Cause**: Missing Webview2 runtime (rare on Windows 11).
*   **Fix**: Install the "Evergreen Bootstrapper" from Microsoft.

### Powershell Scripts Disabled (npm error)
*   **Error**: `File ...\npm.ps1 cannot be loaded. The file ... is not digitally signed.`
*   **Cause**: The default PowerShell execution policy restricts scripts.
*   **Fix**: Run this command in the **Developer PowerShell** (or Admin PowerShell):
    ```powershell
    Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
    ```
    *Type `A` (Yes to All) if prompted.*

---

*Now you're ready to debug the Rust backend or edit the React frontend directly within Visual Studio 2022!*

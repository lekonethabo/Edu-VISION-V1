# Edu-VISION Management & Coding Standards (AGENTS.md)

This file contains the persistent system architecture guidelines, design tokens, and runtime requirements for the **Botswana Education Management Information System (EMIS) - Edu-VISION Portal**. 

---

## 1. Core Architectural Strategy

### Global Color & Theme Flow
- **Dark/Light Cohesion**: The application supports a fully synchronized Dark/Light interface. The state variables `isDark` and `setIsDark` are declared in the root portal `EduVisionPortal` (`/app/edu-vision.tsx`) and **MUST** be threaded explicitly down to any layout views:
  - `ToolsHub` (Central Dashboard Selector)
  - `Header` (Global Navigation context bar)
  - Individual workspace registries (Textbooks, Student Directory, dropouts, etc.)
- **Semantic Classnames**: Always wrap dark styling rules using Tailwind `dark:` prefix or conditional hooks in class assignments.
  - Dark container color anchors: `#00050c` (deep background), `#001020` (card containers / layouts), `#001428` (dropdown menu overlays).
  - Light container color anchors: `bg-slate-50`, `bg-white`, `text-slate-800`, `text-slate-900`.
  - Brand accents: `#00A3A3` (Teal), `#ffd700` (Gold nodes), and `#002652` (Imperial Blue).

### Authentication & Portal Navigation
- The system must adhere to a strict state-driven layout flow:
  1. `SplashScreen`: An automatic boot sequencing simulation with a beautiful progressive loader, validating registry databases and encryption nodes before entering.
  2. `LandingPage`: Elegant human authentication system.
  3. `ToolsHub`: Central app repository where administrators select from educational planning modules, SPED programs, facility management tools, and textbook registries.
  4. Selected Tool Workspaces: Seamless layout including the global shared `<Header />` containing context navigation, network status indicators, active user controls, theme switches, and hub exit shortcuts.

---

## 2. Interactive Component & UX Requirements

### Elegant Toast Alert System
- **Readability**: All toast status banners MUST be high contrast, spacious, and easily readable. Use a clean slate backdrop (`bg-slate-900/95` or `dark:bg-[#001428]/95`) combined with color-coded accent outlines (e.g. `border-emerald-500/50` for success, `border-amber-500/50` for notifications).
- **Graceful Motion**: Always wrap toast selectors with `AnimatePresence` from `motion/react` to allow dynamic slide-and-fade entering and exit transitions.
- **Display Duration**: To ensure complete accessibility, never flash toast controls rapidly. Preserve toaster elements in the view for at least **5.0 seconds** (value set at `5000ms`), and configure tool launching handlers with a comfortable **2.0-second delay** (`2000ms`) before changing routed tabs. This allows managers to fully register the loading context before the viewport shifts.

### Splash Screen Physics
- **Strict Anti-Regression Rule**: Do NOT invoke state setter methods synchronously within standard `useEffect` loops. Derive layout states like current loading step arrays dynamically using simple proportional math selectors:
  ```ts
  const currentStepIndex = Math.min(
    Math.floor((progress / 100) * SHUFFLE_STEPS.length),
    SHUFFLE_STEPS.length - 1
  );
  ```
- **Splash Layout**: Centered geometric prisma books, smooth loading tracks, and a minimal crypto telemetry string at the low footer margin indicating `v3.5.0` active encryption.

---

## 3. Design Philosophy & Anti-Slop Safeguards

### Architectural Honesty
- **No Mock Noise**: Do not decorate your dashboards with unnecessary artificial numbers or simulated system parameters. Indicators must represent action items, local registries, or official Botswana EMIS protocols.
- **Literal Naming**: Use clear, polite, and literal vocabulary suitable for school staff and inspectors (e.g., Use *"Standard Teaching Equipment"*, *"Comprehensive Sexuality Education"*, *"School Profile Registry"*).
- **Standard Layout Spacing**: Balance layouts with negative space. Keep sidebar controls, lists, and form tables wrapped in cozy margins (`p-6` or `gap-6`), using premium border alignments (`border-slate-250/70` or `dark:border-slate-805`) instead of heavy shadows.

---

## 4. Coding Practices & Technical Setup

- **Iconography**: Every symbol used throughout the administrative templates MUST be imported from `lucide-react`. Custom inline SVG vectors should be reserved strictly for visual elements like the complex multi-axis `GeometricLogo`.
- **Framework Imports**: Motion animations must be loaded from `motion/react` instead of general `framer-motion` modules.
- **API Security**: Run server-side routines for secure processing. Never expose structural config variables on the client side.

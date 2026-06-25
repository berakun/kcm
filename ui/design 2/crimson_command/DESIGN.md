---
name: Crimson Command
colors:
  surface: '#0c1322'
  surface-dim: '#0c1322'
  surface-bright: '#323949'
  surface-container-lowest: '#070e1d'
  surface-container-low: '#141b2b'
  surface-container: '#191f2f'
  surface-container-high: '#232a3a'
  surface-container-highest: '#2e3545'
  on-surface: '#dce2f7'
  on-surface-variant: '#e4beb9'
  inverse-surface: '#dce2f7'
  inverse-on-surface: '#293040'
  outline: '#ab8985'
  outline-variant: '#5b403d'
  surface-tint: '#ffb4ab'
  primary: '#ffb4ab'
  on-primary: '#690005'
  primary-container: '#b91c1c'
  on-primary-container: '#ffcdc7'
  inverse-primary: '#b91c1c'
  secondary: '#bdc7d9'
  on-secondary: '#27313f'
  secondary-container: '#404a59'
  on-secondary-container: '#afb9cb'
  tertiary: '#a4c9ff'
  on-tertiary: '#00315d'
  tertiary-container: '#005fab'
  on-tertiary-container: '#c2d9ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000b'
  secondary-fixed: '#d9e3f6'
  secondary-fixed-dim: '#bdc7d9'
  on-secondary-fixed: '#121c2a'
  on-secondary-fixed-variant: '#3d4756'
  tertiary-fixed: '#d4e3ff'
  tertiary-fixed-dim: '#a4c9ff'
  on-tertiary-fixed: '#001c39'
  on-tertiary-fixed-variant: '#004883'
  background: '#0c1322'
  on-background: '#dce2f7'
  surface-variant: '#2e3545'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

This design system is engineered for high-performance administrative environments and user portals, prioritizing data density and visual clarity. The brand personality is authoritative, industrial, and precise. By utilizing a **Modern High-Contrast** style, the interface minimizes cognitive load through clear structural separation and a sophisticated dark-mode palette.

The aesthetic avoids unnecessary ornamentation, relying on a rigorous grid and subtle geometric borders to define hierarchy. It evokes a "command center" atmosphere—professional, reliable, and focused. The emotional response is one of control and efficiency, ensuring that users can navigate complex datasets and operational tasks without visual fatigue.

## Colors

The color palette is anchored by a deep obsidian base to reduce eye strain during prolonged use. The primary Maroon (#B91C1C) is used sparingly as a "call to action" and brand anchor, providing high-energy contrast against the dark backgrounds. 

Surface levels are defined by tonal shifts:
- **Level 0 (App Background):** #111827 for the deepest foundation.
- **Level 1 (Cards/Sidebar):** #1F2937 to create a distinct interactive layer.
- **Borders:** #374151 provides the structural definition necessary for a shadowless layout.

Semantic colors for success, error, and warnings are tuned for high luminosity to ensure they remain accessible and urgent against the dark surfaces.

## Typography

This design system utilizes **Hanken Grotesk** as its primary typeface. It is a sharp, contemporary sans-serif that maintains exceptional legibility at small sizes, making it ideal for data-heavy admin tables and dashboards.

**Key Typographic Rules:**
- **Hierarchy:** Use `label-caps` for table headers and section overviews to provide clear structural categorization.
- **Numeric Data:** For financial figures or IDs within tables, use a monospaced font (JetBrains Mono) to ensure vertical alignment and quick scanning.
- **Contrast:** Always use Primary Text (#F9FAFB) for titles and body content, reserving Secondary Text (#9CA3AF) for metadata, captions, and deactivated states.

## Layout & Spacing

The design system follows a **12-column fluid grid** for the main content area, with a fixed-width sidebar (280px) on desktop. The layout relies on a strict 8px spacing rhythm to maintain mathematical balance.

- **Desktop:** 32px outer margins with 20px gutters. Content should be grouped into cards that span 3, 4, 6, or 12 columns.
- **Tablet:** 24px margins. The sidebar collapses into a hamburger menu or a slim icon bar.
- **Mobile:** 16px margins. All grid items reflow to a single column (12-span).

Spacing between related elements (labels and inputs) should use `sm` (8px), while spacing between unrelated sections or cards should use `lg` (24px) or `xl` (32px).

## Elevation & Depth

To maintain a "flat-modern" and professional aesthetic, this design system eschews traditional ambient shadows in favor of **Tonal Layering and Low-Contrast Outlines**.

Depth is communicated through three primary methods:
1.  **Background Differentiation:** The main canvas is #111827. Elevated elements like cards, modals, and the sidebar use #1F2937.
2.  **Structural Outlines:** Every card and container must have a 1px solid border of #374151. This provides the necessary definition against the dark background.
3.  **Active States:** Interactive elements (like hover states on list items) should utilize a slightly lighter background (#374151) rather than a shadow, reinforcing the tactile, "etched" feel of the UI.

## Shapes

The shape language is "Soft" (0.25rem base radius). This maintains a professional, geometric rigor while removing the harshness of sharp corners.

- **Components:** Buttons, input fields, and tags use the base `rounded` (4px).
- **Containers:** Dashboard cards and modals use `rounded-lg` (8px) to create a clear container-to-content relationship.
- **Consistency:** Never use full-circle/pill shapes for functional buttons; keep them subtly rounded to maintain the architectural feel of the system.

## Components

### Buttons
- **Primary:** Background #B91C1C, Text #F9FAFB. Solid fill, no border.
- **Secondary:** Background transparent, Border 1px #374151, Text #F9FAFB.
- **Ghost:** Background transparent, Text #9CA3AF, Hover Background #1F2937.

### Cards
Cards are the primary organizational unit. Use #1F2937 for the background with a 1px #374151 border. Card headers should have a subtle bottom border to separate titles from content.

### Input Fields
Inputs should have a #111827 background (inset feel) with a 1px #374151 border. On focus, the border color shifts to the Primary Maroon (#B91C1C) or Info Blue (#60A5FA).

### Chips & Badges
Use a low-opacity tint of the semantic color for the background and the full-saturation color for the text (e.g., Error badge: Background 10% #F87171, Text #F87171).

### Lists & Tables
Rows should have a subtle hover state (#374151). Table headers must be sticky, utilizing the `label-caps` typography style for maximum readability.
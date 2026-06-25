---
name: Kurnia Cipta Mandiri Admin
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#59413e'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#8d706d'
  outline-variant: '#e1bfbb'
  surface-tint: '#b02d29'
  primary: '#760009'
  on-primary: '#ffffff'
  primary-container: '#991b1b'
  on-primary-container: '#ffaaa1'
  inverse-primary: '#ffb4ac'
  secondary: '#a53936'
  on-secondary: '#ffffff'
  secondary-container: '#fe7c74'
  on-secondary-container: '#721315'
  tertiary: '#353739'
  on-tertiary: '#ffffff'
  tertiary-container: '#4c4e50'
  on-tertiary-container: '#bebfc1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ac'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#8e1214'
  secondary-fixed: '#ffdad7'
  secondary-fixed-dim: '#ffb3ad'
  on-secondary-fixed: '#410004'
  on-secondary-fixed-variant: '#852221'
  tertiary-fixed: '#e1e2e4'
  tertiary-fixed-dim: '#c5c6c8'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-tabular:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-margin: 24px
  gutter: 16px
  card-padding: 20px
  section-gap: 32px
---

## Brand & Style

The design system is engineered for professional precision and organized data management. It adopts a **Corporate Modern** aesthetic with a subtle "Affordable Luxury" influence, characterized by high-contrast surfaces, meticulous alignment, and a sophisticated color palette. The goal is to instill a sense of institutional reliability and operational clarity. 

Key visual principles include:
- **Functional Luxury:** High-quality typography and a rich maroon signature color balanced against clean, utilitarian surfaces.
- **Architectural Clarity:** A strong structural grid that prioritizes information hierarchy, ensuring that even data-dense screens feel approachable.
- **Precision:** Sharp execution of borders, consistent spacing increments, and clear semantic signaling for error-free administrative workflows.

## Colors

The color strategy uses a deep, authoritative maroon as the primary brand anchor. 

- **Primary Maroon (#991B1B):** Reserved for primary actions, active navigation states, and key branding elements.
- **Sidebar Maroon (#7F1D1D):** A deeper variant used for the global navigation sidebar to provide a strong visual container and contrast against the main content.
- **Surface & Background:** The main canvas uses a Light Grey (#F3F4F6) background to reduce glare, while White (#FFFFFF) is used for cards and workspace surfaces to create clear "elevation" for the content.
- **Semantic Palette:** Standardized status colors ensure immediate recognition of system health, user attendance, and budgetary alerts.

## Typography

Inter is the sole typeface for this design system, chosen for its exceptional legibility in data-heavy environments and its neutral, professional tone.

- **Hierarchy:** Use `display-lg` for primary page headers. `headline-md` should be used for card titles and section breaks.
- **Data Display:** For table content and numerical values, enable tabular lining figures (`tnum`) to ensure numbers align vertically for easier comparison.
- **Labels:** Use `label-caps` for table headers and sidebar category labels to provide clear visual separation from interactive content.

## Layout & Spacing

This design system utilizes a **12-column fluid grid** for the main content area, allowing the dashboard to scale from laptop to wide-screen monitors effectively.

- **Sidebar:** Fixed width of 260px. On mobile, it collapses into a drawer.
- **Rhythm:** A 4px baseline grid governs all spacing. Vertical rhythm is maintained through 16px (4 units) or 24px (6 units) increments.
- **Margins:** Standard page margins are 24px on desktop and 16px on mobile. 
- **Density:** To maintain a "premium" feel while handling data, use generous 20px internal padding for cards and 12px vertical padding for table rows.

## Elevation & Depth

The design system uses a **Tonal Layering** approach combined with subtle ambient shadows to define the Z-axis.

- **Base Layer:** The light grey background (#F3F4F6) acts as the foundation.
- **Content Layer:** Cards and panels are set in White (#FFFFFF).
- **Shadows:** Use a single, soft shadow style for cards: `0px 1px 3px rgba(0,0,0,0.05), 0px 4px 6px rgba(0,0,0,0.02)`. This creates a "lifted" effect without appearing heavy.
- **Overlays:** Modals and dropdowns use a higher elevation with a more pronounced shadow and a semi-transparent backdrop blur (e.g., 40% opacity of a dark neutral) to focus user attention.

## Shapes

The shape language is defined by **Round Eight** (8px) corners, striking a balance between modern friendliness and professional structure.

- **Components:** Buttons, input fields, and cards all follow the base 0.5rem (8px) radius.
- **Small Elements:** Status badges and tags use a smaller 4px radius or a full "pill" radius for distinct categorization.
- **Focus States:** High-visibility 2px solid rings with 4px offset to ensure accessibility and precision during keyboard navigation.

## Components

### Buttons
- **Primary:** Solid Maroon (#991B1B) with White text.
- **Secondary:** White background with Maroon border and text.
- **States:** Hover states should darken the background by 10%. Active states use a subtle inner shadow.

### Tables
- **Styling:** No vertical borders. Horizontal borders are 1px solid #E5E7EB. 
- **Rows:** Alternating "Zebra" striping using #F9FAFB on even rows.
- **Status Badges:** Subtle background tints with high-contrast text (e.g., Success badge: Light green background with dark green text).

### Sidebar
- **Navigation:** Grouped items with 11px uppercase labels.
- **Active State:** A 4px vertical Maroon bar on the left edge of the active menu item, with a subtle white-opacity background highlight.

### Inputs
- **Field Style:** White background with #D1D5DB (Light Grey) border.
- **Focus State:** 2px solid Maroon border ring.
- **Labels:** Always positioned above the field in `body-sm` bold.

### Cards
- **Structure:** 20px internal padding, 8px rounded corners, and a 1px soft border or subtle shadow. Header areas within cards should have a thin bottom border to separate titles from content.
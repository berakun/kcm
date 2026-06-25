---
name: KCM Interior & Construction
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#59413e'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#8d706d'
  outline-variant: '#e1bfbb'
  surface-tint: '#b02d29'
  primary: '#760009'
  on-primary: '#ffffff'
  primary-container: '#991b1b'
  on-primary-container: '#ffaaa1'
  inverse-primary: '#ffb4ac'
  secondary: '#9b4500'
  on-secondary: '#ffffff'
  secondary-container: '#fd8a42'
  on-secondary-container: '#682c00'
  tertiary: '#2e3847'
  on-tertiary: '#ffffff'
  tertiary-container: '#454f5e'
  on-tertiary-container: '#b6c1d3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ac'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#8e1214'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb68e'
  on-secondary-fixed: '#331200'
  on-secondary-fixed-variant: '#763300'
  tertiary-fixed: '#d9e3f6'
  tertiary-fixed-dim: '#bdc7d9'
  on-tertiary-fixed: '#121c2a'
  on-tertiary-fixed-variant: '#3d4756'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  section-gap: 80px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The brand identity centers on "Affordable Luxury"—a philosophy that balances high-end aesthetic sensibilities with grounded, professional reliability. This design system targets homeowners and commercial developers who seek premium craftsmanship without the pretense. 

The visual style is **Corporate Modern with Minimalist influences**, emphasizing architectural precision through generous white space and structured layouts. The emotional response is one of "Confident Elegance": the UI should feel established and sturdy, yet light and airy enough to let the interior design portfolio photography remain the focal point. Surfaces are clean, depth is used sparingly, and the overall interface acts as a sophisticated gallery frame for the company’s physical construction work.

## Colors

The palette is anchored by **Deep Maroon**, a color representing heritage and strength, used intentionally for primary calls to action and brand markers. **Subtle Gold** is utilized as a high-value accent for highlights, iconography, or small badges to signify quality.

The interface is predominantly light. We use **White** for primary cards and content areas, while **Light Grey** serves as a subtle background separator to define structure without adding visual noise. **Deep Charcoal** is reserved for the footer and high-contrast utility sections, providing a "heavy" base that grounds the lighter elements above it. Text hierarchy is strictly enforced through grey scales to ensure readability and a professional tone.

## Typography

The design system utilizes **Inter** for all roles to achieve a systematic, architectural feel. The typeface’s neutral but tall x-height provides exceptional legibility in both technical construction specifications and editorial marketing copy.

Headings should be set in Semi-Bold or Bold weights with slightly tightened letter-spacing to appear "locked-in" and authoritative. Body text uses a generous line height (1.5x - 1.6x) to ensure the "airy" feel is maintained even in text-heavy sections. Labels and small navigational elements use uppercase tracking to inject a sense of high-end fashion and luxury retail aesthetics.

## Layout & Spacing

This design system follows a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The layout philosophy is centered on "Generous Margins"—avoiding edge-to-edge content to create a focused, premium viewing experience.

Vertical spacing between major sections should be expansive (80px to 120px) to prevent the "clutter" often found in low-end construction websites. Small components use a 4px baseline grid for internal alignment, ensuring that even the smallest UI elements feel mathematically precise and intentional.

## Elevation & Depth

To maintain the "Affordable Luxury" feel, depth is communicated through **Soft Ambient Shadows** rather than harsh borders or heavy gradients. 

We use a "Surface-over-Surface" approach:
1. **Level 0 (Background):** Light Grey (#F9FAFB) for the canvas.
2. **Level 1 (Cards):** White (#FFFFFF) with a very subtle, diffused shadow (Blur 15px, Opacity 4%, Y-offset 4px) and a thin 1px border in a slightly darker grey.
3. **Level 2 (Hover/Active):** Increased shadow spread and a subtle lift (Y-offset 8px) to signify interactivity.

Avoid using pure black shadows; instead, use a deep navy or charcoal tint in the shadow color to maintain a sophisticated tone.

## Shapes

The shape language utilizes a **12px standard corner radius** (`rounded-lg`) for all primary UI elements including cards, input fields, and buttons. This specific radius is large enough to feel modern and friendly, yet sharp enough to retain a sense of architectural structure.

The logo mark is a strict geometric circle, providing a visual counterpoint to the rectangular grid of the website. Iconography should follow a "Line Art" style with 1.5pt or 2pt stroke weights and slightly rounded caps to match the component radius.

## Components

### Buttons
Primary buttons use the Maroon (#991B1B) background with White text. They feature a smooth 200ms transition; on hover, the background shifts to a slightly darker shade or adds a subtle gold bottom-border. Secondary buttons use a Ghost style with a Maroon outline.

### Input Fields
Forms should feel "stable." Use White backgrounds with a 1px Grey border. On focus, the border transitions to Maroon with a subtle Gold glow (2px outer spread).

### Cards
Portfolio cards are the cornerstone of this system. They should feature high-quality imagery with a minimal text overlay or a clean white footer area. Images should have a slight zoom-in effect on hover to create a sense of immersion.

### Chips & Tags
Use the Gold accent (#B45309) for status tags (e.g., "In Progress," "Completed") with a 10% opacity background of the same color to ensure the text remains the focal point while providing a premium highlight.

### Progress Indicators
For construction project tracking, use thin, elegant progress bars in Maroon with a light grey track, avoiding heavy "industrial" looking bars.
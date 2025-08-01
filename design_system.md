Cyberpunk Terminal Design System
Theme Overview

This design system creates a dark, cyberpunk-inspired terminal interface using a monospace aesthetic with glowing purple accents and subtle animations. It is designed to be fully responsive, ensuring a consistent and usable experience from mobile to desktop.

Color Palette
Primary Colors (HSL)
Generated css
--background: 0 0% 0% /_ Pure black _/
--foreground: 0 0% 100% /_ Pure white _/
--primary: 270 100% 70% /_ Bright purple #9933ff _/
--primary-foreground: 0 0% 0% /_ Black text on purple _/

Secondary Colors
Generated css
--secondary: 270 20% 5% /_ Very dark purple _/
--secondary-foreground: 0 0% 98% /_ Nearly white _/
--accent: 270 20% 5% /_ Same as secondary _/
--accent-foreground: 0 0% 98% /_ Nearly white _/
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Css
IGNORE_WHEN_COPYING_END
Semantic Colors
Generated css
--card: 0 0% 0% /_ Black cards _/
--card-foreground: 0 0% 98% /_ White text on cards _/
--muted: 0 0% 2% /_ Very dark gray _/
--muted-foreground: 0 0% 63.9% /_ Medium gray text _/
--border: 270 50% 30% /_ Purple borders _/
--input: 270 20% 5% /_ Dark purple inputs _/
--ring: 270 100% 70% /_ Bright purple focus rings _/
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Css
IGNORE_WHEN_COPYING_END
Cyberpunk Specific Colors (CSS Custom Properties)
Generated css
--cyber-black: #000000 /_ Pure black background _/
--cyber-purple-900: #0a0015 /_ Darkest purple _/
--cyber-purple-800: #150025 /_ Very dark purple _/
--cyber-purple-700: #200040 /_ Dark purple _/
--cyber-purple-600: #2d0055 /_ Medium dark purple _/
--cyber-purple-500: #3d0077 /_ Medium purple _/
--cyber-purple-400: #5500aa /_ Bright purple _/
--cyber-purple-300: #7700dd /_ Brighter purple _/
--cyber-purple-200: #9933ff /_ Very bright purple _/
--cyber-purple-100: #bb66ff /_ Lightest purple _/
--cyber-glow: #7700dd /_ Glow effect color _/
--cyber-bright: #9933ff /_ Bright accent color _/
--cyber-dim: #3d0077 /_ Dim accent color _/
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Css
IGNORE_WHEN_COPYING_END
Typography
Font Family

Primary: 'Courier New', monospace

Fallback: monospace system fonts

Responsive Font Sizes

The font sizes adapt to screen width to ensure readability and maintain the terminal aesthetic across all devices.

Element Mobile Tablet Desktop
Default Body 16px 16px 14px
Buttons 0.7rem (11.2px) 0.65rem (10.4px) 0.6rem (9.6px)
Inputs 1rem (16px) 0.85rem (13.6px) 0.75rem (12px)
Terminal Glow 0.8rem (12.8px) 0.8rem (12.8px) 0.75rem (12px)
Tabs 0.7rem (11.2px) 0.65rem (10.4px) 0.6rem (9.6px)

Note: An input font size of 16px on mobile is critical to prevent automatic browser zoom on iOS devices.

Line Height

Body Text: 1.5 (for optimal readability)

Headings & Compact Text: 1.2

Font Weights

Default: 400 (regular)

Emphasis: 700 (bold, used sparingly)

Text Styling

Text Transform: UPPERCASE for buttons and tabs

Letter Spacing: 0.5px (reduced for compact feel)

Layout & Spacing
Responsive Breakpoints

Use these standard breakpoints to apply responsive styles via media queries.

Mobile: up to 767px

Tablet: 768px to 1023px

Desktop: 1024px and up

Responsive Spacing Scale

Spacing adjusts to provide more room for touch interactions on smaller screens while becoming more compact on desktops.

Spacing Tier Mobile Tablet Desktop
Gaps
Compact 0.75rem (12px) 0.6rem (9.6px) 0.5rem (8px)
Tight 1rem (16px) 0.85rem (13.6px) 0.75rem (12px)
Normal 1.5rem (24px) 1.25rem (20px) 1rem (16px)
Page Margin 1rem (16px) 1.5rem (24px) 2rem (32px)
Grid System

Terminal Grid: 30px x 30px subtle grid pattern

Background: Barely visible purple dots (background-image with 0.01 opacity)

Border Radius

Default: 0rem (sharp, terminal-like edges)

Component Classes
.terminal-card

Background: Pure black (#000000)

Border: 1px solid var(--cyber-purple-600)

Animation: Subtle border flare effect (8s cycle)

Hover: Glowing border with box-shadow

Mobile Consideration: Consider increasing border to 1.5px or 2px on mobile screens to maintain visual presence.

.cyber-input

Background: Black

Border: 1px solid var(--cyber-purple-600)

Focus: Glowing border with box-shadow

Font: Courier New

Responsive Font Size: 1rem (Mobile), 0.85rem (Tablet), 0.75rem (Desktop)

Responsive Padding: 8px 10px (Mobile), 7px 9px (Tablet), 6px 8px (Desktop)

.cyber-button

Background: Black

Border: 1px solid var(--cyber-purple-600)

Hover: Glowing effect

Font: Courier New, uppercase

Letter Spacing: 0.5px

Responsive Font Size: 0.7rem (Mobile), 0.65rem (Tablet), 0.6rem (Desktop)

Responsive Padding: 6px 10px (Mobile), 5px 9px (Tablet), 4px 8px (Desktop)

.cyber-tab

Background: Black

Border: 1px solid var(--cyber-purple-700)

Active State: Glowing border and text

Font: Courier New, uppercase

Responsive Font Size: 0.7rem (Mobile), 0.65rem (Tablet), 0.6rem (Desktop)

.terminal-glow

Color: var(--cyber-bright)

Font: Courier New, uppercase

Letter Spacing: 1px

Responsive Font Size: 0.8rem (Mobile), 0.8rem (Tablet), 0.75rem (Desktop)

Usage: Accent text and highlights

Animations
terminal-flare (8s cycle)

Subtle moving light effect on card borders using clip-path animations.

subtle-light-sweep (12s cycle)

Gentle light sweep animation for purple border elements.

terminalFadeIn (0.3s)

Smooth fade-in animation with slight vertical movement (transform: translateY).

Component Variants
Button Variants
Generated css
.cyber-button /_ Default cyber styling _/
.cyber-primary /_ Black bg, primary border _/
.cyber-secondary /_ Black bg, secondary border _/
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Css
IGNORE_WHEN_COPYING_END
Usage Guidelines

Always use semantic tokens instead of direct colors.

Maintain monospace consistency across all text elements.

Use uppercase text for interactive elements (buttons, tabs).

Apply subtle animations to enhance the cyberpunk feel without being distracting.

Adhere to responsive spacing for a dense but usable interface on all devices.

Use glowing effects sparingly for focus, hover, and active states to maximize impact.

Accessibility

High Contrast: High contrast between text and backgrounds is maintained.

Focus Indicators: Clear focus indicators are provided with glowing rings and borders.

Semantic HTML: Use semantic HTML for better screen reader support.

Color Contrast: Ensure all text/background combinations meet WCAG AA standards.

Mobile Usability: Ensure touch targets are sufficiently large on mobile devices (recommended minimum of 44x44px).

State Management Architecture

Centralized state with React Context or a similar library.

Domain-specific hooks for data fetching and state management.

Clear separation between UI state (e.g., active tabs) and business logic.

Consistent error handling and loading states with clear visual indicators.

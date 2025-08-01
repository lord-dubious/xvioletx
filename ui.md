# UI Replication Guide for TweetScheduler Pro

This document outlines the key components, layout structures, and styling conventions used in the TweetScheduler Pro application to facilitate accurate UI replication.

## 1. Core Technologies

*   **Framework**: React (with TypeScript)
*   **Styling**: Tailwind CSS (utility-first CSS framework)
*   **Animations**: Framer Motion (for smooth page transitions and UI element animations)
*   **Notifications**: Sonner (for toast notifications)

## 2. Responsive Layout Strategy

The application employs a responsive design approach, adapting its layout based on screen size (mobile vs. web).

### 2.1. Mobile Layout (`isMobile` true)

*   **Structure**:
    *   `MobileHeader`: Top navigation bar with title, subtitle, and a menu toggle.
    *   `MobileSidebar`: A collapsible sidebar (drawer) that slides in from the left, containing navigation links.
    *   `main` content area: Displays the active view (e.g., Dashboard, Tweet Composer).
    *   `MobileBottomNav`: A fixed bottom navigation bar for primary navigation.
*   **Key Components**:
    *   `MobileHeader`
    *   `MobileSidebar`
    *   `MobileBottomNav`
    *   `MobileDashboard`
    *   `MobileTweetComposer`
*   **Styling Notes**:
    *   `min-h-screen bg-black`: Ensures a dark background and full height.
    *   Transitions and animations are handled by `framer-motion`.

### 2.2. Web Layout (`isMobile` false)

*   **Structure**:
    *   `WebSidebar`: A persistent sidebar on the left, which can be collapsed/expanded. Contains main navigation.
    *   Main content area: Occupies the remaining width, containing `WebHeader` and the active view.
    *   `WebHeader`: Top navigation bar within the main content area, displaying title and subtitle.
*   **Key Components**:
    *   `WebSidebar`
    *   `WebHeader`
    *   `DashboardView`
    *   `TweetComposer`
    *   `SchedulingView`
    *   `SettingsView`
    *   `AgentSettingsView`
    *   `MediaLibraryView`
*   **Styling Notes**:
    *   `min-h-screen bg-black flex overflow-hidden`: Establishes a flex container for sidebar and main content.
    *   `lg:ml-16` / `lg:ml-64`: Dynamic left margin on the main content area based on sidebar collapse state, creating a smooth transition.
    *   `p-6 min-h-full`: Padding and minimum height for the content area.

## 3. Common UI Elements and Patterns

### 3.1. Navigation

*   **Sidebar (Web & Mobile)**: Contains primary navigation links (Dashboard, Compose, Schedule, AI Agents, Media Library, Analytics, Settings). Active tab is highlighted.
*   **Bottom Navigation (Mobile)**: Simplified navigation for quick access to core features.
*   **Headers (Web & Mobile)**: Display current view title and a descriptive subtitle.

### 3.2. Content Views

*   **Dashboard**: Overview of Twitter activity.
*   **Compose**: Interface for creating and scheduling tweets.
*   **Schedule**: Management of scheduled posts.
*   **AI Agents**: Configuration for AI personas.
*   **Media Library**: Management of uploaded media files.
*   **Settings**: Account and integration configurations.
*   **"Coming Soon" Placeholder**: A consistent UI pattern for features under development, centered with a bold title and descriptive text.

### 3.3. Interactive Elements

*   **Tab Switching**: `activeTab` state manages which view is rendered.
*   **Sidebar Toggle**: Button to collapse/expand the `WebSidebar` and open/close the `MobileSidebar`.

### 3.4. Animations

*   **Page Transitions**: `AnimatePresence` and `motion.div` from `framer-motion` are used for smooth transitions between views.
    *   `initial={{ opacity: 0, y: 20 }}`: Starts slightly faded and below.
    *   `animate={{ opacity: 1, y: 0 }}`: Fades in and moves up to position.
    *   `exit={{ opacity: 0, y: -20 }}`: Fades out and moves up when exiting.
    *   `transition={{ duration: 0.3 }}`: Animation duration.

### 3.5. Notifications

*   **Toast Notifications**: `Toaster` component from `sonner` is used for displaying transient messages.
    *   **Theme**: `dark`
    *   **Position**: `top-center` for mobile, `top-right` for web.
    *   **Styling**: Custom Tailwind CSS classes applied via `toastOptions.style` and `toastOptions.classNames` for a consistent dark, blurred, and shadowed appearance.

## 4. Styling Conventions (Tailwind CSS)

*   **Color Palette**: Primarily dark theme (`bg-black`, `text-white`, `text-gray-400`, `text-gray-300`, `border-gray-600`, `bg-purple-600`).
*   **Typography**: `antialiased` for smoother text rendering. Font sizes and weights are defined by Tailwind's defaults or custom classes.
*   **Spacing**: Consistent use of `p-`, `m-`, `px-`, `py-` classes for padding and margin.
*   **Flexbox**: Extensive use of `flex`, `flex-col`, `items-center`, `justify-center` for layout.
*   **Transitions**: `transition-all duration-300` for smooth property changes.
*   **Shadows**: `shadow-xl` and custom `boxShadow` for depth.
*   **Blur**: `backdrop-blur-sm` for notification backgrounds.
*   **Borders**: `border` and `border-gray-500/30` for subtle outlines.

## 5. Replication Steps

1.  **Set up React + TypeScript + Tailwind CSS project**: Ensure `tailwind.config.js` is configured for dark mode and extends default colors/spacing as needed.
2.  **Implement Responsive Layout**: Create conditional rendering based on a `isMobile` hook (similar to `useMobileLayout`).
3.  **Develop Core Layout Components**: Replicate `WebSidebar`, `WebHeader`, `MobileSidebar`, `MobileHeader`, `MobileBottomNav` with their respective styling and interactive logic.
4.  **Create View Components**: Develop `DashboardView`, `TweetComposer`, `SchedulingView`, etc., as separate components.
5.  **Integrate Framer Motion**: Apply `AnimatePresence` and `motion.div` for view transitions as seen in `App.tsx`.
6.  **Implement Sonner Toaster**: Configure `Toaster` with the specified theme, position, and custom styling.
7.  **Adhere to Tailwind CSS conventions**: Use the provided class names and color palette for consistent visual design.

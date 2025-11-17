<!-- 85da8a27-6c08-498b-8d12-bc3388a59fa4 427fff54-f9e2-42f3-ba21-648c1cbbc271 -->
# Dark Mode Implementation Plan

## Overview

Add a complete dark mode feature with theme toggle in Settings, persistent storage, and a carefully designed color palette.

## Phase 1: Theme Setup & Configuration

### 1. Configure Tailwind Dark Mode

**File: `frontend/tailwind.config.js`**

- Enable dark mode with `class` strategy
- Define custom color palette for both light and dark themes
- Colors chosen for financial app context:
- **Dark backgrounds**: Deep blue-gray (not pure black) for better readability
- **Surfaces**: Layered grays with subtle blues
- **Primary**: Vibrant blue (works in both modes)
- **Text**: Warm off-white for dark mode
- **Charts/Categories**: Adjusted colors with good contrast

### 2. Create Theme Context

**File: `frontend/src/contexts/ThemeContext.tsx` (new)**

- Create React Context for theme management
- Provide `theme` state and `toggleTheme` function
- Initialize from localStorage
- Apply/remove `dark` class on document root
- Persist changes to localStorage

### 3. Update Store with Theme State

**File: `frontend/src/store/useStore.ts`**

- Add theme preference to user settings
- Add `setTheme()` action
- Integrate with localStorage for persistence

## Phase 2: Settings UI Implementation

### 4. Add Dark Mode Toggle to Settings

**File: `frontend/src/pages/Settings.tsx`**

- Add "Appearance" section
- Implement theme toggle with:
- Sun icon for light mode
- Moon icon for dark mode
- Smooth transition animation
- Clear labels and description
- Connect to theme context

## Phase 3: Component Updates

### 5. Update Core Components

Apply dark mode classes to all components:

- **Card.tsx**: Dark backgrounds, borders
- **Input.tsx**: Dark inputs with proper contrast
- **Button.tsx**: Variants for dark mode
- **Badge.tsx**: Adjusted colors
- **Table.tsx**: Dark rows with hover states
- **Modal.tsx**: Dark overlay and content
- **Select.tsx**: Dark dropdowns
- **Toggle.tsx**: Dark-mode compatible

### 6. Update Page Layouts

**Files: All pages in `frontend/src/pages/`**

- Dashboard.tsx
- Subscriptions.tsx
- Insights.tsx
- AddEditSubscription.tsx
- SubscriptionDetail.tsx
- Update with dark mode classes
- Ensure charts are readable in dark mode

### 7. Update Charts Components

**Files: CategoryChart.tsx, SpendTrendChart.tsx**

- Adjust Recharts colors for dark mode
- Ensure proper contrast and readability
- Update grid lines, axes, tooltips

## Phase 4: Integration & Polish

### 8. Wrap App with Theme Provider

**File: `frontend/src/main.tsx`**

- Import ThemeProvider
- Wrap App component
- Ensure theme loads before initial render

### 9. Add Smooth Transitions

**File: `frontend/src/index.css`**

- Add global CSS transitions for theme changes
- Transition background, text, border colors
- Keep transitions smooth but not jarring

## Proposed Color Palette

### Light Mode (Current)

- Background: `#FAFAFA`
- Surface: `#FFFFFF`
- Primary: `#6366F1` (Indigo)
- Text: `#111827`
- Borders: `#E5E7EB`

### Dark Mode (New)

- Background: `#0F172A` (Slate 900)
- Surface: `#1E293B` (Slate 800)
- Surface Hover: `#334155` (Slate 700)
- Primary: `#818CF8` (Indigo 400 - lighter for contrast)
- Text: `#F1F5F9` (Slate 100)
- Secondary Text: `#CBD5E1` (Slate 300)
- Borders: `#334155` (Slate 700)
- Success: `#34D399` (Emerald 400)
- Warning: `#FBBF24` (Amber 400)
- Danger: `#F87171` (Red 400)

## Testing Checklist

- [ ] Theme toggle works in Settings
- [ ] Preference persists across sessions
- [ ] All pages render correctly in dark mode
- [ ] Charts are readable with good contrast
- [ ] Form inputs are accessible
- [ ] Buttons and interactive elements are clear
- [ ] No white flashes on page load
- [ ] Smooth transitions between modes

## Implementation Order

1. Tailwind configuration
2. Theme context and provider
3. Settings page toggle
4. Component updates (start with most used)
5. Page updates
6. Chart updates
7. Final polish and testing
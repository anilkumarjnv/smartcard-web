# SmartCard Web Application - Detailed UI Description

## Overview
SmartCard is a digital business card platform that allows users to create, customize, and share professional digital business cards. The application uses a sidebar navigation layout with a clean, modern design system based on indigo/purple gradients.

---

## Design System

### Color Palette
- **Primary Brand Colors:**
  - Indigo: `#4f46e5` (indigo-600)
  - Purple: `#7c3aed` (purple-600)
  - Gradient: `from-indigo-600 to-purple-600`
  
- **Neutral Colors:**
  - Background: `#f9fafb` (gray-50)
  - White: `#ffffff`
  - Text Primary: `#111827` (gray-900)
  - Text Secondary: `#6b7280` (gray-600)
  - Borders: `#e5e7eb` (gray-200)

- **Status Colors:**
  - Success: Green (`#10b981`)
  - Error: Red (`#ef4444`)
  - Warning: Yellow/Orange

### Typography
- **Font Family:** System fonts (sans-serif), Inter for cards
- **Headings:**
  - H1: `text-2xl font-bold` (24px, bold)
  - H2: `text-xl font-semibold` (20px, semibold)
  - H3: `text-lg font-medium` (18px, medium)
- **Body:** `text-base` (16px, regular)
- **Small Text:** `text-sm` (14px)

### Spacing & Layout
- **Container Padding:** `p-8` (32px)
- **Card Border Radius:** `rounded-3xl` (24px) for main cards, `rounded-2xl` (16px) for smaller elements
- **Gap Between Elements:** `gap-6` (24px) or `gap-8` (32px)
- **Sidebar Width:** `w-64` (256px, fixed)

### Shadows
- **Card Shadow:** `shadow-sm` (subtle)
- **Elevated Cards:** `shadow-xl` (prominent)
- **Hover Effects:** `hover:shadow-md` (medium)

---

## Layout Structure

### Main Layout (Authenticated Pages)
```
┌─────────────────────────────────────────┐
│  Sidebar (Fixed, 256px) │  Main Content │
│                         │               │
│  - Logo                 │  - Container  │
│  - Navigation           │  - Page Title │
│  - User Profile         │  - Content    │
│  - Sign Out             │               │
└─────────────────────────────────────────┘
```

### Sidebar Component
- **Position:** Fixed left, full height
- **Width:** 256px (w-64)
- **Background:** White with right border (gray-200)
- **Structure:**
  1. **Logo Section** (top, with border-bottom)
     - Gradient square icon (indigo-600 to purple-600, rounded-xl)
     - "S" letter in white, bold
     - "SmartCard" text (text-xl, semibold, gray-900)
  
  2. **Navigation** (middle, flex-1)
     - Vertical list of nav items
     - Each item: icon + label
     - Active state: `bg-indigo-50 text-indigo-600`
     - Hover state: `hover:bg-gray-50 hover:text-indigo-600`
     - Icons: CreditCard, Users, Settings (lucide-react)
     - Items: "My Cards", "Leads", "Settings"
  
  3. **User Profile** (bottom, with border-top)
     - Avatar: Gradient circle with user initials
     - Email text (truncated)
     - Sign Out button (ghost variant, full width)

---

## Pages & Components

### 1. Login Page (`/login`)
**Layout:** Centered, full-screen
- **Background:** `bg-gray-50`
- **Container:** Max width `md` (448px), centered
- **Card:** White, `rounded-3xl`, `shadow-xl`, padding `p-8 md:p-10`

**Elements:**
- Back link (top-left, gray-600, with ArrowLeft icon)
- Logo section (same as sidebar)
- Heading: "Welcome back" (h2)
- Subheading: "Sign in to your account to continue" (gray-600)
- Error message (if any): Red background (`bg-red-50`), red border, red text
- Form fields:
  - Email input (with Mail icon)
  - Password input (with Lock icon)
  - "Remember me" checkbox + "Forgot password?" link
- Submit button: Primary, full width, large size
- Divider: "or" text on gray line
- Sign up link: "Don't have an account? Sign up"

**Input Style:**
- Rounded-2xl (16px)
- Border-2, gray-200
- Focus: border-indigo-600, ring-4 indigo-600/10
- Icon on left (pl-12)
- Padding: px-4 py-3

---

### 2. Signup Page (`/signup`)
**Two-Step Flow:**

**Step 1: Role Selection**
- Same layout as login
- Heading: "Choose Your Role"
- Two large cards in grid (md:grid-cols-2):
  - Student card: GraduationCap icon, blue background
  - Professional card: Briefcase icon, indigo background
- Each card: Border-2, rounded-2xl, hover effects
- "Already have an account?" link at bottom

**Step 2: Account Details**
- Back button (ghost variant, with ArrowLeft)
- Heading: "Create your account"
- Form fields:
  - Full Name (User icon)
  - Email (Mail icon)
  - Password (Lock icon, min 6 chars)
- Checkbox: "I agree to Terms of Service and Privacy Policy"
- Submit button: "Create Account"
- Divider and sign in link

---

### 3. My Cards Page (`/mycards`)

**Two Views:**

#### A. Card Listing View (Default)
- **Header:**
  - Title: "My Cards" (text-2xl, bold)
  - "Create Card" button (primary, with plus icon)

- **Empty State:**
  - Centered card
  - Large icon (blue-100 background, blue-600 icon)
  - Heading: "No cards yet"
  - Description text
  - "Create Your First Card" button

- **Card Grid:**
  - 3 columns on large screens (lg:grid-cols-3)
  - Each card:
    - **Header Section:**
      - Gradient background (indigo-600 to purple-600)
      - Height: h-40
      - Badge (top-right): "Published" or "Draft"
      - Avatar (centered, -bottom-12, ring-4 white, shadow-lg)
    
    - **Body Section:**
      - Padding-top: pt-16 (to accommodate avatar)
      - Centered text
      - Name (text-xl, bold)
      - Title (text-sm, gray-600)
      - Company (text-xs, gray-500)
      - About (line-clamp-2, gray-600)
      - Footer: Created date + Views count
      - Action buttons (grid-cols-2):
        - "Edit" (primary)
        - "Analytics" (secondary, with BarChart3 icon)
        - "Publish/Unpublish" (secondary)
        - "View" (ghost, external link icon, only if published)

#### B. Card Editor View (When `?tab=card&cardId=xxx` or `?mode=create`)
- **Back Button:** "Back to My Cards" (ghost, small, with arrow icon)

- **Tab Navigation:**
  - White background, rounded-2xl, shadow-sm, inline-flex
  - Three tabs: "My Card", "Themes", "Share"
  - Active tab: `bg-indigo-600 text-white shadow-sm`
  - Inactive: `text-gray-600 hover:text-gray-900`

- **Two-Column Layout (lg:grid-cols-2):**
  - **Left Column:** Editor form
  - **Right Column:** Live preview (sticky, hidden on mobile)

---

### 4. Card Editor Tab

**Form Structure:**
- White card, rounded-3xl, shadow-sm, padding `p-6 md:p-8`
- Header: Title + Save button (top-right, hidden on mobile)

**Sections:**

1. **Profile Photo Upload**
   - Label: "Profile Photo"
   - Preview: 24x24 (w-24 h-24) rounded-full
   - Border: border-4 gray-200
   - Upload button with Upload icon
   - Remove button (X icon) if image exists
   - Helper text: "Recommended: Square image, at least 400x400px"

2. **Basic Info**
   - Full Name input
   - Role-based fields (Title/Company OR School/Major based on user role)
   - About/Bio textarea (4 rows)

3. **Contact Information** (border-top separator)
   - Phone Number input
   - **Privacy Toggle:** 
     - Label: "Make phone number public"
     - Checkbox in gray-50 background, rounded-lg, border
     - Phone icon on left
   - Email input
   - WhatsApp input
   - Website input

4. **Social Links** (border-top separator)
   - LinkedIn, Instagram, Twitter, GitHub inputs
   - All with URL type and platform icons

5. **Save Message**
   - Success: Green background (`bg-green-50 text-green-700`)
   - Error: Red background (`bg-red-50 text-red-700`)
   - Rounded-2xl, padding p-4

---

### 5. Theme Customization Tab

**Layout:**
- White card, rounded-3xl, shadow-sm
- Heading: "Customize Your Card Theme"

**Three Selectors:**

1. **Style Selector**
   - Grid of style cards
   - Each card shows preview image/description
   - Selected: border-indigo-600, ring-2
   - Styles: Classic, Modern, Minimal, Bold, Elegant, Creative

2. **Color Palette Selector**
   - Grid of color swatches
   - Shows palette name
   - Selected: ring-2 indigo-600
   - Palettes vary by selected style

3. **Font Selector**
   - List of font options
   - Shows font name and preview
   - Selected: highlighted

**Auto-saves** on selection change

---

### 6. Share Tab

**Layout:**
- White card, rounded-3xl, shadow-sm
- Heading: "Share Your Card"

**Empty State (if no card):**
- Centered, large icon (indigo-100 background)
- Heading: "Create Your Card First"
- Description text

**Content (if card exists):**

1. **Shareable Link Section**
   - Input field (read-only) with copy button
   - Copy button: Primary, with Copy icon
   - Success state: Check icon, "Copied!" text

2. **QR Code Section**
   - QR code display (centered)
   - Download QR button (secondary, with Download icon)

3. **Share Options**
   - Native share button (if available)
   - Social share buttons (optional)

---

### 7. Live Preview (Right Sidebar in Editor)

**Container:**
- White background, rounded-3xl, padding p-8, shadow-sm
- Sticky positioning (top-24)
- Hidden on mobile (lg:block)

**Header:**
- "Live Preview" heading
- "View Full Page" link (if card exists, indigo-600)

**Preview Area:**
- Gray-50 background, rounded-2xl
- Min-height: 600px
- Shows CardPreview component with `isPublicView={true}`
- Updates in real-time as form changes

---

### 8. Public Card View (`/[slug]`)

**Card Styles Available:**

#### Classic Style
- Centered layout
- Header: Gradient banner (h-40) with logo or gradient
- Avatar: Centered, -mt-16, ring-4 white, shadow-xl
- Content: Centered text
  - Name (text-3xl, bold)
  - Title (text-lg, medium)
  - Company (text-md)
  - About (centered, leading-relaxed)
- Contact Information section (rounded-xl, p-6)
- Additional Info section (if applicable)
- Social Links section (border-top)

#### Modern Style
- Asymmetric layout (md:grid-cols-2)
- Left: Avatar + Name/Title
- Right: Company, About, Contact, Additional Info, Social Links

#### Minimal Style
- Ultra-clean, lots of white space
- Centered avatar
- Minimal text
- Simple layout

#### Bold Style
- High contrast
- Vibrant colors
- Strong visual impact

#### Elegant Style
- Sophisticated, refined
- Premium feel
- Elegant typography

#### Creative Style
- Unique layouts
- Creative arrangements

**Contact Information Display:**
- Section title: "CONTACT INFORMATION" (uppercase, small, semibold)
- Items displayed:
  - Website (with globe icon)
  - Email (with mail icon, always visible)
  - Phone (with phone icon, only if `phone_public === true`)
- Each item: Icon (w-10 h-10, rounded-lg, accent color background) + Label + Value
- Clickable links (mailto:, tel:, href)

**Additional Info Section:**
- Shows: School, Major, Graduation Year, Skills, Projects, Experience, Certifications
- Skills: Displayed as badges (rounded-full, accent color)
- Projects/Experience: Bullet list
- Other fields: Plain text

**Social Links:**
- Section title: "CONNECT WITH ME"
- Grid of social icons (w-12 h-12, rounded-xl)
- Gradient background per icon
- Hover: scale-110, shadow-lg
- Platform-specific icons (LinkedIn, Instagram, Twitter, GitHub, WhatsApp)

---

### 9. Dashboard Page (`/dashboard`)

**Layout:**
- Container with padding
- Heading: "Dashboard" (text-2xl, bold)

**Role-Based Dashboard Section:**
- Welcome card (role-specific colors)
- Role-specific sections in grid

**Card Grid (if cards exist):**
- 3 columns (lg:grid-cols-3)
- Each card shows:
  - Avatar + Name + Slug
  - Badge: Published/Draft
  - Created date
  - Views count
  - Clickable to card details

---

### 10. Leads Page (`/leads`)

**Layout:**
- Container
- Header: Title + "Export CSV" button
- Table:
  - Headers: Name, Contact, Message, Date, Source
  - Empty state: Centered, large icon, "No leads yet" message

---

## Component Specifications

### Button Component
**Variants:**
- `primary`: Blue-600 background, white text, hover: blue-700
- `secondary`: Gray-200 background, gray-900 text, hover: gray-300
- `ghost`: Transparent, gray-700 text, hover: gray-100
- `danger`: Red-600 background, white text

**Sizes:**
- `sm`: px-3 py-1.5 text-sm
- `md`: px-4 py-2 text-base
- `lg`: px-6 py-3 text-lg

**States:**
- Loading: Spinner icon
- Disabled: opacity-50, cursor-not-allowed

### Input Component
- Rounded-2xl (16px)
- Border-2, gray-200
- Focus: border-indigo-600, ring-4 indigo-600/10
- Icon support (left side, pl-12)
- Label can float (when focused/has value)
- Error state: border-red-500

### Card Component
- White background
- Rounded-3xl (24px) for main cards
- Shadow-sm (subtle)
- Padding: p-6 or p-8
- Hoverable variant: hover:shadow-md

### Badge Component
- Variants: success (green), default (gray)
- Rounded-full or rounded-lg
- Small text, padding

---

## User Flows

### 1. Signup Flow
1. Landing page → Click "Sign Up"
2. Role selection → Choose Student or Professional
3. Account details → Fill form → Submit
4. Redirect to `/mycards`

### 2. Create Card Flow
1. `/mycards` → Click "Create Card"
2. URL: `/mycards?tab=card&mode=create`
3. Fill form in "My Card" tab
4. See live preview update in real-time
5. Click "Create Card" → Card created → Redirect to edit page

### 3. Edit Card Flow
1. `/mycards` → Click "Edit" on a card
2. URL: `/mycards?tab=card&cardId=xxx`
3. Form pre-filled with card data
4. Make changes → See live preview update
5. Click "Save Changes" → Success message

### 4. Customize Theme Flow
1. In card editor → Click "Themes" tab
2. Select style → Auto-saves
3. Select color palette → Auto-saves
4. Select font → Auto-saves
5. See preview update in real-time

### 5. Share Card Flow
1. In card editor → Click "Share" tab
2. See shareable link
3. Copy link or download QR code
4. Share via native share or social platforms

---

## Interactive Elements

### Hover States
- Buttons: Darker background color
- Links: Color change to indigo-600
- Cards: Shadow increase (shadow-md)
- Nav items: Background change (gray-50)

### Focus States
- Inputs: Border indigo-600, ring-4 indigo-600/10
- Buttons: Ring-2 with offset

### Transitions
- All interactive elements: `transition-colors duration-200`
- Hover effects: `transition-all duration-200`

### Loading States
- Spinner component (circular, animated)
- Button loading: Spinner icon + disabled state
- Page loading: Centered spinner, large size

---

## Responsive Design

### Breakpoints
- Mobile: Default (< 768px)
- Tablet: `md:` (≥ 768px)
- Desktop: `lg:` (≥ 1024px)

### Mobile Adaptations
- Sidebar: Hidden (or collapsible)
- Two-column layouts: Stack vertically
- Live preview: Hidden on mobile
- Tab navigation: Full width
- Card grid: 1 column on mobile, 2 on tablet, 3 on desktop

---

## Key Design Principles

1. **Clean & Minimal:** Lots of white space, simple layouts
2. **Consistent Spacing:** 8px grid system (gap-2, gap-4, gap-6, gap-8)
3. **Rounded Corners:** Consistent use of rounded-2xl and rounded-3xl
4. **Gradient Accents:** Indigo-to-purple gradients for branding
5. **Subtle Shadows:** Light shadows for depth
6. **Icon Usage:** Lucide-react icons throughout
7. **Real-time Updates:** Live preview updates as user types
8. **Form Persistence:** Form data persists across tab switches

---

## Color Usage by Context

- **Primary Actions:** Indigo-600 background
- **Secondary Actions:** Gray-200 background
- **Text Primary:** Gray-900
- **Text Secondary:** Gray-600
- **Borders:** Gray-200
- **Backgrounds:** Gray-50 or White
- **Success:** Green-50 background, green-700 text
- **Error:** Red-50 background, red-700 text
- **Active States:** Indigo-50 background, indigo-600 text

---

## Typography Hierarchy

1. **Page Titles:** text-2xl font-bold (24px)
2. **Section Headings:** text-xl font-semibold (20px)
3. **Card Titles:** text-lg font-medium (18px)
4. **Body Text:** text-base (16px)
5. **Small Text:** text-sm (14px)
6. **Labels:** text-xs (12px)

---

## Animation & Transitions

- **Duration:** 200ms for most transitions
- **Easing:** Default (ease-in-out)
- **Hover Effects:** Scale, shadow, color changes
- **Loading:** Spinner rotation animation
- **Form Updates:** Instant (no animation on live preview)

---

## Accessibility Features

- Focus states on all interactive elements
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance

---

This document provides a comprehensive overview of the current UI. Use this as a reference to create modernized designs while maintaining the same user flows and functionality.


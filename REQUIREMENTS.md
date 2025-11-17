# SubSentry – The Subscription Tracker
## Product Requirements Document (PRD)

---

## 1️⃣ Problem & Goal Summary

### Problem Statement
People have no single place to see all recurring costs; they forget to cancel free trials or low-value subscriptions, causing "subscription creep" that slowly drains their money through missed renewal dates and unexpected charges.

### Product Goal
Give users a simple place to log subscriptions, understand total recurring spend, and get pre-renewal alerts so they can stay in control of their finances.

### Key Outcomes

1. **User Outcome**: Users stop getting surprise renewal charges and reduce unnecessary subscription spend by having visibility into all recurring costs.

2. **Engagement Outcome**: Users feel more in control of their money, leading to higher ongoing engagement with the dashboard and proactive subscription management.

3. **Product Validation**: The product proves demand with consistent weekly active users who rely on reminders before renewal dates and actively audit their subscriptions.

---

## 2️⃣ Functional Requirements

| ID | Feature | Description | Priority | Example Interaction |
|----|---------|-------------|----------|---------------------|
| F1 | Signup/Login | Email + password or OAuth login for secure personal workspace | H | User clicks "Get Started" → enters email/password or "Continue with Google" → lands on onboarding |
| F2 | Onboarding Quick Add | Guided flow where new users add 1-3 subscriptions immediately | H | After signup → wizard prompts "Add your top 3 subscriptions" → user fills Netflix, Spotify, Gym → dashboard populated |
| F3 | Add/Edit Subscription | Form to manually log subscription details (name, amount, cycle, dates, payment) | H | Dashboard → "+ Add Subscription" → form with name, category, ₹199/month, next renewal 2024-12-01 → Save → returns to dashboard |
| F4 | Subscriptions List | View, search, filter, sort all logged subscriptions | H | Navigation → "Subscriptions" → table with search box → filter by "Streaming" → sorted by amount descending |
| F5 | Dashboard Overview | Cards showing total monthly/annual spend, active subs count, upcoming renewals | H | User logs in → sees "₹2,450/month", "₹29,400/year", "12 active", "3 renewals next 7 days" |
| F6 | Upcoming Renewals View | List ordered by next renewal date with days remaining | H | Dashboard card "Upcoming Renewals" → shows Netflix (3 days), Gym (5 days), Adobe (12 days) |
| F7 | Reminder Settings (Per Sub) | Toggle reminder on/off and configure lead time per subscription | H | Subscription detail → "Reminder: ON" toggle → dropdown "7 days before" → Save |
| F8 | Global Reminder Preferences | Default reminder timing and timezone for all subscriptions | M | Settings → "Default reminder: 7 days before" → applies to new subs unless overridden |
| F9 | Basic Insights | Simple stats and charts (spend by category, top 3 costliest) | M | Navigation → "Insights" → donut chart "Streaming 40%, SaaS 35%, Fitness 25%" + bar chart monthly trend |
| F10 | Profile/Settings | Manage profile, default currency, account options | M | Top-right avatar → Settings → edit name, currency (₹/$/€), timezone, delete account |
| S1 | Bank/Email Import | Semi-automatic suggestion of subscriptions from statements | L | Future: Upload statement → AI suggests "Netflix ₹649 monthly" → user confirms to add |
| S2 | Cancellation Helper | Generate email template or steps to cancel a subscription | L | Future: Subscription detail → "Help me cancel" → shows email template or cancellation link |

---

## 3️⃣ Front-End Architecture

| Screen | Purpose | Key Actions | Data Displayed | Navigation Flow |
|--------|---------|-------------|----------------|-----------------|
| Welcome/Landing | Explain problem and benefits, drive signups | "Get Started", "Log In" | Hero: "Stop losing money to forgotten subscriptions", bullet benefits | Landing → Signup or Login |
| Signup/Login | Create account or authenticate | Enter email/password, OAuth Google button | Form fields, "Centralize subscriptions in minutes" | Signup → Onboarding; Login → Dashboard |
| Onboarding Wizard | Guide users to add first subscriptions | Select categories, add 1-3 subs with quick form | Category chips, mini-form (name, amount, cycle, date) | After signup → Step 1 → Step 2 → Dashboard |
| Dashboard | Main home showing totals and upcoming renewals | "+ Add Subscription", "View All", "Conduct Audit" | Monthly/annual spend cards, upcoming renewals timeline, category chart | Dashboard ↔ Add/Edit/Detail/List/Insights |
| Subscriptions List | Browse and manage all subscriptions | Search, filter (category/cycle), sort, row actions (view/edit/cancel) | Table: name, category, cycle, amount, next renewal, reminder status | List → Detail (click row); List → Edit (click edit icon) |
| Add/Edit Subscription | Manual logging form | Fill all fields, toggle reminder, set lead time, Save/Cancel | Form: name, category, amount, currency, cycle, dates, payment method, notes, reminder toggle | Dashboard/List → Add → Save → Dashboard; Detail → Edit → Save → Detail |
| Subscription Detail | Detailed view of single subscription | "Edit", "Toggle Reminder", "Mark Cancelled", back button | Full subscription info, charge history chart (mock), reminder status | List/Dashboard → Detail → Edit or back |
| Reminder Preferences | Configure default reminder settings | Set default lead time (1/3/7/14 days), notification channel toggles | Current defaults, explanation text | Settings/Navigation → Preferences → Save |
| Insights/Reports | Lightweight analytics | View charts, identify savings opportunities | Monthly trend chart (6-12 months), top 3 categories, "Save ₹X" card | Dashboard/Navigation → Insights |
| Settings/Profile | Manage account and preferences | Edit profile, set currency/timezone, delete/export data | Profile info, currency dropdown, timezone dropdown, danger zone buttons | Avatar menu → Settings |

### Design Language

**Color Palette**
- Primary: Teal/Green `#14B8A6` (saving money, control)
- Secondary: Slate/Gray `#64748B` for text and neutral elements
- Background: Soft off-white `#F8FAFC`
- Success: Bright green `#10B981`
- Warning/Reminder: Soft amber `#F59E0B`
- Error: Red `#EF4444`

**Typography**
- Font Family: Inter (fallback: system sans-serif)
- H1: 32px/40px, bold, for page titles
- H2: 24px/32px, semibold, for section titles
- H3: 18px/28px, semibold, for card titles
- Body: 16px/24px, regular, for general text
- Small: 14px/20px, regular, for captions and helper text

**UI Style**
- Clean dashboard with cards
- Rounded corners (8px cards, 6px buttons)
- Subtle shadows (`0 1px 3px rgba(0,0,0,0.1)`)
- Ample whitespace
- Simple charts (bar, donut, line)

**Navigation**
- Persistent sidebar (desktop) or top nav (mobile)
- Links: Dashboard, Subscriptions, Insights, Settings
- "+ Add Subscription" prominent CTA
- Avatar/profile in top-right

**Accessibility**
- WCAG 2.1 AA contrast (≥4.5:1)
- Keyboard navigation with visible focus states
- ARIA labels on icons and interactive elements
- Skip-to-content link
- Base font ≥14px

---

## 4️⃣ Back-End Architecture

### Core Entities

**User**
- id, email, name, created_at, currency_preference, timezone, default_reminder_days

**Subscription**
- id, user_id, name, category, amount, currency, billing_cycle (monthly/annual/custom), first_payment_date, next_renewal_date, payment_method, notes, status (active/cancelled), reminder_enabled, reminder_days_before, created_at, updated_at

**ReminderSettings**
- user_id, default_days_before, notification_channels (email, in-app), timezone

**Category** (optional preset)
- id, name, icon (e.g., Streaming, SaaS, Fitness, Utilities, Other)

### Data Flow Narrative

The app uses a hosted Postgres database (e.g., Supabase) to store user profiles, subscriptions, and reminder preferences. The backend exposes REST or GraphQL endpoints for CRUD operations on subscriptions and for fetching dashboard aggregated stats (total monthly, annual, upcoming renewals, category breakdowns).

A scheduled job (serverless function or cron) runs daily to query subscriptions where `next_renewal_date - reminder_days_before <= today` and triggers email notifications via SendGrid/Mailgun. After a renewal date passes, a separate job can auto-increment the next_renewal_date based on billing_cycle.

### Component Table

| Component | Function | Example API/Service | Trigger | Output |
|-----------|----------|---------------------|---------|--------|
| Auth Service | User signup, login, session management | Supabase Auth / Firebase Auth | User submits signup/login form | JWT token, user session |
| Subscription Service | CRUD operations on subscriptions | REST API (POST/GET/PUT/DELETE `/api/subscriptions`) | User adds/edits/deletes subscription | Stored/updated/deleted subscription record |
| Dashboard Aggregator | Calculate totals, upcoming renewals, category rollups | Database query aggregation | User loads dashboard | JSON with totals, counts, upcoming list |
| Reminder Engine | Find subscriptions due for reminder, send notifications | Serverless function + email API (SendGrid) | Daily cron job | Email sent to user with renewal alert |
| Insights Service | Generate spend trends and category breakdowns | Database queries with GROUP BY and time-series | User loads insights screen | JSON with monthly spend array, category totals |

---

## 5️⃣ Non-Functional Requirements

### Usability
- **Onboarding Speed**: First subscription logged in under 2 minutes.
- **Accessibility**: Key actions (view upcoming renewals, add subscription, edit reminder) accessible within 2-3 clicks from dashboard.
- **Clear CTAs**: Primary action buttons clearly labeled and prominently placed.

### Performance
- **Load Time**: Dashboard and subscriptions list load in under 2 seconds for up to 100-200 subscriptions.
- **Responsiveness**: Smooth transitions and interactions with minimal lag.

### Security & Privacy
- **Authentication**: Secure auth via hosted provider (Supabase Auth, Firebase, Auth0).
- **HTTPS**: All traffic encrypted via HTTPS.
- **No PII Storage**: No storage of raw payment card details; only metadata like "Visa ending 1234".
- **Data Privacy**: Users can export and delete their data.

### Scalability
- **User Load**: MVP designed to support at least 1,000 users with up to a few hundred subscriptions each.
- **Database**: Indexed queries on user_id and next_renewal_date for fast lookups.

### Reliability
- **Backups**: Daily automated backups of database.
- **Idempotent Jobs**: Reminder jobs should be idempotent to avoid duplicate notifications (track last_reminder_sent timestamp).
- **Error Handling**: Graceful error messages and fallback UI states.

---

## 6️⃣ Integration & Compatibility

### Technology Stack

**Front-End**
- React + TypeScript + Vite
- Tailwind CSS for styling
- Recharts for charts/graphs
- Lucide React for icons
- React Router for navigation

**Back-End & Database**
- Supabase (PostgreSQL + Auth + Realtime) OR Firebase OR PlanetScale
- REST API or GraphQL endpoints

**Notifications**
- Email provider: SendGrid, Mailgun, or Resend
- Placeholder for in-app notifications in MVP

**Hosting**
- Front-end: Vercel, Netlify, or Cloudflare Pages
- Back-end: Supabase functions or Vercel serverless

### AI-Assisted Build Compatibility

Requirements are simple enough for AI-assisted stacks (Cursor + Supabase + email API) to build end-to-end flows quickly. The app avoids complex multi-tenant billing, advanced ML, or custom infrastructure.

---

## 7️⃣ Constraints & Assumptions

### In Scope (MVP)
- Manual subscription logging
- Dashboard and list views with totals and upcoming renewals
- Configurable reminder timing with email notifications
- Basic insights: spend by category, monthly trend
- Responsive web app (desktop-first, mobile-friendly)

### Out of Scope (MVP)
- Automatic bank/email scraping or import
- Advanced analytics, budgeting tools, forecasting
- Multi-currency accounting or currency conversion
- Mobile native apps (iOS/Android)
- Shared subscriptions or family plans
- Integration with subscription provider APIs to auto-cancel

### Assumptions
- User has a valid email address for authentication and notifications
- Backend (Supabase/Firebase) and email service are configured and available
- Users will manually input subscription details accurately
- No complex multi-tenant billing or payment processing needed in MVP
- Timezone handling is simplified (user sets once in settings)

---

## 8️⃣ Success Metrics for MVP

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Subscriptions Logged in First Session | ≥3 subscriptions per user | Validates that onboarding effectively helps users populate the dashboard and see value immediately |
| Weekly Active Users (WAU) | ≥60% of registered users | Measures ongoing engagement; users returning weekly indicates the dashboard is a trusted reference |
| Reminder Adoption | ≥80% of active subs have reminders enabled | Confirms users trust and rely on the core feature (pre-renewal alerts) to avoid surprise charges |
| Self-Reported Savings | Positive feedback from ≥50% of surveyed users after 4 weeks | Validates that users feel they've reduced surprise charges and regained control |
| Retention (4-week) | ≥40% of users return after 4 weeks | Shows stickiness; users find ongoing value in tracking and reminders |

---

## Copy Tone & Microcopy Guidelines

**Brand Tone**: Calm, clear, financially confident, slightly proactive (like a friendly CFO watching your back).

**Example Copy**:
- **Hero**: "Stop losing money to forgotten subscriptions"
- **Onboarding**: "Let's find out what you're really spending each month"
- **Dashboard Empty State**: "No subscriptions added yet. Log your first one to reveal your real monthly spend."
- **Upcoming Renewals Empty**: "You're all clear — no renewals in the next 30 days."
- **Success Toast**: "Nice catch — that renewal won't surprise you now."
- **Nudge**: "Haven't used this service lately? Consider whether it still earns its place in your budget."
- **Reminder Explanation**: "We'll email you before each renewal so you can decide: keep it, cancel it, or adjust your plan."

**Voice**: Supportive, non-judgmental, action-oriented, focused on clarity and control over finances.

---

## Navigation & User Flows

### New User Flow
1. Land on **Welcome** page
2. Click "Get Started" → **Signup** page (email/password or Google OAuth)
3. After signup → **Onboarding Wizard** (add 1-3 subscriptions)
4. Complete wizard → redirected to **Dashboard** with initial data

### Returning User Flow
1. Land on **Login** page or auto-authenticated
2. Redirected to **Dashboard** immediately

### Key Flows from Dashboard
- **Add Subscription**: Dashboard → "+ Add Subscription" button → Add Subscription form → Save → Dashboard (with success toast)
- **View Subscription Detail**: Dashboard "Upcoming Renewals" card → click subscription → Subscription Detail → Edit or back
- **View All Subscriptions**: Dashboard → "View All Subscriptions" link → Subscriptions List
- **Insights**: Dashboard → "See Insights" card or nav link → Insights/Reports screen
- **Settings**: Top-right avatar → Settings → Profile/Preferences

### Interactions
- **Search & Filter**: Subscriptions List → search box + category/cycle filters → instant filter results
- **Edit Reminder**: Subscription Detail → toggle reminder on/off → save → confirmation toast
- **Sort Table**: Subscriptions List → click column header (name/amount/date) → table re-sorts
- **Cancel Subscription**: Subscription Detail → "Mark as Cancelled" → confirmation modal → status changed to cancelled, no longer in upcoming renewals

---

## Next Steps for Implementation

1. **Scaffold Project**: Initialize React + TypeScript + Vite with Tailwind, React Router, Recharts, Lucide icons
2. **Build Shared Components**: Layout shell, navigation, cards, forms, tables, charts, modals, toasts
3. **Implement Screens**: Build all 10 screens with routing and mock data
4. **State Management**: Set up Zustand or Context for subscriptions, user, reminders; implement derived metrics helpers
5. **Seed Mock Data**: Create realistic sample subscriptions and insights data
6. **Polish & QA**: Accessibility audit, responsive testing, copy polish, keyboard navigation
7. **Backend Integration**: Connect to Supabase/Firebase for auth, CRUD, and reminder jobs (post-MVP frontend completion)

---

*Document Version: 1.0*  
*Last Updated: 2025-11-17*


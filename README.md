# SubSentry - The Subscription Tracker

> **Stop losing money to forgotten subscriptions**

SubSentry is a comprehensive web application that helps users track all their recurring subscriptions, understand their total spending, and receive timely alerts before renewals—so they never pay for what they don't use.

![SubSentry Dashboard](https://img.shields.io/badge/Status-MVP%20Complete-success)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3-blue)

---

## 🎯 Problem Statement

Most people have 5-15 active subscriptions scattered across streaming services, software tools, fitness apps, and more. Without a central view, it's easy to forget what you're paying for—and those "small" charges add up to hundreds or thousands per year. **Subscription creep** quietly drains bank accounts through missed renewals and surprise charges.

## 💡 Solution

SubSentry provides:
- ✅ A **single dashboard** to see all recurring costs
- ✅ **Pre-renewal alerts** to avoid surprise charges
- ✅ **Spending insights** to identify savings opportunities
- ✅ **Full control** over subscription management

---

## 📋 Project Structure

```
subsentry/
├── REQUIREMENTS.md          # Complete PRD with features, architecture, metrics
├── frontend/               # React + TypeScript frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Screen components
│   │   ├── store/          # Zustand state management + mock data
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Helper functions
│   │   ├── App.tsx         # Main app with routing
│   │   └── main.tsx        # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── README.md           # Frontend-specific documentation
└── README.md              # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation & Running

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:5173
   ```

5. **Login/Signup:**
   - Use any email/password for demo authentication
   - Or click "Continue with Google" (mock OAuth)
   - New users go through onboarding, returning users land on dashboard

---

## ✨ Features

### 🏠 Dashboard
- **At-a-glance metrics**: Total monthly spend, annual spend, active subscriptions, upcoming renewals
- **Upcoming renewals timeline**: See what's renewing in the next 30 days with days-until-renewal badges
- **Category breakdown chart**: Visualize spending by category (Streaming, SaaS, Fitness, etc.)
- **Quick actions**: Add subscription, conduct audit, view insights

### 📝 Subscription Management
- **Full CRUD operations**: Add, edit, view, delete subscriptions
- **Rich details**: Name, category, amount, billing cycle, payment method, notes
- **Status tracking**: Active or cancelled subscriptions
- **Search & filter**: Find subscriptions by name, category, cycle, or status

### 🔔 Smart Reminders
- **Per-subscription reminders**: Toggle on/off for each subscription
- **Flexible timing**: Choose 1, 3, 7, 14, or 30 days before renewal
- **Global defaults**: Set default reminder preferences for new subscriptions
- **Visual indicators**: Clear badges showing reminder status

### 📊 Insights & Analytics
- **Monthly spend trend**: Line chart showing spending over the last 12 months
- **Category pie chart**: See where your money goes
- **Top 3 expensive subscriptions**: Identify biggest costs
- **Savings opportunities**: Smart suggestions to reduce spend

### 🎨 Design & UX
- **Modern, clean UI**: Dashboard-style cards with soft shadows and rounded corners
- **Responsive layout**: Works seamlessly on desktop, tablet, and mobile
- **Accessible**: WCAG 2.1 AA compliant with keyboard navigation
- **Brand colors**: Calming teal/green primary color reinforcing "saving money" theme
- **Supportive microcopy**: Non-judgmental, action-oriented messaging

---

## 🧩 Tech Stack

### Frontend
- **React 18** with **TypeScript** for type-safe development
- **Vite** for lightning-fast builds and hot module replacement
- **Tailwind CSS** for utility-first styling
- **Zustand** for lightweight, scalable state management
- **React Router v6** for declarative routing
- **Recharts** for beautiful, responsive charts
- **Lucide React** for consistent icon set

### State Management
- Mock data store with Zustand
- Derived metrics (totals, upcoming renewals, category breakdowns)
- CRUD operations for subscriptions
- User authentication state

### Routing
- Protected routes for authenticated users
- Public routes for welcome, login, signup
- Onboarding flow for new users
- Dynamic routes for subscription details

---

## 📄 Documentation

### Requirements Document
See **[REQUIREMENTS.md](./REQUIREMENTS.md)** for:
- Complete PRD with problem/goal summary
- Functional requirements (F1-F10)
- Front-end and back-end architecture
- Non-functional requirements (performance, security, accessibility)
- Success metrics for MVP
- Copy tone and microcopy guidelines

### Frontend README
See **[frontend/README.md](./frontend/README.md)** for:
- Detailed project structure
- Component documentation
- Development workflow
- Build and deployment instructions

---

## 🎨 Design System

### Color Palette
- **Primary**: `#14B8A6` (Teal/Green - saving money, control)
- **Secondary**: `#64748B` (Slate/Gray - neutral text)
- **Background**: `#F8FAFC` (Soft off-white)
- **Success**: `#10B981` (Green)
- **Warning**: `#F59E0B` (Amber)
- **Danger**: `#EF4444` (Red)

### Typography
- **Font Family**: Inter (with system fallbacks)
- **Base Size**: 16px / 24px line-height
- **Headings**: H1 (32px), H2 (24px), H3 (18px)

### Accessibility
- ✅ WCAG 2.1 AA contrast ratios (≥4.5:1)
- ✅ Full keyboard navigation
- ✅ ARIA labels on interactive elements
- ✅ Focus states on all focusable elements
- ✅ Screen reader support

---

## 🧪 Mock Data

The app includes 12 pre-populated sample subscriptions:
- **Streaming**: Netflix, Spotify, Amazon Prime, YouTube Premium
- **SaaS**: Adobe Creative Cloud, GitHub Pro, Microsoft 365, Notion, Zoom, Canva
- **Fitness**: Cult.fit, Headspace
- **Currencies**: Indian Rupees (₹) with support for $, €, £

---

## 🔮 Future Roadmap

### Backend Integration (Post-MVP)
- [ ] Integrate Supabase/Firebase for auth and database
- [ ] Real email reminders via SendGrid/Mailgun/Resend
- [ ] Serverless functions for daily reminder jobs
- [ ] User data export and account deletion

### Feature Enhancements (v2)
- [ ] Bank/email statement import for auto-detection
- [ ] Cancellation helper with email templates
- [ ] Multi-currency conversion and accounting
- [ ] Shared subscriptions for families
- [ ] Budget alerts and spending limits
- [ ] Mobile native apps (iOS/Android)

---

## 📊 Success Metrics (MVP)

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Subscriptions logged in first session | ≥3 per user | Validates onboarding effectiveness |
| Weekly Active Users (WAU) | ≥60% of registered | Measures ongoing engagement |
| Reminder adoption | ≥80% of active subs | Confirms core feature usage |
| Self-reported savings | Positive feedback from ≥50% | Validates product value |
| 4-week retention | ≥40% | Shows stickiness and long-term value |

---

## 🤝 Contributing

This is an MVP project. To extend for production:

1. **Set up backend**: Choose Supabase, Firebase, or custom Node.js + PostgreSQL
2. **Integrate auth**: Replace mock auth with real provider (Supabase Auth, Firebase Auth, Auth0)
3. **Add notifications**: Connect email service for reminder delivery
4. **Deploy**: Host frontend on Vercel/Netlify, backend on Supabase/Railway/Render
5. **Monitor**: Add analytics (Google Analytics, Mixpanel) and error tracking (Sentry)

---

## 📝 License

MIT License - feel free to use this for your own projects!

---

## 🎯 Product Positioning

**For**: Budget-conscious professionals with multiple subscriptions  
**Who**: Have been surprised by renewal charges they forgot about  
**SubSentry**: Is a subscription tracking web app  
**That**: Provides a single dashboard of all recurring costs and proactive renewal alerts  
**Unlike**: Spreadsheets or banking apps that don't predict renewals  
**Our product**: Gives users clarity, control, and prevents subscription creep

---

## 🙏 Acknowledgments

Built with modern web development best practices and AI-assisted coding tools.

**Remember**: Stop losing money to forgotten subscriptions. SubSentry helps you stay in control! 💰

---

For questions, issues, or contributions, please open an issue in the repository.




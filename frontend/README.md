# SubSentry - The Subscription Tracker

A modern web application to track all your recurring subscriptions, understand your total spend, and get alerts before renewals to avoid surprise charges and subscription creep.

## Features

✅ **Dashboard Overview** - See total monthly/annual spend and upcoming renewals at a glance
✅ **Subscription Management** - Add, edit, and track all your recurring payments
✅ **Smart Reminders** - Configure pre-renewal alerts to stay in control
✅ **Insights & Analytics** - Visualize spending by category and track trends
✅ **Search & Filter** - Find subscriptions quickly with advanced filtering
✅ **Responsive Design** - Works seamlessly on desktop and mobile devices
✅ **Accessible** - WCAG 2.1 AA compliant with keyboard navigation support

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── CategoryChart.tsx
│   ├── EmptyState.tsx
│   ├── Input.tsx
│   ├── Layout.tsx
│   ├── Modal.tsx
│   ├── Select.tsx
│   ├── SpendTrendChart.tsx
│   ├── Table.tsx
│   ├── Textarea.tsx
│   ├── Toast.tsx
│   └── Toggle.tsx
├── pages/              # Page components
│   ├── AddEditSubscription.tsx
│   ├── Dashboard.tsx
│   ├── Insights.tsx
│   ├── Login.tsx
│   ├── Onboarding.tsx
│   ├── Settings.tsx
│   ├── SubscriptionDetail.tsx
│   ├── Subscriptions.tsx
│   ├── Signup.tsx
│   └── Welcome.tsx
├── store/              # State management
│   ├── mockData.ts
│   └── useStore.ts
├── types/              # TypeScript types
│   └── index.ts
├── utils/              # Utility functions
│   └── format.ts
├── App.tsx             # Main app with routing
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Key Features Explained

### Authentication Flow
- Mock authentication for demo purposes
- Login with any email/password or use Google OAuth button
- Redirects to onboarding for new users, dashboard for returning users

### Subscription Tracking
- Manually log subscriptions with name, amount, billing cycle, renewal date
- Track payment method and add notes
- Mark subscriptions as active or cancelled
- View detailed information for each subscription

### Smart Reminders
- Configure per-subscription reminder timing (1, 3, 7, 14, or 30 days before renewal)
- Toggle reminders on/off for each subscription
- Set global default reminder preferences

### Dashboard Insights
- Total monthly and annual spend calculations
- Upcoming renewals in the next 30 days
- Spending breakdown by category with pie chart
- Monthly spend trend visualization

### Search & Filtering
- Full-text search across subscription names
- Filter by category, billing cycle, and status
- Real-time filtering with instant results

## Mock Data

The app comes pre-populated with 12 sample subscriptions including:
- Netflix, Spotify, Amazon Prime (Streaming)
- Adobe Creative Cloud, GitHub Pro, Microsoft 365 (SaaS)
- Cult.fit Membership, Headspace (Fitness)
- And more!

## Design System

### Colors
- **Primary**: Teal/Green `#14B8A6` (money saved, control)
- **Secondary**: Slate/Gray `#64748B`
- **Background**: Off-white `#F8FAFC`
- **Success**: Green `#10B981`
- **Warning**: Amber `#F59E0B`
- **Danger**: Red `#EF4444`

### Typography
- Font: Inter (with system fallbacks)
- Clear hierarchy with semantic heading levels
- Base font size: 16px with 24px line-height

### Accessibility
- WCAG 2.1 AA contrast ratios (≥4.5:1)
- Full keyboard navigation support
- ARIA labels on interactive elements
- Focus states on all focusable elements
- Skip-to-content link for screen readers

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Future Enhancements

- Backend integration with Supabase/Firebase
- Real email reminder notifications
- Bank/email statement import
- Cancellation helper with email templates
- Multi-currency conversion
- Shared subscriptions for families
- Mobile native apps (iOS/Android)

## Contributing

This is a demo MVP. For production use, integrate with:
1. Authentication service (Supabase Auth, Firebase Auth)
2. Database (PostgreSQL via Supabase)
3. Email service (SendGrid, Mailgun, Resend)
4. Serverless functions for reminder jobs

## License

MIT License - feel free to use this for your own projects!

## Contact

For questions or feedback about SubSentry, please open an issue or contact the development team.

---

**Remember**: Stop losing money to forgotten subscriptions. SubSentry helps you stay in control! 💰

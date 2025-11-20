# SubSentry Frontend

This is the frontend application for SubSentry, built with React, TypeScript, and Vite.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase Project (URL and Anon Key)

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Create a `.env` file in the root of the `frontend` directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Mobile*.tsx      # Mobile-specific components
│   └── ...
├── contexts/            # React Contexts (Theme, etc.)
├── hooks/               # Custom hooks (useIsMobile, etc.)
├── lib/                 # External library config (Supabase)
├── pages/               # Page components
├── store/               # Zustand store (Auth, Subscriptions, Budget)
├── types/               # TypeScript definitions
├── utils/               # Helper functions
├── App.tsx              # Main application component
└── main.tsx             # Entry point
```

## ✨ Key Features

- **Authentication**: Integrated with Supabase Auth (Email/Password, Google OAuth).
- **Data Persistence**: User data (subscriptions, settings) is stored in Supabase PostgreSQL.
- **Dark Mode**: Fully supported via `ThemeContext`.
- **Mobile Experience**: Optimized with touch gestures (swipe, pull-to-refresh).
- **Budgeting**: Track monthly limits and get alerts.

## 🛠 Tech Stack

- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Zustand** (State Management)
- **Supabase** (Backend as a Service)
- **Recharts** (Visualization)
- **Lucide React** (Icons)

## 📦 Build

To build for production:

```bash
npm run build
```

The output will be in the `dist` folder.

# SubSentry - Quick Start Guide

## Starting the Application

1. **Open Terminal** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to:
   ```
   http://localhost:5173
   ```

## First Time Setup

The app will open to the Welcome page. From here you can:

1. Click **"Get Started"** to create a new account
2. Or click **"Log In"** if you already have an account

### Creating an Account

1. Enter any email address (e.g., `demo@example.com`)
2. Enter any name (e.g., `Demo User`)
3. Enter any password (e.g., `password123`)
4. Click **"Create Account"**

> **Note**: This is a demo app with mock authentication. Any credentials will work!

### Onboarding

After signing up, you'll go through a quick onboarding:

1. **Step 1**: Review subscription categories
2. **Step 2**: Add 1-3 initial subscriptions
   - Enter name (e.g., "Netflix")
   - Select category (e.g., "Streaming")
   - Enter amount (e.g., "649")
   - Choose billing cycle (Monthly/Annual)
   - Set next renewal date
   - Toggle reminder on/off

3. Click **"Complete Setup"** when done

## Using the App

### Dashboard
- View total monthly/annual spend
- See upcoming renewals
- Check spending by category
- Quick access to add subscriptions

### Subscriptions List
- View all subscriptions in a table
- Search by name
- Filter by category, cycle, or status
- Click any row to view details

### Add/Edit Subscription
- Fill out the complete form
- Configure reminder settings
- Save to dashboard

### Insights
- View spending trends over time
- See category breakdown
- Identify top expensive subscriptions
- Find savings opportunities

### Settings
- Update profile information
- Configure default reminder preferences
- Change currency and timezone
- Export data or delete account

## Demo Features

### Mock Authentication
- **Any email/password works** for login
- **Google OAuth button** bypasses form (demo only)
- No real backend required

### Pre-loaded Data
When you log in with existing demo credentials, you'll see:
- 12 sample subscriptions
- Pre-calculated metrics
- Sample charts and visualizations

### Interactive Features
- ✅ Add, edit, delete subscriptions
- ✅ Toggle reminders on/off
- ✅ Search and filter
- ✅ View detailed subscription info
- ✅ Mark subscriptions as cancelled
- ✅ See spending insights

## Troubleshooting

### Port Already in Use
If port 5173 is already in use:
```bash
# Kill the process using the port, or
# Vite will automatically use the next available port
```

### Dependencies Issues
If you encounter dependency errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Browser Cache
If changes don't appear:
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Try incognito/private browsing mode

## Testing Different Scenarios

### Empty State
1. Sign up with a new account
2. Skip onboarding
3. See empty state prompts

### With Data
1. Log in with demo credentials
2. See pre-loaded subscriptions
3. Add more subscriptions
4. Filter and search

### Upcoming Renewals
The mock data includes subscriptions with various renewal dates. Change dates to test:
- Renewals in next 3 days (warning badges)
- Renewals in next 7-30 days
- No upcoming renewals

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Next Steps

After familiarizing yourself with the frontend:

1. **Backend Integration**: Connect to Supabase or Firebase
2. **Real Authentication**: Replace mock auth with OAuth provider
3. **Email Service**: Integrate SendGrid for real reminders
4. **Deployment**: Deploy to Vercel or Netlify

See `REQUIREMENTS.md` for complete feature specifications and `IMPLEMENTATION_SUMMARY.md` for technical details.

---

**Need Help?** Check the README files or open an issue in the repository.

**Ready to start?** Run `npm run dev` and visit http://localhost:5173! 🚀



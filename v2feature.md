# SubSentry V2 Feature Implementation Plan

## Overview
This document outlines the step-by-step implementation plan for three major features:
1. Bulk Operations
2. Advanced Sorting/Filtering
3. Budget Tracking with Alerts

---

## Feature 1: Bulk Operations

### 1.1 Update Type Definitions
**File:** `frontend/src/types/index.ts`

**Changes:**
- Add `BulkAction` type: `'delete' | 'cancel' | 'toggleReminders' | 'changeCategory' | 'changePaymentMethod'`
- Add `BulkOperationResult` interface:
  ```typescript
  export interface BulkOperationResult {
    success: number;
    failed: number;
    errors: string[];
  }
  ```

### 1.2 Update Store with Bulk Operations
**File:** `frontend/src/store/useStore.ts`

**Changes:**
- Add to `AppState` interface:
  - `bulkDeleteSubscriptions: (ids: string[]) => BulkOperationResult`
  - `bulkCancelSubscriptions: (ids: string[]) => BulkOperationResult`
  - `bulkToggleReminders: (ids: string[], enabled: boolean) => BulkOperationResult`
  - `bulkUpdateSubscriptions: (ids: string[], updates: Partial<Subscription>) => BulkOperationResult`

- Implement bulk operations in store:
  - `bulkDeleteSubscriptions`: Delete multiple subscriptions, return success/failure counts
  - `bulkCancelSubscriptions`: Mark multiple subscriptions as cancelled
  - `bulkToggleReminders`: Enable/disable reminders for multiple subscriptions
  - `bulkUpdateSubscriptions`: Update common fields (category, paymentMethod) for multiple subscriptions

### 1.3 Create BulkActionsBar Component
**File:** `frontend/src/components/BulkActionsBar.tsx` (NEW)

**Features:**
- Display when subscriptions are selected
- Show count of selected items
- Action buttons: Delete, Cancel, Toggle Reminders, Bulk Edit
- "Select All" / "Deselect All" toggle
- Position: Above the subscriptions table

**Props:**
- `selectedIds: string[]`
- `onSelectAll: () => void`
- `onDeselectAll: () => void`
- `onBulkAction: (action: BulkAction, ...args: any[]) => void`
- `totalCount: number`

### 1.4 Create BulkEditModal Component
**File:** `frontend/src/components/BulkEditModal.tsx` (NEW)

**Features:**
- Modal for bulk editing subscriptions
- Fields: Category, Payment Method
- Show preview of affected subscriptions
- Confirmation before applying changes

**Props:**
- `isOpen: boolean`
- `onClose: () => void`
- `selectedIds: string[]`
- `onSave: (updates: Partial<Subscription>) => void`

### 1.5 Update Subscriptions Page
**File:** `frontend/src/pages/Subscriptions.tsx`

**Changes:**
- Add state: `const [selectedIds, setSelectedIds] = useState<string[]>([])`
- Add checkbox column as first column in table header
- Add checkbox to each table row
- Implement selection handlers:
  - `handleSelectAll: () => void`
  - `handleDeselectAll: () => void`
  - `handleToggleSelect: (id: string) => void`
- Add BulkActionsBar component above table
- Add BulkEditModal component
- Implement bulk action handlers:
  - `handleBulkDelete: () => void`
  - `handleBulkCancel: () => void`
  - `handleBulkToggleReminders: () => void`
  - `handleBulkEdit: (updates: Partial<Subscription>) => void`
- Show Toast notifications for bulk operation results
- Clear selection after successful operations

### 1.6 Add Checkbox Component (if needed)
**File:** `frontend/src/components/Checkbox.tsx` (NEW, if not exists)

**Features:**
- Reusable checkbox component
- Support checked/unchecked/indeterminate states
- Dark mode support
- Accessible (ARIA labels)

---

## Feature 2: Advanced Sorting/Filtering

### 2.1 Update Type Definitions
**File:** `frontend/src/types/index.ts`

**Changes:**
- Add `SortField` type: `'name' | 'amount' | 'nextRenewalDate' | 'category' | 'createdAt' | 'monthlyAmount'`
- Add `SortOrder` type: `'asc' | 'desc'`
- Add `SortConfig` interface:
  ```typescript
  export interface SortConfig {
    field: SortField;
    order: SortOrder;
  }
  ```
- Add `PriceRange` interface:
  ```typescript
  export interface PriceRange {
    min: number | null;
    max: number | null;
  }
  ```
- Add `FilterConfig` interface:
  ```typescript
  export interface FilterConfig {
    category: string[];
    billingCycle: BillingCycle[];
    status: SubscriptionStatus[];
    paymentMethod: PaymentMethod[];
    priceRange: PriceRange;
    reminderEnabled: boolean | null;
    searchQuery: string;
  }
  ```

### 2.2 Create SortDropdown Component
**File:** `frontend/src/components/SortDropdown.tsx` (NEW)

**Features:**
- Dropdown for selecting sort field and order
- Visual indicators for current sort (arrow icons)
- Options:
  - Name (A-Z, Z-A)
  - Amount (Low to High, High to Low)
  - Next Renewal (Soonest, Latest)
  - Category (A-Z, Z-A)
  - Date Added (Newest, Oldest)
  - Monthly Amount (Low to High, High to Low)

**Props:**
- `value: SortConfig`
- `onChange: (config: SortConfig) => void`

### 2.3 Create PriceRangeFilter Component
**File:** `frontend/src/components/PriceRangeFilter.tsx` (NEW)

**Features:**
- Two number inputs for min/max price
- Currency symbol display
- Clear button
- Validation (min <= max)

**Props:**
- `value: PriceRange`
- `onChange: (range: PriceRange) => void`
- `currency: string`

### 2.4 Create AdvancedFilters Component
**File:** `frontend/src/components/AdvancedFilters.tsx` (NEW)

**Features:**
- Collapsible section for advanced filters
- Multi-select for categories
- Multi-select for billing cycles
- Multi-select for payment methods
- Price range filter
- Reminder toggle filter (All/Enabled/Disabled)
- "Clear All Filters" button
- "Save Filter Preset" button (future feature placeholder)

**Props:**
- `filters: FilterConfig`
- `onFiltersChange: (filters: FilterConfig) => void`
- `onClear: () => void`
- `currency: string`

### 2.5 Update Store with Sorting/Filtering Utilities
**File:** `frontend/src/store/useStore.ts`

**Changes:**
- Add helper functions (or keep in component):
  - `sortSubscriptions: (subscriptions: Subscription[], config: SortConfig) => Subscription[]`
  - `filterSubscriptions: (subscriptions: Subscription[], config: FilterConfig) => Subscription[]`

### 2.6 Update Subscriptions Page
**File:** `frontend/src/pages/Subscriptions.tsx`

**Changes:**
- Replace existing filter state with `FilterConfig` object
- Add `SortConfig` state: `const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'name', order: 'asc' })`
- Update `filteredSubscriptions` useMemo to:
  1. First apply filters using `filterSubscriptions`
  2. Then apply sorting using `sortSubscriptions`
- Add SortDropdown component next to search bar
- Add AdvancedFilters component (collapsible)
- Add "Quick Filters" section:
  - "Expiring Soon" (< 7 days)
  - "Most Expensive" (top 10 by monthly amount)
  - "No Reminders" (reminderEnabled = false)
- Update filter UI to use new FilterConfig structure
- Add filter count badge showing active filter count
- Persist filter/sort preferences to localStorage (optional)

### 2.7 Create FilterPreset Component (Optional Enhancement)
**File:** `frontend/src/components/FilterPreset.tsx` (NEW, optional)

**Features:**
- Save current filter configuration as preset
- Load saved presets
- Delete presets
- Preset management UI

---

## Feature 3: Budget Tracking with Alerts

### 3.1 Update Type Definitions
**File:** `frontend/src/types/index.ts`

**Changes:**
- Add `Budget` interface:
  ```typescript
  export interface Budget {
    id: string;
    userId: string;
    monthlyBudget: number;
    annualBudget: number;
    currency: string;
    alertThreshold: number; // Percentage (e.g., 80 = alert at 80% of budget)
    createdAt: string;
    updatedAt: string;
  }
  ```
- Add `BudgetAlert` type: `'none' | 'warning' | 'exceeded'`
- Add `BudgetStatus` interface:
  ```typescript
  export interface BudgetStatus {
    monthlySpent: number;
    monthlyBudget: number;
    monthlyRemaining: number;
    monthlyPercentage: number;
    annualSpent: number;
    annualBudget: number;
    annualRemaining: number;
    annualPercentage: number;
    alert: BudgetAlert;
  }
  ```

### 3.2 Update User Interface
**File:** `frontend/src/types/index.ts`

**Changes:**
- Add to `User` interface:
  - `budget?: Budget` (optional, user may not have set budget)

### 3.3 Update Store with Budget Management
**File:** `frontend/src/store/useStore.ts`

**Changes:**
- Add to `AppState` interface:
  - `budget: Budget | null`
  - `setBudget: (budget: Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void`
  - `updateBudget: (updates: Partial<Budget>) => void`
  - `deleteBudget: () => void`
  - `getBudgetStatus: () => BudgetStatus`
  - `checkBudgetAlerts: () => BudgetAlert`

- Implement budget functions:
  - `setBudget`: Create or update user budget
  - `updateBudget`: Update budget fields
  - `deleteBudget`: Remove budget
  - `getBudgetStatus`: Calculate current spending vs budget
  - `checkBudgetAlerts`: Determine alert level based on threshold

### 3.4 Create BudgetCard Component
**File:** `frontend/src/components/BudgetCard.tsx` (NEW)

**Features:**
- Display monthly and annual budget progress
- Progress bars with color coding:
  - Green: < threshold%
  - Yellow: >= threshold% and < 100%
  - Red: >= 100%
- Show spent/remaining amounts
- Percentage indicators
- Alert badges

**Props:**
- `budgetStatus: BudgetStatus`
- `currency: string`
- `onEdit: () => void`

### 3.5 Create BudgetSetupModal Component
**File:** `frontend/src/components/BudgetSetupModal.tsx` (NEW)

**Features:**
- Form to set monthly/annual budget
- Alert threshold slider/input (default 80%)
- Currency selector
- Preview of current spending vs proposed budget
- Save/Cancel buttons

**Props:**
- `isOpen: boolean`
- `onClose: () => void`
- `onSave: (budget: Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void`
- `existingBudget?: Budget`
- `currentSpending: { monthly: number; annual: number }`

### 3.6 Create BudgetAlertBanner Component
**File:** `frontend/src/components/BudgetAlertBanner.tsx` (NEW)

**Features:**
- Alert banner shown when budget threshold exceeded
- Display at top of Dashboard
- Show warning/exceeded status
- Link to budget settings
- Dismissible (temporary, resets on page refresh)

**Props:**
- `alert: BudgetAlert`
- `budgetStatus: BudgetStatus`
- `currency: string`
- `onDismiss: () => void`
- `onViewBudget: () => void`

### 3.7 Update Dashboard Page
**File:** `frontend/src/pages/Dashboard.tsx`

**Changes:**
- Add BudgetCard component to metrics section
- Add BudgetAlertBanner at top if alert exists
- Show budget status in metrics cards
- Add "Set Budget" button if no budget exists
- Add "Edit Budget" option in BudgetCard
- Update `getDashboardMetrics` to include budget info (if needed)

### 3.8 Update Settings Page
**File:** `frontend/src/pages/Settings.tsx`

**Changes:**
- Add "Budget & Spending" section
- Include BudgetCard component
- Add "Set Budget" / "Edit Budget" button
- Add BudgetSetupModal
- Show budget status and alerts
- Option to delete budget

### 3.9 Create Budget Utilities
**File:** `frontend/src/utils/budget.ts` (NEW)

**Functions:**
- `calculateBudgetStatus: (spending: { monthly: number; annual: number }, budget: Budget) => BudgetStatus`
- `getBudgetAlert: (status: BudgetStatus, threshold: number) => BudgetAlert`
- `formatBudgetProgress: (spent: number, budget: number) => { percentage: number; remaining: number }`

### 3.10 Update Mock Data
**File:** `frontend/src/store/mockData.ts`

**Changes:**
- Add optional budget to `mockUser`:
  ```typescript
  budget: {
    id: 'budget-1',
    userId: 'user-1',
    monthlyBudget: 10000,
    annualBudget: 120000,
    currency: 'Γé╣',
    alertThreshold: 80,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }
  ```

---

## Implementation Order

### Phase 1: Foundation (Types & Store)
1. Update type definitions for all three features
2. Add store methods for bulk operations
3. Add store methods for budget management
4. Add sorting/filtering utilities

### Phase 2: Bulk Operations
1. Create Checkbox component
2. Create BulkActionsBar component
3. Create BulkEditModal component
4. Update Subscriptions page with selection logic
5. Test bulk operations

### Phase 3: Advanced Sorting/Filtering
1. Create SortDropdown component
2. Create PriceRangeFilter component
3. Create AdvancedFilters component
4. Update Subscriptions page with new filtering/sorting
5. Test sorting and filtering combinations

### Phase 4: Budget Tracking
1. Create budget utility functions
2. Create BudgetCard component
3. Create BudgetSetupModal component
4. Create BudgetAlertBanner component
5. Update Dashboard with budget display
6. Update Settings with budget management
7. Test budget alerts and calculations

### Phase 5: Integration & Polish
1. Ensure all features work together
2. Add loading states where needed
3. Add error handling
4. Add Toast notifications for all actions
5. Test edge cases
6. Update documentation

---

## Testing Checklist

### Bulk Operations
- [ ] Select single subscription
- [ ] Select multiple subscriptions
- [ ] Select all subscriptions
- [ ] Deselect all subscriptions
- [ ] Bulk delete (with confirmation)
- [ ] Bulk cancel
- [ ] Bulk toggle reminders
- [ ] Bulk edit category
- [ ] Bulk edit payment method
- [ ] Error handling for failed operations
- [ ] Toast notifications display correctly

### Advanced Sorting/Filtering
- [ ] Sort by each field (ascending/descending)
- [ ] Filter by category (single/multiple)
- [ ] Filter by billing cycle
- [ ] Filter by payment method
- [ ] Filter by price range
- [ ] Filter by reminder status
- [ ] Combine multiple filters
- [ ] Sort filtered results
- [ ] Clear all filters
- [ ] Quick filters work correctly
- [ ] Filter count badge updates

### Budget Tracking
- [ ] Set monthly budget
- [ ] Set annual budget
- [ ] Set alert threshold
- [ ] Edit existing budget
- [ ] Delete budget
- [ ] Budget status calculation correct
- [ ] Alert triggers at threshold
- [ ] Alert shows when exceeded
- [ ] Budget card displays correctly
- [ ] Budget banner appears/disappears correctly
- [ ] Budget persists across sessions

---

## File Structure Summary

### New Files
```
frontend/src/
Γö£ΓöÇΓöÇ components/
Γöé   Γö£ΓöÇΓöÇ BulkActionsBar.tsx
Γöé   Γö£ΓöÇΓöÇ BulkEditModal.tsx
Γöé   Γö£ΓöÇΓöÇ Checkbox.tsx
Γöé   Γö£ΓöÇΓöÇ SortDropdown.tsx
Γöé   Γö£ΓöÇΓöÇ PriceRangeFilter.tsx
Γöé   Γö£ΓöÇΓöÇ AdvancedFilters.tsx
Γöé   Γö£ΓöÇΓöÇ BudgetCard.tsx
Γöé   Γö£ΓöÇΓöÇ BudgetSetupModal.tsx
Γöé   ΓööΓöÇΓöÇ BudgetAlertBanner.tsx
ΓööΓöÇΓöÇ utils/
    ΓööΓöÇΓöÇ budget.ts
```

### Modified Files
```
frontend/src/
Γö£ΓöÇΓöÇ types/
Γöé   ΓööΓöÇΓöÇ index.ts
Γö£ΓöÇΓöÇ store/
Γöé   Γö£ΓöÇΓöÇ useStore.ts
Γöé   ΓööΓöÇΓöÇ mockData.ts
ΓööΓöÇΓöÇ pages/
    Γö£ΓöÇΓöÇ Subscriptions.tsx
    Γö£ΓöÇΓöÇ Dashboard.tsx
    ΓööΓöÇΓöÇ Settings.tsx
```

---

## Notes

1. **State Management**: All new state should be managed through Zustand store for consistency
2. **Type Safety**: Ensure all new components and functions are fully typed
3. **Dark Mode**: All new components must support dark mode
4. **Accessibility**: Add proper ARIA labels and keyboard navigation
5. **Performance**: Use useMemo for expensive filtering/sorting operations
6. **Error Handling**: Add try-catch blocks and user-friendly error messages
7. **Loading States**: Show loading indicators for async operations
8. **Toast Notifications**: Use existing Toast component for user feedback
9. **Responsive Design**: Ensure all new UI works on mobile devices
10. **Testing**: Test each feature independently before integration

---

## Future Enhancements (Out of Scope for V2)

1. Filter presets persistence
2. Budget history/trends
3. Budget by category
4. Export filtered subscriptions
5. Undo/redo for bulk operations
6. Keyboard shortcuts for bulk selection
7. Budget sharing/collaboration


import { Budget, BudgetAlert, BudgetStatus } from '../types';

export interface SpendingSnapshot {
  monthly: number;
  annual: number;
}

export const formatBudgetProgress = (spent: number, budget: number) => {
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 999) : 0;
  const remaining = Math.max(budget - spent, 0);
  return { percentage, remaining };
};

const deriveAlert = (
  monthlyPercentage: number,
  annualPercentage: number,
  threshold: number
): BudgetAlert => {
  if (monthlyPercentage >= 100 || annualPercentage >= 100) {
    return 'exceeded';
  }
  if (monthlyPercentage >= threshold || annualPercentage >= threshold) {
    return 'warning';
  }
  return 'none';
};

export const calculateBudgetStatus = (
  spending: SpendingSnapshot,
  budget: Budget
): BudgetStatus => {
  const monthlyProgress = formatBudgetProgress(spending.monthly, budget.monthlyBudget);
  const annualProgress = formatBudgetProgress(spending.annual, budget.annualBudget);
  const alert = deriveAlert(
    monthlyProgress.percentage,
    annualProgress.percentage,
    budget.alertThreshold
  );

  return {
    monthlySpent: spending.monthly,
    monthlyBudget: budget.monthlyBudget,
    monthlyRemaining: monthlyProgress.remaining,
    monthlyPercentage: monthlyProgress.percentage,
    annualSpent: spending.annual,
    annualBudget: budget.annualBudget,
    annualRemaining: annualProgress.remaining,
    annualPercentage: annualProgress.percentage,
    alert,
  };
};

export const getBudgetAlert = (status: BudgetStatus, threshold: number): BudgetAlert =>
  deriveAlert(status.monthlyPercentage, status.annualPercentage, threshold);


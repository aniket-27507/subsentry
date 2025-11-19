import { Subscription, User, Budget } from '../types';

interface AppData {
  version: number;
  timestamp: string;
  user: User | null;
  subscriptions: Subscription[];
  budget: Budget | null;
}

export const exportData = (
  user: User | null,
  subscriptions: Subscription[],
  budget: Budget | null
) => {
  const data: AppData = {
    version: 1,
    timestamp: new Date().toISOString(),
    user,
    subscriptions,
    budget,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `subsentry-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<Partial<AppData>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Basic validation
        if (!data.version || !Array.isArray(data.subscriptions)) {
          throw new Error('Invalid backup file format');
        }

        resolve({
          user: data.user,
          subscriptions: data.subscriptions,
          budget: data.budget,
        });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

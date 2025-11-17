import { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export default function Table<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  emptyMessage = 'No data available',
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-dark-border p-8 text-center">
        <p className="text-gray-500 dark:text-dark-text-secondary">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-dark-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-dark-surface-hover border-b border-gray-200 dark:border-dark-border">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-dark-text-secondary uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
            {data.map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(item)}
                className={`${
                  onRowClick
                    ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-surface-hover transition-colors'
                    : ''
                }`}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-sm text-gray-900 dark:text-dark-text">
                    {column.render
                      ? column.render(item)
                      : item[column.key]?.toString() || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


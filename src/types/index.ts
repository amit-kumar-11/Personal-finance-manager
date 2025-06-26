export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  createdAt: number;
}

export interface Budget {
  category: string;
  amount: number;
  spent: number;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}
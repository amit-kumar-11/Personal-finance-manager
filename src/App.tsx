import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Transaction, Budget } from './types';
import Navbar from './components/Navbar';
import StatsCard from './components/StatsCard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import ExpenseChart from './components/ExpenseChart';
import BudgetPlanner from './components/BudgetPlanner';

function AppContent() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('finance-transactions', []);
  const [budgets, setBudgets] = useLocalStorage<Budget[]>('finance-budgets', []);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      createdAt: Date.now()
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
    setEditingTransaction(null);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  // Calculate stats
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Income"
            amount={totalIncome}
            icon={TrendingUp}
            color="green"
            delay={0}
          />
          <StatsCard
            title="Total Expenses"
            amount={totalExpenses}
            icon={TrendingDown}
            color="red"
            delay={100}
          />
          <StatsCard
            title="Current Balance"
            amount={balance}
            icon={Wallet}
            color={balance >= 0 ? 'green' : 'red'}
            delay={200}
          />
        </div>

        {/* Charts */}
        <div className="mb-8">
          <ExpenseChart transactions={transactions} />
        </div>

        {/* Budget Planner */}
        <div className="mb-8">
          <BudgetPlanner 
            transactions={transactions}
            budgets={budgets}
            onUpdateBudgets={setBudgets}
          />
        </div>

        {/* Transaction List */}
        <div className="mb-8">
          <TransactionList
            transactions={transactions}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={deleteTransaction}
          />
        </div>

        {/* Transaction Form */}
        <TransactionForm
          onAddTransaction={addTransaction}
          editingTransaction={editingTransaction}
          onUpdateTransaction={updateTransaction}
          onCancelEdit={handleCancelEdit}
        />
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
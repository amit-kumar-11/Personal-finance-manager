import React, { useState } from 'react';
import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { Transaction, Budget } from '../types';

interface BudgetPlannerProps {
  transactions: Transaction[];
  budgets: Budget[];
  onUpdateBudgets: (budgets: Budget[]) => void;
}

const BudgetPlanner: React.FC<BudgetPlannerProps> = ({ 
  transactions, 
  budgets, 
  onUpdateBudgets 
}) => {
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({ category: '', amount: '' });

  const categories = [
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
    'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Other'
  ];

  const calculateSpentAmount = (category: string) => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) return;

    const amount = parseFloat(formData.amount);
    if (amount <= 0) return;

    const newBudget: Budget = {
      category: formData.category,
      amount,
      spent: calculateSpentAmount(formData.category)
    };

    if (editingBudget) {
      onUpdateBudgets(budgets.map(b => 
        b.category === editingBudget.category ? newBudget : b
      ));
      setEditingBudget(null);
    } else {
      onUpdateBudgets([...budgets.filter(b => b.category !== formData.category), newBudget]);
    }

    setFormData({ category: '', amount: '' });
    setIsAddingBudget(false);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({ category: budget.category, amount: budget.amount.toString() });
    setIsAddingBudget(true);
  };

  const handleDelete = (category: string) => {
    onUpdateBudgets(budgets.filter(b => b.category !== category));
  };

  const handleCancel = () => {
    setIsAddingBudget(false);
    setEditingBudget(null);
    setFormData({ category: '', amount: '' });
  };

  // Update spent amounts
  const updatedBudgets = budgets.map(budget => ({
    ...budget,
    spent: calculateSpentAmount(budget.category)
  }));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Budget Planner
          </h2>
          {!isAddingBudget && (
            <button
              onClick={() => setIsAddingBudget(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              <span>Add Budget</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {isAddingBudget && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-slideDown">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.filter(cat => 
                      !budgets.some(b => b.category === cat) || editingBudget?.category === cat
                    ).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Budget Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
                >
                  {editingBudget ? 'Update' : 'Add'} Budget
                </button>
              </div>
            </form>
          </div>
        )}

        {updatedBudgets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No budgets set. Create your first budget to start tracking!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {updatedBudgets.map((budget, index) => {
              const percentage = (budget.spent / budget.amount) * 100;
              const isOverBudget = percentage > 100;
              const isNearLimit = percentage > 80 && percentage <= 100;

              return (
                <div
                  key={budget.category}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {budget.category}
                      </h3>
                      {(isOverBudget || isNearLimit) && (
                        <AlertTriangle className={`h-4 w-4 ${
                          isOverBudget ? 'text-red-500' : 'text-amber-500'
                        }`} />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        isOverBudget 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleEdit(budget)}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(budget.category)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        isOverBudget 
                          ? 'bg-gradient-to-r from-red-500 to-red-600' 
                          : isNearLimit
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className={`${
                      isOverBudget 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {percentage.toFixed(1)}% used
                    </span>
                    <span className="text-gray-500 dark:text-gray-500">
                      ${(budget.amount - budget.spent).toFixed(2)} remaining
                    </span>
                  </div>
                  
                  {isOverBudget && (
                    <div className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">
                      Over budget by ${(budget.spent - budget.amount).toFixed(2)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetPlanner;
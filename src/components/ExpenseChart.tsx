import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Transaction } from '../types';

interface ExpenseChartProps {
  transactions: Transaction[];
}

const COLORS = [
  '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', 
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions }) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  
  const categoryData = expenses.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  const barData = Object.entries(categoryData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6)
    .map(([category, amount]) => ({
      category: category.length > 10 ? category.substring(0, 10) + '...' : category,
      amount
    }));

  if (expenses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Expense Breakdown
        </h2>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          No expense data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Expense Breakdown
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              By Category
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Top Categories
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;
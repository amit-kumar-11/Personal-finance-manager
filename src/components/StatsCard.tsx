import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  color: 'green' | 'red' | 'blue';
  delay?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, amount, icon: Icon, color, delay = 0 }) => {
  const colorClasses = {
    green: 'from-emerald-500 to-teal-600 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
    red: 'from-red-500 to-pink-600 text-red-600 bg-red-50 dark:bg-red-900/20',
    blue: 'from-blue-500 to-indigo-600 text-blue-600 bg-blue-50 dark:bg-blue-900/20'
  };

  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn border border-gray-100 dark:border-gray-800"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${Math.abs(amount).toFixed(2)}
            </p>
          </div>
          <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]}`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
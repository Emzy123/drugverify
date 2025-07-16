
import React from 'react';
import { HistoryItem } from '../types';
import { ClockIcon } from './icons/UIIcons';

interface SearchHistoryProps {
  history: HistoryItem[];
  onHistoryClick: (item: HistoryItem) => void;
  isLoading: boolean;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({ history, onHistoryClick, isLoading }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <ClockIcon className="w-5 h-5 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-600">Recent Searches</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((item, index) => (
          <button
            key={index}
            onClick={() => onHistoryClick(item)}
            disabled={isLoading}
            className="px-3 py-1.5 bg-slate-200 text-slate-700 text-sm font-medium rounded-full hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cust-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {item.term} <span className="text-xs text-slate-500">({item.method})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

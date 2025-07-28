"use client"
import { useState } from 'react';
import CommissionCard from "./CommissionCard";
import CommissionType from "./CommissionType";

export default function CommissionsPage({ commissions }: { commissions: CommissionType[] }) {
  const [sortBy, setSortBy] = useState<'dueDate' | 'status'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusPriority = (status: string) => {
    switch (status) {
      case 'Awaiting Payment': return 1;
      case 'in_progress': return 2;
      case 'Awaiting Approval': return 3;
      default: return 4;
    }
  };

  const sortedCommissions = [...commissions].sort((a, b) => {
    if (sortBy === 'dueDate') {
      const daysA = getDaysUntilDue(a.dueDate);
      const daysB = getDaysUntilDue(b.dueDate);
      return sortOrder === 'asc' ? daysA - daysB : daysB - daysA;
    } else {
      const priorityA = getStatusPriority(a.status);
      const priorityB = getStatusPriority(b.status);
      return sortOrder === 'asc' ? priorityA - priorityB : priorityB - priorityA;
    }
  });

  const renderCommissionCards = () => {
    return sortedCommissions.map((commission) => (
      <CommissionCard key={commission.id} commission={commission} />
    ))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Active Commissions</h3>
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'status')}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="dueDate">Due Date</option>
            <option value="status">Status</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {renderCommissionCards()}
      </div>
    </div>
  )
}
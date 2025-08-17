import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

export function calculateDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    'planning': 'bg-gray-100 text-gray-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'on_hold': 'bg-yellow-100 text-yellow-800',
    'todo': 'bg-gray-100 text-gray-800',
    'review': 'bg-purple-100 text-purple-800',
    'done': 'bg-green-100 text-green-800',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

export function getPriorityColor(priority: string): string {
  const priorityColors: Record<string, string> = {
    'low': 'bg-gray-100 text-gray-600',
    'medium': 'bg-blue-100 text-blue-600',
    'high': 'bg-orange-100 text-orange-600',
    'urgent': 'bg-red-100 text-red-600',
  };
  return priorityColors[priority] || 'bg-gray-100 text-gray-600';
}

export function calculateProfit(revenue: number, cost: number): number {
  return revenue - cost;
}

export function calculateProfitMargin(revenue: number, cost: number): number {
  if (revenue === 0) return 0;
  return ((revenue - cost) / revenue) * 100;
}
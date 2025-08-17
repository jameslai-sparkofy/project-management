export type UserRole = 'owner' | 'project_manager' | 'craftsman' | 'supplier' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  startDate: string;
  endDate: string;
  actualEndDate?: string;
  budget: number;
  actualCost: number;
  revenue: number;
  progress: number;
  managerId: string;
  tasks: Task[];
  suppliers: string[];
  craftsmen: string[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId: string;
  startDate: string;
  endDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  estimatedHours: number;
  actualHours?: number;
  dependencies: string[];
  progress: number;
  cost: number;
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  products: string[];
  rating: number;
}

export interface Product {
  id: string;
  name: string;
  supplierId: string;
  unitPrice: number;
  unit: string;
  category: string;
  leadTime: number;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  projects: string[];
}

export interface Craftsman {
  id: string;
  userId: string;
  name: string;
  specialty: string;
  hourlyRate: number;
  availability: 'available' | 'busy' | 'unavailable';
  skills: string[];
  currentTasks: string[];
  completedTasks: string[];
}

export interface TimeReport {
  id: string;
  taskId: string;
  craftsmanId: string;
  date: string;
  hours: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CostReport {
  projectId: string;
  laborCost: number;
  materialCost: number;
  otherCost: number;
  totalCost: number;
  budget: number;
  profit: number;
  profitMargin: number;
}
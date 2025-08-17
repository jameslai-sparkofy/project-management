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

// 工程專業類別
export interface EngineringCategory {
  id: string;
  name: string;           // 土木工程、水電工程、木作工程等
  color: string;          // 泳道顏色
  icon: string;           // 圖標名稱 (lucide-react)
  description: string;    // 類別說明
  standardProcesses: string[]; // 標準工序ID列表
}

// 標準工序模板
export interface StandardProcess {
  id: string;
  name: string;           // 標準工序名稱
  categoryId: string;     // 所屬工程類別
  description: string;    // 工序說明
  estimatedDuration: number; // 預估工期(天)
  unitPrice: number;      // 單價
  unit: string;           // 計價單位 (坪、米、項等)
  complexity: 'simple' | 'medium' | 'complex'; // 複雜度
  requiredSkills: string[]; // 所需技能
}

// 工序 (替代原本的 Task)
export interface WorkProcess {
  id: string;
  projectId: string;
  categoryId: string;     // 工程類別ID
  name: string;           // 工序名稱
  description: string;
  quantity: number;       // 數量
  unitPrice: number;      // 單價
  totalCost: number;      // 總價 (quantity * unitPrice)
  duration: number;       // 工期(天)
  status: 'planned' | 'ready' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedCraftsmen: string[]; // 分配的師傅ID
  dependencies: string[]; // 前置工序ID
  subProcesses: SubProcess[]; // 子工序
  startDate?: string;
  endDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  progress: number;       // 完成百分比
  notes?: string;         // 備註
}

// 子工序
export interface SubProcess {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  assignee?: string;      // 負責師傅ID
  estimatedHours: number;
  actualHours?: number;
  startTime?: string;
  endTime?: string;
}
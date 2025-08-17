import type { Project, Task, User, Client, Supplier, Craftsman, Product } from '../types/models';

export const mockUsers: User[] = [
  { id: 'u1', name: '張經理', email: 'manager@company.com', role: 'project_manager' },
  { id: 'u2', name: '李老闆', email: 'owner@company.com', role: 'owner' },
  { id: 'u3', name: '王師傅', email: 'wang@company.com', role: 'craftsman' },
  { id: 'u4', name: '陳師傅', email: 'chen@company.com', role: 'craftsman' },
  { id: 'u5', name: '林師傅', email: 'lin@company.com', role: 'craftsman' },
  { id: 'u6', name: '建材供應商', email: 'supplier1@company.com', role: 'supplier' },
  { id: 'u7', name: '張先生', email: 'client1@gmail.com', role: 'client' },
  { id: 'u8', name: '李小姐', email: 'client2@gmail.com', role: 'client' },
];

export const mockClients: Client[] = [
  {
    id: 'c1',
    name: '張先生',
    company: '張氏企業',
    email: 'client1@gmail.com',
    phone: '0912-345-678',
    projects: ['p1', 'p2']
  },
  {
    id: 'c2',
    name: '李小姐',
    company: '個人',
    email: 'client2@gmail.com',
    phone: '0923-456-789',
    projects: ['p3']
  }
];

export const mockSuppliers: Supplier[] = [
  {
    id: 's1',
    name: '建材大王',
    contactPerson: '陳經理',
    email: 'supplier1@company.com',
    phone: '02-1234-5678',
    products: ['prod1', 'prod2', 'prod3'],
    rating: 4.5
  },
  {
    id: 's2',
    name: '五金百貨',
    contactPerson: '林老闆',
    email: 'supplier2@company.com',
    phone: '02-2345-6789',
    products: ['prod4', 'prod5'],
    rating: 4.8
  }
];

export const mockProducts: Product[] = [
  { id: 'prod1', name: '水泥', supplierId: 's1', unitPrice: 250, unit: '包', category: '建材', leadTime: 1 },
  { id: 'prod2', name: '鋼筋', supplierId: 's1', unitPrice: 35000, unit: '噸', category: '建材', leadTime: 3 },
  { id: 'prod3', name: '磁磚', supplierId: 's1', unitPrice: 800, unit: '坪', category: '建材', leadTime: 2 },
  { id: 'prod4', name: '電線', supplierId: 's2', unitPrice: 1200, unit: '捲', category: '電料', leadTime: 1 },
  { id: 'prod5', name: '開關插座', supplierId: 's2', unitPrice: 150, unit: '個', category: '電料', leadTime: 1 },
];

export const mockCraftsmen: Craftsman[] = [
  {
    id: 'cr1',
    userId: 'u3',
    name: '王師傅',
    specialty: '水電工程',
    hourlyRate: 800,
    availability: 'available',
    skills: ['配電', '給排水', '衛浴安裝'],
    currentTasks: ['t1'],
    completedTasks: ['t10', 't11']
  },
  {
    id: 'cr2',
    userId: 'u4',
    name: '陳師傅',
    specialty: '土木工程',
    hourlyRate: 1000,
    availability: 'busy',
    skills: ['混凝土', '鋼筋綁紮', '模板'],
    currentTasks: ['t2', 't3'],
    completedTasks: ['t12']
  },
  {
    id: 'cr3',
    userId: 'u5',
    name: '林師傅',
    specialty: '裝潢工程',
    hourlyRate: 900,
    availability: 'available',
    skills: ['木工', '油漆', '系統櫃'],
    currentTasks: ['t4'],
    completedTasks: ['t13', 't14', 't15']
  }
];

export const mockTasks: Task[] = [
  {
    id: 't1',
    projectId: 'p1',
    title: '基礎配電工程',
    description: '完成一樓配電箱安裝及線路配置',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'cr1',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    estimatedHours: 40,
    actualHours: 35,
    dependencies: [],
    progress: 75,
    cost: 32000,
    subtasks: [
      { id: 'st1', title: '配電箱安裝', completed: true },
      { id: 'st2', title: '主幹線配置', completed: true },
      { id: 'st3', title: '分路配線', completed: false },
      { id: 'st4', title: '接地工程', completed: false },
    ]
  },
  {
    id: 't2',
    projectId: 'p1',
    title: '地基開挖',
    description: '開挖基礎並準備灌漿',
    status: 'done',
    priority: 'urgent',
    assigneeId: 'cr2',
    startDate: '2024-01-10',
    endDate: '2024-01-14',
    actualEndDate: '2024-01-13',
    estimatedHours: 32,
    actualHours: 28,
    dependencies: [],
    progress: 100,
    cost: 28000
  },
  {
    id: 't3',
    projectId: 'p1',
    title: '鋼筋綁紮',
    description: '完成基礎及柱鋼筋綁紮',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'cr2',
    startDate: '2024-01-14',
    endDate: '2024-01-18',
    estimatedHours: 24,
    actualHours: 16,
    dependencies: ['t2'],
    progress: 60,
    cost: 24000
  },
  {
    id: 't4',
    projectId: 'p2',
    title: '客廳天花板施工',
    description: '矽酸鈣板天花板及間接照明',
    status: 'todo',
    priority: 'medium',
    assigneeId: 'cr3',
    startDate: '2024-01-22',
    endDate: '2024-01-26',
    estimatedHours: 32,
    dependencies: [],
    progress: 0,
    cost: 28800
  },
  {
    id: 't5',
    projectId: 'p2',
    title: '主臥室系統櫃',
    description: '衣櫃及收納櫃安裝',
    status: 'todo',
    priority: 'medium',
    assigneeId: 'cr3',
    startDate: '2024-01-27',
    endDate: '2024-01-30',
    estimatedHours: 24,
    dependencies: ['t4'],
    progress: 0,
    cost: 21600
  },
  // 商業空間改造專案任務 (p3)
  {
    id: 't6',
    projectId: 'p3',
    title: '廚房設備拆除',
    description: '拆除舊有廚房設備及管線',
    status: 'done',
    priority: 'high',
    assigneeId: 'cr1',
    startDate: '2023-10-01',
    endDate: '2023-10-05',
    actualEndDate: '2023-10-04',
    estimatedHours: 32,
    actualHours: 28,
    dependencies: [],
    progress: 100,
    cost: 22400
  },
  {
    id: 't7',
    projectId: 'p3',
    title: '新廚房設計施工',
    description: '新廚房設備安裝及管線配置',
    status: 'done',
    priority: 'urgent',
    assigneeId: 'cr3',
    startDate: '2023-10-06',
    endDate: '2023-11-20',
    actualEndDate: '2023-11-18',
    estimatedHours: 180,
    actualHours: 175,
    dependencies: ['t6'],
    progress: 100,
    cost: 157500
  },
  {
    id: 't8',
    projectId: 'p3',
    title: '用餐區裝修',
    description: '用餐區地板、牆面及天花板裝修',
    status: 'done',
    priority: 'medium',
    assigneeId: 'cr3',
    startDate: '2023-11-21',
    endDate: '2023-12-18',
    actualEndDate: '2023-12-18',
    estimatedHours: 120,
    actualHours: 118,
    dependencies: ['t7'],
    progress: 100,
    cost: 106200
  },
  // 廠房擴建工程專案任務 (p4)
  {
    id: 't9',
    projectId: 'p4',
    title: '結構評估',
    description: '既有廠房結構安全評估',
    status: 'todo',
    priority: 'urgent',
    assigneeId: 'cr2',
    startDate: '2024-02-01',
    endDate: '2024-02-10',
    estimatedHours: 40,
    dependencies: [],
    progress: 0,
    cost: 40000
  },
  {
    id: 't10',
    projectId: 'p4',
    title: '擴建區域基礎工程',
    description: '新增1000坪廠房區域的基礎開挖與灌漿',
    status: 'todo',
    priority: 'high',
    assigneeId: 'cr2',
    startDate: '2024-02-11',
    endDate: '2024-03-15',
    estimatedHours: 200,
    dependencies: ['t9'],
    progress: 0,
    cost: 200000
  },
  {
    id: 't11',
    projectId: 'p4',
    title: '鋼構安裝',
    description: '廠房鋼構樑柱安裝',
    status: 'todo',
    priority: 'high',
    assigneeId: 'cr2',
    startDate: '2024-03-16',
    endDate: '2024-05-31',
    estimatedHours: 300,
    dependencies: ['t10'],
    progress: 0,
    cost: 300000
  }
];

// 專案數據將在底部動態生成，包含對應的任務
export const mockProjects: Project[] = [];

// 動態生成專案數據，包含對應的任務
const generateProjects = () => {
  return [
    {
      id: 'p1',
      name: '台北辦公室新建工程',
      description: '三層樓辦公大樓新建案，包含土建、機電、裝修工程',
      clientId: 'c1',
      status: 'in_progress' as const,
      startDate: '2024-01-10',
      endDate: '2024-06-30',
      budget: 8000000,
      actualCost: 2500000,
      revenue: 9600000,
      progress: 35,
      managerId: 'u1',
      tasks: mockTasks.filter(t => t.projectId === 'p1'),
      suppliers: ['s1', 's2'],
      craftsmen: ['cr1', 'cr2']
    },
    {
      id: 'p2',
      name: '住宅室內裝修工程',
      description: '120坪豪宅全室裝修，包含客廳、餐廳、主臥、次臥等空間',
      clientId: 'c1',
      status: 'planning' as const,
      startDate: '2024-01-22',
      endDate: '2024-03-15',
      budget: 3500000,
      actualCost: 0,
      revenue: 4200000,
      progress: 0,
      managerId: 'u1',
      tasks: mockTasks.filter(t => t.projectId === 'p2'),
      suppliers: ['s2'],
      craftsmen: ['cr3']
    },
    {
      id: 'p3',
      name: '商業空間改造',
      description: '餐廳空間重新設計裝修，包含廚房設備更新',
      clientId: 'c2',
      status: 'completed' as const,
      startDate: '2023-10-01',
      endDate: '2023-12-20',
      actualEndDate: '2023-12-18',
      budget: 2000000,
      actualCost: 1850000,
      revenue: 2400000,
      progress: 100,
      managerId: 'u1',
      tasks: mockTasks.filter(t => t.projectId === 'p3'),
      suppliers: ['s1'],
      craftsmen: ['cr1', 'cr3']
    },
    {
      id: 'p4',
      name: '廠房擴建工程',
      description: '既有廠房擴建1000坪，含結構補強及機電系統',
      clientId: 'c1',
      status: 'on_hold' as const,
      startDate: '2024-02-01',
      endDate: '2024-08-31',
      budget: 15000000,
      actualCost: 0,
      revenue: 18000000,
      progress: 0,
      managerId: 'u1',
      tasks: mockTasks.filter(t => t.projectId === 'p4'),
      suppliers: ['s1', 's2'],
      craftsmen: ['cr2']
    }
  ];
};

// 初始化專案數據
mockProjects.push(...generateProjects());
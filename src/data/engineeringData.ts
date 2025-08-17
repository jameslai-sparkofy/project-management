import type { EngineringCategory, StandardProcess, WorkProcess } from '../types/models';

// 工程專業類別
export const engineeringCategories: EngineringCategory[] = [
  {
    id: 'civil',
    name: '土木工程',
    color: 'bg-amber-50 border-amber-300',
    icon: 'Building2',
    description: '基礎工程、結構工程、混凝土工程',
    standardProcesses: ['civil-001', 'civil-002', 'civil-003', 'civil-004', 'civil-005']
  },
  {
    id: 'electrical',
    name: '水電工程',
    color: 'bg-blue-50 border-blue-300',
    icon: 'Zap',
    description: '配電工程、給排水工程、弱電系統',
    standardProcesses: ['elec-001', 'elec-002', 'elec-003', 'elec-004', 'elec-005']
  },
  {
    id: 'carpentry',
    name: '木作工程',
    color: 'bg-orange-50 border-orange-300',
    icon: 'Hammer',
    description: '天花板、櫃體、隔間、地板工程',
    standardProcesses: ['carp-001', 'carp-002', 'carp-003', 'carp-004', 'carp-005']
  },
  {
    id: 'painting',
    name: '油漆工程',
    color: 'bg-purple-50 border-purple-300',
    icon: 'Paintbrush',
    description: '批土、底漆、面漆、特殊塗裝',
    standardProcesses: ['paint-001', 'paint-002', 'paint-003', 'paint-004']
  },
  {
    id: 'mechanical',
    name: '機電工程',
    color: 'bg-green-50 border-green-300',
    icon: 'Cog',
    description: '空調、電梯、自動化系統',
    standardProcesses: ['mech-001', 'mech-002', 'mech-003', 'mech-004']
  },
  {
    id: 'doors_windows',
    name: '門窗工程',
    color: 'bg-indigo-50 border-indigo-300',
    icon: 'RectangleHorizontal',
    description: '鋁窗、木門、玻璃、五金安裝',
    standardProcesses: ['door-001', 'door-002', 'door-003', 'door-004']
  },
  {
    id: 'interior',
    name: '裝修工程',
    color: 'bg-pink-50 border-pink-300',
    icon: 'Home',
    description: '磁磚、壁紙、燈具、衛浴設備',
    standardProcesses: ['int-001', 'int-002', 'int-003', 'int-004', 'int-005']
  }
];

// 標準工序庫
export const standardProcesses: StandardProcess[] = [
  // 土木工程
  {
    id: 'civil-001',
    name: '基礎開挖',
    categoryId: 'civil',
    description: '場地整理、基礎開挖、土方處理',
    estimatedDuration: 3,
    unitPrice: 1200,
    unit: '立方米',
    complexity: 'medium',
    requiredSkills: ['挖掘機操作', '測量', '土方工程']
  },
  {
    id: 'civil-002',
    name: '鋼筋綁紮',
    categoryId: 'civil',
    description: '鋼筋加工、綁紮、檢查',
    estimatedDuration: 2,
    unitPrice: 85,
    unit: '公斤',
    complexity: 'medium',
    requiredSkills: ['鋼筋工程', '結構圖識讀']
  },
  {
    id: 'civil-003',
    name: '混凝土澆置',
    categoryId: 'civil',
    description: '混凝土澆置、震動、養護',
    estimatedDuration: 1,
    unitPrice: 3500,
    unit: '立方米',
    complexity: 'complex',
    requiredSkills: ['混凝土工程', '品質管制']
  },
  {
    id: 'civil-004',
    name: '模板組立',
    categoryId: 'civil',
    description: '模板安裝、支撐、拆模',
    estimatedDuration: 2,
    unitPrice: 800,
    unit: '平方米',
    complexity: 'medium',
    requiredSkills: ['模板工程', '結構支撐']
  },
  {
    id: 'civil-005',
    name: '防水工程',
    categoryId: 'civil',
    description: '防水層施作、保護層',
    estimatedDuration: 1,
    unitPrice: 450,
    unit: '平方米',
    complexity: 'medium',
    requiredSkills: ['防水施工', '材料應用']
  },

  // 水電工程
  {
    id: 'elec-001',
    name: '配電箱安裝',
    categoryId: 'electrical',
    description: '配電箱定位、安裝、接線',
    estimatedDuration: 1,
    unitPrice: 8500,
    unit: '組',
    complexity: 'complex',
    requiredSkills: ['配電工程', '電氣圖識讀', '安全規範']
  },
  {
    id: 'elec-002',
    name: '管路配置',
    categoryId: 'electrical',
    description: '電管、水管配置安裝',
    estimatedDuration: 2,
    unitPrice: 120,
    unit: '米',
    complexity: 'medium',
    requiredSkills: ['管路工程', '配管技術']
  },
  {
    id: 'elec-003',
    name: '給排水安裝',
    categoryId: 'electrical',
    description: '給水、排水管路及設備安裝',
    estimatedDuration: 3,
    unitPrice: 2800,
    unit: '套',
    complexity: 'complex',
    requiredSkills: ['給排水工程', '衛生設備']
  },
  {
    id: 'elec-004',
    name: '弱電系統',
    categoryId: 'electrical',
    description: '網路、電話、監控系統配置',
    estimatedDuration: 2,
    unitPrice: 3200,
    unit: '點',
    complexity: 'complex',
    requiredSkills: ['弱電工程', '網路配置', '系統整合']
  },
  {
    id: 'elec-005',
    name: '照明安裝',
    categoryId: 'electrical',
    description: '燈具安裝、開關插座配置',
    estimatedDuration: 1,
    unitPrice: 180,
    unit: '點',
    complexity: 'simple',
    requiredSkills: ['照明工程', '電氣安裝']
  },

  // 木作工程
  {
    id: 'carp-001',
    name: '天花板施工',
    categoryId: 'carpentry',
    description: '輕鋼架、矽酸鈣板天花板',
    estimatedDuration: 2,
    unitPrice: 1200,
    unit: '平方米',
    complexity: 'medium',
    requiredSkills: ['天花板工程', '輕鋼架']
  },
  {
    id: 'carp-002',
    name: '系統櫃製作',
    categoryId: 'carpentry',
    description: '系統櫃設計、製作、安裝',
    estimatedDuration: 3,
    unitPrice: 12000,
    unit: '組',
    complexity: 'complex',
    requiredSkills: ['櫃體製作', '五金安裝', '精密施工']
  },
  {
    id: 'carp-003',
    name: '隔間牆施工',
    categoryId: 'carpentry',
    description: '木構隔間牆製作安裝',
    estimatedDuration: 2,
    unitPrice: 850,
    unit: '平方米',
    complexity: 'medium',
    requiredSkills: ['隔間工程', '木構造']
  },
  {
    id: 'carp-004',
    name: '地板鋪設',
    categoryId: 'carpentry',
    description: '木質地板、超耐磨地板施工',
    estimatedDuration: 1,
    unitPrice: 2200,
    unit: '平方米',
    complexity: 'medium',
    requiredSkills: ['地板施工', '精密測量']
  },
  {
    id: 'carp-005',
    name: '門框安裝',
    categoryId: 'carpentry',
    description: '木門框製作安裝',
    estimatedDuration: 1,
    unitPrice: 4500,
    unit: '組',
    complexity: 'medium',
    requiredSkills: ['門窗工程', '精密安裝']
  },

  // 油漆工程
  {
    id: 'paint-001',
    name: '牆面批土',
    categoryId: 'painting',
    description: '牆面整平、批土處理',
    estimatedDuration: 2,
    unitPrice: 180,
    unit: '平方米',
    complexity: 'medium',
    requiredSkills: ['批土技術', '表面處理']
  },
  {
    id: 'paint-002',
    name: '底漆施作',
    categoryId: 'painting',
    description: '底漆塗佈、養護',
    estimatedDuration: 1,
    unitPrice: 120,
    unit: '平方米',
    complexity: 'simple',
    requiredSkills: ['油漆技術', '材料應用']
  },
  {
    id: 'paint-003',
    name: '面漆施作',
    categoryId: 'painting',
    description: '面漆塗佈、修飾',
    estimatedDuration: 1,
    unitPrice: 150,
    unit: '平方米',
    complexity: 'medium',
    requiredSkills: ['油漆技術', '色彩調配']
  },
  {
    id: 'paint-004',
    name: '特殊塗裝',
    categoryId: 'painting',
    description: '藝術塗裝、特殊效果',
    estimatedDuration: 2,
    unitPrice: 380,
    unit: '平方米',
    complexity: 'complex',
    requiredSkills: ['特殊塗裝', '藝術技法']
  },

  // 機電工程
  {
    id: 'mech-001',
    name: '空調安裝',
    categoryId: 'mechanical',
    description: '冷氣機、通風設備安裝',
    estimatedDuration: 2,
    unitPrice: 25000,
    unit: '台',
    complexity: 'complex',
    requiredSkills: ['空調工程', '冷媒配管', '電氣控制']
  },
  {
    id: 'mech-002',
    name: '排風系統',
    categoryId: 'mechanical',
    description: '排風扇、管路系統安裝',
    estimatedDuration: 1,
    unitPrice: 3200,
    unit: '套',
    complexity: 'medium',
    requiredSkills: ['通風工程', '管路配置']
  },
  {
    id: 'mech-003',
    name: '消防設備',
    categoryId: 'mechanical',
    description: '消防灑水、警報系統',
    estimatedDuration: 3,
    unitPrice: 12000,
    unit: '套',
    complexity: 'complex',
    requiredSkills: ['消防工程', '系統整合', '法規符合']
  },
  {
    id: 'mech-004',
    name: '電梯安裝',
    categoryId: 'mechanical',
    description: '電梯設備安裝、測試',
    estimatedDuration: 7,
    unitPrice: 850000,
    unit: '台',
    complexity: 'complex',
    requiredSkills: ['電梯工程', '機械安裝', '安全檢測']
  },

  // 門窗工程
  {
    id: 'door-001',
    name: '鋁窗安裝',
    categoryId: 'doors_windows',
    description: '鋁合金窗戶製作安裝',
    estimatedDuration: 1,
    unitPrice: 3800,
    unit: '平方米',
    complexity: 'medium',
    requiredSkills: ['鋁窗工程', '精密測量', '防水施工']
  },
  {
    id: 'door-002',
    name: '木門安裝',
    categoryId: 'doors_windows',
    description: '實木門、密集板門安裝',
    estimatedDuration: 1,
    unitPrice: 8500,
    unit: '組',
    complexity: 'medium',
    requiredSkills: ['門窗工程', '五金安裝']
  },
  {
    id: 'door-003',
    name: '玻璃安裝',
    categoryId: 'doors_windows',
    description: '強化玻璃、膠合玻璃安裝',
    estimatedDuration: 1,
    unitPrice: 1200,
    unit: '平方米',
    complexity: 'medium',
    requiredSkills: ['玻璃工程', '安全作業']
  },
  {
    id: 'door-004',
    name: '五金配件',
    categoryId: 'doors_windows',
    description: '門鎖、鉸鏈、把手安裝',
    estimatedDuration: 1,
    unitPrice: 450,
    unit: '組',
    complexity: 'simple',
    requiredSkills: ['五金安裝', '精密調整']
  },

  // 裝修工程
  {
    id: 'int-001',
    name: '磁磚鋪貼',
    categoryId: 'interior',
    description: '地磚、壁磚鋪貼施工',
    estimatedDuration: 2,
    unitPrice: 1800,
    unit: '平方米',
    complexity: 'medium',
    requiredSkills: ['磁磚工程', '水平測量', '切割技術']
  },
  {
    id: 'int-002',
    name: '壁紙施工',
    categoryId: 'interior',
    description: '壁紙裁切、黏貼、修邊',
    estimatedDuration: 1,
    unitPrice: 380,
    unit: '平方米',
    complexity: 'medium',
    requiredSkills: ['壁紙施工', '精密裁切']
  },
  {
    id: 'int-003',
    name: '燈具安裝',
    categoryId: 'interior',
    description: '吊燈、崁燈、壁燈安裝',
    estimatedDuration: 1,
    unitPrice: 280,
    unit: '組',
    complexity: 'simple',
    requiredSkills: ['燈具安裝', '電氣連接']
  },
  {
    id: 'int-004',
    name: '衛浴設備',
    categoryId: 'interior',
    description: '馬桶、洗手台、淋浴設備',
    estimatedDuration: 1,
    unitPrice: 12000,
    unit: '套',
    complexity: 'medium',
    requiredSkills: ['衛浴安裝', '給排水連接']
  },
  {
    id: 'int-005',
    name: '廚具安裝',
    categoryId: 'interior',
    description: '廚具、檯面、水槽安裝',
    estimatedDuration: 2,
    unitPrice: 45000,
    unit: '套',
    complexity: 'complex',
    requiredSkills: ['廚具安裝', '檯面加工', '水電連接']
  }
];

// 範例工序數據 (轉換自原本的 Task)
export const mockWorkProcesses: WorkProcess[] = [
  {
    id: 'wp001',
    projectId: 'p1',
    categoryId: 'civil',
    name: '基礎開挖工程',
    description: '辦公大樓基礎開挖及土方處理',
    quantity: 120,
    unitPrice: 1200,
    totalCost: 144000,
    duration: 5,
    status: 'completed',
    priority: 'high',
    assignedCraftsmen: ['cr2'],
    dependencies: [],
    subProcesses: [
      {
        id: 'sp001',
        name: '場地整理',
        description: '清理場地雜物',
        completed: true,
        assignee: 'cr2',
        estimatedHours: 8,
        actualHours: 7
      },
      {
        id: 'sp002', 
        name: '機械開挖',
        description: '挖掘機開挖作業',
        completed: true,
        assignee: 'cr2',
        estimatedHours: 32,
        actualHours: 28
      }
    ],
    startDate: '2024-01-10',
    endDate: '2024-01-14',
    actualStartDate: '2024-01-10',
    actualEndDate: '2024-01-13',
    progress: 100
  },
  {
    id: 'wp002',
    projectId: 'p1',
    categoryId: 'civil',
    name: '鋼筋綁紮工程',
    description: '基礎及柱鋼筋綁紮',
    quantity: 2800,
    unitPrice: 85,
    totalCost: 238000,
    duration: 4,
    status: 'in_progress',
    priority: 'high',
    assignedCraftsmen: ['cr2'],
    dependencies: ['wp001'],
    subProcesses: [
      {
        id: 'sp003',
        name: '鋼筋加工',
        description: '鋼筋切割、彎曲加工',
        completed: true,
        assignee: 'cr2',
        estimatedHours: 16,
        actualHours: 16
      },
      {
        id: 'sp004',
        name: '鋼筋綁紮',
        description: '現場鋼筋綁紮作業',
        completed: false,
        assignee: 'cr2',
        estimatedHours: 24,
        actualHours: 12
      }
    ],
    startDate: '2024-01-14',
    endDate: '2024-01-18',
    actualStartDate: '2024-01-14',
    progress: 60
  },
  {
    id: 'wp003',
    projectId: 'p1',
    categoryId: 'electrical',
    name: '基礎配電工程',
    description: '一樓配電箱安裝及線路配置',
    quantity: 1,
    unitPrice: 32000,
    totalCost: 32000,
    duration: 5,
    status: 'in_progress',
    priority: 'high',
    assignedCraftsmen: ['cr1'],
    dependencies: [],
    subProcesses: [
      {
        id: 'sp005',
        name: '配電箱安裝',
        description: '主配電箱定位安裝',
        completed: true,
        assignee: 'cr1',
        estimatedHours: 8
      },
      {
        id: 'sp006',
        name: '主幹線配置',
        description: '主要電力幹線配置',
        completed: true,
        assignee: 'cr1',
        estimatedHours: 12
      },
      {
        id: 'sp007',
        name: '分路配線',
        description: '各樓層分路配線',
        completed: false,
        assignee: 'cr1',
        estimatedHours: 16
      }
    ],
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    progress: 75
  }
];
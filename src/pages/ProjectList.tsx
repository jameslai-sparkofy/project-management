import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NewProjectModal from '../components/NewProjectModal';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Users,
  MoreVertical,
  Eye,
  Edit,
  Archive,
  ClipboardList
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDate, calculateDaysRemaining, getStatusColor, calculateProfitMargin } from '../lib/utils';
import { cn } from '../lib/utils';

const ProjectList: React.FC = () => {
  const { projects, currentUser } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusLabels: Record<string, string> = {
    'planning': '規劃中',
    'in_progress': '進行中',
    'completed': '已完成',
    'on_hold': '暫停'
  };

  const ProjectCard = ({ project }: { project: typeof projects[0] }) => {
    const daysRemaining = calculateDaysRemaining(project.endDate);
    const profitMargin = calculateProfitMargin(project.revenue, project.actualCost || project.budget);
    const profit = project.revenue - (project.actualCost || 0);

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{project.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getStatusColor(project.status))}>
              {statusLabels[project.status]}
            </span>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
            </div>
            {project.status === 'in_progress' && (
              <span className={cn('text-sm font-medium', daysRemaining < 7 ? 'text-red-600' : 'text-gray-600')}>
                剩餘 {daysRemaining} 天
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>預算: {formatCurrency(project.budget)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span className={profitMargin > 0 ? 'text-green-600' : 'text-red-600'}>
                利潤率: {profitMargin.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-blue-600">
                  進度
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {project.progress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
              <div 
                style={{ width: `${project.progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                <span>{project.craftsmen.length} 師傅</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ClipboardList className="h-4 w-4 mr-1" />
                <span>{project.tasks.length} 任務</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                to={`/projects/${project.id}`}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
              >
                <Eye className="h-4 w-4" />
              </Link>
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
                <Edit className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">專案管理</h1>
          <p className="text-gray-600 mt-1">管理所有工程專案的進度、成本與資源</p>
        </div>
        <button 
          onClick={() => setShowNewProjectModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          新增專案
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜尋專案名稱或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">所有狀態</option>
              <option value="planning">規劃中</option>
              <option value="in_progress">進行中</option>
              <option value="completed">已完成</option>
              <option value="on_hold">暫停</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('card')}
              className={cn(
                'p-2 rounded',
                viewMode === 'card' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'p-2 rounded',
                viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">沒有找到符合條件的專案</p>
        </div>
      )}

      <NewProjectModal 
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
      />
    </div>
  );
};

export default ProjectList;
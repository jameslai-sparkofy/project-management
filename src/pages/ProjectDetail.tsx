import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NewTaskModal from '../components/NewTaskModal';
import { 
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  ClipboardList,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { mockWorkProcesses } from '../data/engineeringData';
import { formatCurrency, formatDate, calculateDaysRemaining, getStatusColor, getPriorityColor, calculateProfit, calculateProfitMargin } from '../lib/utils';
import { cn } from '../lib/utils';
import KanbanView from '../components/KanbanView';
import GanttView from '../components/GanttView';
import ListView from '../components/ListView';
import SwimLaneView from '../components/SwimLaneView';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, tasks, craftsmen, clients, currentUser } = useStore();
  const [activeView, setActiveView] = useState<'kanban' | 'gantt' | 'list' | 'swimlane'>('swimlane');
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'finance' | 'team'>('tasks');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const project = projects.find(p => p.id === id);
  const projectTasks = tasks.filter(t => t.projectId === id);
  const projectWorkProcesses = mockWorkProcesses.filter(wp => wp.projectId === id);
  const client = clients.find(c => c.id === project?.clientId);
  const projectCraftsmen = craftsmen.filter(c => project?.craftsmen.includes(c.id));

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">專案不存在</p>
      </div>
    );
  }

  const daysRemaining = calculateDaysRemaining(project.endDate);
  const profit = calculateProfit(project.revenue, project.actualCost);
  const profitMargin = calculateProfitMargin(project.revenue, project.actualCost);

  const statusLabels: Record<string, string> = {
    'planning': '規劃中',
    'in_progress': '進行中',
    'completed': '已完成',
    'on_hold': '暫停'
  };

  const viewButtons = [
    { id: 'kanban', label: '看板', icon: '⚏' },
    { id: 'gantt', label: '甘特圖', icon: '▭' },
    { id: 'list', label: '列表', icon: '☰' },
    { id: 'swimlane', label: '泳道圖', icon: '▥' }
  ];

  return (
    <div>
      <div className="mb-6">
        <Link to="/projects" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回專案列表
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600 mt-2">{project.description}</p>
              <div className="flex items-center space-x-4 mt-4">
                <span className={cn('px-3 py-1 text-sm font-medium rounded-full', getStatusColor(project.status))}>
                  {statusLabels[project.status]}
                </span>
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
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">專案進度</span>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{project.progress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">預算</span>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(project.budget)}</p>
              <p className="text-xs text-gray-500 mt-1">已使用 {((project.actualCost / project.budget) * 100).toFixed(1)}%</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">實際成本</span>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(project.actualCost)}</p>
              <p className={cn('text-xs mt-1', project.actualCost > project.budget ? 'text-red-600' : 'text-green-600')}>
                {project.actualCost > project.budget ? '超出預算' : '預算內'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">營收</span>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(project.revenue)}</p>
              <p className="text-xs text-gray-500 mt-1">合約金額</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">利潤</span>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </div>
              <p className={cn('text-2xl font-bold', profit > 0 ? 'text-green-600' : 'text-red-600')}>
                {formatCurrency(profit)}
              </p>
              <p className="text-xs text-gray-500 mt-1">利潤率 {profitMargin.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={cn(
                'py-3 px-6 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              總覽
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={cn(
                'py-3 px-6 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              任務管理
            </button>
            <button
              onClick={() => setActiveTab('finance')}
              className={cn(
                'py-3 px-6 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'finance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              財務報表
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={cn(
                'py-3 px-6 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'team'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              團隊成員
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">專案資訊</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">客戶</p>
                    <p className="font-medium">{client?.name} - {client?.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">專案經理</p>
                    <p className="font-medium">張經理</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">開始日期</p>
                    <p className="font-medium">{formatDate(project.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">預計完成</p>
                    <p className="font-medium">{formatDate(project.endDate)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">任務統計</h3>
                <div className="grid grid-cols-5 gap-4">
                  {['planned', 'ready', 'in_progress', 'review', 'completed'].map(status => {
                    const count = projectWorkProcesses.filter(wp => wp.status === status).length;
                    const labels: Record<string, string> = {
                      'planned': '規劃中',
                      'ready': '準備開始',
                      'in_progress': '進行中',
                      'review': '審查中',
                      'completed': '已完成'
                    };
                    return (
                      <div key={status} className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-gray-900">{count}</p>
                        <p className="text-sm text-gray-600 mt-1">{labels[status]}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  {viewButtons.map(button => (
                    <button
                      key={button.id}
                      onClick={() => setActiveView(button.id as any)}
                      className={cn(
                        'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                        activeView === button.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      <span className="mr-2">{button.icon}</span>
                      {button.label}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setShowNewTaskModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新增任務
                </button>
              </div>

              {activeView === 'kanban' && <KanbanView tasks={projectTasks} />}
              {activeView === 'gantt' && <GanttView tasks={projectTasks} />}
              {activeView === 'list' && <ListView tasks={projectTasks} />}
              {activeView === 'swimlane' && <SwimLaneView workProcesses={projectWorkProcesses} />}
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">成本明細</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">人工成本</span>
                      <span className="font-medium">{formatCurrency(project.actualCost * 0.4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">材料成本</span>
                      <span className="font-medium">{formatCurrency(project.actualCost * 0.5)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">其他費用</span>
                      <span className="font-medium">{formatCurrency(project.actualCost * 0.1)}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span className="font-semibold">總成本</span>
                        <span className="font-bold text-lg">{formatCurrency(project.actualCost)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">利潤分析</h3>
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">合約金額</span>
                      <span className="font-medium">{formatCurrency(project.revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">總成本</span>
                      <span className="font-medium">-{formatCurrency(project.actualCost)}</span>
                    </div>
                    <div className="pt-4 border-t border-green-200">
                      <div className="flex justify-between">
                        <span className="font-semibold">淨利潤</span>
                        <span className={cn('font-bold text-lg', profit > 0 ? 'text-green-600' : 'text-red-600')}>
                          {formatCurrency(profit)}
                        </span>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-sm text-gray-600">利潤率</span>
                        <span className={cn('font-medium', profitMargin > 0 ? 'text-green-600' : 'text-red-600')}>
                          {profitMargin.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">專案團隊</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectCraftsmen.map(craftsman => (
                    <div key={craftsman.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {craftsman.name[0]}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">{craftsman.name}</p>
                            <p className="text-sm text-gray-600">{craftsman.specialty}</p>
                          </div>
                        </div>
                        <span className={cn(
                          'px-2 py-1 text-xs font-medium rounded-full',
                          craftsman.availability === 'available' ? 'bg-green-100 text-green-800' :
                          craftsman.availability === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        )}>
                          {craftsman.availability === 'available' ? '可用' :
                           craftsman.availability === 'busy' ? '忙碌' : '不可用'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">時薪</span>
                          <span className="font-medium">{formatCurrency(craftsman.hourlyRate)}/hr</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">目前任務</span>
                          <span className="font-medium">{craftsman.currentTasks.length} 個</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">完成任務</span>
                          <span className="font-medium">{craftsman.completedTasks.length} 個</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {project && (
        <NewTaskModal 
          isOpen={showNewTaskModal}
          onClose={() => setShowNewTaskModal(false)}
          projectId={project.id}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
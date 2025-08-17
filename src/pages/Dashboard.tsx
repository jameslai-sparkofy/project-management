import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ClipboardList, 
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDate, calculateDaysRemaining, getStatusColor, cn } from '../lib/utils';

const Dashboard: React.FC = () => {
  const { projects, tasks, craftsmen, clients, currentUser } = useStore();

  const activeProjects = projects.filter(p => p.status === 'in_progress').length;
  const totalRevenue = projects.reduce((sum, p) => sum + p.revenue, 0);
  const totalCost = projects.reduce((sum, p) => sum + p.actualCost, 0);
  const totalProfit = totalRevenue - totalCost;
  const avgProfitMargin = projects.length > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'done');
  const overdueTasks = tasks.filter(t => {
    const daysRemaining = calculateDaysRemaining(t.endDate);
    return daysRemaining < 0 && t.status !== 'done';
  });

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    review: tasks.filter(t => t.status === 'review').length,
    done: tasks.filter(t => t.status === 'done').length
  };

  const recentProjects = projects
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 5);

  const busyCraftsmen = craftsmen.filter(c => c.availability === 'busy');
  const availableCraftsmen = craftsmen.filter(c => c.availability === 'available');

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue }: any) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        {trend && (
          <div className={cn('flex items-center text-sm font-medium', 
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          )}>
            {trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {trendValue}
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-600 mt-1">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">儀表板</h1>
        <p className="text-gray-600 mt-1">歡迎回來，{currentUser?.name}！這是您的工程管理總覽</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="活躍專案"
          value={activeProjects}
          subtitle={`總共 ${projects.length} 個專案`}
          icon={ClipboardList}
        />
        <StatCard
          title="總營收"
          value={formatCurrency(totalRevenue)}
          subtitle="所有專案合約金額"
          icon={DollarSign}
          trend="up"
          trendValue="+12.5%"
        />
        <StatCard
          title="淨利潤"
          value={formatCurrency(totalProfit)}
          subtitle={`利潤率 ${avgProfitMargin.toFixed(1)}%`}
          icon={TrendingUp}
          trend={totalProfit > 0 ? 'up' : 'down'}
          trendValue={`${totalProfit > 0 ? '+' : ''}${avgProfitMargin.toFixed(1)}%`}
        />
        <StatCard
          title="團隊成員"
          value={craftsmen.length}
          subtitle={`${busyCraftsmen.length} 忙碌 / ${availableCraftsmen.length} 可用`}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">專案進度總覽</h2>
            <Link to="/projects" className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
              查看全部 <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentProjects.map(project => {
              const daysRemaining = calculateDaysRemaining(project.endDate);
              return (
                <div key={project.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <Link to={`/projects/${project.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                        {project.name}
                      </Link>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getStatusColor(project.status))}>
                          {project.status === 'planning' ? '規劃中' :
                           project.status === 'in_progress' ? '進行中' :
                           project.status === 'completed' ? '已完成' : '暫停'}
                        </span>
                        <span className="text-sm text-gray-600">
                          截止: {formatDate(project.endDate)}
                        </span>
                        {project.status === 'in_progress' && (
                          <span className={cn('text-sm', daysRemaining < 7 ? 'text-red-600' : 'text-gray-600')}>
                            剩餘 {daysRemaining} 天
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{project.progress}%</p>
                      <p className="text-xs text-gray-500">完成度</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">任務統計</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">待辦</span>
              </div>
              <span className="font-medium text-gray-900">{tasksByStatus.todo}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">進行中</span>
              </div>
              <span className="font-medium text-gray-900">{tasksByStatus.in_progress}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">審查中</span>
              </div>
              <span className="font-medium text-gray-900">{tasksByStatus.review}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">已完成</span>
              </div>
              <span className="font-medium text-gray-900">{tasksByStatus.done}</span>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">總任務數</span>
                <span className="text-lg font-bold text-gray-900">{tasks.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">緊急任務</h2>
            <span className="flex items-center text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {urgentTasks.length} 個
            </span>
          </div>
          {urgentTasks.length > 0 ? (
            <div className="space-y-3">
              {urgentTasks.slice(0, 3).map(task => {
                const assignee = craftsmen.find(c => c.id === task.assigneeId);
                return (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs text-gray-600">
                          {assignee ? assignee.name : '未分配'}
                        </span>
                        <span className="text-xs text-red-600">
                          截止: {formatDate(task.endDate)}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/projects/${task.projectId}`}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      查看
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">目前沒有緊急任務</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">逾期任務</h2>
            <span className="flex items-center text-red-600">
              <Clock className="h-4 w-4 mr-1" />
              {overdueTasks.length} 個
            </span>
          </div>
          {overdueTasks.length > 0 ? (
            <div className="space-y-3">
              {overdueTasks.slice(0, 3).map(task => {
                const assignee = craftsmen.find(c => c.id === task.assigneeId);
                const daysOverdue = Math.abs(calculateDaysRemaining(task.endDate));
                return (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs text-gray-600">
                          {assignee ? assignee.name : '未分配'}
                        </span>
                        <span className="text-xs text-red-600 font-medium">
                          逾期 {daysOverdue} 天
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/projects/${task.projectId}`}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      查看
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <p className="text-sm">所有任務都在期限內</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
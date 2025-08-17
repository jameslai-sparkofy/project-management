import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Edit, Trash2, Clock, User, CheckSquare, Square } from 'lucide-react';
import type { Task } from '../types/models';
import { formatDate, formatCurrency, getPriorityColor, getStatusColor, cn } from '../lib/utils';
import { useStore } from '../store/useStore';

interface ListViewProps {
  tasks: Task[];
}

const ListView: React.FC<ListViewProps> = ({ tasks }) => {
  const { craftsmen, updateTask } = useStore();
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'priority' | 'status' | 'endDate'>('priority');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const toggleExpanded = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const toggleSubtask = (task: Task, subtaskId: string) => {
    if (!task.subtasks) return;
    
    const updatedSubtasks = task.subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    
    const completedCount = updatedSubtasks.filter(st => st.completed).length;
    const progress = Math.round((completedCount / updatedSubtasks.length) * 100);
    
    updateTask({
      ...task,
      subtasks: updatedSubtasks,
      progress
    });
  };

  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'status':
          const statusOrder = { todo: 1, in_progress: 2, review: 3, done: 4 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        case 'endDate':
          comparison = new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const sortedTasks = sortTasks(tasks);

  const statusLabels: Record<string, string> = {
    'todo': '待辦',
    'in_progress': '進行中',
    'review': '審查中',
    'done': '已完成'
  };

  const priorityLabels: Record<string, string> = {
    'urgent': '緊急',
    'high': '高',
    'medium': '中',
    'low': '低'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">任務列表</h3>
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="priority">按優先級</option>
              <option value="status">按狀態</option>
              <option value="endDate">按截止日期</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                任務
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                負責人
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                狀態
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                優先級
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                進度
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                截止日期
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                預估成本
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTasks.map(task => {
              const assignee = craftsmen.find(c => c.id === task.assigneeId);
              const isExpanded = expandedTasks.has(task.id);
              const hasSubtasks = task.subtasks && task.subtasks.length > 0;
              
              return (
                <React.Fragment key={task.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        {hasSubtasks && (
                          <button
                            onClick={() => toggleExpanded(task.id)}
                            className="mr-2 p-1 hover:bg-gray-100 rounded"
                          >
                            {isExpanded ? 
                              <ChevronDown className="h-4 w-4 text-gray-400" /> : 
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            }
                          </button>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{task.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {assignee && (
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold mr-2">
                            {assignee.name[0]}
                          </div>
                          <span className="text-sm text-gray-900">{assignee.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getStatusColor(task.status))}>
                        {statusLabels[task.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn('px-2 py-1 text-xs font-medium rounded', getPriorityColor(task.priority))}>
                        {priorityLabels[task.priority]}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-900">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{formatDate(task.endDate)}</div>
                      <div className="text-xs text-gray-500">
                        {(() => {
                          const days = Math.ceil((new Date(task.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                          if (days < 0) return `逾期 ${Math.abs(days)} 天`;
                          if (days === 0) return '今天到期';
                          return `剩餘 ${days} 天`;
                        })()}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900">{formatCurrency(task.cost)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && hasSubtasks && (
                    <tr>
                      <td colSpan={8} className="px-4 py-2 bg-gray-50">
                        <div className="pl-8">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">子任務</h4>
                          <div className="space-y-2">
                            {task.subtasks?.map(subtask => (
                              <div key={subtask.id} className="flex items-center">
                                <button
                                  onClick={() => toggleSubtask(task, subtask.id)}
                                  className="mr-2"
                                >
                                  {subtask.completed ? 
                                    <CheckSquare className="h-4 w-4 text-green-600" /> : 
                                    <Square className="h-4 w-4 text-gray-400" />
                                  }
                                </button>
                                <span className={cn(
                                  'text-sm',
                                  subtask.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                                )}>
                                  {subtask.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListView;
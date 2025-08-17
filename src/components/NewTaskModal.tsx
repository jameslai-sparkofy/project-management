import React, { useState } from 'react';
import { X, Calendar, DollarSign, User, Clock, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Task } from '../types/models';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose, projectId }) => {
  const { craftsmen, addTask, tasks } = useStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeId: '',
    startDate: '',
    endDate: '',
    estimatedHours: '',
    cost: '',
    priority: 'medium' as Task['priority'],
    dependencies: [] as string[]
  });

  const projectTasks = tasks.filter(t => t.projectId === projectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTask: Task = {
      id: 't' + Date.now(),
      projectId,
      title: formData.title,
      description: formData.description,
      status: 'todo',
      priority: formData.priority,
      assigneeId: formData.assigneeId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      estimatedHours: parseInt(formData.estimatedHours),
      dependencies: formData.dependencies,
      progress: 0,
      cost: parseInt(formData.cost)
    };

    addTask(newTask);
    onClose();
    
    // 重置表單
    setFormData({
      title: '',
      description: '',
      assigneeId: '',
      startDate: '',
      endDate: '',
      estimatedHours: '',
      cost: '',
      priority: 'medium',
      dependencies: []
    });
  };

  const handleDependencyChange = (taskId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        dependencies: [...formData.dependencies, taskId]
      });
    } else {
      setFormData({
        ...formData,
        dependencies: formData.dependencies.filter(id => id !== taskId)
      });
    }
  };

  if (!isOpen) return null;

  const priorityOptions = [
    { value: 'low', label: '低', color: 'text-gray-600' },
    { value: 'medium', label: '中', color: 'text-blue-600' },
    { value: 'high', label: '高', color: 'text-orange-600' },
    { value: 'urgent', label: '緊急', color: 'text-red-600' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">新增任務</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                任務名稱
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="輸入任務名稱"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                任務描述
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="輸入任務詳細描述"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                負責師傅
              </label>
              <select
                required
                value={formData.assigneeId}
                onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選擇負責師傅</option>
                {craftsmen.map(craftsman => (
                  <option key={craftsman.id} value={craftsman.id}>
                    {craftsman.name} - {craftsman.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                優先級
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                開始日期
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                截止日期
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-2" />
                預估工時 (小時)
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-2" />
                預估成本 (TWD)
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            {projectTasks.length > 0 && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  前置任務 (可選)
                </label>
                <div className="border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto">
                  {projectTasks.map(task => (
                    <label key={task.id} className="flex items-center mb-2 last:mb-0">
                      <input
                        type="checkbox"
                        checked={formData.dependencies.includes(task.id)}
                        onChange={(e) => handleDependencyChange(task.id, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{task.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              創建任務
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;
import React, { useState } from 'react';
import { Clock, User, AlertCircle, Calendar, CheckCircle } from 'lucide-react';
import type { Task } from '../types/models';
import { formatDate, getPriorityColor, cn } from '../lib/utils';
import { useStore } from '../store/useStore';

interface KanbanViewProps {
  tasks: Task[];
}

const KanbanView: React.FC<KanbanViewProps> = ({ tasks }) => {
  const { updateTaskStatus, craftsmen } = useStore();
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const columns = [
    { id: 'todo', title: '待辦', color: 'bg-gray-100 border-gray-300' },
    { id: 'in_progress', title: '進行中', color: 'bg-blue-50 border-blue-300' },
    { id: 'review', title: '審查中', color: 'bg-purple-50 border-purple-300' },
    { id: 'done', title: '已完成', color: 'bg-green-50 border-green-300' }
  ];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    if (draggedTask) {
      updateTaskStatus(draggedTask, status);
      setDraggedTask(null);
    }
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const assignee = craftsmen.find(c => c.id === task.assigneeId);
    const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
          <span className={cn('px-2 py-1 text-xs font-medium rounded', getPriorityColor(task.priority))}>
            {task.priority === 'urgent' ? '緊急' : 
             task.priority === 'high' ? '高' :
             task.priority === 'medium' ? '中' : '低'}
          </span>
        </div>
        
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>

        {totalSubtasks > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600">子任務</span>
              <span className="text-gray-900 font-medium">{completedSubtasks}/{totalSubtasks}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full"
                style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            {assignee && (
              <div className="flex items-center text-gray-600">
                <User className="h-3 w-3 mr-1" />
                <span>{assignee.name}</span>
              </div>
            )}
            <div className="flex items-center text-gray-600">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(task.endDate)}</span>
            </div>
          </div>
          {task.progress > 0 && (
            <div className="flex items-center text-gray-600">
              <div className="w-8 h-8 relative">
                <svg className="w-8 h-8 transform -rotate-90">
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 14}`}
                    strokeDashoffset={`${2 * Math.PI * 14 * (1 - task.progress / 100)}`}
                    className="text-blue-500"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                  {task.progress}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map(column => {
        const columnTasks = tasks.filter(task => task.status === column.id);
        return (
          <div key={column.id} className="flex flex-col">
            <div className={cn('rounded-t-lg border-t-4 p-3', column.color)}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <span className="bg-white px-2 py-1 rounded text-sm font-medium text-gray-700">
                  {columnTasks.length}
                </span>
              </div>
            </div>
            <div
              className="flex-1 bg-gray-50 p-3 space-y-3 min-h-[400px] rounded-b-lg"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id as Task['status'])}
            >
              {columnTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              {columnTasks.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  暫無任務
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanView;
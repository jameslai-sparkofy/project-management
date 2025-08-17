import React from 'react';
import type { Task } from '../types/models';
import { formatDate, getPriorityColor, cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { Calendar, User } from 'lucide-react';

interface GanttViewProps {
  tasks: Task[];
}

const GanttView: React.FC<GanttViewProps> = ({ tasks }) => {
  const { craftsmen } = useStore();
  
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const startDates = tasks.map(t => new Date(t.startDate));
  const endDates = tasks.map(t => new Date(t.endDate));
  const projectStart = new Date(Math.min(...startDates.map(d => d.getTime())));
  const projectEnd = new Date(Math.max(...endDates.map(d => d.getTime())));
  
  const totalDays = Math.ceil((projectEnd.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  const months: { name: string; days: number; start: Date }[] = [];
  let currentDate = new Date(projectStart);
  
  while (currentDate <= projectEnd) {
    const monthStart = new Date(currentDate);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const endDate = monthEnd > projectEnd ? projectEnd : monthEnd;
    const days = Math.ceil((endDate.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    months.push({
      name: monthStart.toLocaleDateString('zh-TW', { month: 'short', year: 'numeric' }),
      days,
      start: monthStart
    });
    
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  }

  const getTaskPosition = (task: Task) => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    
    const startOffset = Math.floor((taskStart.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const left = (startOffset / totalDays) * 100;
    const width = (duration / totalDays) * 100;
    
    return { left: `${left}%`, width: `${width}%` };
  };

  const getProgressWidth = (task: Task) => {
    return `${task.progress}%`;
  };

  const getDayMarkers = () => {
    const markers = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < totalDays; i += 7) {
      const currentDay = new Date(projectStart);
      currentDay.setDate(currentDay.getDate() + i);
      
      const isToday = currentDay.getTime() === today.getTime();
      const left = (i / totalDays) * 100;
      
      markers.push(
        <div
          key={i}
          className={cn(
            'absolute top-0 bottom-0 border-l',
            isToday ? 'border-red-500 border-l-2 z-10' : 'border-gray-200'
          )}
          style={{ left: `${left}%` }}
        >
          {isToday && (
            <span className="absolute -top-6 -left-6 text-xs text-red-500 font-medium">
              今天
            </span>
          )}
        </div>
      );
    }
    
    return markers;
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          <div className="flex border-b border-gray-200">
            <div className="w-80 flex-shrink-0 bg-gray-50 p-4 border-r border-gray-200">
              <h3 className="font-semibold text-gray-900">任務名稱</h3>
            </div>
            <div className="flex-1 bg-gray-50 p-4">
              <div className="flex">
                {months.map((month, index) => (
                  <div
                    key={index}
                    className="border-r border-gray-200 text-center"
                    style={{ width: `${(month.days / totalDays) * 100}%` }}
                  >
                    <span className="text-sm font-medium text-gray-700">{month.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            {sortedTasks.map((task, index) => {
              const assignee = craftsmen.find(c => c.id === task.assigneeId);
              const position = getTaskPosition(task);
              
              return (
                <div key={task.id} className="flex border-b border-gray-100 hover:bg-gray-50">
                  <div className="w-80 flex-shrink-0 p-4 border-r border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                        <div className="flex items-center mt-1 space-x-3">
                          {assignee && (
                            <div className="flex items-center text-xs text-gray-600">
                              <User className="h-3 w-3 mr-1" />
                              <span>{assignee.name}</span>
                            </div>
                          )}
                          <div className="flex items-center text-xs text-gray-600">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{formatDate(task.startDate)} - {formatDate(task.endDate)}</span>
                          </div>
                        </div>
                      </div>
                      <span className={cn('px-2 py-1 text-xs font-medium rounded ml-2', getPriorityColor(task.priority))}>
                        {task.priority === 'urgent' ? '緊急' : 
                         task.priority === 'high' ? '高' :
                         task.priority === 'medium' ? '中' : '低'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 p-4 relative" style={{ minHeight: '60px' }}>
                    <div className="absolute inset-0 p-4">
                      {getDayMarkers()}
                    </div>
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 bg-blue-200 rounded h-8 hover:shadow-md transition-shadow z-20"
                      style={position}
                    >
                      <div
                        className="bg-blue-500 h-full rounded flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: getProgressWidth(task) }}
                      >
                        {task.progress > 20 && `${task.progress}%`}
                      </div>
                      {task.progress <= 20 && task.progress > 0 && (
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-700 text-xs font-medium">
                          {task.progress}%
                        </span>
                      )}
                    </div>
                    {task.dependencies.length > 0 && (
                      <div className="absolute top-1/2 transform -translate-y-1/2 -left-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttView;
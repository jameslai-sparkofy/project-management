import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle, AlertCircle, PlayCircle, PauseCircle, Upload, MessageSquare } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatDate, formatCurrency, getPriorityColor, cn } from '../lib/utils';

const CraftsmanTasks: React.FC = () => {
  const { currentUser, tasks, updateTask, updateTaskProgress, craftsmen } = useStore();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [timeReport, setTimeReport] = useState({ hours: '', description: '' });
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timerStart, setTimerStart] = useState<number | null>(null);

  const currentCraftsman = craftsmen.find(c => c.userId === currentUser?.id);
  const myTasks = currentCraftsman ? tasks.filter(t => t.assigneeId === currentCraftsman.id) : [];

  const todoTasks = myTasks.filter(t => t.status === 'todo');
  const inProgressTasks = myTasks.filter(t => t.status === 'in_progress');
  const reviewTasks = myTasks.filter(t => t.status === 'review');
  const completedTasks = myTasks.filter(t => t.status === 'done');

  const startTimer = (taskId: string) => {
    setActiveTimer(taskId);
    setTimerStart(Date.now());
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status === 'todo') {
      updateTask({ ...task, status: 'in_progress', actualStartDate: new Date().toISOString().split('T')[0] });
    }
  };

  const stopTimer = () => {
    if (activeTimer && timerStart) {
      const elapsedHours = (Date.now() - timerStart) / (1000 * 60 * 60);
      setTimeReport(prev => ({ ...prev, hours: elapsedHours.toFixed(2) }));
    }
    setActiveTimer(null);
    setTimerStart(null);
  };

  const submitTimeReport = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && timeReport.hours) {
      const newActualHours = (task.actualHours || 0) + parseFloat(timeReport.hours);
      updateTask({
        ...task,
        actualHours: newActualHours
      });
      setTimeReport({ hours: '', description: '' });
      setSelectedTask(null);
    }
  };

  const updateProgress = (taskId: string, progress: number) => {
    updateTaskProgress(taskId, progress);
    const task = tasks.find(t => t.id === taskId);
    if (task && progress === 100 && task.status !== 'done') {
      updateTask({ ...task, status: 'review', progress: 100 });
    }
  };

  const TaskCard = ({ task }: { task: typeof tasks[0] }) => {
    const isActive = activeTimer === task.id;
    const daysRemaining = Math.ceil((new Date(task.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{task.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          </div>
          <span className={cn('px-2 py-1 text-xs font-medium rounded', getPriorityColor(task.priority))}>
            {task.priority === 'urgent' ? '緊急' : 
             task.priority === 'high' ? '高' :
             task.priority === 'medium' ? '中' : '低'}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>截止: {formatDate(task.endDate)}</span>
            </div>
            {daysRemaining <= 3 && task.status !== 'done' && (
              <span className="flex items-center text-red-600 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {daysRemaining < 0 ? `逾期 ${Math.abs(daysRemaining)} 天` :
                 daysRemaining === 0 ? '今天到期' :
                 `剩餘 ${daysRemaining} 天`}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">進度</span>
              <span className="text-sm font-medium">{task.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>預估: {task.estimatedHours}h / 實際: {task.actualHours || 0}h</span>
            </div>
            <span className="font-medium text-gray-900">{formatCurrency(task.cost)}</span>
          </div>

          {task.subtasks && task.subtasks.length > 0 && (
            <div className="border-t pt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">子任務</p>
              <div className="space-y-1">
                {task.subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => {
                        const updatedSubtasks = task.subtasks!.map(st =>
                          st.id === subtask.id ? { ...st, completed: !st.completed } : st
                        );
                        const completedCount = updatedSubtasks.filter(st => st.completed).length;
                        const progress = Math.round((completedCount / updatedSubtasks.length) * 100);
                        updateTask({ ...task, subtasks: updatedSubtasks, progress });
                      }}
                      className="mr-2"
                    />
                    <span className={cn('text-sm', subtask.completed && 'line-through text-gray-500')}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 pt-3 border-t">
            {task.status !== 'done' && (
              <>
                {isActive ? (
                  <button
                    onClick={stopTimer}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <PauseCircle className="h-4 w-4 mr-2" />
                    停止計時
                  </button>
                ) : (
                  <button
                    onClick={() => startTimer(task.id)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    開始工作
                  </button>
                )}
                <button
                  onClick={() => setSelectedTask(task.id)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  回報進度
                </button>
              </>
            )}
            {task.status === 'done' && (
              <div className="flex-1 flex items-center justify-center px-3 py-2 bg-green-100 text-green-800 rounded-lg">
                <CheckCircle className="h-4 w-4 mr-2" />
                已完成
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (currentUser?.role !== 'craftsman') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">請切換到師傅角色查看任務</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">我的任務</h1>
        <p className="text-gray-600 mt-1">管理並回報您負責的工程任務進度</p>
      </div>

      {currentCraftsman && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                {currentCraftsman.name[0]}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">{currentCraftsman.name}</h2>
                <p className="text-gray-600">{currentCraftsman.specialty}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-gray-600">
                    時薪: <span className="font-medium text-gray-900">{formatCurrency(currentCraftsman.hourlyRate)}/hr</span>
                  </span>
                  <span className={cn(
                    'px-2 py-1 text-xs font-medium rounded-full',
                    currentCraftsman.availability === 'available' ? 'bg-green-100 text-green-800' :
                    currentCraftsman.availability === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  )}>
                    {currentCraftsman.availability === 'available' ? '可用' :
                     currentCraftsman.availability === 'busy' ? '忙碌' : '不可用'}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{currentCraftsman.currentTasks.length}</p>
                <p className="text-sm text-gray-600">進行中任務</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{currentCraftsman.completedTasks.length}</p>
                <p className="text-sm text-gray-600">已完成任務</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {todoTasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">待辦任務 ({todoTasks.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todoTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {inProgressTasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">進行中 ({inProgressTasks.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inProgressTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {reviewTasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">審查中 ({reviewTasks.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviewTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {completedTasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">已完成 ({completedTasks.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedTasks.slice(0, 3).map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">回報任務進度</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">進度 (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={tasks.find(t => t.id === selectedTask)?.progress || 0}
                  onChange={(e) => updateProgress(selectedTask, parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>0%</span>
                  <span>{tasks.find(t => t.id === selectedTask)?.progress || 0}%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">工作時數</label>
                <input
                  type="number"
                  step="0.5"
                  value={timeReport.hours}
                  onChange={(e) => setTimeReport({ ...timeReport, hours: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="輸入工作時數"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">工作說明</label>
                <textarea
                  value={timeReport.description}
                  onChange={(e) => setTimeReport({ ...timeReport, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="描述完成的工作內容"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => submitTimeReport(selectedTask)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  提交回報
                </button>
                <button
                  onClick={() => {
                    setSelectedTask(null);
                    setTimeReport({ hours: '', description: '' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CraftsmanTasks;
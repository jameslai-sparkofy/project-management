import React, { useState } from 'react';
import { Clock, Calendar, Plus, Edit, Building2, Zap, Hammer, Paintbrush, Cog, RectangleHorizontal, Home } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { WorkProcess } from '../types/models';
import { formatDate, getPriorityColor, cn } from '../lib/utils';
import { engineeringCategories } from '../data/engineeringData';
import { useStore } from '../store/useStore';

interface SwimLaneViewProps {
  workProcesses: WorkProcess[];
}

const SwimLaneView: React.FC<SwimLaneViewProps> = ({ workProcesses }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddProcess, setShowAddProcess] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const { updateWorkProcess } = useStore();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  // Prevent unused variable warnings
  console.log('Selected category:', selectedCategory, 'Show add process:', showAddProcess);

  const columns = [
    { id: 'planned', title: '規劃中', color: 'bg-gray-100' },
    { id: 'ready', title: '準備開始', color: 'bg-yellow-50' },
    { id: 'in_progress', title: '進行中', color: 'bg-blue-50' },
    { id: 'review', title: '審查中', color: 'bg-purple-50' },
    { id: 'completed', title: '已完成', color: 'bg-green-50' }
  ];

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const processId = active.id as string;
      const newStatus = over.id as WorkProcess['status'];
      
      // Find the process being moved
      const process = workProcesses.find(p => p.id === processId);
      if (process && columns.some(col => col.id === newStatus)) {
        // Update the process status
        updateWorkProcess(processId, { ...process, status: newStatus });
      }
    }
    
    setActiveId(null);
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      Building2, Zap, Hammer, Paintbrush, Cog, RectangleHorizontal, Home
    };
    const IconComponent = icons[iconName] || Building2;
    return <IconComponent className="h-5 w-5" />;
  };

  const DraggableProcessCard = ({ process }: { process: WorkProcess }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: process.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const handleEdit = (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log('Edit process:', process.id);
    };
    
    return (
      <div 
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          "bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group",
          isDragging && "opacity-50 shadow-lg scale-105"
        )}
      >
        <div className="flex items-start justify-between mb-2">
          <h5 className="text-sm font-medium text-gray-900 line-clamp-2">{process.name}</h5>
          <div className="flex items-center space-x-1">
            <span className={cn('px-1.5 py-0.5 text-xs font-medium rounded', getPriorityColor(process.priority))}>
              {process.priority === 'urgent' ? '急' : 
               process.priority === 'high' ? '高' :
               process.priority === 'medium' ? '中' : '低'}
            </span>
            <button 
              onClick={handleEdit}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Edit className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">數量: {process.quantity}</span>
            <span className="font-medium text-gray-900">NT${process.totalCost.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center text-xs text-gray-600">
            <Clock className="h-3 w-3 mr-1" />
            <span>{process.duration} 天</span>
          </div>
          
          {process.endDate && (
            <div className="flex items-center text-xs text-gray-600">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(process.endDate)}</span>
            </div>
          )}
          
          {process.progress > 0 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${process.progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-600">{process.progress}%</span>
                {process.assignedCraftsmen.length > 0 && (
                  <span className="text-xs text-gray-500">{process.assignedCraftsmen.length} 人</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const DroppableColumn = ({ column, children }: { column: any; children: React.ReactNode }) => {
    const { isOver, setNodeRef } = useDroppable({ id: column.id });
    
    return (
      <div 
        ref={setNodeRef}
        className={cn(
          'flex-1 p-3 border-r border-gray-100 min-h-[120px]', 
          column.color,
          isOver && 'ring-2 ring-blue-400 ring-opacity-50'
        )}
      >
        {children}
      </div>
    );
  };

  const AddProcessButton = ({ categoryId }: { categoryId: string }) => (
    <button
      onClick={() => {
        setSelectedCategory(categoryId);
        setShowAddProcess(true);
        console.log('Add process for category:', categoryId);
      }}
      className="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-colors group"
    >
      <div className="text-center">
        <Plus className="h-5 w-5 text-gray-400 group-hover:text-blue-500 mx-auto mb-1" />
        <span className="text-xs text-gray-500 group-hover:text-blue-600">新增工序</span>
      </div>
    </button>
  );

  const activeProcess = activeId ? workProcesses.find(p => p.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[1400px]">
            {/* Header */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              <div className="w-64 flex-shrink-0 p-4 border-r border-gray-200">
                <h3 className="font-semibold text-gray-900">工程專業</h3>
              </div>
              {columns.map(column => (
                <div key={column.id} className="flex-1 p-4 border-r border-gray-200 text-center">
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                </div>
              ))}
            </div>

            {/* Engineering Categories */}
            {engineeringCategories.map(category => {
              const categoryProcesses = workProcesses.filter(process => process.categoryId === category.id);
              
              return (
                <div key={category.id} className="flex border-b border-gray-100 hover:bg-gray-50">
                  <div className={cn('w-64 flex-shrink-0 p-4 border-r border-gray-200', category.color)}>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm">
                        {getIcon(category.icon)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{category.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{category.description}</p>
                        <div className="mt-1 flex items-center space-x-2">
                          <span className="text-xs text-gray-600">
                            {categoryProcesses.length} 工序
                          </span>
                          <span className="text-xs text-gray-600">
                            NT${categoryProcesses.reduce((sum, p) => sum + p.totalCost, 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {columns.map(column => {
                    const columnProcesses = categoryProcesses.filter(process => process.status === column.id);
                    
                    return (
                      <SortableContext 
                        key={column.id} 
                        items={columnProcesses.map(p => p.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <DroppableColumn column={column}>
                          <div className="space-y-2">
                            {columnProcesses.map(process => (
                              <DraggableProcessCard key={process.id} process={process} />
                            ))}
                            {column.id === 'planned' && (
                              <AddProcessButton categoryId={category.id} />
                            )}
                          </div>
                        </DroppableColumn>
                      </SortableContext>
                    );
                  })}
                </div>
              );
            })}

            {/* Summary Row */}
            <div className="flex bg-gray-100 border-t-2 border-gray-300">
              <div className="w-64 flex-shrink-0 p-4 border-r border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">Σ</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">專案總計</p>
                    <p className="text-xs text-gray-600">
                      {workProcesses.length} 工序 | NT${workProcesses.reduce((sum, p) => sum + p.totalCost, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              {columns.map(column => {
                const columnCount = workProcesses.filter(process => process.status === column.id).length;
                const columnCost = workProcesses
                  .filter(process => process.status === column.id)
                  .reduce((sum, p) => sum + p.totalCost, 0);
                
                return (
                  <div key={column.id} className="flex-1 p-4 border-r border-gray-200 text-center">
                    <div className="text-lg font-bold text-gray-900">{columnCount}</div>
                    <div className="text-xs text-gray-600">NT${columnCost.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <DragOverlay>
        {activeProcess ? (
          <div className="bg-white rounded-lg p-3 shadow-lg border border-gray-200 opacity-90 transform rotate-3">
            <div className="flex items-start justify-between mb-2">
              <h5 className="text-sm font-medium text-gray-900 line-clamp-2">{activeProcess.name}</h5>
              <span className={cn('px-1.5 py-0.5 text-xs font-medium rounded', getPriorityColor(activeProcess.priority))}>
                {activeProcess.priority === 'urgent' ? '急' : 
                 activeProcess.priority === 'high' ? '高' :
                 activeProcess.priority === 'medium' ? '中' : '低'}
              </span>
            </div>
            <div className="text-xs text-gray-600">
              NT${activeProcess.totalCost.toLocaleString()} | {activeProcess.duration} 天
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default SwimLaneView;
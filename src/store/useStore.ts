import { create } from 'zustand';
import type { User, Project, Task, Client, Supplier, Craftsman, WorkProcess } from '../types/models';
import { mockUsers, mockProjects, mockTasks, mockClients, mockSuppliers, mockCraftsmen } from '../data/mockData';
import { mockWorkProcesses } from '../data/engineeringData';

interface AppState {
  currentUser: User | null;
  projects: Project[];
  tasks: Task[];
  workProcesses: WorkProcess[];
  clients: Client[];
  suppliers: Supplier[];
  craftsmen: Craftsman[];
  
  setCurrentUser: (user: User | null) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  updateTask: (task: Task) => void;
  addTask: (task: Task) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  updateTaskProgress: (taskId: string, progress: number) => void;
  getProjectTasks: (projectId: string) => Task[];
  getCraftsmanTasks: (craftsmanId: string) => Task[];
  
  // Work Process methods
  addWorkProcess: (workProcess: WorkProcess) => void;
  updateWorkProcess: (processId: string, workProcess: WorkProcess) => void;
  getProjectWorkProcesses: (projectId: string) => WorkProcess[];
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: mockUsers[0],
  projects: mockProjects,
  tasks: mockTasks,
  workProcesses: mockWorkProcesses,
  clients: mockClients,
  suppliers: mockSuppliers,
  craftsmen: mockCraftsmen,
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  addProject: (project) => set((state) => ({
    projects: [...state.projects, project]
  })),
  
  updateProject: (project) => set((state) => ({
    projects: state.projects.map(p => p.id === project.id ? project : p)
  })),
  
  updateTask: (task) => set((state) => ({
    tasks: state.tasks.map(t => t.id === task.id ? task : t),
    projects: state.projects.map(p => {
      if (p.id === task.projectId) {
        return {
          ...p,
          tasks: p.tasks.map(t => t.id === task.id ? task : t)
        };
      }
      return p;
    })
  })),
  
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, task],
    projects: state.projects.map(p => {
      if (p.id === task.projectId) {
        return {
          ...p,
          tasks: [...p.tasks, task]
        };
      }
      return p;
    })
  })),
  
  updateTaskStatus: (taskId, status) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (task) {
      get().updateTask({ ...task, status });
    }
  },
  
  updateTaskProgress: (taskId, progress) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (task) {
      get().updateTask({ ...task, progress });
    }
  },
  
  getProjectTasks: (projectId) => {
    return get().tasks.filter(t => t.projectId === projectId);
  },
  
  getCraftsmanTasks: (craftsmanId) => {
    return get().tasks.filter(t => t.assigneeId === craftsmanId);
  },
  
  // Work Process methods
  addWorkProcess: (workProcess) => set((state) => ({
    workProcesses: [...state.workProcesses, workProcess]
  })),
  
  updateWorkProcess: (processId, workProcess) => set((state) => ({
    workProcesses: state.workProcesses.map(wp => wp.id === processId ? workProcess : wp)
  })),
  
  getProjectWorkProcesses: (projectId) => {
    return get().workProcesses.filter(wp => wp.projectId === projectId);
  }
}));
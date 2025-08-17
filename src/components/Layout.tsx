import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  ClipboardList, 
  UserCircle,
  Building,
  ChevronDown,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

const Layout: React.FC = () => {
  const location = useLocation();
  const { currentUser, setCurrentUser } = useStore();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const navigation = [
    { name: '儀表板', href: '/', icon: LayoutDashboard },
    { name: '專案管理', href: '/projects', icon: FolderOpen },
    { name: '任務中心', href: '/tasks', icon: ClipboardList },
    { name: '客戶管理', href: '/clients', icon: Building },
    { name: '供應商', href: '/suppliers', icon: Users },
    { name: '師傅管理', href: '/craftsmen', icon: UserCircle },
  ];

  const roleNames: Record<string, string> = {
    'owner': '業主',
    'project_manager': '專案經理',
    'craftsman': '師傅',
    'supplier': '供應商',
    'client': '客戶'
  };

  const switchUser = (userId: string) => {
    const users = [
      { id: 'u1', name: '張經理', email: 'manager@company.com', role: 'project_manager' as const },
      { id: 'u2', name: '李老闆', email: 'owner@company.com', role: 'owner' as const },
      { id: 'u3', name: '王師傅', email: 'wang@company.com', role: 'craftsman' as const },
      { id: 'u7', name: '張先生', email: 'client1@gmail.com', role: 'client' as const },
    ];
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setUserMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <div className="w-64 bg-white border-r border-gray-200">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">工程管理系統</h1>
              <p className="text-sm text-gray-500 mt-1">專業工程專案管理平台</p>
            </div>
            
            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== '/' && location.pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {currentUser?.name[0]}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                    <p className="text-xs text-gray-500">{roleNames[currentUser?.role || '']}</p>
                  </div>
                </div>
                <Settings className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {navigation.find(n => n.href === location.pathname || 
                    (n.href !== '/' && location.pathname.startsWith(n.href)))?.name || ''}
                </h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-400 hover:text-gray-600">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    <span>切換角色</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <button
                          onClick={() => switchUser('u2')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          業主視角
                        </button>
                        <button
                          onClick={() => switchUser('u1')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          專案經理視角
                        </button>
                        <button
                          onClick={() => switchUser('u3')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          師傅視角
                        </button>
                        <button
                          onClick={() => switchUser('u7')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          客戶視角
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900">
                  <LogOut className="h-4 w-4" />
                  <span>登出</span>
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto bg-gray-50">
            <div className="p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
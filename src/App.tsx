import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import CraftsmanTasks from './pages/CraftsmanTasks';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectList />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="tasks" element={<CraftsmanTasks />} />
          <Route path="clients" element={<div className="text-center py-12 text-gray-500">客戶管理 (開發中)</div>} />
          <Route path="suppliers" element={<div className="text-center py-12 text-gray-500">供應商管理 (開發中)</div>} />
          <Route path="craftsmen" element={<div className="text-center py-12 text-gray-500">師傅管理 (開發中)</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
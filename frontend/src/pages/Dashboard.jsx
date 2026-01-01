import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import PrivateRoute from '../components/PrivateRoute';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Router from 'next/router';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

  const token = typeof window !== 'undefined' && localStorage.getItem('token');

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/users/me`, { headers: { Authorization: `Bearer ${token}` }});
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const params = {};
      if (q) params.q = q;
      if (statusFilter) params.status = statusFilter;
      const res = await axios.get(`${apiBase}/api/tasks`, { headers: { Authorization: `Bearer ${token}` }, params });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) { Router.push('/'); return; }
    fetchProfile();
    fetchTasks();
  }, []);

  useEffect(() => {
    // apply search debounce simple
    const t = setTimeout(() => fetchTasks(), 300);
    return () => clearTimeout(t);
  }, [q, statusFilter]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    Router.push('/');
  };

  return (
    <PrivateRoute>
      <Layout user={user} onLogout={handleLogout}>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Welcome, {user?.name}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center gap-2 mb-3">
            <input placeholder="Search tasks..." value={q} onChange={(e)=>setQ(e.target.value)} className="border p-2 flex-1" />
            <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className="border p-2">
              <option value="">All</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <TaskForm onCreated={(t)=>{ setTasks(prev => [t, ...prev]); }} />
          <TaskList tasks={tasks} refresh={fetchTasks} />
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <strong>Note on scaling:</strong> For production you'd host the backend separately (containerized), use a managed DB, enable HTTPS, rate-limiting, refresh tokens, and CI/CD pipelines.
        </div>
      </Layout>
    </PrivateRoute>
  );
}

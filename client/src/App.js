import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import CategoryBoard from './components/CategoryBoard';
import AddCategoryForm from './components/AddCategoryForm';
import FoodMenu from './components/FoodMenu';
import * as api from './api';

function App() {
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('home');

  const fetchData = useCallback(async () => {
    try {
      const [catRes, taskRes] = await Promise.all([
        api.getCategories(),
        api.getTasks()
      ]);
      setCategories(catRes.data);
      setTasks(taskRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddCategory = async (name) => {
    const res = await api.createCategory(name);
    setCategories([...categories, res.data]);
  };

  const handleDeleteCategory = async (id) => {
    await api.deleteCategory(id);
    setCategories(categories.filter((c) => c._id !== id));
    setTasks(tasks.filter((t) => t.category?._id !== id));
  };

  const handleUpdateCategory = async (id, name) => {
    const res = await api.updateCategory(id, name);
    setCategories(categories.map((c) => (c._id === id ? res.data : c)));
  };

  const handleAddTask = async (data) => {
    const res = await api.createTask(data);
    setTasks([...tasks, res.data]);
  };

  const handleUpdateTask = async (id, data) => {
    const res = await api.updateTask(id, data);
    setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
  };

  const handleDeleteTask = async (id) => {
    await api.deleteTask(id);
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const handleReorderTasks = async (orderedIds) => {
    await api.reorderTasks(orderedIds);
    setTasks(prev => prev.map(t => {
      const idx = orderedIds.indexOf(t._id);
      return idx !== -1 ? { ...t, sortOrder: idx } : t;
    }));
  };

  const completedCount = tasks.filter((t) => t.status === 'Done').length;
  const totalCount = tasks.length;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Preparing the celebration...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header completed={completedCount} total={totalCount} page={page} onNavigate={setPage} />

      {page === 'home' && (
        <div className="home-page">
          <div className="welcome-card">
            <div className="welcome-icon">🪔</div>
            <p className="welcome-subtitle">We Joyfully Celebrate</p>
            <h2>Shashtipurti Mahotsav</h2>
            <div className="couple-names">
              <div className="couple-person">
                <span className="couple-role">Bride</span>
                <span className="couple-name">K. Kothai</span>
              </div>
              <div className="couple-divider">💞</div>
              <div className="couple-person">
                <span className="couple-role">Bridegroom</span>
                <span className="couple-name">R. Kannan</span>
              </div>
            </div>
            <p className="welcome-tagline">
              60 beautiful years of love, devotion &amp; togetherness
            </p>
            <div className="welcome-divider-line">✦ &nbsp; ✦ &nbsp; ✦</div>
            <div className="welcome-stats">
              <div className="stat-box">
                <span className="stat-number">{categories.length}</span>
                <span className="stat-label">Arrangements</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">{totalCount}</span>
                <span className="stat-label">Total Items</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">{completedCount}</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
            <button className="go-tasks-btn" onClick={() => setPage('tasks')}>
              View Arrangements →
            </button>
          </div>
        </div>
      )}

      {page === 'tasks' && (
        <div className="main-content">
          <div className="arrangements-header">
            <h2>🎊 Event Arrangements</h2>
            <p>Manage all celebration preparations below</p>
          </div>
          {categories.map((cat) => (
            <CategoryBoard
              key={cat._id}
              category={cat}
              tasks={tasks.filter((t) => t.category?._id === cat._id)}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onDeleteCategory={handleDeleteCategory}
              onUpdateCategory={handleUpdateCategory}
              onReorderTasks={handleReorderTasks}
            />
          ))}
          <AddCategoryForm onAdd={handleAddCategory} />
        </div>
      )}

      {page === 'menu' && <FoodMenu />}
    </div>
  );
}

export default App;

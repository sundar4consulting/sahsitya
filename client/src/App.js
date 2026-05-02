import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import CategoryBoard from './components/CategoryBoard';
import AddCategoryForm from './components/AddCategoryForm';
import * as api from './api';

function App() {
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const completedCount = tasks.filter((t) => t.status === 'Done').length;
  const totalCount = tasks.length;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading 60 Function...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header completed={completedCount} total={totalCount} />
      <div className="main-content">
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
          />
        ))}
        <AddCategoryForm onAdd={handleAddCategory} />
      </div>
    </div>
  );
}

export default App;

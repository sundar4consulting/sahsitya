import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '';

const api = axios.create({ baseURL: `${API_BASE}/api` });

// Categories
export const getCategories = () => api.get('/categories');
export const createCategory = (name) => api.post('/categories', { name });
export const updateCategory = (id, name) => api.put(`/categories/${id}`, { name });
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Tasks
export const getTasks = (categoryId) => {
  const params = categoryId ? { category: categoryId } : {};
  return api.get('/tasks', { params });
};
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const reorderTasks = (ids) => api.put('/tasks/reorder', { ids });

// Menu Items
export const getMenuItems = (mealType) => {
  const params = mealType ? { mealType } : {};
  return api.get('/menu', { params });
};
export const createMenuItem = (data) => api.post('/menu', data);
export const updateMenuItem = (id, data) => api.put(`/menu/${id}`, data);
export const deleteMenuItem = (id) => api.delete(`/menu/${id}`);

// Auth
export const login = (password) => api.post('/auth/login', { password });

// Expenses
export const getExpenses = (category) => {
  const params = category ? { category } : {};
  return api.get('/expenses', { params });
};
export const createExpense = (formData) => api.post('/expenses', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateExpense = (id, formData) => api.put(`/expenses/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

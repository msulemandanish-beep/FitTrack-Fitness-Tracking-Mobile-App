import api from './api';

// Workout services
export const workoutService = {
  getCategories: () => api.get('/workouts/categories'),
  getByCategory: (category) => api.get(`/workouts/${category}`),
  getById: (id) => api.get(`/workouts/detail/${id}`),
  seedData: () => api.post('/workouts/seed'),
};

// Progress services
export const progressService = {
  log: (data) => api.post('/progress', data),
  getAll: () => api.get('/progress'),
  getStats: () => api.get('/progress/stats'),
  delete: (id) => api.delete(`/progress/${id}`),
};

// Water services
export const waterService = {
  getToday: () => api.get('/water/today'),
  add: (amount) => api.post('/water/add', { amount }),
  updateGoal: (goalMl) => api.put('/water/goal', { goalMl }),
  reset: () => api.delete('/water/reset'),
};

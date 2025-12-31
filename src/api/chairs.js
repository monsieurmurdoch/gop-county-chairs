const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Chairs API service
export const chairsApi = {
  // Get all chairs
  async getAll() {
    const response = await fetch(`${API_BASE}/chairs`);
    if (!response.ok) throw new Error('Failed to fetch chairs');
    return response.json();
  },

  // Get single chair by ID
  async getById(id) {
    const response = await fetch(`${API_BASE}/chairs/${id}`);
    if (!response.ok) throw new Error('Failed to fetch chair');
    return response.json();
  },

  // Create new chair
  async create(chairData) {
    const response = await fetch(`${API_BASE}/chairs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chairData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create chair');
    }
    return response.json();
  },

  // Update chair
  async update(id, chairData) {
    const response = await fetch(`${API_BASE}/chairs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chairData),
    });
    if (!response.ok) throw new Error('Failed to update chair');
    return response.json();
  },

  // Delete chair
  async delete(id) {
    const response = await fetch(`${API_BASE}/chairs/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete chair');
    return response.json();
  },

  // Get states summary
  async getStates() {
    const response = await fetch(`${API_BASE}/states`);
    if (!response.ok) throw new Error('Failed to fetch states');
    return response.json();
  },

  // Export data
  async export() {
    const response = await fetch(`${API_BASE}/export`);
    if (!response.ok) throw new Error('Failed to export data');
    return response.json();
  },

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },
};

// LocalStorage fallback for when API is unavailable
const STORAGE_KEY = 'countyChairs';

export const localChairsStorage = {
  get() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  set(chairs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chairs));
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },
};

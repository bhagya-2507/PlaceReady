import api from './api';

export const studentService = {
  getDashboard: () => api.get('/students/dashboard'),
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
  updateSkills: (data) => api.put('/students/skills', data),
  uploadResume: (formData) =>
    api.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getMyResume: () => api.get('/resumes/my'),
};

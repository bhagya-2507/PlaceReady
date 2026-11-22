import api from './api';

export const driveService = {
  getAllDrives: (params) => api.get('/drives', { params }),
  getDriveById: (id) => api.get(`/drives/${id}`),
  createDrive: (data) => api.post('/drives', data),
  updateDrive: (id, data) => api.put(`/drives/${id}`, data),
  deleteDrive: (id) => api.delete(`/drives/${id}`),

  // Applications
  apply: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications/my'),
  getAllApplications: (params) => api.get('/applications', { params }),
  updateApplicationStatus: (id, data) => api.put(`/applications/${id}/status`, data),
};

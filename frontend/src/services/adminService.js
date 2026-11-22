import api from './api';

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getPlacementAnalytics: () => api.get('/admin/analytics'),
  getReports: (format = 'json') => api.get(`/admin/reports?format=${format}`),

  // Student Management
  getAllStudents: (params) => api.get('/students', { params }),
  getStudentById: (id) => api.get(`/students/${id}`),

  // Recruiter Management
  getAllRecruiters: () => api.get('/recruiters'),
  updateRecruiterApproval: (id, status) => api.put(`/recruiters/${id}/approval`, { status }),

  // Companies
  getCompanies: () => api.get('/companies'),
  createCompany: (data) => api.post('/companies', data),
  updateCompany: (id, data) => api.put(`/companies/${id}`, data),
  deleteCompany: (id) => api.delete(`/companies/${id}`),

  // Drives
  getDrives: () => api.get('/drives'),
  createDrive: (data) => api.post('/drives', data),
  updateDrive: (id, data) => api.put(`/drives/${id}`, data),
  deleteDrive: (id) => api.delete(`/drives/${id}`),

  // Applications
  getAllApplications: (params) => api.get('/applications', { params }),
  updateApplicationStatus: (id, status, notes) =>
    api.put(`/applications/${id}/status`, { status, notes }),

  // Announcements
  getAnnouncements: () => api.get('/announcements'),
  createAnnouncement: (data) => api.post('/announcements', data),
  deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
};

import api from './api';

export const recruiterService = {
  getProfile: () => api.get('/recruiters/profile'),
  updateProfile: (data) => api.put('/recruiters/profile', data),

  // Jobs
  getMyJobs: () => api.get('/jobs'),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),

  // Applicants for a specific job
  getJobApplicants: (jobId) => api.get(`/jobs/${jobId}/applicants`),

  // Candidate status update (Shortlist, Interview, Select, Reject)
  updateApplicantStatus: (applicationId, status, notes) =>
    api.put(`/applications/${applicationId}/status`, { status, notes }),
};

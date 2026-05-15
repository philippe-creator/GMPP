import api from './axios'

export const machinesApi = {
  getAll: () => api.get('/machines'),
  getById: id => api.get(`/machines/${id}`),
  getByQrCode: qrCode => api.get(`/machines/qr/${qrCode}`),
  create: data => api.post('/machines', data),
  update: (id, data) => api.put(`/machines/${id}`, data),
  updateStatus: (id, status) => api.patch(`/machines/${id}/status?status=${status}`),
  addHours: (id, hours) => api.patch(`/machines/${id}/hours?hours=${hours}`),
  delete: id => api.delete(`/machines/${id}`)
}

export const maintenancePointsApi = {
  getAll: () => api.get('/maintenance-points'),
  getById: id => api.get(`/maintenance-points/${id}`),
  getByMachine: machineId => api.get(`/maintenance-points/machine/${machineId}`),
  getOverdue: () => api.get('/maintenance-points/overdue'),
  getUpcoming: days => api.get(`/maintenance-points/upcoming?days=${days}`),
  create: data => api.post('/maintenance-points', data),
  update: (id, data) => api.put(`/maintenance-points/${id}`, data),
  markExecuted: id => api.patch(`/maintenance-points/${id}/execute`),
  delete: id => api.delete(`/maintenance-points/${id}`)
}

export const interventionsApi = {
  getAll: () => api.get('/interventions'),
  getById: id => api.get(`/interventions/${id}`),
  getByMachine: machineId => api.get(`/interventions/machine/${machineId}`),
  getByTechnician: techId => api.get(`/interventions/technician/${techId}`),
  getPlanning: (start, end) => api.get(`/interventions/planning?start=${start}&end=${end}`),
  create: data => api.post('/interventions', data),
  update: (id, data) => api.put(`/interventions/${id}`, data),
  assign: (id, technicianId) => api.patch(`/interventions/${id}/assign?technicianId=${technicianId}`),
  start: id => api.patch(`/interventions/${id}/start`),
  pause: id => api.patch(`/interventions/${id}/pause`),
  addPhoto: (id, photoPath) => api.post(`/interventions/${id}/photos`, photoPath, { headers: { 'Content-Type': 'text/plain' } }),
  complete: (id, data) => api.patch(`/interventions/${id}/complete`, data),
  validate: id => api.patch(`/interventions/${id}/validate`),
  cancel: id => api.patch(`/interventions/${id}/cancel`),
  delete: id => api.delete(`/interventions/${id}`)
}

export const usersApi = {
  getAll: () => api.get('/users'),
  getById: id => api.get(`/users/${id}`),
  getTechnicians: () => api.get('/users/technicians'),
  getByRole: role => api.get(`/users/role/${role}`),
  register: data => api.post('/auth/register', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  deactivate: id => api.patch(`/users/${id}/deactivate`),
  activate: id => api.patch(`/users/${id}/activate`)
}

export const consumablesApi = {
  getAll: () => api.get('/consumables'),
  getLowStock: () => api.get('/consumables/low-stock'),
  create: data => api.post('/consumables', data),
  update: (id, data) => api.put(`/consumables/${id}`, data),
  deduct: (id, qty) => api.patch(`/consumables/${id}/deduct?qty=${qty}`),
  addStock: (id, qty) => api.patch(`/consumables/${id}/add-stock?qty=${qty}`),
  delete: id => api.delete(`/consumables/${id}`)
}

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getTechnicianStats: () => api.get('/dashboard/technician'),
  getUpcoming: () => api.get('/alerts/upcoming-interventions'),
  getOverduePoints: () => api.get('/alerts/overdue-points')
}

export const notificationsApi = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: id => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all')
}

export const reportsApi = {
  interventionsPdf: () => api.get('/reports/interventions/pdf', { responseType: 'blob' }),
  interventionsCsv: () => api.get('/reports/interventions/csv', { responseType: 'blob' }),
  machinesPdf: () => api.get('/reports/machines/pdf', { responseType: 'blob' }),
  machinesCsv: () => api.get('/reports/machines/csv', { responseType: 'blob' })
}

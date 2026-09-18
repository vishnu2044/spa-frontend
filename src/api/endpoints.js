import apiClient from './client';

// Auth
export const loginAdmin = async (credentials) => {
  // FastAPI OAuth2PasswordRequestForm expects FormData
  const formData = new URLSearchParams();
  formData.append('grant_type', 'password');
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);
  formData.append('scope', '');
  formData.append('client_id', 'string');
  formData.append('client_secret', '********');
  
  const { data } = await apiClient.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return data;
};

export const fetchCurrentUser = async () => {
  const { data } = await apiClient.get('/users/me');
  return data;
};

// Staff & Team
export const fetchStaff = async () => {
  const { data } = await apiClient.get('/staff');
  return data;
};

export const fetchStaffDetails = async (id) => {
  const { data } = await apiClient.get(`/staff/${id}`);
  return data;
};

// Services & Packages
export const fetchServices = async (category) => {
  const params = category && category !== 'All' ? { category } : {};
  const { data } = await apiClient.get('/services', { params });
  return data;
};

export const fetchPackages = async () => {
  const { data } = await apiClient.get('/packages');
  return data;
};

export const fetchOffers = async () => {
  const { data } = await apiClient.get('/offers');
  return data;
};

// Reviews
export const fetchReviews = async () => {
  const { data } = await apiClient.get('/reviews');
  return data;
};

export const submitReview = async (review) => {
  const { data } = await apiClient.post('/reviews', review);
  return data;
};

// Bookings
export const fetchAvailability = async (date, staffId) => {
  const params = { date, staff_id: staffId };
  const { data } = await apiClient.get('/bookings/availability', { params });
  return data;
};

export const createBooking = async (bookingData) => {
  const { data } = await apiClient.post('/bookings', bookingData);
  return data;
};

export const fetchMyBookings = async () => {
  const { data } = await apiClient.get('/bookings/me');
  return data;
};

export const cancelBooking = async (id) => {
  const { data } = await apiClient.put(`/bookings/${id}/cancel`);
  return data;
};

// Admin
export const fetchAdminDashboardStats = async () => {
  const { data } = await apiClient.get('/admin/dashboard/stats');
  return data;
};

export const fetchAdminBookings = async () => {
  const { data } = await apiClient.get('/admin/bookings');
  return data;
};

export const updateBookingStatus = async (id, status) => {
  const { data } = await apiClient.put(`/admin/bookings/${id}/status`, { status });
  return data;
};

export const fetchAdminStaff = async () => {
  const { data } = await apiClient.get('/admin/staff');
  return data;
};

export const createAdminStaff = async (staffData) => {
  const { data } = await apiClient.post('/admin/staff', staffData);
  return data;
};

export const updateAdminStaff = async (id, staffData) => {
  const { data } = await apiClient.put(`/admin/staff/${id}`, staffData);
  return data;
};

export const toggleAdminStaffAvailability = async (id, isActive) => {
  const { data } = await apiClient.patch(`/admin/staff/${id}/availability`, { is_active: isActive });
  return data;
};

export const deleteAdminStaff = async (id) => {
  const { data } = await apiClient.delete(`/admin/staff/${id}`);
  return data;
};

// Admin Services
export const createAdminService = async (serviceData) => {
  const { data } = await apiClient.post('/admin/services', serviceData);
  return data;
};

export const updateAdminService = async (id, serviceData) => {
  const { data } = await apiClient.put(`/admin/services/${id}`, serviceData);
  return data;
};

export const deleteAdminService = async (id) => {
  const { data } = await apiClient.delete(`/admin/services/${id}`);
  return data;
};

export const toggleAdminServiceStatus = async (id, status) => {
  const { data } = await apiClient.patch(`/admin/services/${id}/status`, { status });
  return data;
};

// Auth
export const loginUser = async (credentials) => {
  const { data } = await apiClient.post('/auth/login', credentials);
  return data;
};

export const registerUser = async (userInfo) => {
  const { data } = await apiClient.post('/auth/register', userInfo);
  return data;
};

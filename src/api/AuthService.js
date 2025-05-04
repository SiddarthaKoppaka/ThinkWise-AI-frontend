// src/services/AuthService.js
import axiosInstance from './axiosInstance';

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  fetchProfile,
  changePassword,
  deleteAllIdeas,
  deleteAccount,
};

function forgotPassword({ email }) {
  return axiosInstance.post("/auth/forgot-password", { email });
}

function resetPassword({ token, new_password }) {
  return axiosInstance.post("/auth/reset-password", { token, new_password });
}

function fetchProfile() {
  return axiosInstance.get("/auth/me").then(res => res.data);
}

function changePassword({ old_password, new_password }) {
  return axiosInstance.post('/auth/change-password', { old_password, new_password });
}

function deleteAllIdeas() {
  return axiosInstance.delete('/ideas');
}

function deleteAccount() {
  return axiosInstance.delete('/auth/me');
}

function register({ email, password, first_name, last_name }) {
  return axiosInstance.post('/auth/register', {
    email,
    password,
    first_name,
    last_name,
  });
}

function login({ email, password }) {
  return axiosInstance
    .post('/auth/login', { email, password })
    .then((res) => {
      const { access_token, user } = res.data;
      if (access_token) {
        localStorage.setItem('token', access_token);
        // store the entire user so you can read first_name/last_name anywhere
        localStorage.setItem('user', JSON.stringify(user));
      }
      return user;
    });
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function getCurrentUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}

export default AuthService;

import axios from "axios";

const axiosMakeItTodayInstance = axios.create({
  baseURL: "https://to-it-today-server.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add a request interceptor if you need to modify requests globally
axiosMakeItTodayInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor if you want to handle responses globally
axiosMakeItTodayInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      //
    }
    return Promise.reject(error);
  }
);

// GET Request
export const apiGet = async (endpoint, params = {}) => {
  try {
    const response = await axiosMakeItTodayInstance.get(endpoint, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// POST Request
export const apiPost = async (endpoint, data = {}, config = {}) => {
  try {
    const response = await axiosMakeItTodayInstance.post(endpoint, data, config);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// PUT Request
export const apiPut = async (endpoint, data = {}, config = {}) => {
  try {
    const response = await axiosMakeItTodayInstance.put(endpoint, data, config);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// DELETE Request
export const apiDelete = async (endpoint, config = {}) => {
  try {
    const response = await axiosMakeItTodayInstance.delete(endpoint, config);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Error Handling Function
const handleError = (error) => {
  if (error.response) {
    console.error("API Error:", error.response.data);
    return { success: false, message: error.response.data.message };
  } else {
    console.error("Network Error:", error.message);
    return { success: false, message: "Network error, please try again." };
  }
};


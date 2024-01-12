// axiosConfig.ts

import axios, { AxiosInstance } from 'axios';

// Create an Axios instance with custom configuration
const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'https://659d3eec633f9aee7909027e.mockapi.io/api/v1/', // Your API base URL
    timeout: 5000, // Timeout in milliseconds
    headers: {
        'Content-Type': 'application/json',
        // Add any other default headers you need
    },
});

// Add interceptors if needed
axiosInstance.interceptors.request.use(
    (config) => {
        // Modify the request config if needed (e.g., add authentication token)
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        // Handle successful response
        return response;
    },
    (error) => {
        // Handle response error
        return Promise.reject(error);
    }
);

export default axiosInstance;

import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "ttps://learning-management-system-8.onrender.com/api/v1";

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;

export default axiosInstance;

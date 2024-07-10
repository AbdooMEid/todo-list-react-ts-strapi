import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:1337/api",
  timeout: 1000,
});

export default axiosInstance;

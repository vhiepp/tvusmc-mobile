import axios from "axios";

export const axiosClient = axios.create({
  baseURL: 'https://tvusmc.com/api',
  timeout: 5000,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});
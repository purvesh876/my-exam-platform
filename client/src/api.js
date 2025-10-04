import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  withCredentials: true, // important to send httpOnly cookie
  headers: { "Content-Type": "application/json" }
});

export default api;

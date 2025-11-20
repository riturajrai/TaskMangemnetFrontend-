
// src/lib/axios.js
import Axios from "axios";

const api = Axios.create({
  baseURL:"https://mentoroid-backend-api.up.railway.app/api",
  withCredentials: true
});

export default api;
// src/api.js
import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://restaurant-backend-production-664d.up.railway.app/api",
});

export default API;

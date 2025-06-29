// lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.turmusayacreations.com/api',
});

export default api;

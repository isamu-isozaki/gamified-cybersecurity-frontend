/**
 * Author: Isamu Isozaki
 */
import axios from 'axios';
import {REACT_APP_API_URL} from '../config';
/**
 * Create api
 */
const api = axios.create({
  baseURL: REACT_APP_API_URL,
  responseType: 'json',
});

/**
 * Parse response
 */
api.interceptors.response.use(
  function(res) {
    return res.data;
  },
  function(err) {
    return Promise.reject(err);
  },
);

export default api;

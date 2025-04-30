// src/services/api.js
import axios from 'axios';

const apiClient = async (getAccessTokenSilently) => {
  const token = await getAccessTokenSilently();

  return axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    }
  });
};

export default apiClient;

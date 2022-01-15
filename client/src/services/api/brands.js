import axios from 'axios';

export default {
  list(query) {
    return axios.get('/api/brands', { params: query });
  },
  listOne(id) {
    return axios.get('/api/brands/' + id);
  },
  update(id, payload) {
    return axios.put(`/api/brands/${id}`, payload);
  },
  create(payload) {
    return axios.post('/api/brands', payload);
  },
  delete(id) {
    return axios.delete(`/api/brands/${id}`);
  },
};

import axios from 'axios';

export default {
  list(query) {
    return axios.get('/api/players', { params: query });
  },
  listOne(id) {
    return axios.get('/api/players/' + id);
  },
  update(id, payload) {
    return axios.put(`/api/players/${id}`, payload);
  },
  create(payload) {
    return axios.post('/api/players', payload);
  },
  delete(id) {
    return axios.delete(`/api/players/${id}`);
  },
};

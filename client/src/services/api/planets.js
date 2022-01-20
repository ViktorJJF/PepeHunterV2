import axios from 'axios';

export default {
  list(query) {
    return axios.get('/api/planets', { params: query });
  },
  listOne(id) {
    return axios.get('/api/planets/' + id);
  },
  update(id, payload) {
    return axios.put(`/api/planets/${id}`, payload);
  },
  create(payload) {
    return axios.post('/api/planets', payload);
  },
  delete(id) {
    return axios.delete(`/api/planets/${id}`);
  },
  getAlliances() {
    return axios.get('/api/planets/alliances');
  },
};

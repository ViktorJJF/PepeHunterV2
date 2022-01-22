import axios from 'axios';

export default {
  list(query) {
    return axios.get('/api/activities', { params: query });
  },
  listOne(id) {
    return axios.get('/api/activities/' + id);
  },
  update(id, payload) {
    return axios.put(`/api/activities/${id}`, payload);
  },
  create(payload) {
    return axios.post('/api/activities', payload);
  },
  delete(id) {
    return axios.delete(`/api/activities/${id}`);
  },
  getActivitiesByDay(date, playerId) {
    return axios.get('/api/activities/get-activities-by-day', {
      params: { date, playerId },
    });
  },
};

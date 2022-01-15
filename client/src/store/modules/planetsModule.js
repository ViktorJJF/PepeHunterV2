// usar esto para paginacion con servidor
import api from '@/services/api/planets';
import {
  buildSuccess,
  handleError,
  buildQueryWithPagination,
} from '@/utils/utils';

const module = {
  namespaced: true,
  state: {
    planets: [],
    total: 0,
    totalPages: 0,
  },
  actions: {
    list({ commit }, query) {
      const finalQuery = buildQueryWithPagination(query);
      commit('loadingModule/showLoading', true, { root: true });
      return new Promise((resolve, reject) => {
        api
          .list(finalQuery)
          .then((response) => {
            commit('list', response.data.payload);
            commit('totalItems', response.data.totalDocs);
            commit('totalPages', response.data.totalPages);
            resolve(response.data.payload);
            commit('loadingModule/showLoading', false, { root: true });
          })
          .catch((error) => {
            handleError(error, commit, reject);
          });
      });
    },
    listOne({ commit }, id) {
      commit('loadingModule/showLoading', true, { root: true });
      return new Promise((resolve, reject) => {
        api
          .listOne(id)
          .then((response) => {
            resolve(response.data.payload);
            commit('loadingModule/showLoading', false, { root: true });
          })
          .catch((error) => {
            handleError(error, commit, reject);
          });
      });
    },
    create({ commit }, data) {
      return new Promise((resolve, reject) => {
        commit('loadingModule/showLoading', true, { root: true });
        api
          .create(data)
          .then((res) => {
            commit('loadingModule/showLoading', false, { root: true });
            buildSuccess('Registro guardado con éxito', commit);
            commit('create', res.data.payload);
            resolve(res.data.payload);
          })
          .catch((error) => {
            handleError(error, commit, reject);
          });
      });
    },
    update({ commit }, { id, data }) {
      commit('loadingModule/showLoading', true, { root: true });
      return new Promise((resolve, reject) => {
        api
          .update(id, data)
          .then((res) => {
            commit('loadingModule/showLoading', false, { root: true });
            buildSuccess('Registro actualizado con éxito', commit);
            commit('update', {
              id,
              data: res.data.payload,
            });
            resolve(res.data.payload);
          })
          .catch((error) => {
            handleError(error, commit, reject);
          });
      });
    },
    delete({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('loadingModule/showLoading', true, { root: true });
        api
          .delete(id)
          .then(() => {
            commit('loadingModule/showLoading', false, { root: true });
            buildSuccess('Registro eliminado con éxito', commit);
            commit('delete', id);
            resolve();
          })
          .catch((error) => {
            handleError(error, commit, reject);
          });
      });
    },
  },
  mutations: {
    list(state, data) {
      state.planets = data;
    },
    totalItems(state, data) {
      state.total = data;
    },
    totalPages(state, data) {
      state.totalPages = data;
    },
    create(state, data) {
      state.planets.unshift(data);
    },
    update(state, { id, data }) {
      const indexToUpdate = state.planets.findIndex(
        (member) => member.id === id,
      );
      state.planets.splice(indexToUpdate, 1, {
        ...data,
      });
    },
    delete(state, id) {
      const indexToDelete = state.planets.findIndex(
        (member) => member.id === id,
      );
      state.planets.splice(indexToDelete, 1);
    },
  },
  getters: {
    getBrandNameById: (state) => (id) => {
      const brandFound = state.planets.find((brand) => brand.id === id);
      return brandFound ? brandFound.name : 'Sin marca';
    },
  },
};

export default module;

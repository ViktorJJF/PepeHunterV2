import { createStore } from 'vuex';

//  plugins
import modules from './modules';

export default createStore({
  modules,
  state: { maxPaginationButtons: 15, itemsPerPage: 15 },
  mutations: {},
  actions: {},
});

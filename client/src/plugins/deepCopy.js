import deepcopy from 'deepcopy';

export default {
  install: app => {
    app.config.globalProperties.$deepCopy = src => deepcopy(src);
  },
};

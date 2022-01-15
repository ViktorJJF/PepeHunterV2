import { v4 as uuidv4 } from 'uuid';

export default {
  install: app => {
    app.config.globalProperties.$uuid = () => uuidv4();
  },
};

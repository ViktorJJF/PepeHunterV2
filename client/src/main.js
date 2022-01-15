import { createApp } from 'vue';

// plugins
import mosha from '@/plugins/moshaToastify';
import deepCopy from '@/plugins/deepCopy';
import uuid from '@/plugins/uuid';
import sweetAlert from '@/plugins/sweetAlert';
import '@/plugins/axios';
import initialize from '@/filters/filters';

// Element plus
import ElementPlus from 'element-plus';

import 'element-plus/dist/index.css';

import App from './App.vue';
import router from './router';
import store from './store';

const app = createApp(App);
initialize(app);
app.use(ElementPlus);

mosha(app);
app.use(deepCopy);
app.use(uuid);
app.use(sweetAlert);

// styles
import '@/assets/scss/styles.scss';

app.use(store).use(router).mount('#app');

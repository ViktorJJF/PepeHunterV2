import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    name: 'dashboard',
    redirect: { name: 'Home' },
    children: [
      {
        path: '/inicio',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/universo',
        name: 'Universe',
        component: () => import('@/views/Universe.vue'),
      },
      {
        path: '/jugadores',
        name: 'Players',
        component: () => import('@/views/Players.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

import { createRouter, createWebHashHistory } from 'vue-router'
import userRoutes from './modules/user'

const routes = [
  {
    path: '/',
    component: () => import('@/views/TodoList.vue'),
  },
  ...userRoutes
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
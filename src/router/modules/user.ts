import type { RouteRecordRaw } from 'vue-router'

const userRoutes: RouteRecordRaw[] = [
  {
    path: '/users',
    name: 'UserList',
    component: () => import('@/views/user/UserList.vue'),
    meta: { title: '用户列表' }
  },
  {
    path: '/users/create',
    name: 'UserCreate',
    component: () => import('@/views/user/UserForm.vue'),
    meta: { title: '新增用户' }
  },
  {
    path: '/users/:id/edit',
    name: 'UserEdit',
    component: () => import('@/views/user/UserForm.vue'),
    meta: { title: '编辑用户' }
  },
  {
    path: '/users/:id',
    name: 'UserDetail',
    component: () => import('@/views/user/UserDetail.vue'),
    meta: { title: '用户详情' }
  }
]

export default userRoutes
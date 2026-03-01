<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { UserRole, UserStatus } from '@/types/user'

const router = useRouter()
const store = useUserStore()

onMounted(() => {
  store.fetchUsers()
})

const goCreate = () => {
  router.push('/users/create')
}

const goEdit = (id: number) => {
  router.push(`/users/${id}/edit`)
}

const goDetail = (id: number) => {
  router.push(`/users/${id}`)
}

const remove = (id: number) => {
  store.removeUser(id)
}

const roleMap: Record<UserRole, string> = {
  admin: '管理员',
  editor: '编辑',
  visitor: '访客'
}

const statusMap: Record<UserStatus, string> = {
  enabled: '启用',
  disabled: '禁用'
}
</script>

<template>
  <div>
    <h2>用户列表</h2>

    <button @click="goCreate">新增用户</button>

    <table border="1" cellpadding="8">
      <thead>
        <tr>
          <th>ID</th>
          <th>姓名</th>
          <th>年龄</th>
          <th>角色</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in store.list" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.age }}</td>
          <td>{{ roleMap[item.role] }}</td>
          <td>{{ statusMap[item.status] }}</td>
          <td>
            <button @click="goDetail(item.id)">详情</button>
            <button @click="goEdit(item.id)">编辑</button>
            <button @click="remove(item.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
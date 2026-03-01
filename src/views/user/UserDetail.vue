<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const store = useUserStore()

const id = Number(route.params.id)

const user = computed(() =>
  store.list.find(u => u.id === id)
)

const back = () => {
  router.push('/users')
}
</script>

<template>
  <div v-if="user">
    <h2>用户详情</h2>

    <p>ID: {{ user.id }}</p>
    <p>姓名: {{ user.name }}</p>
    <p>年龄: {{ user.age }}</p>
    <p>角色: {{ user.role }}</p>
    <p>状态: {{ user.status }}</p>
    <p>创建时间: {{ user.createTime }}</p>

    <button @click="back">返回</button>
  </div>
</template>
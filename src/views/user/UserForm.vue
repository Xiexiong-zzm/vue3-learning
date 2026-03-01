<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createUser, updateUser } from '@/api/user'
import { useUserStore } from '@/stores/user'
import type { CreateUserParams } from '@/types/user'

const route = useRoute()
const router = useRouter()
const store = useUserStore()

const id = computed(() => Number(route.params.id))
const isEdit = computed(() => !!route.params.id)

const form = reactive<CreateUserParams>({
  name: '',
  age: 0,
  role: 'visitor',
  status: 'enabled'
})

onMounted(() => {
  if (isEdit.value) {
    const target = store.list.find(u => u.id === id.value)
    if (target) {
      Object.assign(form, target)
    }
  }
})

const submit = async () => {
  if (isEdit.value) {
    await updateUser(id.value, form)
  } else {
    await createUser(form)
  }

  await store.fetchUsers()
  router.push('/users')
}
</script>

<template>
  <div>
    <h2>{{ isEdit ? '编辑用户' : '新增用户' }}</h2>

    <div>
      <label>姓名：</label>
      <input v-model="form.name" />
    </div>

    <div>
      <label>年龄：</label>
      <input type="number" v-model.number="form.age" />
    </div>

    <div>
      <label>角色：</label>
      <select v-model="form.role">
        <option value="admin">管理员</option>
        <option value="editor">编辑</option>
        <option value="visitor">访客</option>
      </select>
    </div>

    <div>
      <label>状态：</label>
      <select v-model="form.status">
        <option value="enabled">启用</option>
        <option value="disabled">禁用</option>
      </select>
    </div>

    <button @click="submit">提交</button>
  </div>
</template>
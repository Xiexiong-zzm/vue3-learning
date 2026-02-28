<script setup lang="ts">
import { ref } from 'vue'
import { useTaskStore } from '@/stores'

const taskStore = useTaskStore()
const newTask = ref('')

function handleAdd() {
  if (!newTask.value.trim()) return
  taskStore.addTask(newTask.value)
  newTask.value = ''
}
</script>

<template>
  <div>
    <h1>Task Manager</h1>

    <input v-model="newTask" placeholder="请输入任务" />
    <button @click="handleAdd">添加</button>

    <ul>
      <li v-for="task in taskStore.tasks" :key="task.id">
        <input
          type="checkbox"
          :checked="task.completed"
          @change="taskStore.toggleTask(task.id)"
        />
        {{ task.title }}

        <button @click="taskStore.removeTask(task.id)">删除</button>
      </li>
    </ul>

    <p>已完成：{{ taskStore.completedCount }}</p>
  </div>
</template>
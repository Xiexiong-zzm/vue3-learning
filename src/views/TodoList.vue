<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '@/stores/useTaskStore'
import { showToast, showDialog } from 'vant'

const store = useTaskStore()
const inputTitle = ref('')
const filter = ref<'all' | 'active' | 'completed'>('all')
const currentTaskId = ref('')

// 获取任务列表
onMounted(() => {
  store.fetchTasks()
})

// 过滤后的任务列表
const filteredTasks = computed(() => {
  switch (filter.value) {
    case 'active':
      return store.activeTasks
    case 'completed':
      return store.completedTasks
    default:
      return store.tasks
  }
})

// 新增任务
const handleAddTask = () => {
  const title = inputTitle.value.trim()
  if (title) {
    store.addTask(title)
    inputTitle.value = ''
    showToast('Task added successfully')
  } else {
    showToast({
      message: 'Please enter a task title',
      type: 'fail'
    })
  }
}

// 监听回车键
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleAddTask()
  }
}

// 显示删除对话框
const showDeleteConfirm = (id: string) => {
  currentTaskId.value = id
  showDialog({
    title: 'Delete Task',
    message: 'Are you sure you want to delete this task?'
  }).then(() => {
    confirmDeleteTask()
  }).catch(() => {
    cancelDeleteTask()
  })
}

// 确认删除任务
const confirmDeleteTask = () => {
  if (currentTaskId.value) {
    store.deleteTask(currentTaskId.value)
    showToast('Task deleted successfully')
    currentTaskId.value = ''
  }
}

// 取消删除任务
const cancelDeleteTask = () => {
  currentTaskId.value = ''
}

// 显示清除已完成任务对话框
const showClearConfirm = () => {
  showDialog({
    title: 'Clear Completed',
    message: `Are you sure you want to clear all ${store.completedCount} completed tasks?`
  }).then(() => {
    confirmClearCompleted()
  }).catch(() => {
    cancelClearCompleted()
  })
}

// 确认清除已完成任务
const confirmClearCompleted = () => {
  store.clearCompleted()
  showToast('Completed tasks cleared')
}

// 取消清除已完成任务
const cancelClearCompleted = () => {
  // 取消清除
}

// 切换任务完成状态
const handleToggleTask = (id: string) => {
  store.toggleTask(id)
}

// 切换所有任务完成状态
const handleToggleAll = () => {
  store.toggleAllTasks()
}
</script>

<template>
  <div class="todo-app" :class="{ 'loading': store.loading }">
    <!-- 头部 -->
    <div class="todo-header">
      <h1 class="text-4xl font-bold text-gray-800 mb-6">Todo List</h1>
    </div>

    <!-- 主体内容 -->
    <div class="todo-main bg-white rounded-lg shadow-md overflow-hidden">
      <!-- 切换所有任务 -->
      <div v-if="store.taskCount > 0" class="toggle-all-container bg-gray-50 p-4 flex items-center gap-3 border-b">
        <van-switch 
          :model-value="store.allTasksCompleted" 
          @change="handleToggleAll" 
        />
        <span class="text-gray-700">
          Mark all as {{ store.allTasksCompleted ? 'active' : 'completed' }}
        </span>
      </div>

      <!-- 新增任务输入框 -->
      <div class="new-todo-container p-4 flex gap-2 border-b">
        <input
          v-model="inputTitle"
          class="new-todo flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="What needs to be done?"
          @keyup="handleKeyDown"
          autofocus
        >
        <van-button
          type="primary"
          size="small"
          @click="handleAddTask"
          :loading="store.loading"
        >
          Add
        </van-button>
      </div>

      <!-- 任务列表 -->
      <ul v-if="filteredTasks.length > 0" class="todo-list p-4 space-y-2">
        <li
          v-for="task in filteredTasks"
          :key="task.id"
          class="todo-item flex items-center gap-3 p-3 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100"
          :class="{ 'completed': task.completed }"
        >
          <van-checkbox
            v-model="task.completed"
            @change="handleToggleTask(task.id)"
            class="flex-shrink-0"
          />
          <span
            class="todo-title flex-1 text-gray-800 break-words transition-all duration-200"
            :class="{ 'line-through text-gray-500': task.completed }"
          >
            {{ task.title }}
          </span>
          <van-button
            icon="delete-o"
            type="danger"
            plain
            size="mini"
            @click="showDeleteConfirm(task.id)"
            class="flex-shrink-0 ml-auto"
          />
        </li>
      </ul>

      <!-- 空状态 -->
      <div v-if="filteredTasks.length === 0" class="empty-state p-8 text-center text-gray-500">
        <van-empty
          description="No tasks yet"
          image-size="100"
        />
        <p class="mt-4 text-sm">
          {{ filter === 'all' ? 'What needs to be done?' : filter === 'active' ? 'No active tasks. Great job!' : 'No completed tasks yet.' }}
        </p>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div v-if="store.taskCount > 0" class="todo-footer mt-4 flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
      <span class="todo-count text-sm text-gray-600">
        {{ store.activeCount }} {{ store.activeCount === 1 ? 'item' : 'items' }} left
      </span>

      <!-- 过滤标签 -->
      <div class="filter-tabs flex gap-2">
        <van-tag
          :type="filter === 'all' ? 'primary' : 'default'"
          @click="filter = 'all'"
          class="cursor-pointer px-3 py-1 text-sm"
        >
          All
        </van-tag>
        <van-tag
          :type="filter === 'active' ? 'success' : 'default'"
          @click="filter = 'active'"
          class="cursor-pointer px-3 py-1 text-sm"
        >
          Active
        </van-tag>
        <van-tag
          :type="filter === 'completed' ? 'warning' : 'default'"
          @click="filter = 'completed'"
          class="cursor-pointer px-3 py-1 text-sm"
        >
          Completed
        </van-tag>
      </div>

      <!-- 清除已完成任务 -->
      <van-button
        type="danger"
        plain
        size="small"
        @click="showClearConfirm"
        :disabled="store.completedCount === 0"
        class="flex-shrink-0"
      >
        Clear {{ store.completedCount }}
      </van-button>
    </div>

    <!-- 加载状态 -->
    <van-loading v-if="store.loading" class="loading fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
      Loading...
    </van-loading>
  </div>
</template>

<style lang="scss" scoped>
.todo-app {
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;

  &.loading {
    pointer-events: none;
  }
}

.todo-header {
  text-align: center;
  margin-bottom: 2rem;
}

.todo-main {
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.toggle-all-container {
  padding: 1rem;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.new-todo-container {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.new-todo {
  flex: 1;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;

  &:focus {
    border-color: #1989fa;
    box-shadow: 0 0 0 2px rgba(25, 137, 250, 0.2);
  }
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-item {
  padding: 0.75rem;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: background 0.2s;

  &:hover {
    background: #f9f9f9;
  }

  &:last-child {
    border-bottom: none;
  }

  &.completed {
    background: #f0f9eb;
    opacity: 0.7;
  }
}

.todo-title {
  flex: 1;
  font-size: 1rem;
  color: #333;
  text-decoration: none;
  word-break: break-word;

  &.line-through {
    text-decoration: line-through;
    color: #999;
  }
}

.todo-footer {
  padding: 1rem;
  background: #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.todo-count {
  color: #666;
  font-size: 0.875rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
}

.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.75);
  z-index: 1000;
}

// Vant 组件样式覆盖
:deep(.van-checkbox__label) {
  display: none;
}

:deep(.van-tag) {
  cursor: pointer;

  &.van-tag--primary {
    background-color: #1989fa;
    border-color: #1989fa;
    color: #fff;
  }

  &.van-tag--success {
    background-color: #07c160;
    border-color: #07c160;
    color: #fff;
  }

  &.van-tag--warning {
    background-color: #ff976a;
    border-color: #ff976a;
    color: #fff;
  }
}
</style>

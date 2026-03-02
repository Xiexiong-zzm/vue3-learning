import { defineStore } from "pinia";
import type { Task } from "@/types/task";
import { getTaskList, createTask, updateTask, deleteTask, toggleTask, clearCompletedTasks } from "@/api/task";

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[],
    loading: false
  }),

  getters: {
    activeTasks(): Task[] {
      return this.tasks.filter(task => !task.completed)
    },

    completedTasks(): Task[] {
      return this.tasks.filter(task => task.completed)
    },

    allTasksCompleted(): boolean {
      return this.tasks.length > 0 && this.tasks.every(task => task.completed)
    },

    taskCount(): number {
      return this.tasks.length
    },

    activeCount(): number {
      return this.activeTasks.length
    },

    completedCount(): number {
      return this.completedTasks.length
    }
  },

  actions: {
    async fetchTasks() {
      this.loading = true
      try {
        const response = await getTaskList()
        this.tasks = response.data.list
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
      } finally {
        this.loading = false
      }
    },

    async addTask(title: string) {
      try {
        const response = await createTask(title)
        // 检查是否已经添加了该任务
        const existingTask = this.tasks.find(task => task.id === response.data.id)
        if (!existingTask) {
          this.tasks.push(response.data)
        }
        return response.data
      } catch (error) {
        console.error('Failed to create task:', error)
      }
    },

    async updateTask(id: string, updates: Partial<Task>) {
      try {
        const response = await updateTask(id, updates)
        const index = this.tasks.findIndex(task => task.id === id)
        if (index !== -1) {
          this.tasks[index] = response.data
        }
      } catch (error) {
        console.error('Failed to update task:', error)
      }
    },

    async deleteTask(id: string) {
      try {
        await deleteTask(id)
        this.tasks = this.tasks.filter(task => task.id !== id)
      } catch (error) {
        console.error('Failed to delete task:', error)
      }
    },

    async toggleTask(id: string) {
      try {
        const response = await toggleTask(id)
        const index = this.tasks.findIndex(task => task.id === id)
        if (index !== -1) {
          this.tasks[index] = response.data
        }
      } catch (error) {
        console.error('Failed to toggle task:', error)
      }
    },

    async clearCompleted() {
      try {
        await clearCompletedTasks()
        this.tasks = this.activeTasks
      } catch (error) {
        console.error('Failed to clear completed tasks:', error)
      }
    },

    async toggleAllTasks() {
      const allCompleted = this.allTasksCompleted

      try {
        for (const task of this.tasks) {
          if (task.completed === allCompleted) {
            await updateTask(task.id, { completed: !allCompleted })
          }
        }

        this.tasks = this.tasks.map(task => ({
          ...task,
          completed: !allCompleted
        }))
      } catch (error) {
        console.error('Failed to toggle all tasks:', error)
      }
    }
  },

  persist: {
    paths: ['tasks']
  }
})
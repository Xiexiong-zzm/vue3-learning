import { defineStore } from "pinia";
import {computed} from 'vue';
import type { Task } from "@/types/task";
import {useLocalStorage} from "@/composables/useLocalStorage"

export const useTaskStore = defineStore('task',() => {
  const tasks = useLocalStorage<Task[]>("tasks",[]);
  const completedCount = computed(() => {
    return tasks.value.filter((t:Task) => t.completed).length
  })
  function addTask(title: string) {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: Date.now(),
    }

    tasks.value.push(newTask)
  }

  function toggleTask(id: string) {
    const task = tasks.value.find((t:Task) => t.id === id)
    if (task) {
      task.completed = !task.completed
    }
  }

  function removeTask(id: string) {
    tasks.value = tasks.value.filter((t:Task) => t.id !== id)
  }

  return {
    tasks,
    completedCount,
    addTask,
    toggleTask,
    removeTask,
  }
})
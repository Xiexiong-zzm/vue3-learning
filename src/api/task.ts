import type { Task } from '@/types/task'
import type { PageResult } from '@/types/common'
import { request } from '@/utils/request'

let mockList: Task[] = []

export function getTaskList() {
  return request<PageResult<Task>>({
    list: mockList,
    total: mockList.length
  })
}

export function createTask(title: string) {
  const newTask: Task = {
    id: Date.now().toString(),
    title,
    completed: false,
    createdAt: Date.now()
  }

  mockList.push(newTask)

  return request<Task>(newTask)
}

export function updateTask(id: string, updates: Partial<Task>) {
  const task = mockList.find(t => t.id === id)

  if (!task) {
    throw new Error('Task not found')
  }

  Object.assign(task, updates)

  return request<Task>(task)
}

export function deleteTask(id: string) {
  mockList = mockList.filter(t => t.id !== id)
  return request<boolean>(true)
}

export function toggleTask(id: string) {
  const task = mockList.find(t => t.id === id)

  if (!task) {
    throw new Error('Task not found')
  }

  task.completed = !task.completed

  return request<Task>(task)
}

export function clearCompletedTasks() {
  mockList = mockList.filter(t => !t.completed)
  return request<boolean>(true)
}
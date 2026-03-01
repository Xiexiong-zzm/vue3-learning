import type { User, CreateUserParams, UpdateUserParams } from '@/types/user'
import type { PageResult } from '@/types/common'
import { request } from '@/utils/request'

let mockList: User[] = []

export function getUserList() {
  return request<PageResult<User>>({
    list: mockList,
    total: mockList.length
  })
}

export function createUser(params: CreateUserParams) {
  const newUser: User = {
    ...params,
    id: Date.now(),
    createTime: new Date().toISOString()
  }

  mockList.push(newUser)

  return request<User>(newUser)
}

export function updateUser(id: number, params: UpdateUserParams) {
  const user = mockList.find(u => u.id === id)

  if (!user) {
    throw new Error('User not found')
  }

  Object.assign(user, params)

  return request<User>(user)
}

export function deleteUser(id: number) {
  mockList = mockList.filter(u => u.id !== id)
  return request<boolean>(true)
}
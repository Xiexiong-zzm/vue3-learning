import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import * as api from '@/api/user'

interface UserState {
  list: User[]
  loading: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    list: [],
    loading: false
  }),

  actions: {
    async fetchUsers() {
      this.loading = true
      const res = await api.getUserList()
      this.list = res.data.list
      this.loading = false
    },

    async removeUser(id: number) {
      await api.deleteUser(id)
      this.list = this.list.filter(u => u.id !== id)
    }
  }
})
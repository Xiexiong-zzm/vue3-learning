import { defineStore } from "pinia";
export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    name: '',
    age: 0
  }),

  persist: {
    paths: ['age'] // ✅ 只能写 token | name | age
  }
})
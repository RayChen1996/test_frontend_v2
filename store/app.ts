export interface UserItem {
  id: number
  name: string
  email: string
}

export const useAppStore = defineStore('app', {
  state: () => ({
    users: [] as UserItem[],
    loading: false as boolean,
    errorMessage: '' as string,
  }),
  actions: {
    setUsers(list: UserItem[]) {
      this.users = list
    },
    async fetchUsers() {
      this.loading = true
      this.errorMessage = ''
      try {
        const data = await $fetch<UserItem[]>('/api/users')
        this.users = data
      } catch (err: any) {
        this.errorMessage = err?.message || 'Fetch users failed'
      } finally {
        this.loading = false
      }
    },
    async createUser(payload: Omit<UserItem, 'id'>) {
      const created = await $fetch<UserItem>('/api/users', { method: 'POST', body: payload })
      this.users.push(created)
      return created
    },
    async updateUser(payload: UserItem) {
      const updated = await $fetch<UserItem>('/api/users', { method: 'PUT', body: payload })
      const idx = this.users.findIndex((u) => u.id === updated.id)
      if (idx !== -1) this.users.splice(idx, 1, updated)
      return updated
    },
    async deleteUser(id: number) {
      await $fetch('/api/users', { method: 'DELETE', query: { id } })
      this.users = this.users.filter((u) => u.id !== id)
    },
  },
})

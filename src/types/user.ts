export type UserRole = "admin"|"visitor"|"editor";
export type UserStatus = 'enabled' | 'disabled';

export interface User {
  id: number
  name: string
  age: number
  role: UserRole
  status: UserStatus
  createTime: string
}

export type CreateUserParams = Omit<User, 'id' | 'createTime'>

export type UpdateUserParams = Partial<
  Omit<User, 'id' | 'createTime'>
>
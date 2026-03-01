// 分页接口
export interface PageResult<T> {
  list: T[]
  total: number
}
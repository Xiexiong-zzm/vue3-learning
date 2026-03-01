// 响应
export interface ApiResponse<T>{
  code: number,
  message: string,
  data: T
}


export function request<T>(data: T): Promise<ApiResponse<T>>{
  return Promise.resolve({
    code: 200,
    message: 'success',
    data
  })
}

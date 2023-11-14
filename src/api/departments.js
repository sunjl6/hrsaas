import request from '@/utils/request'

export function getDepartments() {
  return request({
    url: '/authority/org/tree', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET'
  })
}
export function delDepartments(id) {
  return request({
    url: '/authority/org?ids[]=' + id, // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'DELETE' // data = ids[]
  })
}

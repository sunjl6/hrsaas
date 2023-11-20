import request from '@/utils/request'
// 分页获取角色
export function getRoleByPage(params) {
  return request({
    url: '/authority/role/page', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET',
    params
  })
}
// 删除角色
export function delRole(id) {
  return request({
    url: '/authority/role?ids[]=' + id, // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'DELETE'
  })
}
// 修改角色
export function updateRole(data) {
  return request({
    url: '/authority/role', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'PUT',
    data
  })
}
// 添加橘色
export function insertRole(data) {
  return request({
    url: '/authority/role', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'POST',
    data
  })
}
// 查询角色
export function getRoleById(id) {
  return request({
    url: '/authority/role/' + id, // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET'
  })
}

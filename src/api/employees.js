import request from '@/utils/request'
// 分页查询所有员工
export function getEmployeeListByPage(params) {
  return request({
    url: '/authority/user/page', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET',
    params
  })
}
// 删除员工
export function delUser(id) {
  return request({
    url: '/authority/user?ids[]=' + id, // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'DELETE'
  })
}
// 新增员工
export function addUser(data) {
  return request({
    url: '/authority/user', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'POST',
    data
  })
}
// 批量导入用户
export function importEmployee(data) {
  return request({
    url: '/authority/user/saveUserBatch',
    method: 'post',
    data
  })
}

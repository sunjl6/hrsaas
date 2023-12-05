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
// 根据id 获取员工基信息
export function getUserById(id) {
  return request({
    url: '/authority/user/' + id,
    method: 'get'
  })
}
// 修改员工的密码(这里的是管理员修改员工密码,不是员工修改自己密码)
export function updatePasswordByAdmin(data) {
  return request({
    url: '/authority/user/password',
    method: 'put',
    data
  })
}
// 单独上传用户头像
export function uploadAvatar(id, data) {
  return request({
    url: '/authority/user/uploadAvatar/' + id,
    method: 'post',
    data
  })
}

// 查询用户详细
export function getUserDetailById(id, data) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/authority/user/anno/id/' + id, // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'POST',
    data // 根据后台api文档需要追加显示的内容的参数对象
  })
}


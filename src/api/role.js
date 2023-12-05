import request from '@/utils/request'

// 获取所有角色
export function roleList() {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/authority/role/list', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET'
  })
}

// 更新role 角色

export function assignRoles(id, roleids) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: `/authority/role/assignRoles/${id}?roleIds[]=` + roleids, // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'PUT'
  })
}

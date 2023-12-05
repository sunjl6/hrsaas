import request from '@/utils/request'

// 获取所有权限树
export function menuList() {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/authority/menu/tree', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET'
  })
}
// 分页获取所有资源权限
export function pageResource(params) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/authority/resource/page', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET',
    params
  })
}
// 新增菜单权限
export function addMenu(data) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/authority/menu', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'POST',
    data
  })
}
// 删除菜单权限
export function delMenu(id) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/authority/menu?ids[]=' + id, // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'DELETE'
  })
}
// 修改菜单
export function editMenu(data) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/authority/menu', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'PUT',
    data
  })
}
// 根据id查询菜单
export function getMenuById(id) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/authority/menu/' + id, // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET'
  })
}
// 新增权限
export function addResource(data) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/authority/resource', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'POST',
    data
  })
}
// 删除权限
export function delResource(id) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/authority/resource?ids[]=' + id, // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'DELETE'
  })
}

// 根据id 查询权限
export function getResourceById(id) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/authority/resource/' + id, // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET'
  })
}
// 修改资源
export function editResource(data) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/authority/resource/', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'PUT',
    data
  })
}

import request from '@/utils/request'
// 获取部门树结构
export function getDepartments() {
  return request({
    url: '/authority/org/tree', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET'
  })
}
// 删除一个部门
export function delDepartments(id) {
  return request({
    url: '/authority/org?ids[]=' + id, // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'DELETE' // data = ids[]
  })
}
// 新增部门

export function addDepartments(data) {
  return request({
    url: '/authority/org', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'POST',
    data
  })
}

// 通过id 查询所有部门

export function getDepartmentsById(id) {
  return request({
    url: '/authority/org/' + id, // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET'
  })
}
// 通过Pid 查询所有子部门
export function getDepartmentsByPid(pid) {
  return request({
    url: '/authority/org/getOrgsByPid/' + pid, // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET'
  })
}
// 查询所有部门code

export function getDepartmentsByCode(code) {
  return request({
    url: '/authority/org/getAbbreviation/' + code, // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET'
  })
}

// 修改部门

export function editDepartment(data) {
  return request({
    url: '/authority/org', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'PUT',
    data
  })
}

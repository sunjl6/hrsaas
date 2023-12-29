import request from '@/utils/request'
// 获取所有岗位，不分页
export function getAllStations() {
  return request({
    url: '/authority/station/getAllStations/' // 因为所有的接口都要跨域 表示所有的接口要带 /api
  })
}

// 根据部门id 获取所有岗位
export function getStationsByOrgId(orgId) {
  return request({
    url: '/authority/station/getStationsByOrgId/' + orgId // 因为所有的接口都要跨域 表示所有的接口要带 /api
  })
}

// 新增岗位  /station
// data：
// {
// 	"describe": "",
// 	"name": "",
// 	"orgId": 0,
// 	"status": true
// }
export function addStation(data) {
  return request({
    url: '/authority/station/', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'POST',
    data
  })
}

// 分页获取所有岗位  /station/page
export function pageStation(params) {
  return request({
    url: '/authority/station/page', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET',
    params
  })
}
// 删除岗位
export function delStation(params) {
  return request({
    url: '/authority/station/', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'DELETE',
    params
  })
}
// 获取所有岗位树  /station/pageTree
export function getStationTreeList() {
  return request({
    url: '/authority/station/tree', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET'
  })
}
// 修改岗位  put /station
export function editStation(data) {
  return request({
    url: '/authority/station/', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'PUT',
    data
  })
}
// 根据id 查询岗位信息
export function getStationById(id) {
  return request({
    url: '/authority/station/' + id, // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET'
  })
}

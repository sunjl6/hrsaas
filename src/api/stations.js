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

import request from '@/utils/request'

export function login(data) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/authority/anno/login', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'POST',
    data
  })
}
export function getCaptcha(randomId) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/authority/anno/captcha' + `?key=${randomId}`, // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET',
    responseType: 'blob'
  })
}

export function getUserInfo() {
  return request({
    url: '/authority/user/profile',
    method: 'GET'
  })
}
// 登出
export function logout() {
  return request({
  })
}
// 获取所有用户信息
export function getAllUser() {
  return request({
    url: '/authority/user/AllUserList',
    method: 'GET'
  })
}

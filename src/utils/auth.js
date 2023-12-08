import Cookies from 'js-cookie'
import db from '@/utils/localstorage'
const TokenKey = 'hrsaas-ihrm-token'
const UserInfoKey = 'UserInfo'
const timeKey = 'hrsaas-timestamp-key'
const uRouters = 'USER_ROUTER'
const userPermission = 'PERMISSIONS'
const dynamicRouters = 'DYNAMIC_ROUTES'
// const currentTab = 'currentTab'
export function setTimeStamp() {
  return Cookies.set(timeKey, Date.now())
}
export function getTimeStamp() {
  return Cookies.get(timeKey)
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 7 })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function setUseInfoToCookie(usrIfo) {
  return Cookies.set(UserInfoKey, usrIfo, { expires: 7 })
}
export function removeUserInfoFromCookie() {
  return Cookies.remove(UserInfoKey)
}
export function getUserInfoFromCookie() {
  try {
    const user = JSON.parse(Cookies.get(UserInfoKey))
    return user
  } catch (error) {
    return error
  }
}

// 把用户的路由信息存到本地存储
export function setUserRouterToLocalStorage(routersData) {
  return db.save(uRouters, routersData)
}
// 从本地存储获取用户的路由信息
export function getUserRouterFromLocalStorage() {
  return db.get(uRouters)
}
// 从本地存储删除用户的路由信息
export function removeUserRouterFromLocalStorage() {
  return db.remove(uRouters)
}

// 吧当前用户的菜单权限标识缓存到本地存储
export function setUserPermissionToLocalStorage(permissionData) {
  return db.save(userPermission, permissionData)
}
// 从本地存储获取菜单权限标识
export function getUserPermissionFromLocalStorage(permissionData) {
  return db.get(userPermission)
}
// 从本地存储删除用户菜单权限表示由信息
export function removeUserPermissionFromLocalStorage() {
  return db.remove(userPermission)
}
// Jason解析保存本地存储的内容
export function saveStorage(name, data) {
  localStorage.setItem(name, JSON.stringify(data))
}

// Jason解析获取本地存储的内容
export function getStorage(name) {
  return JSON.parse(localStorage.getItem(name))
}

// 删除removeDYNAMIC_ROUTES
export function removeDynamicRouterFromStorage() {
  return db.remove(dynamicRouters)
}

// // 缓存当前tab栏的激活页面
// export function setCurrentTab(value) {
//   return Cookies.set(currentTab, value)
// }
// export function getCurrentTab() {
//   return Cookies.get(currentTab)
// }

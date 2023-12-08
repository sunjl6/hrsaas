import { removeDynamicRouterFromStorage, removeUserPermissionFromLocalStorage, setUserPermissionToLocalStorage, removeUserRouterFromLocalStorage, setUserRouterToLocalStorage, getUserRouterFromLocalStorage, getToken, setToken, removeToken, setUseInfoToCookie, removeUserInfoFromCookie, getUserInfoFromCookie, setTimeStamp, getUserPermissionFromLocalStorage } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'
import { getUserRouters } from '@/api/permisson'
// 状态
const state = {
  token: getToken(),
  userInfo: getUserInfoFromCookie(),
  userRouters: getUserRouterFromLocalStorage(),
  permission: getUserPermissionFromLocalStorage()
}
// 修改状态
const mutations = {
  setToken(state, token) {
    state.token = token // 设置token  只是修改state的数据  123 =》 1234
    // vuex变化 => 缓存数据
    setToken(token) // vuex和 缓存数据的同步
  },
  // 删除缓存
  removeToken(state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },
  // 设置用户信息
  setUserInfo(state, result) {
    state.userInfo = result
    setUseInfoToCookie(result)
  },
  // 删除用户信息
  removeUserInfo() {
    state.userInfo = {}
    removeUserInfoFromCookie()
  },
  // 设置当前用户的路由信息到localstorage
  setUserRouters(state, routersData) {
    state.userRouters = routersData
    setUserRouterToLocalStorage(routersData)
  },
  // 登出删除本地存储用户的信息
  removeUserRouters() {
    state.userRouters = {}
    removeUserRouterFromLocalStorage()
  },
  // 设置权限缓存本地存储
  setUserPermission(state, permissionData) {
    state.permission = permissionData
    setUserPermissionToLocalStorage(permissionData)
  },
  // 登出删除本地存储权限缓存信息
  removeUserPermission() {
    removeUserPermissionFromLocalStorage()
  },
  removeDYNAMIC_ROUTES() {
    removeDynamicRouterFromStorage()
  }
}
// 执行异步
const actions = {
  // 定义login action  也需要参数 调用action时 传递过来的参数
  async login(context, data) {
    const result = await login(data) // 实际上就是一个promise  result就是执行的结果
    // 注意这里返回结果是已经解封的data 数据在 request.js里面已经对返回数据做过判断 如果成功直接返回的是展开的data的数据
    // 所有下面的判断就不需要做了。在request.js里已经进行判断了。这里直接把token 放进去就行了
    // axios默认给数据加了一层data
    // if (result.data.isSuccess) {
    //   // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    //   // 现在有用户token
    //   // actions 修改state 必须通过mutations
    context.commit('setToken', result.token.token)
    // 发送请求获取当前用户的路由信息
    const userRouters = await getUserRouters({ userId: result.user.id })
    // 吧路由信息存到vuex 和 cookies 里
    context.commit('setUserRouters', userRouters)
    // 把用户的权限标识缓存到本地存储
    context.commit('setUserPermission', result.permissionsList)
    // 把当前时间戳放进cookies里 用于token时效校验
    setTimeStamp()
    // }
  },
  // 获取用户信息
  async getUserInfo(context) {
    const result = await getUserInfo()
    context.commit('setUserInfo', result)
    return result
  },
  // 给permission.js用的
  async getUserRoutersById(userId) {
    const result = await getUserRouters(userId)
    return result
  },
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
    context.commit('removeUserRouters')
    context.commit('removeUserPermission')
    context.commit('removeDYNAMIC_ROUTES')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

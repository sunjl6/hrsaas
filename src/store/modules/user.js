import { getToken, setToken, removeToken, setUseInfoToCookie, removeUserInfoFromCookie, getUserInfoFromCookie, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'
// 状态
const state = {
  token: getToken(),
  userInfo: getUserInfoFromCookie()
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
    // 把当前实际戳放进cookies里 用于token时效校验
    setTimeStamp()
    // }
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    context.commit('setUserInfo', result)
    return result
  },
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

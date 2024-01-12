import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getTimeStamp } from '@/utils/auth'
import router from 'vue-router'

// 定义一个token的时效
const timeOut = 43200
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // 在这个位置需要统一的去注入token
  if (store.getters.token) {
    if (checkTime()) {
      store.dispatch('user/logout') // 登出操作
      location.reload() // 刷新页面
      return Promise.reject(new Error('token超时了')) // 返回一个promis 错误提示
    }
    // 修改请求头信息
    // if (config.type === 'change') {
    //   config.headers['Content-Type'] = 'multipart/form-data'
    // } else {
    //   config.headers['Content-Type'] = 'application/json'
    // }
    // 如果token存在 注入token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
    config.headers['token'] = store.getters.token
  }
  return config // 必须返回配置
}, error => {
  return Promise.reject(error)
})

// response interceptor
service.interceptors.response.use(
  response => {
    const { isSuccess, msg, data, code } = response.data
    if (response.status === 200 && isSuccess === undefined) {
      return response
    } else if (isSuccess) {
      return data
    } else if (code === 40001) {
      store.dispatch('user/logout') // 登出action 删除token
      location.reload()
    } else {
      Message.error(msg)
      return Promise.reject(new Error(msg))
    }
  }, error => {
    // alert('123')
    Message.error(error)
    return Promise.reject(error)
  }
)
// 检查是否过期
function checkTime() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > timeOut
}
export default service

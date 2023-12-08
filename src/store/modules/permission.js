// 首先，从index.js中引入已经定义过的2个router数组
import { asyncRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'
// 全局变量state，routes和addRoutes数组
const state = {
  routes: [],
  addRoutes: []
}

// mutations 是唯一可以更改state的函数，使用SET_ROUTES定义更改方法，SET_ROUTES(state, routes)的入参routes赋值给addRoutes数组，将constantRoutes静态路由数组增加routes；

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = [...constantRoutes, ...routes]
  }
}

// vue中store状态管理，通过actions调用 mutations 中封装的方法来实现对于state更改，
// 这里是vue-element-admin中动态路由的主要判断逻辑发生地方，首先判定用户角色是否包含admin（可能多角色），是则将所有asyncRoutes 加入到constantRoutes，若用户角色没有包含admin，则调用filterAsyncRoutes函数，递归地判定asyncRoutes.roles属性是否有该角色，即是否有权限，将有权限的router赋值accessedRoutes 后加入到constantRoutes；

const actions = {
  generateRoutes({ commit }, asyncRouter) {
    // asyncRouter = filterAsyncRouter(asyncRouter)
    commit('SET_ROUTES', asyncRouter)
  }
}

// 把动态路由加到路由表里
function go(to, next) {
  asyncRouter = filterAsyncRouter(asyncRouter)
  router.addRoutes(asyncRouter)
  next({ ...to, replace: true })
}
// 保存到本地存储并且是jason格式
function save(name, data) {
  localStorage.setItem(name, JSON.stringify(data))
}

// Jason解析获取本地存储的内容
function get(name) {
  return JSON.parse(localStorage.getItem(name))
}

function filterAsyncRouter(routes) {
  // 刷新满足条件的结果
  return routes.filter((route) => {
    const component = route.component // 这个component是个值 例如：//salarys/index
    // 判断获取到的路由的component是否有值 有值就做处理，没用那么就是没有路由不做处理
    if (component) {
      // 有值的情况下，再判断路由的component的值是不是等于 layout 就是判断是不是最外面的根组件
      if (route.component === 'Layout') {
        // 如果是 那就直接把引入的 layout 组件赋值给他
        route.component = Layout
      } else {
        // 不是根组件，转化下根组件 把原来的 //salarys/index 通过view方法转成 动态路由组件格式: component: () => import('@/views/login/index'),
        route.component = view(component)
      }
      // 如果还有子路由 那就iu递归调用filterAsyncRouter
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children)
      }
      // 这里return true 是数组的filter用法之一，返回一个新数组这样里面的component 必定都是处理过
      return true
    }
  })
}
// 把存的component 字符串 变成懒加载的函数
// component: () => import('@/views/salarys'), 懒加载的组件都是这样的 function(path){import}
// 这个view 返回的就是加载组件的函数
// function view(path) {
//   return function(resolve) {
//     import(`@/views/${path}.vue`).then(mod => {
//       resolve(mod)
//     })
//   }
// }

function view(path) {
  return function(resolve) {
    require([`@/views/${path}.vue`], resolve)
  }
}

//   generateRoutes({ commit }, roles) {
//     return new Promise(resolve => {
//       let accessedRoutes
//       if (roles.includes('system')) {
//         accessedRoutes = asyncRoutes || []
//       } else {
//         accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
//       }
//       commit('SET_ROUTES', accessedRoutes)
//       resolve(accessedRoutes)
//     })
//   }

// -----------------
// 两个上面使用的方法
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

// export function filterAsyncRoutes(routes, roles) {
//   const res = []

//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })

//   return res
// }

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

// 权限拦截 导航守卫 路由守卫  router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面
import Layout from '@/layout'
// 定义一个动态路由
let asyncRouter
// 路由的前置守卫
router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条
  // 首先判断有无token
  if (store.getters.token) {
    //   如果有token 继续判断是不是去登录页
    if (to.path === '/login') {
      //  表示去的是登录页
      next('/') // 跳到主页
    } else {
      // 判断vuex里的 userInfo 是否有 id 信息，如果有 那么说明有数据，不调用action里的获取用户接口
      // 如果没有id 那么说明 userinfo 里面是空的 那么就要调用action里的接口获取信息并且存到vuex的state的userinfo里
      if (!store.getters.id) {
        // console.log('没有id')
        // 如果没有id这个值 才会调用 vuex的获取资料的action
        // alert('没用id')
        await store.dispatch('user/getUserInfo')
        // next({ ...to, replace: true })
        // 为什么要写await 因为我们想获取完资料再去放行
      }
      if (store.getters.routes.length) {
        // console.log(store.getters.routes)
        // router.addRoutes(store.getters.routes)
        // console.log('有router')
        next()
      } else {
        // alert('有id')
        // console.log('没用router动态添加')
        // 把后台拿到的route 和 静态的route 进行合并后，再去拿store的 routes 这时候是 合并好的
        await store.dispatch('permission/generateRoutes', store.getters.userRouters)
        // 获取本地存储里的后端获取到的路由信息
        let asyncRouter = store.getters.userRouters
        // 这里只处理下后台获取的需要动态生成路由 不处静态路由 进行转化
        asyncRouter = filterAsyncRouter(asyncRouter)
        // 这里添加store的路由已经处理过了
        router.addRoutes(store.getters.routes)
        router.addRoutes([{
          path: '/:pathMatch(.*)*',
          redirect: '/404'
        }])
        // 这里为了能显示出路由菜单
        router.options.routes = store.getters.routes
        // console.log(asyncRouter)
        next({ ...to, replace: true })
      }
      // next()
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 如果找到了 表示在在名单里面
      next()
    } else {
      next('/login') // 跳到登录页
    }
  }

  // const token = store.getters.token
  // if (token && to.path !== '/login') {
  //   // 有token 但不是去 login页面 通过
  //   console.log('有登入，并且访问的不是登入页面直接放行')
  //   // 如果没有id 那么说明 userinfo 里面是空的 那么就要调用action里的接口获取信息并且存到vuex的state的userinfo里
  //   if (!store.getters.id) {
  //     await store.dispatch('user/getUserInfo')
  //     next()
  //   } else {
  //     // console.log(router2)
  //     await store.dispatch('permission/generateRoutes', store.getters.userRouters)
  //     router.options.routes = store.getters.userRouters
  //     console.log(store.getters.routes)
  //     router.addRoutes(store.getters.routes)
  //     next()
  //     // console.log(store.getters.userRouters)
  //   }
  // } else if (token && to.path === '/login') {
  //   console.log('有登入，但是访问了登入页面，直接转到主页')
  //   // 有token 但是去 login页面 不通过 重定向到首页
  //   next('/')
  // } else if (!token && to.path !== '/login') {
  //   // 没有token 但不是去 login页面 不通过（未登录不给进入）
  //   console.log('未等入，没去登入页')
  //   if (whiteList.indexOf(to.path) > -1) {
  //     // 如果找到了 表示在在名单里面
  //     console('未登入，但是访问了白名单页面放行。')
  //     next()
  //   } else {
  //     console.log('未登入，又不是白名单，又不在登入页面，直接跳转登入页')
  //     next('/login') // 跳到登录页
  //   }
  // } else {
  //   console.log('没用登入，但是访问了登入的页面')
  //   // 剩下最后一种 没有token 但是去 login页面 通过
  //   next()
  // }
})

// 后置守卫
router.afterEach(function() {
  NProgress.done() // 关闭进度条
})

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

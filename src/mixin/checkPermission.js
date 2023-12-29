import store from '@/store'
export default {
  methods: {
    checkPermission(key) {
      const permission = store.getters.permission
      // console.log(permission)
      if (permission && permission.length) {
        // console.log(permission.some(item => item === key))
        return permission.some(item => item === key)
      }
      return false
    }
  }
}

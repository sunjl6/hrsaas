<template>
  <UploadExcel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    async  success({ header, results }) {
      // 如果是导入员工
      const userRelations = {
        '账号': 'account',
        '邮箱': 'email',
        '工号': 'employeeId',
        '手机号': 'mobile',
        '姓名': 'name',
        '密码': 'password',
        '部门': 'orgId',
        '岗位': 'stationId',
        '性别': 'sex',
        '工作描述': 'workDescribe'
      }
      const arr = []
      results.forEach(item => {
        const userInfo = {}
        console.log(item)
        Object.keys(item).forEach(key => {
          userInfo[userRelations[key]] = item[key]
        })
        arr.push(userInfo)
      })
      await importEmployee(arr) // 调用导入接口
      this.$router.back()
    }
  }
}
</script>

<style>

</style>

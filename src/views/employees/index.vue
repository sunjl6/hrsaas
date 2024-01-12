<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 通用组件部分 -->
      <page-tools :show-before="true">
        <span slot="before">一共{{ pageInfo.total }}条记录</span>
        <el-button slot="after" type="warning" @click="$router.push('/import')">导入excel</el-button>
        <el-button slot="after" type="danger" @click="exportExcel">导出所有</el-button>
        <el-button slot="after" type="primary" @click="addUserBtn">新增员工</el-button>
      </page-tools>
      <el-card>
        <!-- 列表展示员工 -->
        <el-table v-loading="loading" border :data="userList">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="name" />
          <el-table-column label="工号" sortable="" prop="employeeId" />
          <el-table-column label="账号" sortable="" prop="account" />
          <el-table-column label="工作描述" sortable="" prop="workDescribe" />
          <el-table-column label="入职时间" sortable="" prop="createTime" />
          <el-table-column label="性别" sortable="" prop="sex" :formatter="formatSex" align="center" />
          <el-table-column label="账户状态" sortable="" prop="status" :formatter="formatStatus" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                style="display: block"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="禁用"
                @change="changeUserStatus(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="230">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${scope.row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="addRoleBtn(scope.row)">角色</el-button>
              <el-button type="text" size="small" @click="delUserBtn(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination :total="pageInfo.total" :current-page="pageInfo.page" :page-size="pageInfo.size" layout="prev, pager, next" @current-change="changePage" />
        </el-row>
      </el-card>
      <!-- 新增员工对话框 -->
      <addUser :is-open-add-dialog="isOpenAddDialog" :orgs="orgs" @cancelAddDialog="cancelAddDialog" />
      <!-- 分配角色对话框 -->
      <assign-role ref="roles" :show-role-dialog.sync="isOpenRoleDialog" :user-id="userId" @closeRoleDialog="closeRoleDialog" />
    </div>
  </div>
</template>

<script>
import { getEmployeeListByPage, delUser, switchAccountStatus } from '@/api/employees'
import { getAllDepts } from '@/api/departments'
import addUser from './components/add-employee.vue'
import { formatDate } from '@/filter/index'
import EmployeeEnum from '@/api/constants/employees'
import assignRole from './components/assign-role.vue'
export default {
  components: {
    addUser,
    assignRole
  },
  data() {
    return {
      userId: '',
      currentUser: {}, // 点击角色的时候获取的id 传递给分配角色组件，用于获取这个用户的角色
      isOpenRoleDialog: false,
      orgs: [], // 所有部门的数据用于子组件select 选择
      loading: false,
      userList: [], // 表单数据
      pageInfo: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      },
      formatStatus: function(row, colunm, cellValue) {
        var ret = ''
        if (cellValue) {
          ret = '启用'
        } else {
          ret = '禁用'
        }
        return ret
      },
      formatSex: function(row, colunm, cellValue) {
        var ret = ''
        if (cellValue === 'M') {
          ret = '男'
        } else {
          ret = '女'
        }
        return ret
      },
      isOpenAddDialog: false,
      switchUserStatusDTO: {
        id: '',
        status: true
      } // 传给后台修改用户status的 dto

    }
  },
  created() {
    this.getUserListByPage()
    this.getAllOrgs()
  },
  methods: {
    // 子组件通知父组件关闭对话
    closeRoleDialog(value) {
      this.isOpenRoleDialog = false
    },
    // 点击分配角色按钮
    async addRoleBtn(row) {
      this.$refs.roles.getUserRoles(row.id)
      this.userId = row.id
      this.isOpenRoleDialog = true
    },
    // 转成excel 导出的格式需要对应表头一一对应
    formatJson(headers, rows) {
      // 首先遍历数组
      // [{ username: '张三'},{},{}]  => [[’张三'],[],[]]
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]]) // 返回格式化之前的时间
          } else if (headers[key] === 'formOfEmployment') {
            // 这里判断了 这个formOfEmployment 是 是否正式聘用的意思 如果是就 把id 替换成文字
            var en = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return en ? en.value : '未知'
          }
          return item[headers[key]]
        }) // => ["张三", "13811"，"2018","1", "2018", "10002"]
      })
      // return data
      // return rows.map(item => {
      //   // item是对象  => 转化成只有值的数组 => 数组值的顺序依赖headers  {username: '张三'  }
      //   // Object.keys(headers)  => ["姓名", "手机号",...]
      //   return Object.keys(headers).map(key => {
      //     return item[headers[key]]
      //   }) // /  得到 ['张三'，’129‘，’dd‘,'dd']
      // })
    },
    // 员工数据导出到excel的方法
    exportExcel() {
      // 定义表头对应的中文字段和英文参数
      const headers = {
        '姓名': 'name',
        '手机号': 'mobile',
        '入职日期': 'createTime',
        '工号': 'employeeId',
        '邮箱': 'email',
        '性别': 'sex',
        '工作描述': 'workDescribe'
      }
      // 懒加载的方式导入excel 导出工具 调用里excel.export_json_to_excel 的方法导出
      import('@/vendor/Export2Excel').then(async(excel) => {
        const result = await getEmployeeListByPage(1, this.pageInfo.total)
        const data = this.formatJson(headers, result.records)
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          autoWidth: true,
          filename: '员工列表',
          bookType: 'xlsx'
        })
      })
    },
    // 添加用户子组件通知父组件 关闭dialog
    cancelAddDialog() {
      this.isOpenAddDialog = false
    },
    // 获取所有部门
    async getAllOrgs() {
      const res = await getAllDepts()
      this.orgs = res
    },
    // 新增员工
    addUserBtn() {
      this.isOpenAddDialog = true
    },
    // 删除员工
    delUserBtn(row) {
      this.$confirm(`此操作将永久删除用户：${row.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delUser(row.id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getUserListByPage()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 获取员工列表
    async getUserListByPage() {
      this.loading = true
      const res = await getEmployeeListByPage({
        current: this.pageInfo.page,
        size: this.pageInfo.size
      })
      this.userList = res.records
      this.pageInfo.total = +res.total
      this.loading = false
    },
    // 点击切换页面功能
    changePage(newpage) {
      this.pageInfo.page = newpage
      this.getUserListByPage()
    },
    // 页面开启和禁用员工按钮方法
    async changeUserStatus(row) {
      this.switchUserStatusDTO.id = row.id
      this.switchUserStatusDTO.status = row.status
      await switchAccountStatus(this.switchUserStatusDTO)
    }
  }
}
</script>

  <style>
</style>

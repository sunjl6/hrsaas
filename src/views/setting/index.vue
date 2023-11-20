<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-button
              icon="el-icon-plus"
              plain
              type="primary"
              size="small"
              @click="addRole"
            >添加角色</el-button>
            <el-table
              :data="tableData"
              border=""
              size="medium"
              highlight-current-row
            >
              <el-table-column
                label="序号"
                width="120"
                prop="id"
                type="index"
                align="center"
              />
              <el-table-column
                label="角色名称"
                width="140"
                prop="name"
                align="center"
              />
              <el-table-column
                label="角色编码"
                width="180"
                prop="code"
                align="center"
              />
              <el-table-column
                label="是否内置"
                width="100"
                prop="readonly"
                align="center"
                :formatter="formatReadonly"
              />
              <el-table-column
                label="角色所属部门"
                width="120"
                prop="status"
                align="center"
              />
              <el-table-column
                label="功能描述"
                prop="describe"
                align="center"
              />
              <el-table-column
                label="状态"
                width="200"
                prop="status"
                align="center"
              >
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.status"
                    active-color="#02538C"
                    inactive-color="#B9B9B9"
                    active-text="启用"
                    inactive-text="关闭"
                    @change="changeSwitch(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                  <el-button type="success" icon="el-icon-user" circle />
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    @click="editRole(scope.row.id)"
                  />
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="delRole(scope.row.id)"
                  />
                </template>
              </el-table-column>
            </el-table>
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <el-pagination
                layout="prev, pager, next"
                :current-page="page.current"
                :total="page.total"
                :page-size="page.size"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司简介">
            <el-alert
              show-icon
              :closable="false"
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="warning"
            />
            <el-form
              :model="companyData"
              label-width="120px"
              style="margin-top: 50px"
            >
              <el-form-item label="公司名称">
                <el-input
                  v-model="companyData.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="companyData.address"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="companyData.email"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="companyData.mark"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 打开编辑角色对话的组件 -->
      <edit-role
        ref="editRoleCompnent"
        :dialog-visible="isOpenEditDialog"
        @closeEditDialog="closeEditDialog"
        @updateRoleDone="updateRoleDone"
      />
      <add-role :open-dialog="isOpenAddDialog" @closeAddRoleDialog="closeAddRoleDialog" @addRoleSuccess="addRoleSuccess" />
    </div>
  </div>
</template>

<script>
import {
  getRoleByPage,
  delRole
} from '@/api/setting'
import editRole from './components/edit-role.vue'
import addRole from './components/add-role.vue'
export default {
  components: {
    editRole,
    addRole
  },
  data() {
    return {
      tableData: [],
      companyData: {
        name: 'sunjl未来公司',
        address: '上海',
        email: 'adm@sunjl.cn',
        mark: '学习demo项目仅供参考学习使用'
      },
      page: {
        current: 1, // 当前页 这里名字要和后端接口保持一直
        size: 10, // 每页数量
        total: 0 // 总记录数
      },
      formatReadonly: function(row, colunm, cellValue) {
        var ret = ''
        if (cellValue) {
          ret = '是'
        } else {
          ret = '否'
        }
        return ret
      },
      isOpenEditDialog: false, // 控制打开编辑角色对话
      isOpenAddDialog: false // 控制打开添加角色对话框
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 添加角色添加成功后通知父组件关闭对话
    addRoleSuccess() {
      this.isOpenAddDialog = false
      this.getRoleList()
    },
    // 添加角色的子组件通知父组件关闭对话框
    closeAddRoleDialog() {
      this.isOpenAddDialog = false
      this.$message('已关闭')
    },
    // 子组件通知父组件 完成了更新角色 关闭对话框
    updateRoleDone() {
      this.isOpenEditDialog = false
      this.getRoleList()
    },
    // switch 开关触发的事件
    changeSwitch(row) {

    },
    // 子组件通知父组件关闭编辑对话框
    closeEditDialog() {
      this.isOpenEditDialog = false
    },
    async getRoleList() {
      const res = await getRoleByPage(this.page)
      this.tableData = res.records
      this.page.total = +res.total
    },
    changePage(newPage) {
      this.page.current = newPage
      this.getRoleList()
    },
    async delRole(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await delRole(id)
          this.getRoleList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async editRole(id) {
      this.isOpenEditDialog = true
      this.$refs.editRoleCompnent.getRoleInfo(id)
    },
    addRole() {
      this.isOpenAddDialog = true
    }
  }
}
</script>

  <style>
</style>

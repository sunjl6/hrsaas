<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="基本设置">
            <!-- 内容 -->
            <el-form ref="updateUser" :model="userData" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="ID" prop="id">
                <el-input v-model="userData.id" style="width:300px" disabled />
              </el-form-item>
              <el-form-item label="名字" prop="name">
                <el-input v-model="userData.name" style="width:300px" disabled />
              </el-form-item>
              <el-form-item label="账号" prop="account">
                <el-input v-model="userData.account" style="width:300px" disabled />
              </el-form-item>
              <el-form-item label="旧密码" prop="oldPassword">
                <el-input v-model="userData.oldPassword" type="password" style="width:300px" />
              </el-form-item>
              <el-form-item label="新密码" prop="password">
                <el-input v-model="userData.password" type="password" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码确认" prop="confirmPassword">
                <el-input v-model="userData.confirmPassword" type="password" style="width:300px" />
              </el-form-item>
              <el-form-item style="margin-left: 70px; margin-top:30px">
                <el-button @click="$router.back()">取消</el-button>
                <el-button type="primary" @click="confirmBtn">确认</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人信息">
            <!-- 内容 -->
            <user-info :user-info="userData" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <!-- 内容 -->
            <job-info />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserById, updatePasswordByAdmin } from '@/api/employees'
import userInfo from './components/user-info.vue'
import jobInfo from './components/job-info.vue'
export default {
  components: {
    userInfo,
    jobInfo
  },
  data() {
    return {
      userData: {
        id: this.$route.params.id,
        account: '',
        name: '',
        oldPassword: '',
        password: '',
        confirmPassword: '',
        createTime: '',
        employeeId: '',
        mobile: '',
        orgName: '',
        avatar: ''
      },
      rules: {
        oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
        confirmPassword: [{ required: true, message: '再次确认密码不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserById(this.userData.id)
  },
  methods: {
    confirmBtn() {
      this.$refs.updateUser.validate((isok) => {
        if (isok) {
          alert(123)
          this.$confirm('确认提交修改密码, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            await updatePasswordByAdmin(this.userData)
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.logout()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消修改'
            })
          })
        } else {
          this.$message('请正确填写表单')
        }
      })
    },
    async getUserById(id) {
      const result = await getUserById(id)
      this.userData = result
      this.createTime = new Date(result.createTime)
      this.userData.password = ''
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      // 可用刷新页面或者跳转路由 因为permission.js里已经定义了 没用token 会强制跳转到login
      location.reload()
    }
  }
}
</script>

    <style>
  </style>


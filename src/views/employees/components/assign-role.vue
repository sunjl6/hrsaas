<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="$emit('closeRoleDialog')">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <!-- 分配角色 -->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{
          item.name
        }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="confirmRolesBtn">确定</el-button>
        <el-button size="small" @click="$emit('closeRoleDialog')">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { roleList, assignRoles } from '@/api/role'
import { getUserDetailById } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      userData: {
        'full': true,
        'org': true,
        'roles': true,
        'station': true
      }, // 查询用户详细的参数
      list: [], // 角色列表
      roleIds: []
    }
  },
  created() {
    this.getAllRoles()
  },
  methods: {
    // 提交修改角色
    async confirmRolesBtn() {
      await assignRoles(this.userId, this.roleIds)
      this.$message.success('添加角色成功')
      this.$emit('closeRoleDialog')
    },
    // 更具userid 获取角色
    async getUserRoles(id) {
      const res = await getUserDetailById(id, this.userData)
      const roles = res.roles
      this.roleIds = roles.map((item) => { return item.id })
    },
    // 获取所有角色
    async getAllRoles() {
      const RolesList = await roleList()
      this.list = RolesList
    }
  }
}
</script>
<style>
</style>


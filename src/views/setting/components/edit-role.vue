<template>
  <el-dialog title="编辑角色" :visible="dialogVisible" @close="close">
    <!-- 内容区域 -->
    <el-form v-loading="loading" :model="formData">
      <el-form-item label="ID" label-width="120px" prop="id">
        <el-input v-model="formData.id" style="width: 80%" disabled />
      </el-form-item>
      <el-form-item label="角色名称" label-width="120px" prop="name">
        <el-input v-model="formData.name" style="width: 80%" />
      </el-form-item>
      <el-form-item label="角色代码" label-width="120px" prop="code">
        <el-input v-model="formData.code" style="width: 80%" />
      </el-form-item>
      <el-form-item label="角色描述" label-width="120px" prop="describe">
        <el-input v-model="formData.describe" style="width: 80%" />
      </el-form-item>
    </el-form>
    <!-- footer 部分 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="updateRoleBtn">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleById, updateRole } from '@/api/setting'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      formData: {},
      loading: true
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeEditDialog')
    },
    // 获取角色信息
    async getRoleInfo(id) {
      this.loading = true
      const res = await getRoleById(id)
      this.formData = res
      this.loading = false
    },
    // 点击确定提交修改按钮事件
    async updateRoleBtn() {
      await updateRole(this.formData)
      this.$emit('updateRoleDone')
      this.$message.success('修改成功')
    },
    close() {
      this.formData.id = ''
      this.formData.name = ''
      this.formData.describe = ''
      this.formData.code = ''
      this.$emit('closeEditDialog')
    }
  }

}
</script>

<style scoped>
</style>

<template>
  <el-dialog title="编辑角色" :visible="openDialog">
    <!-- 内容区域 -->
    <el-form :model="formData">
      <!-- <el-form-item label="ID" label-width="120px" prop="id">
        <el-input v-model="formData.id" style="width: 80%" disabled />
      </el-form-item> -->
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
        <el-button size="mini" @click="close">取 消</el-button>
        <el-button size="mini" type="primary" @click="addRole">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { insertRole } from '@/api/setting'
export default {
  props: {
    openDialog: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      formData: {}
    }
  },
  methods: {
    async addRole() {
      await insertRole(this.formData)
      this.$message.success('添加角色成功')
      this.$emit('addRoleSuccess')
    },
    close() {
      this.$emit('closeAddRoleDialog')
    }
  }
}
</script>

<style>

</style>

<template>
  <el-dialog
    title="编辑菜单权限"
    :visible="isOpenEditMenuePermissionDialog"
    @close="closeEditMenuPermissionDialogBtn"
  >
    <!-- 输入框 -->
    <el-form ref="editForm" :model="menu" label-width="120px" :rules="rules">
      <el-form-item label="父ID" prop="parentId">
        <el-input v-model="menu.parentId" style="width: 80%" disabled />
      </el-form-item>
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="menu.name" style="width: 80%" placeholder="对应页面菜单显示的名称" />
      </el-form-item>
      <el-form-item label="路径" prop="path">
        <el-input v-model="menu.path" style="width: 80%" placeholder="对应路由里的菜单路径 例如：/xxx" />
      </el-form-item>
      <el-form-item label="组件" prop="component">
        <el-input v-model="menu.component" style="width: 80%" placeholder="对应页面组件路径 例如：/xxx/index" />
      </el-form-item>
      <el-form-item label="是否公开" prop="isPublice">
        <template>
          <el-radio v-model="menu.isPublic" :label="true">是</el-radio>
          <el-radio v-model="menu.isPublic" :label="false">否</el-radio>
        </template>
      </el-form-item>

      <el-form-item label="图标" prop="icon">
        <el-input v-model="menu.icon" style="width: 80%" placeholder="字体图标例如：el-icon-guide" />
      </el-form-item>
      <el-form-item label="菜单描述" prop="describe">
        <el-input v-model="menu.describe" type="textarea" :row="3" style="width: 80%" />
      </el-form-item>
    </el-form>

    <!-- footer部分 -->
    <span slot="footer" class="dialog-footer">
      <el-row type="flex" justify="center">
        <el-col :span="10">
          <el-button @click="closeEditMenuPermissionDialogBtn">取 消</el-button>
          <el-button type="primary" @click="editPermissionBtn">确 定</el-button>
        </el-col>
      </el-row>

    </span>
  </el-dialog>
</template>

<script>
import { getMenuById, editMenu } from '@/api/permisson'
export default {
  props: {
    isOpenEditMenuePermissionDialog: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      menu: {
        'component': '',
        'describe': '',
        'group': '',
        'icon': '',
        'isEnable': true,
        'isPublic': false,
        'name': '',
        'parentId': '',
        'path': '',
        'sortValue': 0
      },
      rules: {}
    }
  },
  created() {
  },
  methods: {
    // 根据id获取菜单内容回显
    async getMenuById(id) {
      const res = await getMenuById(id)
      this.menu = res
    },
    // 确认修改提交按钮事件
    async editPermissionBtn() {
      await editMenu(this.menu)
      this.$message.success('修改成功')
      this.$emit('closeEditPermDiag')
    },
    // 关闭对话
    closeEditMenuPermissionDialogBtn() {
      this.$emit('closeEditPermDiag')
    }
  }
}
</script>

<style>

</style>

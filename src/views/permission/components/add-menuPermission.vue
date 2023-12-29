<template>
  <el-dialog
    title="新增菜单权限"
    :visible="isOpenAddMenuePermissionDialog"
    @close="closeAddMenuPermissionDialogBtn"
  >
    <!-- 输入框 -->
    <el-form ref="addForm" :model="menu" label-width="120px" :rules="rules">
      <el-form-item label="父ID" prop="parentId">
        <el-input v-model="parentId" style="width: 80%" disabled />
      </el-form-item>
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="menu.name" style="width: 80%" placeholder="对应页面菜单显示的名称" />
      </el-form-item>
      <el-form-item label="路径" prop="path">
        <el-input v-model="menu.path" style="width: 80%" placeholder="对应路由里的菜单路径 例如：/activiti/deployment" />
      </el-form-item>
      <el-form-item label="组件" prop="component">
        <el-input v-model="menu.component" style="width: 80%" placeholder="对应页面组件路径 例如：setting/index" />
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
          <el-button @click="closeAddMenuPermissionDialogBtn">取 消</el-button>
          <el-button type="primary" @click="addPermissionBtn">确 定</el-button>
        </el-col>
      </el-row>

    </span>
  </el-dialog>
</template>

<script>
import { addMenu } from '@/api/permisson'
export default {
  props: {
    isOpenAddMenuePermissionDialog: {
      type: Boolean,
      required: true
    },
    parentId: {
      type: String,
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
  watch: {
    parentId(newValue) {
      this.menu.parentId = newValue
    }
  },
  methods: {
    // 添加权限按钮执行
    async addPermissionBtn() {
      await addMenu(this.menu)
      this.$message.success('添加成功')
      this.$emit('closeMenuDialog')
    },
    // 这是关闭前执行的方法
    // handleClose(done) {
    // },
    // 取消对话框关闭
    closeAddMenuPermissionDialogBtn() {
      this.$emit('closeMenuDialog')
    }
  }
}
</script>

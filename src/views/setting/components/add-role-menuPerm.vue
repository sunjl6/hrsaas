<template>
  <el-dialog v-loading="loading" title="分配权限" :visible="isOpenAddRolePermissionDialog">
    <el-card>
      <span>分配菜单按钮</span>
      <el-tree
        ref="tree"
        :data="menuTree"
        show-checkbox
        :default-expand-all="false"
        node-key="id"
        highlight-current
        :props="defaultProps"
        :default-checked-keys="menuCheckedArr"
        @check-change="handleCheckChange"
      />
    </el-card>
    <!-- footer部分 -->
    <el-row slot="footer" type="flex" align="center">
      <el-col :span="12">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addRolePermBtn">确 定</el-button>
      </el-col>
    </el-row>

  </el-dialog>
</template>

<script>
import { getMenuAndResourcesIdListByRoleId, assignRolePermission } from '@/api/permisson'
export default {
  props: {
    isOpenAddRolePermissionDialog: {
      type: Boolean,
      require: true
    },
    // eslint-disable-next-line vue/require-default-prop
    menuTree: {
      type: Array,
      require: true
    },
    // eslint-disable-next-line vue/require-default-prop
    roleId: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      resourceIdList: [], // 用于提交权限参数不能省
      loading: false, // 加载开关
      menuCheckedArr: [], // 存放默认选中的内容的数组
      menuIdlist: [], // 存放需要分配的菜单权限id
      defaultProps: {
        children: 'children',
        label: 'label'
      } // 树结构 子成员
    }
  },
  created() {
  },
  methods: {
    // 获取所有节点方法
    getAllMenu() {
      const res = this.$refs.tree.getCheckedNodes()
      const menuArr = []
      res.forEach((item) => {
        menuArr.push(item.id)
      })
      this.menuIdlist = menuArr
    },
    // 通过id 获取角色所有菜单 获取数据并且把里的id给默认的树选中的值的数组
    async getMenuById(roleId) {
      this.loading = true
      const res = await getMenuAndResourcesIdListByRoleId(roleId)
      this.menuCheckedArr = res.menuIdList
      this.resourceIdList = res.resourceIdList
      this.loading = false
    },
    // 节点选中状态发生变化时的回调
    handleCheckChange(data, checked, indeterminate) {
      const res = this.$refs.tree.getCheckedNodes()
      const result = []
      res.forEach((item) => {
        result.push(item.id)
      })
      this.menuIdList = result

      // 获取所有选中的节点 end
    },
    getCheckedNodes() {
      console.log(this.$refs.tree.getCheckedNodes())
    },
    getCheckedKeys() {
      console.log(this.$refs.tree.getCheckedKeys())
    },
    setCheckedNodes() {
      this.$refs.tree.setCheckedNodes([])
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys([])
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    },
    // 提交角色分配权限方法
    async addRolePermBtn() {
      console.log(this.menuIdList)
      await assignRolePermission({ menuIdList: this.menuIdList, resourceIdList: this.resourceIdList, roleId: this.roleId })
      this.$message.success('分配菜单成功')
      this.closeDialog()
    },
    // 关闭次对话框
    closeDialog() {
      this.$emit('closeAddRolePermDialog')
      this.menuCheckedArr = []
    }
  }
}
</script>

<style>

</style>

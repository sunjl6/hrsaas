<template>
  <el-dialog v-loading="loading" title="分配API权限" :visible="isOpenAddResourcePermissionDialog">
    <el-card>
      <span>分配API权限</span>
      <el-tree
        ref="tree"
        :data="resourceTree"
        show-checkbox
        :default-expand-all="false"
        node-key="id"
        highlight-current
        :props="defaultProps"
        :default-checked-keys="resourceCheckedArr"
        @check-change="handleCheckChange"
      />
    </el-card>
    <!-- footer部分 -->
    <el-row slot="footer" type="flex" align="center">
      <el-col :span="12">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addResourcePermBtn">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getMenuAndResourcesIdListByRoleId, assignRolePermission } from '@/api/permisson'
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    resourceTree: {
      type: Array,
      require: true
    },
    isOpenAddResourcePermissionDialog: {
      type: Boolean,
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
      loading: false, // 加载开关
      resourceCheckedArr: [], // 存放默认选中api权限的数组
      resourceIdList: [], // 存放需要分配的api权限id
      menuIdList: [], // 由于提交的参数是 菜单和权限2个id 数组所有这里再定义一个提交的时候不会报错
      defaultProps: {
        children: 'children',
        label: 'name'
      } // 树结构 子成员
    }
  },
  methods: {
    // 通过id 获取已有的权限并且给tree 设置默认选中
    async getResourceListIdsByRoleId(roleId) {
      this.loading = true
      const res = await getMenuAndResourcesIdListByRoleId(roleId)
      this.resourceCheckedArr = res.resourceIdList
      this.menuIdList = res.menuIdList
      this.loading = false
    },
    closeDialog() {
      this.$emit('closeResourceDialog')
      this.resourceCheckedArr = []
    },
    // 提交权限修改按钮
    async addResourcePermBtn() {
      this.loading = true
      await assignRolePermission({ menuIdList: this.menuIdList, resourceIdList: this.resourceIdList, roleId: this.roleId })
      this.$message.success('分配api权限成功')
      this.resourceCheckedArr = []
      this.closeDialog()
      this.loading = false
    },
    // 树结构有数据变化的钩子函数
    handleCheckChange(data, checked, indeterminate) {
      this.loading = true
      const res = this.$refs.tree.getCheckedNodes()
      const menuArr = []
      res.forEach((item) => {
        menuArr.push(item.id)
      })
      this.resourceIdList = menuArr
      // 获取所有选中的节点 end
      this.loading = false
    }
  }
}
</script>

<style>

</style>

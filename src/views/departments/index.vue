<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构头部 -->
      <el-card class="tree-card">
        <!-- 最上面的公司名称和添加部门 -->
        <tree-tools :is-root="true" :tree-node="company" @openDialog="openDialog" />
        <!-- 下面的树形展示 -->
        <el-tree
          :data="departs"
          show-checkbox
          :props="defaultProps"
          default-expand-all
        >
          <tree-tools slot-scope="{ data }" :tree-node="data" @delDept="delDept" @openDialog="openDialog" @editDialog="editDialog" />
        </el-tree>
      </el-card>
    </div>
    <!-- 新增弹层组件 -->
    <add-dept :show-dialog="showDialog" :tree-node="treeNode" @closeDialog="closeDialog" @addDeptFinsihed="getAllDepartment" />
    <!-- 编辑弹出层，因为编辑弹出层多条必要的属性和 新增的有点区别所有这里不复用了新建一个 -->
    <edit-dept ref="editDept" :show-edit-dialog="showEditDialog" :tree-node="treeNode" @closeDialog="closeDialog" @editDeptFinsihed="getAllDepartment" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import addDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import editDept from './components/edit-dept.vue'
export default {
  components: {
    TreeTools,
    addDept,
    editDept
  },
  data() {
    return {
      company: { name: 'sunjl未来公司', manager: '描述' },
      // departs: [{ name: '总裁办', children: [{ name: '董事会' }, { name: '理事会' }] },
      //   { name: '行政部' }, { name: '人事部' }],
      departs: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeNode: {},
      showDialog: false, // 控制显示新增对话框
      showEditDialog: false // 控制修改对话框
    }
  },
  created() {
    this.getAllDepartment()
  },
  methods: {
    closeDialog() {
      this.showDialog = false
      this.showEditDialog = false
    },
    // 子通知父亲 打开 新增对话框的自定义事件
    openDialog(treeNode) {
      this.showDialog = true
      this.treeNode = treeNode
    },
    // 子通知父亲 需要打开编辑的dialog对话框
    editDialog(treeNode) {
      this.showEditDialog = true
      this.treeNode = treeNode
      // 这里通过ref获取子组件，调用子组件的获取部分方法，把id 传进去，避免prop 异步拿不到id的问题
      this.$refs.editDept.getDepartmentsById(treeNode.id)
    },
    // 子组件通知我父组件有部门删除了 重新获取下数据
    delDept() {
      this.getAllDepartment()
    },
    async getAllDepartment() {
      const result = await getDepartments()
      this.departs = result
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>

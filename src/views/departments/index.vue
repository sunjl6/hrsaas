<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构头部 -->
      <el-card class="tree-card">
        <!-- 最上面的公司名称和添加部门 -->
        <tree-tools :isRoot="true" :treeNode="company"></tree-tools>
        <!-- 下面的树形展示 -->
        <el-tree
          :data="departs"
          show-checkbox
          :props="defaultProps"
        >
          <tree-tools slot-scope="{ data }" :treeNode="data"  @updateDept="updateDept"></tree-tools>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
export default {
  components: {
    TreeTools
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
      }
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 通知父组件刷下数据
    updateDept() {
      this.getDepartments()
    },
    async getDepartments() {
      const result = await getDepartments()
      console.log(result)
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

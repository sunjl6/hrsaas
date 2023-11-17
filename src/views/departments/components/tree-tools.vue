<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <!-- 左侧 -->
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!-- 右侧 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>
          <!-- 这里写负责人 -->
          <span>{{ treeNode.manager }}</span>
        </el-col>
        <el-col>
          <el-dropdown @command="operateDepts">
            <span> 操作 &nbsp; <i class="el-icon-arrow-down" /> </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">修改部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    treeNode: {
      type: Object, // 对象类型
      required: true// 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShowDialog: false
    }
  },
  methods: {
    operateDepts(type) {
      if (type === 'add') {
        // 添加部门
        this.$emit('openDialog', this.treeNode)
      } else if (type === 'edit') {
        this.$emit('editDialog', this.treeNode)
        // 修改部门
      } else {
        // 删除部门
        this.$confirm(`你确定要删除：${this.treeNode.name} 吗？`).then(() => {
          return delDepartments(this.treeNode.id)
        }).then(() => {
          this.$emit('delDept')
          this.$message(`删除：${this.treeNode.name} 成功！`)
        }).catch(() => {
          this.$message('取消删除')
        })
      }
    }
  }
}
</script>

<style scoped>
</style>

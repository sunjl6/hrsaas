<template>
  <el-dialog
    title="新增权限"
    :visible="isOpenAddResourceDialog"
    @close="closeResourceDialog"
  >
    <!-- 需要添加的内容部分 -->
    <el-form :model="resource" label-width="120px">
      <el-form-item label="权限标识符" prop="code">
        <el-input v-model="resource.code" placeholder="示例：upload:add" />
      </el-form-item>
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="resource.name" />
      </el-form-item>
      <el-form-item label="所属菜单" prop="menuId">
        <el-tree
          ref="tree"
          :data="tableDataMenu"
          check-strictly
          show-checkbox
          node-key="id"
          :props="defaultProps"
          @check-change="handleCheckChange"
        />
      </el-form-item>
      <el-form-item label="请求方法" prop="method">
        <el-select v-model="resource.method" placeholder="请选择">
          <el-option
            v-for="item in methods"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="权限url" prop="url">
        <el-input v-model="resource.url" placeholder="示例：/resource" />
      </el-form-item>
      <el-form-item label="权限描述" prop="describe">
        <el-input v-model="resource.describe" type="textarea" placeholder="请输入文字描述" />
      </el-form-item>
    </el-form>
    <!-- footer 部分 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeResourceDialog">取 消</el-button>
      <el-button type="primary" @click="addResourcePermBtn">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addResource } from '@/api/permisson'
export default {
  props: {
    isOpenAddResourceDialog: {
      type: Boolean,
      require: true
    },
    tableDataMenu: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label',
        disabled: function(data, node) {
          if (data.children && data.children.length > 0) {
            return true
          } else {
            return false
          }
        }
      }, // 树状图的child
      resource: {
        'id': '',
        'code': '',
        'describe': '',
        'menuId': 0,
        'method': '',
        'name': '',
        'url': ''
      },
      methods: [
        { value: 'GET',
          label: 'GET' },
        { value: 'POST',
          label: 'POST' },
        { value: 'PUT',
          label: 'PUT' },
        { value: 'DELETE',
          label: 'DELETE' }
      ]
    }
  },
  methods: {
    handleCheckChange(data, checked) { // 子级只能单选
      if (checked) {
        this.resource.menuId = data.id
        this.resource.id = data.id
        this.$refs.tree.setCheckedKeys([data.id], true)
      } else {
        this.resource.id = null
      }
    },
    // 添加权限请求方法
    async addResourcePermBtn() {
      this.resource.id
      await addResource(this.resource)
      this.$message.success('创建api权限成功')
      this.$emit('closeAddResourceDialog')
    },
    // 关闭对话框方法
    closeResourceDialog() {
      this.$emit('closeAddResourceDialog')
    }
  }
}
</script>

<style>

</style>

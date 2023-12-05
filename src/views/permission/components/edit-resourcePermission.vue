<template>
  <el-dialog
    title="编辑api权限"
    :visible="isOpenEditResourceDialog"
  >
    <!-- 表单部分 -->
    <el-form v-loading="loading" :model="resource" label-width="120px">
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
          :default-checked-keys="[resource.menuId]"
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
      <el-button @click="closeEditResourceDialogBtn">取 消</el-button>
      <el-button type="primary" @click="editResourcePermBtn">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getResourceById, editResource } from '@/api/permisson'
export default {
  props: {
    isOpenEditResourceDialog: {
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
      loading: true,
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
    // 根据id 查询权限 回显到编辑对话框
    async getResourceById(id) {
      this.loading = true
      const res = await getResourceById(id)
      this.resource = res
      this.loading = false
    },
    handleCheckChange(data, checked) { // 子级只能单选
      if (checked) {
        // this.resource.menuId = data.id
        // this.resource.id = data.id
        this.$refs.tree.setCheckedKeys([data.id], true)
        this.resource.menuId = data.id
      } else {
        // this.resource.id = null
        this.resource.menuId = 0
      }
    },
    // 关闭编辑api对话框方法
    closeEditResourceDialogBtn() {
      this.$emit('closeEditResourceDialog', 'api') // 传api 是告诉父组件，当前tab 激活页面停留在名字叫api的tab栏上,当然也子父组件的自定义绑定事件里写，随意，
    },
    // 提交修改api权限方法
    async editResourcePermBtn() {
      await editResource(this.resource)
      this.$message.success('提交修改成功')
      this.$emit('closeEditResourceDialog')
    }
  }
}
</script>

<style>

</style>

<template>
  <el-dialog title="编辑部门" :visible="showEditDialog" @close="closeThisDialog">
    <!-- 内容区域 -->
    <el-form
      ref="deptForm"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="ID">
        <el-input
          v-model="formData.id"
          style="width: 80%"
          placeholder="1-50个字符"
          disabled
        />
      </el-form-item>
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="简称" prop="abbreviation">
        <el-input
          v-model="formData.abbreviation"
          style="width: 80%"
          placeholder="部门缩写 例如：销售部 XS"
        />
      </el-form-item>
      <el-form-item label="部门排序" prop="sortValue">
        <el-input
          v-model="formData.sortValue"
          style="width: 80%"
          placeholder="数字越小越靠前"
        />
      </el-form-item>
      <el-form-item label="部门描述" prop="describe">
        <el-input
          v-model="formData.describe"
          type="textarea"
          style="width: 80%"
          placeholder="1-300个字符"
          :row="3"
        />
      </el-form-item>
    </el-form>
    <div v-loading="loading" class="dashboard-container" />
    <!-- foot区域 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="mini" @click="closeThisDialog">取消</el-button>
        <el-button type="primary" size="mini" @click="btnOK">确认</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import {
  // getDepartmentsByPid,
  // getDepartmentsByCode,
  getDepartmentsById,
  editDepartment
} from '@/api/departments'
export default {
  props: {
    showEditDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object, // 对象类型
      required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    }
  },
  data() {
    // 自定义校验规则 校验部门是否重复
    // const checkNameRepeat = async(rule, value, callback) => {
    //   const orgs = await getDepartmentsByPid(`${this.formData.parentId}`)
    //   const isExist = orgs.some((item) => item.name === this.formData.name)
    //   isExist ? callback(new Error(`组织架构中已:${value}`)) : callback()
    // }
    // // 自定义校验规则 校验部门代码是否重复
    // const checkCodeRepeat = async(rule, value, callback) => {
    //   const orgs = await getDepartmentsByCode(this.formData.abbreviation)
    //   const isExist = orgs.some(
    //     (item) => item.abbreviation === this.formData.abbreviation
    //   )
    //   isExist ? callback(new Error(`组织架构中已存在:${value}`)) : callback()
    // }
    return {
      loading: false,
      formData: {
        abbreviation: '', // 简称
        describe: '', // 部门描述
        name: '', // 部门名称
        parentId: '', // 父ID
        sortValue: 0, // 排序
        id: null
        // status: true 状态
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 20, message: '长度不能超过20' }
          // { triiger: 'blur', validator: checkNameRepeat }
        ],
        abbreviation: [
          { required: true, message: '简写名称不能为空', trigger: 'blur' },
          { min: 1, max: 10, message: '长度不能超过10' }
          // { triiger: 'blur', validator: checkCodeRepeat }
        ],
        sortValue: [
          {
            type: 'number',
            transform: (value) => Number(value),
            min: 0,
            max: 100,
            message: '0-100之间',
            trigger: 'blur'
          }
        ],
        describe: [
          { required: true, message: '部门描述不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '长度不能超过300' }
        ]
      }
    }
  },
  created() {},
  methods: {
    async getDepartmentsById(id) {
      this.loading = true
      const res = await getDepartmentsById(id)
      this.formData.id = res.id
      this.formData.abbreviation = res.abbreviation
      this.formData.name = res.name
      this.formData.parentId = res.parentId
      this.formData.sortValue = res.sortValue
      this.formData.describe = res.describe
      this.loading = false
    },
    btnOK() {
      this.$refs.deptForm.validate(async(isok) => {
        if (isok) {
          await editDepartment(this.formData) // 发送修改部门请求
          this.$message.success(`修改：${this.formData.name} 成功`)
          this.$emit('closeDialog') // 告诉父组件 关闭窗口
          this.$emit('editDeptFinsihed') // 告诉父组件重新获取所有部门数据
        } else {
          this.$message('请正确填写表单')
        }
      })
    },
    closeThisDialog() {
      this.formData.parentId = ''
      this.formData.id = ''
      this.formData.name = ''
      this.formData.describe = ''
      this.formData.abbreviation = ''
      this.sortValue = 0
      this.$refs.deptForm.resetFields()
      this.$emit('closeDialog')
    }
  }
}
</script>

  <style scoped>
</style>

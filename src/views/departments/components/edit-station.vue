<template>
  <el-dialog title="修改岗位信息" :visible="isShowEditDialog">
    <el-form ref="stationForm" :model="formData" :rules="rules">
      <el-form-item label="父节点ID" prop="parentId">
        <el-input v-model="formData.parentId" style="width: 80%" placeholder="" disabled />
      </el-form-item>
      <el-form-item label="岗位的ID" prop="id">
        <el-input v-model="formData.id" style="width: 80%" placeholder="" disabled />
      </el-form-item>
      <el-form-item label="岗位名称" prop="name">
        <el-input v-model="formData.name" style="width: 80%" placeholder="" />
      </el-form-item>
      <el-form-item label="所属部门" prop="orgId">
        <el-select v-model="formData.orgId" placeholder="请选择">
          <el-option
            v-for="item in orgList"
            :key="item.value"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="岗位描述" prop="describe">
        <el-input
          v-model="formData.describe"
          type="textarea"
          placeholder="1-300个字符"
          :row="3"
          style="width: 80%"
        />
      </el-form-item>
    </el-form>
    <!-- footer区域 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" plain @click="closeDialog">取消</el-button>
        <el-button type="success" plain @click="confirmBtn">确定</el-button>
      </el-col>
    </el-row>

  </el-dialog>
</template>

<script>
import { editStation, getStationById } from '@/api/stations'
export default {
  props: {
    isShowEditDialog: {
      type: Boolean,
      require: true,
      default: false
    },
    orgList: {
      type: Array,
      require: true,
      default: null
    }
  },
  data() {
    return {
      formData: {
        describe: null,
        name: null,
        orgId: null,
        parentId: null,
        id: null
      },
      rules: {
        id: [
          { required: true, message: 'id不能为空', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '岗位名称不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '岗位名称不能为空', trigger: 'blur' },
          { min: 1, max: 20, message: '长度不能超过20' }
        ],
        orgId: [
          { required: true, message: '必须选择所在部门', trigger: 'blur' }
        ],

        describe: [
          { required: true, message: '部门描述不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '长度不能超过300' }
        ]
      }
    }
  },
  methods: {

    // 根据id 获取岗位信息
    async getStationById(id) {
      const res = await getStationById(id)
      this.formData = res
    },
    // 提交表单
    async confirmBtn() {
      this.$refs.stationForm.validate(async(isok) => {
        if (isok) {
          await editStation(this.formData)
          this.$message.success('修改成功')
          this.closeDialog()
        } else {
          this.$message('请正确填写表单')
        }
      })
    },

    // 通知父组件关闭对话框
    closeDialog() {
      this.$emit('closeEditStation')
      this.formData = {}
    }
  }
}
</script>

  <style scoped>

  </style>


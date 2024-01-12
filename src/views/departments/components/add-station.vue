<template>
  <el-dialog title="新增岗位" :visible="isShowAddDialog">
    <el-form ref="stationForm" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="父节点ID" prop="parentId">
        <el-input v-model="formData.parentId" style="width: 80%" placeholder="" disabled />
      </el-form-item>
      <el-form-item label="所属岗位" prop="parentId">
        <el-input v-model="parentName" style="width: 80%" placeholder="" disabled />
      </el-form-item>
      <el-form-item label="岗位名称" prop="name">
        <el-input v-model="formData.name" style="width: 80%" placeholder="" />
      </el-form-item>
      <el-form-item label="level" prop="level">
        <el-select v-model="formData.level" placeholder="请选择level">
          <el-option
            v-for="item in levels"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
import { addStation } from '@/api/stations'
export default {
  props: {
    isShowAddDialog: {
      type: Boolean,
      require: true,
      default: false
    },
    orgList: {
      type: Array,
      require: true,
      default: null
    },
    parentId: {
      type: String,
      require: true,
      default: '0'
    },
    parentName: {
      type: String,
      require: true,
      default: '无'
    }
  },
  data() {
    return {
      // 职位的level 等级
      levels: [{
        value: '1',
        label: '普通员工'
      }, {
        value: '2',
        label: '主管'
      }, {
        value: '3',
        label: '经理'
      }, {
        value: '4',
        label: '总监'
      }],
      value: '',
      formData: {
        describe: null,
        name: null,
        orgId: null,
        parentId: this.parentId
      },
      rules: {
        level: [{ required: true, message: '岗位level不能为空', trigger: 'blur' }],
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
  watch: {
    parentId(value) {
      this.formData.parentId = value
    },
    parentName(value) {
      this.parentName = value
    }
  },
  methods: {
    // 提交表单
    async confirmBtn() {
      this.$refs.stationForm.validate(async(isok) => {
        if (isok) {
          await addStation(this.formData)
          this.$message.success('添加成功')
          this.closeDialog()
        } else {
          this.$message('请正确填写表单')
        }
      })
    },

    // 通知父组件关闭对话框
    closeDialog() {
      this.$emit('closeAddStation')
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <el-dialog title="新增员工" :visible="isOpenAddDialog" @close="closeAddDialog">
    <!-- 表单区域 -->
    <el-form ref="addForm" :model="FormData" label-width="120px" :rules="rules">
      <el-form-item label="用户账号" prop="account">
        <el-input v-model="FormData.account" style="width: 80%" />
      </el-form-item>
      <el-form-item label="初始密码" prop="password">
        <el-input v-model="FormData.password" style="width: 80%" />
      </el-form-item>
      <el-form-item label="用户名称" prop="name">
        <el-input v-model="FormData.name" style="width: 80%" />
      </el-form-item>
      <el-form-item label="用户工号" prop="employeeId">
        <el-input v-model="FormData.employeeId" style="width: 80%" placeholder="暂不校验，根据实际企业工号定义规则后台自动生成，这里仅做展示" />
      </el-form-item>
      <el-form-item label="性别" prop="code">
        <template>
          <el-radio v-model="FormData.sex" label="M">男</el-radio>
          <el-radio v-model="FormData.sex" label="W">女</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="所属部门" prop="orgId">
        <el-select v-model="FormData.orgId" placeholder="请选择部门" @change="changeOrg">
          <el-option
            v-for="item in orgs"
            :key="item.value"
            :label="item.name"
            :value="item.id"
          />
        </el-select></el-form-item>
      <el-form-item label="岗位" prop="stationId">
        <el-select v-model="FormData.stationId" placeholder="请选择岗位" clearable>
          <el-option
            v-for="item in stations"
            :key="item.value"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="FormData.mobile" style="width: 80%" />
      </el-form-item>
      <el-form-item label="邮箱地址" prop="email">
        <el-input v-model="FormData.email" style="width: 80%" />
      </el-form-item>
      <el-form-item label="工作描述" prop="workDescribe">
        <el-input v-model="FormData.workDescribe" type="textarea" :row="3" style="width: 80%" />
      </el-form-item>
    </el-form>
    <!-- foot区域 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="12">
        <el-button size="mini" @click="closeDialog">取消</el-button>
        <el-button size="mini" @click="btnOK">确认</el-button>
        <el-button size="mini" @click="restForm">重置</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { addUser } from '@/api/employees'
import { getStationsByOrgId } from '@/api/stations'
export default {
  props: {
    isOpenAddDialog: {
      type: Boolean,
      required: true
    },
    // 所有部门数据
    orgs: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      stations: [], // 根据部门id 获取到的所有岗位
      FormData: {
        account: '',
        email: '',
        employeeId: '', // 员工工号应该由后台 系统的生成 例如 公司的区域 职能 部门 等代码组合而成，这里我们随意写，确保唯一
        mobile: '',
        name: '',
        password: '',
        sex: '', // 编码,可用值:W,M,N
        orgId: '', // 预留 以后选择那个部门用
        stationId: '', // 以后选择部门对应岗位选择用预留
        workDescribe: ''
      },
      rules: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }, { min: 1, max: 11, message: '长度在 1 到 11 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '长度不能小于6', trigger: 'blur' }],
        name: [{ required: true, message: '请输名字', trigger: 'blur' }, { min: 1, max: 20, message: '超出范围', trigger: 'blur' }],
        mobile: [
          // 添加正则表达式 pattern: /^1[3|5|7|8|9]\d{9}$/，验证手机号是否正确
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'blur' }
        ],
        email: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/, message: '请输入正确的邮箱', trigger: 'blur' }],
        orgId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        stationId: [{ required: true, message: '请选择岗位', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 让用户点击重置表单
    restForm() {
      this.FormData.sex = ''
      this.FormData.account = ''
      this.FormData.email = ''
      this.FormData.employeeId = ''
      this.FormData.mobile = ''
      this.FormData.name = ''
      this.FormData.password = ''
      this.FormData.orgId = ''
      this.FormData.stationId = ''
      this.FormData.workDescribe = ''
    },
    // 通过选择的部门id 获取 部门的职位展示给下面个标签
    async changeOrg(value) {
      this.FormData.stationId = ''
      const res = await getStationsByOrgId(value)
      this.stations = res
    },
    // 点击x 取消对话
    closeAddDialog() {
      this.$emit('cancelAddDialog')
    },
    // 取消对话框点击方法
    closeDialog() {
      this.$message.info('取消对话')
      this.$emit('cancelAddDialog')
    },
    // 确认修改方法
    btnOK() {
      this.$refs.addForm.validate(async(isOK) => {
        if (isOK) {
          await addUser(this.FormData)
          this.$message.success('添加成功')
          this.closeAddDialog()
        } else {
          this.$message('请填写正确的表单')
        }
      })
    }

  }
}
</script>

<style>

</style>

<template>
  <el-dialog title="节点受理人修改" :visible="isOpenModifiAssDialog" append-to-body width="70%">
    <el-alert
      title="请注意，受理人，候选人，候选组，只可以选一种类，优先级别 受理人>候选人>候选组"
      type="error"
    />
    <el-row style="margin-top:20px;display: flex; align-content: center; justify-content: center;">
      <el-form :model="formData" label-width="80px">
        <el-form-item label="节点名称">
          <el-input v-model="formData.name" placeholder="" disabled style="width:100%" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="formData.type" placeholder="请选择">
            <el-option
              v-for="item in typeAssignee"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="formData.type==='1'" label="受理人">
          <el-select
            v-model="formData.assignee"
            placeholder="请选择"
            filterable
            allow-create
          >
            <el-option
              v-for="item in assignee"
              :key="item.account"
              :label="item.name"
              :value="item.account"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="formData.type==='2'" label="候选人">
          <el-select
            v-model="formData.candidateUsers"
            placeholder="请选择"
            multiple
            filterable
            allow-create
          >
            <el-option
              v-for="item in candidateUsers"
              :key="item.account"
              :label="item.name"
              :value="item.account"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-show="formData.type==='3'" label="候选组">
          <el-select v-model="formData.candidateGroups" placeholder="请选择">
            <el-option
              v-for="item in candidateGroups"
              :key="item.candidateGroupsValue"
              :label="item.label"
              :value="item.candidateGroupsValue"
            />
          </el-select>
        </el-form-item>

      </el-form>
    </el-row>
    <!-- footer 部分 -->
    <span slot="footer" class="dialog-footer">
      <el-row type="flex" justify="center">
        <el-col :span="10">
          <el-button size="mini" @click="closeBtn">取 消</el-button>
          <el-button size="mini" type="primary" @click="confirmBtn">确 定</el-button>
        </el-col>
      </el-row>
    </span>

  </el-dialog>
</template>

<script>
import { getAllUser } from '@/api/user'
export default {
  props: {
    isOpenModifiAssDialog: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      formData: [], // 表单绑定
      // {
      //   value: '0',
      //   label: '未指定'
      // },
      typeAssignee: [{
        value: '1',
        label: '受理人'
      }, {
        value: '2',
        label: '候选人'
      }, {
        value: '3',
        label: '候选组'
      }],
      value: '',
      // 这个是受理人的select选择数据模型
      assignee: [{
        account: '',
        name: ''
      }],
      assigneeValue: '',

      // 这个是候选人的select数据模型
      candidateUsers: [{
        account: '',
        name: ''
      }],
      candidateUsersValue: '',
      // 这是候选组的select数据模型
      candidateGroups: [{
        candidateGroupsValue: '',
        label: ''
      }],
      candidateGroupsValue: ''
    }
  },
  methods: {

    // 获取所有用户信息并且复制个select的数据模型
    async getAllUserList() {
      const res = await getAllUser()
      this.assignee = res
      this.candidateUsers = res
    },

    // 通过父组件调用这个方法 把行里的内容复制给这个组件的 formData
    getRow(row) {
      this.formData = row
    },
    // 确认修改内容
    confirmBtn() {
      this.$emit('closeModifyAssigneDialogByArgs', this.formData)
    },
    // 通知父组件关闭dialog
    closeBtn() {
      this.$emit('closeModifyAssigneDialog')
    }
  }
}
</script>

<style>

</style>

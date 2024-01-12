<template>
  <el-dialog title="当前流程定义的节点信息" :visible="isOpenViewNodeDialog" width="70%">
    <el-card>
      <el-table
        :data="tableData"
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          prop="name"
          label="节点名称"
          width="180"
        />
        <el-table-column
          prop="type"
          label="受理人类型"
          width="150"
          :formatter="formatType"
        />
        <el-table-column
          prop="assignee"
          label="受理人"
          width="150"
        />
        <el-table-column
          prop="candidateUsers"
          label="候选人"
          width="150"
          :formatter="formatCandidateUser"
        />
        <el-table-column
          prop="candidateGroups"
          label="候选组"
          width="150"
        />
        <el-table-column
          label="操作"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="warning" size="mini" icon="el-icon-edit" @click="modifyAssignee(scope.row)">修改</el-button>
          </template></el-table-column>
      </el-table>
    </el-card>
    <!-- footer部分 -->
    <span slot="footer" class="dialog-footer">
      <el-row type="flex" justify="center">
        <el-col :span="10">
          <el-button size="mini" @click="closeBtn">取 消</el-button>
          <el-button size="mini" type="primary" @click="confirmBTN">确 定</el-button>
        </el-col>
      </el-row>
    </span>

    <!-- 打开修改受理人对话框组件 -->
    <modifyAssignee ref="modifyAssignee" :is-open-modifi-ass-dialog="isOpenModifiAssDialog" @closeModifyAssigneDialogByArgs="closeModifyAssigneDialogByArgs" @closeModifyAssigneDialog="closeModifyAssigneDialog" />
  </el-dialog>
</template>

<script>
import { getProcessNodeByDeploymentId, modifyProcessNodeByDeploymentId } from '@/api/activiti'
import modifyAssignee from './components/modify-assignee.vue'
export default {
  components: {
    modifyAssignee
  },
  props: {
    isOpenViewNodeDialog: {
      type: Boolean,
      require: true
    },
    deploymentId: {
      type: String,
      require: true,
      default: null
    }
  },
  data() {
    return {
      isOpenModifiAssDialog: false, // 控制打开修改受理人对话框
      tableData: [
      ],
      // 格式化类型数据
      formatType(row, cloumn) {
        if (row.type === '0') {
          return '未指定'
        }
        if (row.type === '1') {
          return '受理人'
        }
        if (row.type === '2') {
          return '候选人'
        }
        if (row.type === '3') {
          return '候选组'
        }
      },
      // 格式化 候选人数组数据
      formatCandidateUser(row, column, cellValue, index) {
        let str = ''
        if (row.candidateUsers !== undefined) {
          for (let i = 0; i < row.candidateUsers.length; i++) {
            if (i === row.candidateUsers.length - 1) {
              str = str + row.candidateUsers[i]
            } else {
              str = str + row.candidateUsers[i] + ','
            }
          }
        }
        return str
      }
    }
  },
  methods: {
    // 确定按钮提交修改的候选人信息内容
    async confirmBTN() {
      await modifyProcessNodeByDeploymentId(this.deploymentId, this.tableData)
      this.$message.success('修改成功')
      this.closeBtn()
    },
    // 子组件 修改好内容 把修改的内容当作参数传递给父组件并且告诉他关闭对话框
    closeModifyAssigneDialogByArgs(formData) {
      this.isOpenModifiAssDialog = false
    },
    // 子组件通知父组件关闭修改受理人对话框
    closeModifyAssigneDialog() {
      this.isOpenModifiAssDialog = false
    },
    // 打开修改执行人dialog 还需要调用一个查询所有用户的方法这样在子组件的select里选择到用户
    modifyAssignee(row) {
      this.$refs.modifyAssignee.getRow(row)
      this.$refs.modifyAssignee.getAllUserList()
      this.isOpenModifiAssDialog = true
    },
    // 查看当前流程定义的所有节点信息方法
    async viewAllNodeByDeploymentId(deploymentId) {
      const res = await getProcessNodeByDeploymentId(deploymentId)
      this.tableData = res
    },
    // confirmBtn 确定按钮 可用于修改
    confirmBtn() {
    },
    // closeBtn 关闭dialog
    closeBtn() {
      this.$emit('closeViewNodeDialog')
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    }
  }
}
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

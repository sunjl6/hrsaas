<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- header -->
      <el-card>
        任务列表
      </el-card>
      <!-- body -->
      <el-card>
        <template>
          <el-table
            :data="tableData"
            style="width: 100%"
            :row-class-name="tableRowClassName"
          >
            <!-- <el-table-column
              prop="taskId"
              label="任务编号"
              width="280"
            /> -->
            <el-table-column
              prop="processInstatnceName"
              label="流程名称"
              width="180"
              align="center"
            />
            <el-table-column
              prop="name"
              label="任务节点名称"
              width="180"
              align="center"
            />
            <el-table-column
              prop="assignee"
              label="当前受理人ID"
              width="180"
              align="center"
            />
            <el-table-column
              prop="isSuspended"
              label="是否挂起"
              width="120"
              align="center"
              :formatter="formatIsSuspended"
            />
            <el-table-column
              prop="taskDefinitionKey"
              label="节点任务和表单id"
              width="180"
              align="center"
            />
            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button type="success" size="mini" icon="el-icon-thumb" @click="renderForm(scope.row)">办理/审批</el-button>
                <el-button type="warning" size="mini" icon="el-icon-thumb" @click="claimTask(scope.row)">拾取/归还</el-button>
                <!-- <el-button type="danger" size="mini" icon="el-icon-delete" @click="delDeployment(scope.row)">删除</el-button>
                <el-button type="primary" size="mini" icon="el-icon-download" @click="downloadBpmn(scope.row)">下载</el-button> -->
              </template>

            </el-table-column>
          </el-table>
        </template>
      </el-card>
      <!-- 动态渲染表单的对话框组件 -->
      <taskRenderForm ref="renderTaskFormData" :is-open-render-form-dialog="isOpenRenderFormDialog" @closeRenderTaskFormDialog="closeRenderTaskFormDialog" />
      <!-- footer -->
    </div>
  </div>
</template>

<script>
import { finsihTask, AllTasks } from '@/api/activiti'
import taskRenderForm from './components/task-renderForm.vue'
export default {
  components: {
    taskRenderForm
  },
  data() {
    return {
      isOpenRenderFormDialog: false, // 控制开关动态表单
      tableData: [],
      formatIsSuspended: function(row, colunm, cellValue) {
        if (row.isSuspended) {
          return '已挂起'
        } else {
          return '未挂起'
        }
      } // 格式化数据
    }
  },
  created() {
    this.getAllTasks()
  },
  methods: {
    // 关闭子组件通知task表单渲染对话框
    closeRenderTaskFormDialog() {
      this.isOpenRenderFormDialog = false
      this.getAllTasks()
    },
    // 渲染表单
    async renderForm(row) {
      this.isOpenRenderFormDialog = true
      this.$refs.renderTaskFormData.renderFormData(row.taskId)
    },

    // 办理这个任务也就是完成这个任务 无任务参数表单
    async finishTask(row) {
      await finsihTask({ 'taskId': row.taskId })
    },

    // 获取所有task
    async getAllTasks() {
      const res = await AllTasks()
      this.tableData = res
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

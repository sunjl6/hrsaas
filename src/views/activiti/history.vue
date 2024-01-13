<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- 历史流程标签 -->
          <el-tab-pane label="历史流程" name="first">
            <el-card>
              <el-table
                :data="historyProcessTableData"
                style="width: 100%"
                :row-class-name="tableRowClassName"
              >
                <el-table-column
                  prop="processDefinitionName"
                  label="流程名称"
                />
                <el-table-column
                  prop="processInstanceId"
                  label="流程实例Id"
                  width="180"
                />
                <el-table-column
                  prop="processDefinitionId"
                  label="流程定义Id"
                  width="180"
                />
                <el-table-column
                  prop="startTime"
                  label="开始时间"
                />
                <el-table-column
                  prop="endTime"
                  label="结束时间"
                />

                <el-table-column
                  prop="durationInMillis"
                  label="持续时间"
                />

                <el-table-column
                  prop="startUserId"
                  label="流程发起者"
                />

                <el-table-column
                  prop="processDefinitionVersion"
                  label="流程版本"
                />

              </el-table>
              <el-pagination
                layout="prev, pager, next"
                :total="processPageInfo.total"
                :current-page.sync="processPageInfo.page"
                :page-size="processPageInfo.size"
                @prev-click="preClick"
                @next-click="nextClick"
                @current-change="currentPage()"
              />
            </el-card>
          </el-tab-pane>
          <!-- 历史任务标签 -->
          <el-tab-pane label="历史任务" name="second">
            <el-card>
              <el-table
                :data="historyTaskTableData"
                style="width: 100%"
                :row-class-name="tableRowClassName"
              >
                <el-table-column
                  prop="name"
                  label="任务名称"
                />
                <el-table-column
                  prop="processInstanceId"
                  label="流程实例id"
                />
                <el-table-column
                  prop="processDefinitionId"
                  label="流程定义id"
                  width="180"
                />
                <el-table-column
                  prop="startTime"
                  label="开始时间"
                  width="180"
                />
                <el-table-column
                  prop="endTime"
                  label="结束时间"
                />
                <el-table-column
                  prop="durationInMillis"
                  label="持续时间"
                />

                <el-table-column
                  prop="executionId"
                  label="执行id"
                />
                <el-table-column
                  prop="assignee"
                  label="任务受理人"
                />
                <!-- <el-table-column
                  prop="taskDefinitionKey"
                  label="taskDefinitionKey"
                /> -->
                <!-- <el-table-column
                  prop="formKey"
                  label="formKey"
                /> -->
                <el-table-column
                  prop="createTime"
                  label="任务创建时间"
                />

              </el-table>
              <el-pagination
                layout="prev, pager, next"
                :total="historyTaskTableData.total"
                :current-page.sync="historyTaskTableData.page"
                :page-size="historyTaskTableData.size"
                @prev-click="preClick"
                @next-click="nextClick"
                @current-change="currentPage()"
              />
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-card>

    </div>
  </div>
</template>

<script>
import { pageProcessHistory, pageTaskHistory } from '@/api/activiti'
export default {
  data() {
    return {
      activeName: 'first',
      historyProcessTableData: [],
      historyTaskTableData: [],
      taskPageInfo: {
        page: 1,
        size: 5,
        total: 0
      },
      processPageInfo: {
        page: 1,
        size: 5,
        total: 0
      }
    }
  },
  created() {
    this.pageProcessInstance()
    this.pageTaskHistory()
  },
  methods: {
    // 分页获取历史task 方法
    async pageTaskHistory() {
      const res = await pageTaskHistory({
        page: this.taskPageInfo.page,
        size: this.taskPageInfo.size
      })
      this.historyTaskTableData = res
    },
    // 分页获取历史流程的方法
    async pageProcessInstance() {
      const res = await pageProcessHistory({
        page: this.processPageInfo.page,
        size: this.processPageInfo.size
      })
      this.historyProcessTableData = res
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    // 历史流程的分页事件
    preClick() {
      this.taskPageInfo.page = this.taskPageInfo.page - 1
    },
    // 历史流程的分页事件
    nextClick() {
      this.taskPageInfo.page = this.taskPageInfo.page + 1
    },
    // 历史流程的分页事件
    currentPage() {
      this.pageProcessInstance()
    },
    handleClick() {}
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

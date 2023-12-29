<template>
  <div class="dashboard-container">
    <div class="app-container">
      <h3>流程实例列表</h3>
      <el-card>
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          :border="true"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column
            prop="processInstatnceId"
            label="processInstatnceId"
            width="280"
          />
          <!-- <el-table-column
            prop="processDefinitionId"
            label="processDefinitionId"
            width="180"
          /> -->
          <el-table-column
            prop="processDefinitionName"
            label="流程定义名称"
            width="280"
            align="center"
          />
          <!-- <el-table-column
            prop="processDefinitionKey"
            label="流程定义的ID(key)"
            width="180"
          /> -->
          <el-table-column
            prop="processDefinitionVersion"
            label="version"
            width="80 "
            align="center"
          />
          <!-- <el-table-column
            prop="processVariables"
            label="流程变量参数"
            width="180"
          /> -->
          <el-table-column
            prop="suspended"
            label="是否挂起"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <el-button v-if="scope.row.suspended" type="success" size="mini" icon="el-icon-caret-right" @click="actInstance(scope.row)">激活</el-button>
              <el-button v-else type="warning" size="mini" icon="el-icon-caret-right" @click="suspendInstance(scope.row)">挂起</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="ended"
            label="是否已经结束"
            :formatter="formatIsFinished"
            align="center"
          />
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="delDeployment(scope.row)">删除</el-button>
            </template></el-table-column>
        </el-table>
        <el-pagination
          layout="prev, pager, next"
          :total="pageInfo.total"
          :current-page.sync="pageInfo.page"
          :page-size="pageInfo.size"
          @prev-click="preClick"
          @next-click="nextClick"
          @current-change="currentPage()"
        />
      </el-card>
      <!-- 引入删除的打开对话组件 -->
      <delprocessInstance :process-instatnce-id="processInstatnceId" :is-open-del-process-instance-dialog="isOpenDelProcessInstanceDialog" @closeDelProcessInstanceDialog="closeDelProcessInstanceDialog" />
    </div>
  </div>
</template>

<script>
import { getAllProcessInstanceByPage, suspendInstance, actInstance } from '@/api/activiti'
import delprocessInstance from './components/del-processInstance.vue'
export default {
  components: {
    delprocessInstance
  },
  data() {
    return {
      processInstatnceId: null,
      isOpenDelProcessInstanceDialog: false, // 控制打开删除按钮的对话框
      formatIsFinished: function(row, colunm, cellValue) {
        if (row.ended) {
          return '已结束'
        } else {
          return '进行中'
        }
      }, // 格式化数据
      pageInfo: {
        page: 1,
        size: 5,
        total: 0
      },
      tableData: []
    }
  },
  created() {
    this.processInstancePageList()
  },
  methods: {
    // 子组件通知父组件关闭对话框
    closeDelProcessInstanceDialog() {
      this.isOpenDelProcessInstanceDialog = false
      this.processInstancePageList()
    },
    // 删除流程实例
    delDeployment(row) {
      this.processInstatnceId = row.processInstatnceId
      this.isOpenDelProcessInstanceDialog = true
    },
    // 激活实例
    actInstance(row) {
      this.$confirm('此操作将激活实例, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await actInstance({
          'processInstatnceId': row.processInstatnceId
        })
        this.$message({
          type: 'success',
          message: '激活成功!'
        })
        this.processInstancePageList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // suspendInstance 挂起实例
    suspendInstance(row) {
      this.$confirm('此操作将挂起实例, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await suspendInstance({ 'processInstatnceId': row.processInstatnceId })
        this.$message({
          type: 'success',
          message: '挂起成功!'
        })
        this.processInstancePageList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 分页获取所有开启的流程实例
    async processInstancePageList() {
      const res = await getAllProcessInstanceByPage({
        'page': this.pageInfo.page,
        'size': this.pageInfo.size
      })
      this.pageInfo.total = res.total
      this.tableData = res.pagelist
    },
    preClick() {
      this.pageInfo.page = this.pageInfo.page - 1
    },
    nextClick() {
      this.pageInfo.page = this.pageInfo.page + 1
    },
    currentPage() {
      this.processInstancePageList()
    }
  }
}
</script>
  <style>

  </style>


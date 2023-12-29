<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 头部区域 -->
      <el-card>
        <el-button type="primary" icon="el-icon-plus" @click="$refs.upload.click()">上传BPMN</el-button>
      </el-card>
      <input ref="upload" class="uploadBpmn" type="file" accept=".bpmn" @change="uploadBpmn()">
      <!-- 内容区域 -->
      <el-card>
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
        >
          <el-table-column
            prop="id"
            label="ProcessDefinitionId"
            width="280"
          />
          <el-table-column
            prop="name"
            label="流程定义名称"
            width="180"
          />
          <el-table-column
            prop="version"
            label="部署版本"
            width="80px"
            align="center"
          />
          <el-table-column
            prop="key"
            label="流程定义ID(Key)"
            width="180"
          />
          <el-table-column
            prop="resourceName"
            label="流程文件名称"
          />
          <!-- <el-table-column
            prop="suspended"
            label="是否挂起"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.suspended"
                style="display: block"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="已挂起"
                inactive-text="未挂起"
                @change="changeSwitch(scope.row)"
              />
            </template>
          </el-table-column> -->
          <el-table-column
            label="操作"
          > <template slot-scope="scope">
            <el-button v-if="checkPermission('processDefinition:start')" type="success" size="mini" icon="el-icon-caret-right" @click="startProcessDefinition(scope.row)">启动</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="delDeployment(scope.row)">删除</el-button>
            <el-button type="primary" size="mini" icon="el-icon-download" @click="downloadBpmn(scope.row)">下载</el-button>
          </template>
          </el-table-column>
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
      <!-- 用作下载用的链接 -->
      <a ref="downloadLink" hidden />
    </div>
  </div>
</template>

<script>
import { pageListProcessDefinition, delDeployedById, uploadBpmnByStream, downloadBpmn, startInstanceById } from '@/api/activiti'
import { checkPermission } from '@/mixin/checkPermission'
export default {
  data() {
    return {
      pageInfo: {
        page: 1,
        size: 5,
        total: 0
      },
      tableData: []
    }
  },
  created() {
    this.listProcessDefinitionByPage()
  },
  methods: {
    // 启动流程实例
    async startProcessDefinition(row) {
      await startInstanceById({ 'processInstatnceId': row.id })
      this.$message.success('启动实例成功')
    },
    // 下载bpmn文件
    async downloadBpmn(row) {
      const data = await downloadBpmn({
        'deploymentId': row.deploymentId,
        'name': row.resourceName
      })
      console.log(data.data)
      this.download({ name: row.resourceName, data: data.data })
    },
    // 打开上传
    async uploadBpmn() {
      const file = this.$refs.upload.files[0]
      // const fileName = this.$refs.upload.files[0].name
      var fd = new FormData()
      fd.append('bpmnFile', file)
      const res = await uploadBpmnByStream(fd)
      if (res) {
        this.$message.success('上传成功')
        this.listProcessDefinitionByPage()
      } else {
        this.$message.error('上传失败')
      }
    },
    // 删除定义
    async delDeployment(row) {
      this.$confirm('确认是否删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delDeployedById(row.deploymentId)
        this.listProcessDefinitionByPage()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        // this.$message({
        //   // type: 'info'
        //   // message: '删除失败'
        // })
      })
    },
    // 分页获取流程定义
    async listProcessDefinitionByPage() {
      const result = await pageListProcessDefinition({
        'page': this.pageInfo.page,
        'size': this.pageInfo.size
      })
      this.tableData = result.pagelist
      this.pageInfo.total = result.total
    },
    preClick() {
      this.pageInfo.page = this.pageInfo.page - 1
    },
    nextClick() {
      this.pageInfo.page = this.pageInfo.page + 1
    },
    currentPage() {
      this.listProcessDefinitionByPage()
    },
    // 下载方法
    download({ name, data }) {
      // 这里就获取到了之前设置的隐藏链接
      const downloadLink = this.$refs.downloadLink
      // 把输就转换为URI，下载要用到的
      const encodedData = encodeURIComponent(data)
      if (data) {
        // 将数据给到链接
        downloadLink.href =
            'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
        // 设置文件名
        downloadLink.download = name
        // 触发点击事件开始下载
        downloadLink.click()
      }
    }
  }
}
</script>

<style scoped>
.uploadBpmn{
  display: none;
}
</style>


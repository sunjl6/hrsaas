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
            width="280"
            align="center"
          > <template slot-scope="scope">
            <el-button v-if="checkPermission('processDefinition:start')" type="success" size="mini" icon="el-icon-caret-right" @click="startProcessDefinitionViavaribles(scope.row)">启动</el-button>
            <el-button style="margin-top: 5px;" type="danger" size="mini" icon="el-icon-delete" @click="delDeployment(scope.row)">删除</el-button>
            <el-button style="margin-top: 5px;" type="warning" size="mini" icon="el-icon-view" @click="viewNode(scope.row)">查看修改节点</el-button>
            <el-button style="margin-top: 5px;" type="primary" size="mini" icon="el-icon-download" @click="downloadBpmn(scope.row)">下载</el-button>
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
      <!-- 查看节点信息的组件 -->
      <deploymentViewNode ref="viewNode" :deployment-id="deploymentId" :is-open-view-node-dialog="isOpenViewNodeDialog" @closeViewNodeDialog="closeViewNodeDialog" />
      <!-- 用作下载用的链接 -->
      <a ref="downloadLink" hidden />
    </div>
  </div>
</template>

<script>
import { pageListProcessDefinition, delDeployedById, uploadBpmnByStream, downloadBpmn, startInstanceById, startInstanceByIdAndVariable, getProcessNodeByDeploymentId } from '@/api/activiti'
import deploymentViewNode from './components/deployment-viewNode.vue'
export default {
  components: {
    deploymentViewNode
  },
  data() {
    return {
      isOpenViewNodeDialog: false, // 控制打开查看节点信息的对话框
      varible: {
        key: '',
        value: ''
      }, // 启动流程实例的参数
      varibleList: [],
      pageInfo: {
        page: 1,
        size: 5,
        total: 0
      },
      tableData: [],
      deploymentId: ''// 作用：把当前的 deploymentId 传递给子组件
    }
  },
  created() {
    this.listProcessDefinitionByPage()
  },
  methods: {
    // 获取${} 里面的内容
    getUserName(str) {
      var reg = /\$\{(.+?)\}/
      // var reg_g = /\$\{(.+?)\}/g
      var result = str.match(reg)
      return result
    },
    // 子组件通知父组件关闭查看节点对话框
    closeViewNodeDialog() {
      this.isOpenViewNodeDialog = false
    },
    // 查看分支节点信息的方法
    viewNode(row) {
      this.$refs.viewNode.viewAllNodeByDeploymentId(row.deploymentId)
      this.deploymentId = row.deploymentId
      this.isOpenViewNodeDialog = true
    },
    // 带参数启动流程实例(包含无参启动)
    async startProcessDefinitionViavaribles(row) {
      // 获取第一个节点的assignee 看看是否是 ${user} 开头的，如果是 怎带参启动，如果不是则无参启动
      const resCurrentNodes = await getProcessNodeByDeploymentId(row.deploymentId)
      // 如果拿不到assignee 那么这个节点可能是个服务，没有执行人是自动启动的 那么我们就直接无参数启动流程
      if (resCurrentNodes.length <= 0) {
        console.log('没执行人启动')
        this.$confirm(`确认启动： ${row.name}流程, 是否继续?`, '提示', {
          confirmButtonText: '启动',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await startInstanceById({
            processInstatnceId: row.id
          })
          this.listProcessDefinitionByPage()
          this.$message({
            type: 'success',
            message: '启动成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '启动失败'
          })
        })
        return
      }
      const assigneeName = (resCurrentNodes[0].assignee)
      if (assigneeName.startsWith('$')) {
        console.log('有参启动')
        // 如果是 $开头就 带参数启动，不然就无参启动
        this.$confirm(`确认启动： ${row.name}流程, 是否继续?`, '提示', {
          confirmButtonText: '启动',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const res = this.getUserName(assigneeName)
          const userName = res[1]
          console.log(userName)
          this.varibleList.push({ key: userName,
            value: this.$store.getters.userInfo.account })
          await startInstanceByIdAndVariable(row.id, this.varibleList)
          this.$message.success('启动实例成功')
          this.listProcessDefinitionByPage()
          this.$message({
            type: 'success',
            message: '启动成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else {
        // 无参启动
        console.log('无参启动')
        this.$confirm(`确认启动： ${row.name}流程, 是否继续?`, '提示', {
          confirmButtonText: '启动',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await startInstanceById({ 'processInstatnceId': row.id })
          this.$message.success('启动实例成功')
          this.listProcessDefinitionByPage()
          this.$message({
            type: 'success',
            message: '启动成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },

    // // 启动流程实例
    // async startProcessDefinition(row) {
    //   // 这里启动实例 有带参数 和不带 参数的方式，那么 通过返回结果判断 如果有错误说明需要带参数的。
    //   const res = await startInstanceById({ 'processInstatnceId': row.id })
    //   console.log(res)
    //   this.$message.success('启动实例成功')
    // },
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
        this.pageInfo.total = this.pageInfo.total - 1
        if (this.pageInfo.total / this.pageInfo.size === 1) {
          console.log('12121212')
          this.pageInfo.page = this.pageInfo.page - 1
          this.listProcessDefinitionByPage()
        }

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


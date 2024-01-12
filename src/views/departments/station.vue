<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addParentStation">新增各部门最高管理层岗位</el-button>
      </el-card>
      <!-- 岗位列表部分 -->
      <el-card>
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          row-key="id"
          border
          :default-expand-all="false"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <!-- <el-table-column
            prop="id"
            label="岗位编号"
            width="280"
          /> -->
          <el-table-column
            prop="name"
            label="岗位名称"
            width="160"
          />
          <el-table-column
            prop="orgId"
            label="所属部门"
            width="140"
            :formatter="formatOrg"
            align="center"
          />
          <!-- <el-table-column
            prop="status"
            label="状态"
            width="100"
            :formatter="formatIsEnable"
          /> -->
          <el-table-column
            prop="level"
            label="类型"
            width="80"
            :formatter="formatLevel"
            align="center"
          />
          <el-table-column
            prop="describe"
            label="描述"
            width="280"
            align="center"
          />
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="addBtn(scope.row)">新增子岗位</el-button>
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="editBtn(scope.row)">修改</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="delBtn(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 新增岗位的组件 -->
    <addStation :parent-name="parentName" :parent-id="parentId" :is-show-add-dialog="isShowAddDialog" :org-list="orgList" @closeAddStation="closeAddStation" />
    <!-- 编辑岗位组件 -->
    <editStation ref="editStation" :is-show-edit-dialog="isShowEditDialog" :org-list="orgList" @closeEditStation="closeEditStation" />
  </div>
</template>

<script>
import addStation from './components/add-station.vue'
import editStation from './components/edit-station.vue'
import { getAllDepts } from '@/api/departments'
import { delStation, getStationTreeList } from '@/api/stations'
export default {
  components: {
    addStation,
    editStation
  },
  data() {
    return {
      formatLevel: function(row, colunm, cellValue) {
        let str = ''
        switch (row.level) {
          case '1':
            str = '员工'
            break
          case '2':
            str = '主管'
            break
          case '3':
            str = '经理'
            break
          case '4':
            str = '总监'
            break
          default:
            str = '其他'
        }
        return str
      },
      formatIsEnable: function(row, colunm, cellValue) {
        if (row.status) {
          return '已启用'
        } else {
          return '已禁用'
        }
      }, // 格式化数据
      orgList: [],
      isShowAddDialog: false,
      isShowEditDialog: false,
      tableData: [],
      parentId: '0',
      parentName: '无' // 传递给子组件的上级岗位的名字。
    }
  },
  created() {
    this.getAllOrgs()
    this.treeList()
  },
  methods: {
    formatOrg: function(row, colunm, cellValue) {
      // newarr.filter(item => item.num===2 )
      const res = this.orgList.find(item => {
        return item.id === row.orgId
      })
      // console.log(res[0].name)
      // console.log(res.name)
      return res.name
    },
    // 打开编辑岗位
    editBtn(row) {
      console.log(row.id)
      this.$refs.editStation.getStationById(row.id)
      this.isShowEditDialog = true
    },
    // 关闭编辑岗位对话框
    closeEditStation() {
      this.isShowEditDialog = false
      this.treeList()
    },
    // 新增父岗位
    addParentStation() {
      this.parentId = '0'
      this.parentName = '无'
      this.isShowAddDialog = true
    },
    // 新增子岗位
    addBtn(row) {
      this.parentId = row.id
      this.isShowAddDialog = true
      this.parentName = row.name
    },
    // 删除
    async delBtn(row) {
      await delStation({
        'ids': [row.id]
      })
      this.$message.success('删除成功')
      this.treeList()
    },

    // 获取所有岗位树
    async treeList() {
      const tree = await getStationTreeList()
      this.tableData = tree
    },

    // 获取所有部门
    async getAllOrgs() {
      const res = await getAllDepts()
      this.orgList = res
    },
    // 关闭添加站点对话框
    closeAddStation() {
      this.isShowAddDialog = false
      this.treeList()
    }
  }
}
</script>

    <style>
  </style>


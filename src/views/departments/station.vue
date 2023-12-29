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
          <el-table-column
            prop="id"
            label="编号"
            width="280"
          />
          <el-table-column
            prop="name"
            label="岗位名称"
            width="180"
          />
          <el-table-column
            prop="status"
            label="状态"
            width="180"
            :formatter="formatIsEnable"
          />
          <el-table-column
            prop="describe"
            label="描述"
            width="180"
          />
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="addBtn(scope.row)">新增下属岗位</el-button>
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


<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs>
        <el-tab-pane label="菜单权限">
          <!-- 靠右的按钮 -->
          <page-tools>
            <template v-slot:after>
              <el-button type="primary" size="small" @click="addMenuPermBaseBtn">添加菜单权限</el-button>
            </template>
          </page-tools>
          <!-- 树形表格展示 -->
          <div>
            <el-table
              :data="tableDataMenu"
              style="width: 100%;margin-bottom: 20px;"
              row-key="id"
              border
              :default-expand-all="false"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            >
              <el-table-column
                prop="name"
                label="菜单名称"
                sortable
                width="180"
              />
              <el-table-column
                prop="isPublic"
                label="是否公开"
                :formatter="formatPub"
                align="center"
              />
              <el-table-column
                prop="path"
                label="路由path"
              />
              <el-table-column
                prop="component"
                label="组件路径"
              />
              <el-table-column
                prop="isEnable"
                label="状态"
                align="center"
                :formatter="formatIsEnable"
              />
              <el-table-column
                prop="icon"
                label="图标"
              />
              <el-table-column
                prop="describe_"
                label="权限描述"
              />
              <el-table-column label="操作">
                <template slot-scope="{ row }">
                  <el-button type="text" @click="addMenuPermBtn(row.id)">添加</el-button>
                  <el-button type="text" @click="editMenuPerBtn(row)">编辑</el-button>
                  <el-button type="text" @click="delMenuBtn(row)"> 删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="API权限管理">
          <page-tools>
            <template v-slot:after>
              <el-button type="primary" size="small" @click="addResourcePerm">添加API权限</el-button>
            </template>
          </page-tools>
          <el-table
            :data="tableDataResource"
            style="width: 100%"
          >
            <el-table-column
              prop="id"
              label="权限ID"
              width="190"
            />
            <el-table-column
              prop="code"
              label="权限标识符"
              width="200"
            />
            <el-table-column
              prop="name"
              label="名称"
              width="120"
            />
            <el-table-column
              prop="method"
              label="请求方法"
              width="100"
            />
            <el-table-column
              prop="url"
              label="请求路径"
            />
            <el-table-column
              prop="describe"
              label="api描述"
            />
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <el-button type="text" @click="editResourceBtn(row)">编辑</el-button>
                <el-button type="text" @click="delResourceBtn(row)"> 删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            layout="prev, pager, next"
            :total="pageResourceInfo.total"
            :current-page.sync="pageResourceInfo.current"
            @prev-click="preClick"
            @next-click="nextClick"
            @current-change="currentPage()"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 打开添加菜单权限的对话框 -->
    <addMenuPermissionDialog :is-open-add-menue-permission-dialog="isOpenAddMenuePermissionDialog" :parent-id="parentId" @closeMenuDialog="closeAppMenuPermDiag" />
    <!-- 打开编辑菜单权限对话 -->
    <editMenuPermissionDialog ref="editMenu" :is-open-edit-menue-permission-dialog="isOpenEditMenuePermissionDialog" @closeEditPermDiag="closeEditPermDiag" />
    <!-- 打开新增api权限对话框 -->
    <addResourcePermissionDialog :is-open-add-resource-dialog="isOpenAddResourceDialog" :table-data-menu="tableDataMenu" @closeAddResourceDialog="closeResourceDialog" />
    <!-- 打开修改api'权限对话框 -->
    <editResourcePermissionDialog ref="editResource" :is-open-edit-resource-dialog="isOpenEditResourceDialog" :table-data-menu="tableDataMenu" @closeEditResourceDialog="closeEditResourceDialog" />
  </div>
</template>

<script>
import { setCurrentTab, getCurrentTab } from '@/utils/auth'
import { menuList, pageResource, delMenu, delResource } from '@/api/permisson'
import addMenuPermissionDialog from './components/add-menuPermission.vue'
import editMenuPermissionDialog from './components/edit-menuPermission.vue'
import addResourcePermissionDialog from './components/add-resourcePermission.vue'
import editResourcePermissionDialog from './components/edit-resourcePermission.vue'
export default {
  components: {
    addMenuPermissionDialog,
    editMenuPermissionDialog,
    addResourcePermissionDialog,
    editResourcePermissionDialog
  },
  data() {
    return {
      // activePage: getCurrentTab,
      isOpenEditResourceDialog: false, // 控制打开编辑api对话框
      isOpenAddResourceDialog: false, // 控制打开新增api权限的对话框
      isOpenAddMenuePermissionDialog: false, // 控制开启添加菜单权限的对话框
      isOpenEditMenuePermissionDialog: false, // 控制开启修改菜单权限的对话框
      id: '', // 把当前id 传递给子组件用于查询回显内容并且做修改
      parentId: '0', // 传递给添加菜单权限子组件的parentId
      pageResourceInfo: {
        current: 1,
        size: 10,
        total: 0
      },
      tableDataResource: [],
      tableDataMenu: [],
      formatIsEnable: function(row, colunm, cellValue) {
        if (row.isEnable) {
          return '已启用'
        } else {
          return '已禁用'
        }
      }, // 格式化数据
      formatPub: function(row, colunm, cellValue) {
        if (cellValue) {
          return '是'
        } else {
          return '否'
        }
      } // 格式化树
    }
  },
  created() {
    // this.activePage = getCurrentTab()
    this.getAllMenu()
    this.pageResource()
  },
  methods: {
    // 关闭编辑api权限对话框
    closeEditResourceDialog() {
      this.isOpenEditResourceDialog = false
      this.pageResource()
      // this.getAllMenu()
      // setCurrentTab('api')
      // location.reload()
    },
    // 编辑api权限按钮事件
    editResourceBtn(row) {
      this.isOpenEditResourceDialog = true
      this.$refs.editResource.getResourceById(row.id)
    },
    // 根据所选id删除权限
    delResourceBtn(row) {
      this.$confirm(`此操作将永久删除"${row.name}" 权限, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delResource(row.id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.pageResource()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 关闭新增api权限对话框
    closeResourceDialog() {
      this.isOpenAddResourceDialog = false
      this.pageResource()
    },
    // 打开添加api权限方法
    addResourcePerm() {
      this.isOpenAddResourceDialog = true
    },
    // 关闭编辑菜单对话框
    closeEditPermDiag() {
      this.isOpenEditMenuePermissionDialog = false
      this.getAllMenu()
    },
    // 编辑菜单事件
    editMenuPerBtn(row) {
      this.$refs.editMenu.getMenuById(row.id)
      this.isOpenEditMenuePermissionDialog = true
    },
    // 删除菜单权限
    delMenuBtn(row) {
      this.$confirm(`此操作将永久删除:${row.name}权限, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delMenu(row.id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getAllMenu()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 菜单权限子组件通知父组件关闭对话方法
    closeAppMenuPermDiag() {
      this.isOpenAddMenuePermissionDialog = false
      this.getAllMenu()
    },
    // 单独分装一个 添加最高节点的菜单 因为他的父id 必须为0
    addMenuPermBaseBtn() {
      this.parentId = '0'
      this.isOpenAddMenuePermissionDialog = true
    },
    // 添加菜单权限按钮点击方法
    addMenuPermBtn(id) {
      this.parentId = id
      this.isOpenAddMenuePermissionDialog = true
    },
    // 点击当前页获取数据
    currentPage() {
      this.pageResource()
    },
    // 点击下一页
    nextClick() {
      this.pageResourceInfo.current = this.pageResourceInfo.current + 1
      this.pageResource()
    },
    // 点击上一页
    preClick() {
      this.pageResourceInfo.current = this.pageResourceInfo.current - 1
      this.pageResource()
    },
    // 分页查询所有api权限
    async pageResource() {
      const res = await pageResource({
        current: this.pageResourceInfo.current,
        size: this.pageResourceInfo.size
      })
      this.tableDataResource = res.records
      this.pageResourceInfo.total = Number(res.total)
    },
    async getAllMenu() {
      const res = await menuList()
      this.tableDataMenu = res
      // setCurrentTab('menu')
    }

  }
}
</script>

  <style>
</style>

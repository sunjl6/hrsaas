<template>
  <el-dialog v-loading="loading" title="办理业务" :visible="isOpenRenderFormDialog" width="70%">
    <el-card>
      <el-alert
        v-show="showText"
        title="获取任务成功"
        type="success"
        description="点击确定按钮完成任务"
        show-icon
      />
      <el-form :model="FormData" :rules="rules" label-width="90px">
        <el-form-item v-for="(item,index) in FormRenderResults" :key="index" :label="`${item.controlLabel}`">
          <el-row v-if="item.controlType==='date'">
            <el-col style="display: flex; justify-content: center;">
              <el-date-picker
                v-model="item.controlDefaultValue"
                align="center"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
              />
            </el-col>
          </el-row>
          <el-row v-else>
            <el-col>
              <el-input v-model="item.controlDefaultValue" :placeholder="item.controlDefaultValue" />
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- footer部分 -->
    <span slot="footer" class="dialog-footer">
      <el-row type="flex" justify="center">
        <el-col :span="10">
          <el-button size="mini" @click="closeBtn">取 消</el-button>
          <el-button size="mini" type="primary" @click="confirmBtn">办理/审批</el-button>
        </el-col>
      </el-row>
    </span>
  </el-dialog>
</template>

<script>
import { formDataRender, formDataSave } from '@/api/activiti'
export default {
  props: {
    isOpenRenderFormDialog: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      loading: false, // loading加载开关
      showText: false, // 控制提示 不需要渲染表单直接完成task 文字提示开关
      taskIdForSaveData: '',
      FormData: {
        'value': ''
      }, // 渲染提交的表单
      FormRenderResults: [], // 渲染表单的返回结果
      rules: {
        reason: [{ required: true, message: '请输入删除的原因', trigger: 'blur' }, { min: 1, max: 30, message: '长度不能超过30' }]
      }
    }
  },

  methods: {

    // 提交渲染表单 formDataSave

    // 渲染表单方法
    async renderFormData(taskId) {
      this.loading = true
      const res = await formDataRender(taskId)

      // 如果res的长度为0 那么说明没用渲染的表单 那么就弹出一个提示直接完成，否则 就渲染表单
      if (res.length <= 0) {
        this.showText = true
        // 没有动态表单，直接完成任务 dialog 显示一些文字提示用户直接确定
      }
      // 如果返回数组里空的，说明每页渲染的表单那么我就给个提示 让用户直接点击确认发起流程
      this.taskIdForSaveData = taskId
      this.FormRenderResults = res
      this.loading = false
    },

    // 拼接返回数据 每个表单用 !_! 分割
    // FormProperty_1hbdgpb-_!请填写姓名-_!f!_!FormProperty_1483t23-_!99-_!s
    convertStr(Results = []) {
      let str = ''
      Results.forEach(element => {
        if (Results.lastIndexOf(element) === Results.length - 1) {
          str = str + element.id + '-_!' + element.controlDefaultValue + '-_!' + element.controleParam
        } else {
          str = str + element.id + '-_!' + element.controlDefaultValue + '-_!' + element.controleParam + '!_!'
        }
      })
      return str
    },
    // 确认对话框 提交表单并且完成task
    async confirmBtn() {
      const resStr = this.convertStr(this.FormRenderResults)
      if (resStr === '') {
        await formDataSave({
          'taskid': this.taskIdForSaveData,
          'formDataStr': ''
        })
        this.$message.success('执行成功')
        this.closeBtn()
      } else {
        await formDataSave({
          'taskid': this.taskIdForSaveData,
          'formDataStr': resStr
        })
        this.$message.success('执行成功')
        this.closeBtn()
      }

      this.$message.success('执行成功')
      this.closeBtn()
    },
    // 关闭对话框
    closeBtn() {
      this.$emit('closeRenderTaskFormDialog')
      this.showText = false
    }
  }
}
</script>

  <style scoped>

</style>


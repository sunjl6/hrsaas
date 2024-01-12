<template>
  <el-dialog title="删除流程" :visible="isOpenDelProcessInstanceDialog">
    <el-card>
      <el-form :model="FormData" :rules="rules">
        <el-form-item label="processInstanceId">
          <el-input v-model="FormData.processInstatnceId" placeholder="请输入原因" disabled />
        </el-form-item>
        <el-form-item label="删除原因" prop="reason">
          <el-input v-model="FormData.reason" type="textarea" placeholder="请输入原因" />
        </el-form-item>
      </el-form>
    </el-card>
    <!-- footer部分 -->
    <span slot="footer" class="dialog-footer">
      <el-row type="flex" justify="center">
        <el-col :span="10">
          <el-button size="mini" @click="closeBtn">取 消</el-button>
          <el-button size="mini" type="primary" @click="confirmBtn()">确 定</el-button>
        </el-col>
      </el-row>
    </span>
  </el-dialog>
</template>

<script>
import { delInstatnce } from '@/api/activiti'
export default {
  props: {
    isOpenDelProcessInstanceDialog: {
      type: Boolean,
      require: true
    },
    processInstatnceId: {
      type: String, Number,
      require: true,
      default: null
    }
  },
  data() {
    return {
      FormData: {
        'processInstatnceId': null,
        'reason': null
      },
      rules: {
        reason: [{ required: true, message: '请输入删除的原因', trigger: 'blur' }, { min: 1, max: 30, message: '长度不能超过30' }]
      }
    }
  },
  watch: {
    processInstatnceId(value) {
      this.FormData.processInstatnceId = value
    }
  },
  methods: {
    // 确认对话框
    async confirmBtn() {
      await delInstatnce({
        'processInstatnceId': this.FormData.processInstatnceId,
        'reason': this.FormData.reason
      })
      this.$message.success('删除成功')
      this.closeBtn()
    },
    // 关闭对话框
    closeBtn() {
      this.$emit('closeDelProcessInstanceDialog')
    }
  }
}
</script>

<style>

</style>

<template>
  <el-dialog title="流程进度" :visible="isOpenTimeLine">
    <el-card>
      <div class="block">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :icon="activity.icon"
            :type="activity.type"
            :color="activity.color"
            :size="activity.size"
            :timestamp="activity.timestamp"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
    <!-- footer部分 -->
    <span slot="footer" class="dialog-footer">
      <el-row type="flex" justify="center">
        <el-col :span="10">
          <el-button size="mini" @click="closeBtn">取 消</el-button>
          <el-button size="mini" type="primary" @click="confirmBTN">确 定</el-button>
        </el-col>
      </el-row>
    </span>
  </el-dialog>
</template>

<script>
import { getTimeLine } from '@/api/activiti'
export default {
  props: {
    isOpenTimeLine: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      activities: []
    //   activities: [{
    //     content: '支持使用图标',
    //     timestamp: '2018-04-12 20:46',
    //     size: 'large',
    //     type: 'primary',
    //     icon: 'el-icon-more'
    //   }, {
    //     content: '支持自定义颜色',
    //     timestamp: '2018-04-03 20:46',
    //     color: '#0bbd87'
    //   }, {
    //     content: '支持自定义尺寸',
    //     timestamp: '2018-04-03 20:46',
    //     size: 'large'
    //   }, {
    //     content: '默认样式的节点',
    //     timestamp: '2018-04-03 20:46'
    //   }]
    }
  },
  methods: {
    // 获取时间线
    // name: '发起请假', startTime: '2024-01-16', endTime: '2024-01-16', assignee: '13800000000'
    async getTimeLine(processInstatnceId) {
      const res = await getTimeLine(processInstatnceId)
      const arr = []
      res.forEach(function(item, index, obj) {
        const line = {
          content: item.name,
          timestamp: item.endTime === undefined ? '进行中' : item.endTime,
          size: item.endTime === undefined ? '' : 'large',
          color: item.endTime === undefined ? '' : '#0bbd87'
        }
        arr.push(line)
      })

      this.activities = arr
    },
    // 确认按钮事件
    confirmBTN() {
      this.closeBtn()
    },
    // 关闭对话框事件
    closeBtn() {
      this.$emit('closeTimeLine')
    }
  }
}
</script>

<style>

</style>

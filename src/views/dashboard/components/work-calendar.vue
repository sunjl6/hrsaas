<template>
  <div>
    <h2>工作日历</h2>
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" size="small" style="width:120px;margin-right: 10px" placeholder="请选择" @change="dateChange">
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width:120px;" placeholder="请选择" @change="dateChange">
        <el-option
          v-for="item in 12"
          :key="item"
          :label="item"
          :value="item"
        >{{ item }}</el-option>
      </el-select>
    </el-row>
    <el-calendar v-model="currentDate">
      <template
        slot="dateCell"
        slot-scope="{date, data}"
      >
        <p :class="data.isSelected ? 'is-selected' : ''">
          {{ data.day.split('-')[2].startsWith('0') ? data.day.split('-')[2].substr(1) : data.day.split('-')[2] }} {{ data.isSelected ? '✔️' : '' }}
        </p>
        <h5 v-if="isWeek(date)" style="color:red">休息</h5>
      </template>
    </el-calendar>
  </div>

</template>

<script>
export default {
  props: {
    startDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      currentMonth: null, // 当前月份
      currentYear: null, // 当前年份
      currentDate: null,
      yearList: []
    }
  },
  created() {
    this.currentMonth = new Date().getMonth() + 1
    this.currentYear = new Date().getFullYear()
    // 这里通过Array(11) 生成一个长度是11的数组，参数2是个钩子函数 返回的是数字就是数组里的 如果写index 那么就从0，1，2 ... 直到长度11 ，那么我们加上当前年就能往后显示 11个年，再 - 5 就能显示前后5天的数据
    this.yearList = Array.from(Array(11), (value, index) => { return index + this.currentYear - 5 })
  },
  methods: {
    // 判断是否是周末
    isWeek(date) {
      const newDay = (date.getDay())

      return newDay === 6 || newDay === 0
    },
    // 月份变化时间
    dateChange() {
      this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`)
    }
  }
}
</script>

<style scoped>
  .is-selected {
    color: #1989FA;
  }
 /deep/ .el-calendar__header {
   display: none
 }
</style>

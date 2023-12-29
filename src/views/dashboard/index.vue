<template>
  <div class="dashboard-container">
    <!-- 头部部分 -->
    <el-card class="header-card">
      <div>
        <div class="fl headL">
          <div class="headImg">
            <img v-imageerror="defaultImg" :src="photo" style="widht:20px ; height:40px">
          </div>
          <div class="headInfoTip">
            <p class="firstChild">早安，{{ name }}，祝你开心每一天！</p>
            <p class="lastChild">{{ name }}， {{ userInfo.org.name }} - {{ userInfo.station.name }}</p>
          </div>
        </div>
        <div class="fr" />
      </div>
    </el-card>
    <!-- 内容部分 -->
    <el-row class="main" type="flex" justify="space-between" style="margin-top: 20px;">
      <!-- 左边部分 -->
      <el-col class="left" :span="13">
        <el-card>
          <workCalendarVue />
        </el-card>
      </el-col>
      <!-- 右边部分 -->
      <el-col class="right" :span="13">
        <el-card>
          申请流程
          申请流程
          申请流程
          申请流程
          申请流程
          申请流程
          申请流程
          申请流程
          申请流程
          申请流程
          申请流程
          申请流程
        </el-card>
        <el-card>
          <radar />
        </el-card>
      </el-col>
    </el-row></div>
</template>

<script>
import { mapGetters } from 'vuex'
import workCalendarVue from './components/work-calendar.vue'
import radar from './components/radar.vue'
export default {
  name: 'Dashboard',
  components: {
    workCalendarVue,
    radar
  },
  data() {
    return {
      defaultImg: require('@/assets/common/head.jpg')
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'photo',
      'userInfo'
    ])
  },
  created() {
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.dashboard-container{
  .main{
    .left{
      margin-right: 20px;
      .el-card{
        margin-bottom: 10px;
      }
    }
    .right{
      .el-card{
        margin-bottom: 10px;
      }
    }
  }
}
</style>

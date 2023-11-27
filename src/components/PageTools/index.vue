<template>
  <el-card class="page-tools">
    <!-- 左边自定义插槽 -->
    <el-row type="flex">
      <el-col>
        <div v-if="showBefore" class="before">
          <i class="el-icon-warning" />
          <slot name="before" />
        </div>
      </el-col>
      <!-- 右边自定义插槽 -->
      <el-col>
        <el-row type="flex" justify="end">
          <slot name="after" />
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  props: {
    showBefore: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang='scss'>
 .page-tools {
    margin: 10px 0;
    .before {
      line-height: 34px;
    i {
      margin-right: 5px;
      color: #409eff;
    }
    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
 }
</style>

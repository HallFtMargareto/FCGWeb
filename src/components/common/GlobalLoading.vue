<template>
  <div v-if="loadingFlag" class="global-loading-mask">
    <div class="global-loading-spinner">
      <el-loading-spinner :size="size"></el-loading-spinner>
      <p v-if="text" class="global-loading-text">{{ text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlobalLoading',
  props: {
    loadingFlag: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '加载中'
    },
    size: {
      type: String,
      default: '50px'
    }
  }
}
</script>

<style scoped>
.global-loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3000; /* 确保比el-dialog的z-index(2050)高 */
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.global-loading-spinner {
  text-align: center;
  background-color: white;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.global-loading-text {
  margin-top: 10px;
  color: #606266;
}
</style>
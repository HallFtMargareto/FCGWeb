<template>
  <div v-if="isVisible" class="system-notice">
    <div class="notice-container">
      <div
        class="notice-content"
        :style="{ animationDuration: animationDuration }"
      >
        <span class="notice-text">{{ noticeText }}</span>
      </div>
    </div>
    <button class="close-button" @click="closeNotice">
      <i class="el-icon-close"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: "SystemNotice",
  data() {
    return {
      isVisible: true,
      noticeText:
        "温馨提示：平台生成的所有数据及模拟分析结果仅为信息参考与交流目的，不构成任何形式的投资或购买建议。为保障您的合法权益，购买彩票请务必通过国家批准的官方正规渠道进行。",
      animationDuration: "40s", // 滚动动画持续时间
    };
  },
  methods: {
    closeNotice() {
      this.isVisible = false;
    },
  },
};
</script>

<style scoped>
.system-notice {
  position: fixed;
  top: 15px;
  left: 20%;
  width: 70%;
  /* background-color: #fff3cd; */
  /* border-bottom: 1px solid #ffeaa7; */
  /* overflow: hidden; */
  z-index: 2000;
  /* -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.notice-container {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  box-sizing: border-box;
  padding: 8px 0;
}

.notice-content {
  display: inline-block;
  white-space: nowrap;
  animation: scrollText linear infinite;
  padding-left: 100%;
}

.notice-text {
  color: red;
  font-size: 14px;
  font-weight: 500;
  padding-right: 50px; /* 确保两次滚动之间有间隔 */
}

.close-button {
  background: none;
  border: none;
  color: #856404;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.close-button:focus {
  outline: none;
}

@keyframes scrollText {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .notice-text {
    font-size: 12px;
  }

  .system-notice {
    padding: 6px 0;
  }

  .close-button {
    padding: 6px 10px;
    font-size: 14px;
  }
}
</style>
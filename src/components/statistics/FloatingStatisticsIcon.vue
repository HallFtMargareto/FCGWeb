<template>
  <div class="floating-statistics-icon" @click="handleClick" title="统计数据">
    <i class="el-icon-data-line" :class="{ rotating: refreshing }"></i>
    <div v-if="refreshing" class="loading-indicator"></div>
  </div>
</template>

<script>
export default {
  name: "FloatingStatisticsIcon",
  data() {
    return {
      refreshing: false,
    };
  },
  methods: {
    async handleClick() {
      if (this.refreshing) return;

      this.refreshing = true;
      try {
        // 先触发数据更新
        await this.$store.dispatch("statistics/fetchLatestIssueStatistics");

        // 更新完成后，打开统计组件
        this.$emit("toggle-statistics");
      } catch (error) {
        console.warn("获取统计数据失败:", error);
        // 即使更新失败，也打开统计组件
        this.$emit("toggle-statistics");
      } finally {
        this.refreshing = false;
      }
    },
  },
};
</script>

<style scoped>
.floating-statistics-icon {
  position: fixed;
  right: 20px;
  bottom: 20%;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #409eff, #337ecc);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  z-index: 1999;
  transition: all 0.3s ease;
}

.floating-statistics-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.4);
  background: linear-gradient(135deg, #337ecc, #2c6bb0);
}

.floating-statistics-icon:active {
  transform: scale(0.95);
}

.floating-statistics-icon i {
  font-size: 24px;
  color: white;
  transition: transform 0.3s ease;
}

.floating-statistics-icon i.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-indicator {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  background: #67c23a;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(0.8);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .floating-statistics-icon {
    width: 45px;
    height: 45px;
    right: 15px;
    bottom: 25%;
  }

  .floating-statistics-icon i {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .floating-statistics-icon {
    width: 40px;
    height: 40px;
    right: 10px;
    bottom: 30%;
  }

  .floating-statistics-icon i {
    font-size: 18px;
  }
}
</style>

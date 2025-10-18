<template>
  <div
    v-if="isVisible"
    :class="['statistics-display', floating ? 'floating' : 'compact']"
  >
    <!-- 控制栏 -->
    <div class="control-bar">
      <span class="title">统计数据</span>
      <div class="actions">
        <el-button
          type="text"
          size="mini"
          @click="refreshData"
          :loading="refreshing"
          class="refresh-btn"
        >
          {{ refreshing ? "刷新中..." : "刷新" }}
        </el-button>
        <el-button
          type="text"
          size="mini"
          @click="closeComponent"
          class="close-btn"
        >
          ✕
        </el-button>
      </div>
    </div>

    <!-- 期号信息 -->
    <div v-if="currentIssue" class="issue-info">
      <div class="issue-card">
        <div class="issue-header">
          <span class="issue-title">期号信息</span>
        </div>
        <div class="issue-content">
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">期号:</span>
              <span class="info-value">{{ currentIssue.issue_number }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">类型:</span>
              <span class="info-value">{{
                formatLotteryType(currentIssue.lottery_type)
              }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">状态:</span>
              <el-tag :type="getStatusType(currentIssue.status)" size="mini">
                {{ formatStatus(currentIssue.status) }}
              </el-tag>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">开奖时间:</span>
              <span class="info-value">{{
                formatDateTime(currentIssue.draw_time)
              }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">福彩:</span>
              <span
                class="draw-number fucai"
                v-html="formatDrawNumber(currentIssue.fc_draw_number)"
              ></span>
            </div>
            <div class="info-item">
              <span class="info-label">体彩:</span>
              <span
                class="draw-number ticai"
                v-html="formatDrawNumber(currentIssue.tc_draw_number)"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计数据 -->
    <div v-if="statistics" class="stats-container">
      <!-- 总体统计 -->
      <div class="stats-section">
        <div class="stats-card">
          <div class="card-header">
            <span class="card-title">总体统计</span>
          </div>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value primary">
                {{ statistics.total_order_count || 0 }}
              </div>
              <div class="stat-label">总订单</div>
            </div>
            <div class="stat-item">
              <div class="stat-value success">
                ¥{{ formatAmount(statistics.total_bet_amount) }}
              </div>
              <div class="stat-label">总投注</div>
            </div>
            <div class="stat-item">
              <div class="stat-value warning">
                ¥{{ formatAmount(statistics.total_commission) }}
              </div>
              <div class="stat-label">总佣金</div>
            </div>
            <div class="stat-item">
              <div class="stat-value danger">
                ¥{{ formatAmount(statistics.total_win_amount) }}
              </div>
              <div class="stat-label">总中奖</div>
            </div>
            <div class="stat-item">
              <div class="stat-value info">
                {{ statistics.total_win_order_count || 0 }}
              </div>
              <div class="stat-label">中奖单</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ calculateWinRate() }}%</div>
              <div class="stat-label">中奖率</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 福彩统计 -->
      <div class="stats-section">
        <div class="stats-card">
          <div class="card-header">
            <span class="card-title">福彩统计</span>
          </div>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value primary">
                {{ statistics.fu_cai_order_count || 0 }}
              </div>
              <div class="stat-label">福彩订单</div>
            </div>
            <div class="stat-item">
              <div class="stat-value success">
                ¥{{ formatAmount(statistics.fu_cai_bet_amount) }}
              </div>
              <div class="stat-label">福彩投注</div>
            </div>
            <div class="stat-item">
              <div class="stat-value warning">
                ¥{{ formatAmount(statistics.fu_cai_commission) }}
              </div>
              <div class="stat-label">福彩佣金</div>
            </div>
            <div class="stat-item">
              <div class="stat-value danger">
                ¥{{ formatAmount(statistics.fu_cai_win_amount) }}
              </div>
              <div class="stat-label">福彩中奖</div>
            </div>
            <div class="stat-item">
              <div class="stat-value info">
                {{ statistics.fu_cai_win_order_count || 0 }}
              </div>
              <div class="stat-label">福彩中奖单</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ calculateFuCaiWinRate() }}%</div>
              <div class="stat-label">福彩中奖率</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 体彩统计 -->
      <div class="stats-section">
        <div class="stats-card">
          <div class="card-header">
            <span class="card-title">体彩统计</span>
          </div>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value primary">
                {{ statistics.ti_cai_order_count || 0 }}
              </div>
              <div class="stat-label">体彩订单</div>
            </div>
            <div class="stat-item">
              <div class="stat-value success">
                ¥{{ formatAmount(statistics.ti_cai_bet_amount) }}
              </div>
              <div class="stat-label">体彩投注</div>
            </div>
            <div class="stat-item">
              <div class="stat-value warning">
                ¥{{ formatAmount(statistics.ti_cai_commission) }}
              </div>
              <div class="stat-label">体彩佣金</div>
            </div>
            <div class="stat-item">
              <div class="stat-value danger">
                ¥{{ formatAmount(statistics.ti_cai_win_amount) }}
              </div>
              <div class="stat-label">体彩中奖</div>
            </div>
            <div class="stat-item">
              <div class="stat-value info">
                {{ statistics.ti_cai_win_order_count || 0 }}
              </div>
              <div class="stat-label">体彩中奖单</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ calculateTiCaiWinRate() }}%</div>
              <div class="stat-label">体彩中奖率</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="loading-text">正在加载统计数据...</div>

    <div v-else class="no-data-text">暂无统计数据</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "StatisticsDisplay",
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    floating: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isVisible: this.visible,
      refreshing: false,
    };
  },
  computed: {
    ...mapGetters("statistics", [
      "currentStatistics",
      "statisticsLoading",
      "currentIssue",
    ]),
    statistics() {
      return this.currentStatistics;
    },
    loading() {
      return this.statisticsLoading;
    },
  },
  watch: {
    visible(newVal) {
      this.isVisible = newVal;
    },
  },
  methods: {
    // 关闭组件
    closeComponent() {
      this.isVisible = false;
      this.$emit("close");
    },

    // 刷新数据
    async refreshData() {
      this.refreshing = true;
      try {
        await this.$store.dispatch("statistics/fetchLatestIssueStatistics");
        // 移除成功提示消息
      } catch (error) {
        this.$message.error("数据刷新失败: " + (error.message || "未知错误"));
      } finally {
        this.refreshing = false;
      }
    },

    formatAmount(amount) {
      if (!amount) return "0.00";
      return parseFloat(amount).toFixed(2);
    },

    formatDateTime(dateTime) {
      if (!dateTime) return "-";
      return new Date(dateTime).toLocaleString("zh-CN");
    },

    formatLotteryType(type) {
      const typeMap = {
        fucai: "福彩",
        ticai: "体彩",
      };
      return typeMap[type] || type;
    },

    formatStatus(status) {
      const statusMap = {
        0: "正常",
        1: "关闭",
        2: "封盘",
        3: "已开奖",
        open: "开放",
        closed: "已关闭",
        drawn: "已开奖",
      };
      return statusMap[status] || status;
    },

    getStatusType(status) {
      const typeMap = {
        0: "success",
        1: "warning",
        2: "danger",
        3: "info",
        open: "success",
        closed: "warning",
        drawn: "info",
      };
      return typeMap[status] || "info";
    },

    formatDrawNumber(number) {
      if (!number) return "待开奖";
      // 如果号码包含逗号，分割成数组显示
      if (number.includes(",")) {
        const numbers = number.split(",");
        return numbers
          .map((num, index) => {
            if (index === numbers.length - 1) {
              return `<span class="special-number">${num}</span>`;
            }
            return `<span class="normal-number">${num}</span>`;
          })
          .join(" ");
      }
      return number;
    },

    calculateWinRate() {
      if (
        !this.statistics ||
        !this.statistics.total_order_count ||
        this.statistics.total_order_count === 0
      ) {
        return "0.00";
      }
      const rate =
        (this.statistics.total_win_order_count /
          this.statistics.total_order_count) *
        100;
      return rate.toFixed(2);
    },

    calculateFuCaiWinRate() {
      if (
        !this.statistics ||
        !this.statistics.fu_cai_order_count ||
        this.statistics.fu_cai_order_count === 0
      ) {
        return "0.00";
      }
      const rate =
        (this.statistics.fu_cai_win_order_count /
          this.statistics.fu_cai_order_count) *
        100;
      return rate.toFixed(2);
    },

    calculateTiCaiWinRate() {
      if (
        !this.statistics ||
        !this.statistics.ti_cai_order_count ||
        this.statistics.ti_cai_order_count === 0
      ) {
        return "0.00";
      }
      const rate =
        (this.statistics.ti_cai_win_order_count /
          this.statistics.ti_cai_order_count) *
        100;
      return rate.toFixed(2);
    },
  },
};
</script>

<style scoped>
/* 紧凑布局样式 */
/* 浮动样式 */
.statistics-display.floating {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #e4e7ed;
  z-index: 2000;
}

/* 紧凑布局样式 */
.statistics-display.compact {
  padding: 8px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

/* 控制栏样式 */
.control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.control-bar .title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.actions {
  display: flex;
  gap: 8px;
}

.refresh-btn {
  color: #409eff;
  font-size: 12px;
  padding: 2px 8px;
}

.refresh-btn:hover {
  color: #337ecc;
  background: #ecf5ff;
}

.close-btn {
  color: #909399;
  font-size: 14px;
  padding: 2px 6px;
  font-weight: bold;
}

.close-btn:hover {
  color: #f56c6c;
  background: #fef0f0;
}

/* 期号信息样式 - 紧凑版 */
.issue-info {
  margin-bottom: 12px;
}

.issue-card {
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 12px;
}

.issue-header {
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-bottom: 8px;
}

.issue-title {
  font-size: 13px;
  color: #303133;
}

.issue-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-label {
  font-weight: 500;
  color: #606266;
  font-size: 12px;
  min-width: 50px;
}

.info-value {
  color: #303133;
  font-weight: 500;
  font-size: 12px;
}

/* 开奖号码样式 - 紧凑版 */
.draw-number {
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
}

.draw-number.fucai {
  color: #e6a23c;
}

.draw-number.ticai {
  color: #409eff;
}

.draw-number /deep/ .normal-number {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  background: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 50%;
  margin: 0 1px;
  font-size: 10px;
  color: #606266;
}

.draw-number.fucai /deep/ .normal-number {
  background: #fdf6ec;
  border-color: #f5dab1;
  color: #e6a23c;
}

.draw-number.ticai /deep/ .normal-number {
  background: #ecf5ff;
  border-color: #b3d8ff;
  color: #409eff;
}

.draw-number /deep/ .special-number {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 50%;
  margin: 0 1px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.draw-number.fucai /deep/ .special-number {
  background: linear-gradient(135deg, #e6a23c, #d39e00);
  box-shadow: 0 1px 2px rgba(230, 162, 60, 0.3);
}

.draw-number.ticai /deep/ .special-number {
  background: linear-gradient(135deg, #409eff, #337ecc);
  box-shadow: 0 1px 2px rgba(64, 158, 255, 0.3);
}

/* 统计数据容器 */
.stats-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 统计卡片样式 - 紧凑版 */
.stats-section {
  margin-bottom: 0;
}

.stats-card {
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 10px;
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-bottom: 8px;
}

.card-title {
  font-size: 13px;
  color: #303133;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.stat-item {
  text-align: center;
  padding: 8px 4px;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  transition: all 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-color: #409eff;
}

.stat-value {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  line-height: 1.2;
}

.stat-value.primary {
  color: #409eff;
}

.stat-value.success {
  color: #67c23a;
}

.stat-value.warning {
  color: #e6a23c;
}

.stat-value.danger {
  color: #f56c6c;
}

.stat-value.info {
  color: #909399;
}

.stat-label {
  font-size: 10px;
  color: #606266;
  font-weight: 500;
  line-height: 1.2;
}

/* 加载和无数据状态 - 紧凑版 */
.loading-text,
.no-data-text {
  text-align: center;
  padding: 30px 0;
  color: #909399;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .stat-value {
    font-size: 13px;
  }

  .stat-label {
    font-size: 9px;
  }

  .statistics-display.floating {
    width: 350px;
    right: 10px;
  }
}

@media (max-width: 768px) {
  .statistics-display.compact {
    padding: 6px;
  }

  .statistics-display.floating {
    width: 320px;
    right: 5px;
    top: 70px;
    max-height: 85vh;
  }

  .control-bar {
    padding: 6px 8px;
    margin-bottom: 8px;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }

  .stat-item {
    padding: 6px 3px;
  }

  .stat-value {
    font-size: 12px;
  }

  .stat-label {
    font-size: 9px;
  }
}

@media (max-width: 480px) {
  .statistics-display.floating {
    width: 95%;
    right: 2.5%;
    left: 2.5%;
    top: 60px;
    max-height: 90vh;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
  }

  .stat-item {
    padding: 4px 2px;
  }

  .stat-value {
    font-size: 11px;
  }

  .stat-label {
    font-size: 8px;
  }
}
</style>

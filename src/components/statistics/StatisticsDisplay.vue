<template>
  <div class="statistics-display">
    <!-- 期号信息 -->
    <div v-if="currentIssue" class="issue-info">
      <el-card class="issue-card">
        <div slot="header" class="issue-header">
          <span class="issue-title">期号信息</span>
        </div>
        <el-row :gutter="16">
          <el-col :span="6">
            <div class="info-item">
              <span class="info-label">期号:</span>
              <span class="info-value">{{ currentIssue.issue_number }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <span class="info-label">彩票类型:</span>
              <span class="info-value">{{
                formatLotteryType(currentIssue.lottery_type)
              }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <span class="info-label">状态:</span>
              <el-tag :type="getStatusType(currentIssue.status)">
                {{ formatStatus(currentIssue.status) }}
              </el-tag>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <span class="info-label">开奖时间:</span>
              <span class="info-value">{{
                formatDateTime(currentIssue.draw_time)
              }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="16" style="margin-top: 16px;">
          <el-col :span="12">
            <div class="info-item">
              <span class="info-label">福彩开奖号码:</span>
              <span class="draw-number fucai" v-html="formatDrawNumber(currentIssue.fc_draw_number)"></span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="info-label">体彩开奖号码:</span>
              <span class="draw-number ticai" v-html="formatDrawNumber(currentIssue.tc_draw_number)"></span>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 总体统计 -->
    <div v-if="statistics" class="stats-section">
      <el-card class="stats-card">
        <div slot="header" class="card-header">
          <span class="card-title">总体统计</span>
        </div>
        <el-row :gutter="16">
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value primary">
                {{ statistics.total_order_count || 0 }}
              </div>
              <div class="stat-label">总订单数</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value success">
                ¥{{ formatAmount(statistics.total_bet_amount) }}
              </div>
              <div class="stat-label">总投注金额</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value warning">
                ¥{{ formatAmount(statistics.total_commission) }}
              </div>
              <div class="stat-label">总佣金</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value danger">
                ¥{{ formatAmount(statistics.total_win_amount) }}
              </div>
              <div class="stat-label">总中奖金额</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value info">
                {{ statistics.total_win_order_count || 0 }}
              </div>
              <div class="stat-label">中奖订单数</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value">{{ calculateWinRate() }}%</div>
              <div class="stat-label">中奖率</div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 福彩统计 -->
    <div v-if="statistics" class="stats-section">
      <el-card class="stats-card">
        <div slot="header" class="card-header">
          <span class="card-title">福彩统计</span>
        </div>
        <el-row :gutter="16">
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value primary">
                {{ statistics.fu_cai_order_count || 0 }}
              </div>
              <div class="stat-label">福彩订单数</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value success">
                ¥{{ formatAmount(statistics.fu_cai_bet_amount) }}
              </div>
              <div class="stat-label">福彩投注金额</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value warning">
                ¥{{ formatAmount(statistics.fu_cai_commission) }}
              </div>
              <div class="stat-label">福彩佣金</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value danger">
                ¥{{ formatAmount(statistics.fu_cai_win_amount) }}
              </div>
              <div class="stat-label">福彩中奖金额</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value info">
                {{ statistics.fu_cai_win_order_count || 0 }}
              </div>
              <div class="stat-label">福彩中奖订单数</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value">{{ calculateFuCaiWinRate() }}%</div>
              <div class="stat-label">福彩中奖率</div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 体彩统计 -->
    <div v-if="statistics" class="stats-section">
      <el-card class="stats-card">
        <div slot="header" class="card-header">
          <span class="card-title">体彩统计</span>
        </div>
        <el-row :gutter="16">
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value primary">
                {{ statistics.ti_cai_order_count || 0 }}
              </div>
              <div class="stat-label">体彩订单数</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value success">
                ¥{{ formatAmount(statistics.ti_cai_bet_amount) }}
              </div>
              <div class="stat-label">体彩投注金额</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value warning">
                ¥{{ formatAmount(statistics.ti_cai_commission) }}
              </div>
              <div class="stat-label">体彩佣金</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value danger">
                ¥{{ formatAmount(statistics.ti_cai_win_amount) }}
              </div>
              <div class="stat-label">体彩中奖金额</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value info">
                {{ statistics.ti_cai_win_order_count || 0 }}
              </div>
              <div class="stat-label">体彩中奖订单数</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value">{{ calculateTiCaiWinRate() }}%</div>
              <div class="stat-label">体彩中奖率</div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <div v-else-if="loading" class="loading-text">正在加载统计数据...</div>

    <div v-else class="no-data-text">暂无统计数据</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "StatisticsDisplay",
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
  methods: {
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
      if (number.includes(',')) {
        const numbers = number.split(',');
        return numbers.map((num, index) => {
          if (index === numbers.length - 1) {
            return `<span class="special-number">${num}</span>`;
          }
          return `<span class="normal-number">${num}</span>`;
        }).join(' ');
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
.statistics-display {
  padding: 16px;
}

/* 期号信息样式 */
.issue-info {
  margin-bottom: 20px;
}

.issue-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.issue-header {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.issue-title {
  font-size: 16px;
  color: #303133;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.info-label {
  font-weight: 500;
  color: #606266;
  margin-right: 8px;
  min-width: 70px;
}

.info-value {
  color: #303133;
  font-weight: 500;
}

/* 开奖号码样式 */
.draw-number {
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
}

.draw-number.fucai {
  color: #e6a23c;
}

.draw-number.ticai {
  color: #409eff;
}

.draw-number /deep/ .normal-number {
  display: inline-block;
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  background: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 50%;
  margin: 0 2px;
  font-size: 14px;
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
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 50%;
  margin: 0 2px;
  font-size: 16px;
  font-weight: bold;
  color: white;
}

.draw-number.fucai /deep/ .special-number {
  background: linear-gradient(135deg, #e6a23c, #d39e00);
  box-shadow: 0 2px 4px rgba(230, 162, 60, 0.3);
}

.draw-number.ticai /deep/ .special-number {
  background: linear-gradient(135deg, #409eff, #337ecc);
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.3);
}

/* 统计卡片样式 */
.stats-section {
  margin-bottom: 20px;
}

.stats-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.card-title {
  font-size: 16px;
  color: #303133;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
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
  font-size: 12px;
  color: #606266;
  font-weight: 500;
}

/* 加载和无数据状态 */
.loading-text,
.no-data-text {
  text-align: center;
  padding: 60px 0;
  color: #909399;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stat-value {
    font-size: 18px;
  }

  .stat-label {
    font-size: 11px;
  }
}

@media (max-width: 768px) {
  .statistics-display {
    padding: 8px;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .info-label {
    margin-bottom: 4px;
  }

  .stat-value {
    font-size: 16px;
  }

  .stat-label {
    font-size: 10px;
  }
}
</style>

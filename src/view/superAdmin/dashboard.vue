<template>
  <div class="dashboard-container">
    <!-- 欢迎横幅 -->
    <!-- <el-card class="welcome-banner" shadow="never">
      <div class="banner-content">
        <div class="avatar-section">
          <el-avatar :size="60" :src="Info.logo" class="user-avatar"></el-avatar>
        </div>
        <div class="info-section">
          <h2>{{ greeting }}，欢迎使用 {{ Info.site_name }}</h2>
          <p class="subtitle">福彩数据分析平台</p>
        </div>
        <div class="date-section">
          <el-date-picker v-model="selectedDate" type="date" placeholder="选择日期" size="small" class="date-picker" />
        </div>
      </div>
    </el-card> -->

    <!-- 全部订单状态 -->
    <el-card class="section-card" shadow="never">
      <div slot="header" class="card-header">
        <span class="section-title">订单状态</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="4" v-for="item in dashboardData.orderSatus" :key="item.key">
          <el-card shadow="hover" class="stat-card" :class="item.colorClass">
            <div class="stat-content" @click="navigateToOrder(item.key)">
              <i :class="['stat-icon', item.icon]"></i>
              <div class="stat-value">{{ item.value }}</div>
              <div class="stat-label">{{ item.label }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <!-- 今日投注信息 -->
    <el-card class="section-card" shadow="never">
      <div slot="header" class="card-header">
        <span class="section-title">今日投注信息</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="8" v-for="item in dashboardData.todayStats" :key="item.key">
          <el-card shadow="hover" class="detail-card">
            <div slot="header" class="clearfix detail-card-header" :class="item.colorClass">
              <span>{{ item.title }}</span>
            </div>
            <div class="detail-content">
              <div class="detail-item" v-for="stat in item.stats" :key="stat.key">
                <div class="detail-label">{{ stat.label }}</div>
                <div class="detail-value" :class="item.colorClass">{{ stat.value }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <!-- 全部投注信息 -->
    <el-card class="section-card" shadow="never">
      <div slot="header" class="card-header">
        <span class="section-title">全部投注信息</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="8" v-for="item in dashboardData.totalStats" :key="item.key">
          <el-card shadow="hover" class="detail-card">
            <div slot="header" class="clearfix detail-card-header" :class="item.colorClass">
              <span>{{ item.title }}</span>
            </div>
            <div class="detail-content">
              <div class="detail-item" v-for="stat in item.stats" :key="stat.key">
                <div class="detail-label">{{ stat.label }}</div>
                <div class="detail-value" :class="item.colorClass">{{ stat.value }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <!-- 中奖派奖 -->
    <el-card class="section-card" shadow="never">
      <div slot="header" class="card-header">
        <span class="section-title">中奖派奖</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="6" v-for="item in dashboardData.awardStats" :key="item.key">
          <el-card shadow="hover" class="award-card">
            <div class="award-content">
              <div class="award-value" :class="item.colorClass">{{ item.value }}</div>
              <div class="award-label">{{ item.label }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getFcgOrderSummary
} from "@/api/fcgame/fcg_order";

export default {
  name: "DashboardPage",
  data() {
    return {
      // 欢迎信息
      greeting: this.getGreeting(),
      selectedDate: new Date(),
      // 站点信息
      Info: {
        site_name: "FCGame管理系统",
        logo: "https://dgzyx.cn/static/logo.png"
      },
      dashboardData: {

        // 待处理投注
        orderSatus: [
          { key: "all", icon: "el-icon-s-data", value: 0, label: "全部订单", colorClass: "primary" },
          { key: "pending", icon: "el-icon-loading", value: 0, label: "待识别", colorClass: "warning" },
          { key: "failed", icon: "el-icon-circle-close", value: 0, label: "识别失败", colorClass: "danger" },
          { key: "success", icon: "el-icon-check", value: 0, label: "识别成功", colorClass: "success" },
          { key: "notWin", icon: "el-icon-close", value: 0, label: "未中奖", colorClass: "warning" },
          { key: "win", icon: "el-icon-success", value: 0, label: "已中奖", colorClass: "success" }
        ],

        // 今日投注信息
        todayStats: [
          {
            key: "all",
            title: "全部投注",
            colorClass: "primary",
            stats: [
              { key: "amount", label: "投注金额", value: "¥0.00" },
              { key: "denomination", label: "投注注数", value: 0 },
              { key: "order", label: "投注笔数", value: 0 },
              { key: "profit", label: "利润", value: 0 },
              { key: "commission", label: "佣金", value: 0 },
            ]
          },
          {
            key: "opened",
            title: "已开奖",
            colorClass: "success",
            stats: [
              { key: "amount", label: "投注金额", value: "¥0.00" },
              { key: "denomination", label: "投注注数", value: 0 },
              { key: "order", label: "投注笔数", value: 0 }
            ]
          },
          {
            key: "win",
            title: "中奖投注",
            colorClass: "danger",
            stats: [
              { key: "amount", label: "中奖金额", value: "¥0.00" },
              { key: "denomination", label: "中奖注数", value: 0 },
              { key: "order", label: "中奖笔数", value: 0 }
            ]
          }
        ],

        // 全部投注信息
        totalStats: [
          {
            key: "all",
            title: "全部投注",
            colorClass: "primary",
            stats: [
              { key: "amount", label: "投注金额", value: "¥0.00" },
              { key: "denomination", label: "投注注数", value: 0 },
              { key: "order", label: "投注笔数", value: 0 }
            ]
          },
          {
            key: "opened",
            title: "已开奖",
            colorClass: "success",
            stats: [
              { key: "amount", label: "投注金额", value: "¥0.00" },
              { key: "denomination", label: "投注注数", value: 0 },
              { key: "order", label: "投注笔数", value: 0 }
            ]
          },
          {
            key: "win",
            title: "中奖投注",
            colorClass: "danger",
            stats: [
              { key: "amount", label: "中奖金额", value: "¥0.00" },
              { key: "denomination", label: "中奖注数", value: 0 },
              { key: "order", label: "中奖笔数", value: 0 }
            ]
          }
        ],

        // 中奖派奖
        awardStats: [
          { key: "totalWin", value: "¥0.00", label: "总中奖金额", colorClass: "success" },
          { key: "totalUsers", value: 0, label: "总用户数", colorClass: "warning" },
          { key: "activeUsers", value: 0, label: "活跃用户", colorClass: "primary" },
          { key: "pendingAward", value: 0, label: "待派奖笔数", colorClass: "danger" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters("common", ["siteInfo"]),
  },
  methods: {
    formattedVal(val) {
      return (val / 10000).toFixed(2);
    },
    getGreeting() {
      const now = new Date();
      const hour = now.getHours();
      if (hour >= 6 && hour < 12) {
        return "上午好";
      } else if (hour >= 12 && hour < 18) {
        return "下午好";
      } else {
        return "晚上好";
      }
    },
    // 导航到订单页面并传递状态参数
    navigateToOrder(status) {
      // 状态映射关系
      const statusMap = {
        'all': '',  // 全部订单不需要传递状态参数
        'pending': '0',  // 待识别
        'failed': '1',  // 识别失败
        'success': '2',  // 识别成功
        'notWin': '3',  // 未中奖
        'win': '4'  // 已中奖
      };

      // 跳转到订单页面，根据状态传递参数
      const query = {};
      if (status !== 'all') {
        query.status = statusMap[status];
      }

      this.$router.push({
        name: 'fcg_order',
        query: query
      });
    }
  },
  async created() {
    // 如果有API接口，可以在这里获取真实数据
    // const res = await getSysRechargeOrderDashboard();
    // this.dashboardData.day = res.data.day;
    // this.dashboardData.total = res.data.total;
    const res = await getFcgOrderSummary(this.searchInfo);
    this.dashboardData = res.data.summary

    // 更新站点信息
    if (this.siteInfo) {
      this.Info = this.siteInfo;
    }
  }
};
</script>

<style scoped lang="scss">
.dashboard-container {
  padding: 20px;
  background-color: #f5f7f9;
  min-height: calc(100vh - 84px);
}

// 欢迎横幅
.welcome-banner {
  margin-bottom: 20px;
  border-radius: 8px;
  background: linear-gradient(120deg, #409eff, #64b5f6);
  color: white;

  .banner-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;

    .avatar-section {
      flex: 0 0 auto;
    }

    .info-section {
      flex: 1;
      padding: 0 30px;

      h2 {
        margin: 0 0 10px 0;
        font-size: 22px;
        font-weight: 500;
      }

      .subtitle {
        margin: 0;
        font-size: 14px;
        opacity: 0.9;
      }
    }

    .date-section {
      flex: 0 0 auto;
    }
  }
}

.user-avatar {
  background-color: rgba(255, 255, 255, 0.2);
}

.date-picker {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  border: none;

  ::v-deep .el-input__inner {
    background: transparent;
    border: none;
    color: white;

    &::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  ::v-deep .el-input__icon {
    color: white;
  }
}

// 通用卡片样式
.section-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

  ::v-deep .el-card__header {
    padding: 15px 20px;
    border-bottom: 1px solid #ebeef5;
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

// 待处理订单卡片
.stat-card {
  border: none;
  border-radius: 6px;
  height: 120px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.primary {
    background-color: #ecf5ff;
    color: #409eff;
  }

  &.success {
    background-color: #f0f9eb;
    color: #67c23a;
  }

  &.warning {
    background-color: #fdf6ec;
    color: #e6a23c;
  }

  &.danger {
    background-color: #fef0f0;
    color: #f56c6c;
  }

  .stat-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .stat-icon {
    font-size: 28px;
    margin-bottom: 8px;
  }

  .stat-value {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 12px;
    opacity: 0.8;
  }
}

// 详细信息卡片
.detail-card {
  border: none;
  border-radius: 6px;

  .detail-card-header {
    border-bottom: none;
    padding: 12px 15px;
    font-weight: 500;

    &.primary {
      background-color: #ecf5ff;
      color: #409eff;
    }

    &.success {
      background-color: #f0f9eb;
      color: #67c23a;
    }

    &.warning {
      background-color: #fdf6ec;
      color: #e6a23c;
    }

    &.danger {
      background-color: #fef0f0;
      color: #f56c6c;
    }
  }

  .detail-content {
    padding: 15px;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;

    &:not(:last-child) {
      border-bottom: 1px solid #f0f2f5;
    }
  }

  .detail-label {
    font-size: 14px;
    color: #606266;
  }

  .detail-value {
    font-size: 16px;
    font-weight: 500;

    &.primary {
      color: #409eff;
    }

    &.success {
      color: #67c23a;
    }

    &.warning {
      color: #e6a23c;
    }

    &.danger {
      color: #f56c6c;
    }
  }
}

// 中奖派奖卡片
.award-card {
  border: none;
  border-radius: 6px;
  height: 100px;

  .award-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .award-value {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 6px;

    &.primary {
      color: #409eff;
    }

    &.success {
      color: #67c23a;
    }

    &.warning {
      color: #e6a23c;
    }

    &.danger {
      color: #f56c6c;
    }
  }

  .award-label {
    font-size: 12px;
    color: #909399;
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .el-col-4 {
    width: 33.333%;
  }

  .el-col-6 {
    width: 50%;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 15px;
  }

  .banner-content {
    flex-direction: column;
    text-align: center;

    .info-section {
      padding: 15px 0;
    }
  }

  .el-col-4,
  .el-col-6,
  .el-col-8 {
    width: 100%;
    margin-bottom: 10px;
  }

  .stat-card,
  .award-card {
    height: auto;
    min-height: 100px;
  }
}
</style>
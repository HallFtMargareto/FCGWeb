<template>
  <div class="dashboard-container">
    <el-card class="welcome-card" shadow="never">
      <div class="welcome-info">
        <h3>{{ getGreeting() }}, 管理员</h3>
        <p>当前统计期号：{{ summaryData.issue_no }}</p>
      </div>
      <div class="quick-nav">
        <IssueSelect
          v-model="searchInfo.issue_id"
          placeholder="请选择彩期"
          clearable
        ></IssueSelect>

        <template v-if="userInfo.perm['host']">
          -
          <TenantSelect
            v-model="searchInfo.tenant_id"
            placeholder="请选择组织"
            :autoSelectFirst="false"
            clearable
          ></TenantSelect>
          -
        </template>

        <el-button @click="changeSelect">查询</el-button>
      </div>
    </el-card>

    <!-- 统计卡片 -->
    <div class="stat-cards">
      <el-card
        class="stat-card"
        shadow="never"
        :body-style="{ padding: '16px' }"
      >
        <div class="stat-item">
          <div class="stat-label">总投注金额</div>
          <div class="stat-value">¥{{ totalBetAmount }}</div>
        </div>
      </el-card>
      <el-card
        class="stat-card"
        shadow="never"
        :body-style="{ padding: '16px' }"
      >
        <div class="stat-item">
          <div class="stat-label">总佣金</div>
          <div class="stat-value">¥{{ totalCommission }}</div>
        </div>
      </el-card>
      <el-card
        class="stat-card"
        shadow="never"
        :body-style="{ padding: '16px' }"
      >
        <div class="stat-item">
          <div class="stat-label">总中奖金额</div>
          <div class="stat-value">¥{{ totalWinAmount }}</div>
        </div>
      </el-card>

      <el-card
        class="stat-card"
        shadow="never"
        :body-style="{ padding: '16px' }"
      >
        <div class="stat-item">
          <div class="stat-label">总转出金额</div>
          <div class="stat-value">
            ¥{{ totalTransferOutAmount }} /
            <span style="color: #667de8"
              >¥{{ totalTransferOutWaterAmount }}</span
            >
            /
            <span style="color: rgb(103, 194, 58)"
              >¥{{ totalWinferOutAmount }}</span
            >
          </div>
        </div>
      </el-card>
      <el-card
        class="stat-card"
        shadow="never"
        :body-style="{ padding: '16px' }"
      >
        <div class="stat-item">
          <div class="stat-label">总利润</div>
          <div class="stat-value profit">¥{{ totalProfit }}</div>
        </div>
      </el-card>
    </div>

    <!-- 图表部分 -->
    <div class="charts-row">
      <el-card
        class="chart-card"
        shadow="never"
        :body-style="{ padding: '12px' }"
      >
        <div slot="header" class="card-header">
          <span
            ><span>订单状态分布</span><span>{{ totalOrderCount }}</span></span
          >
        </div>
        <div class="chart-container">
          <el-table :data="orderStatusData" size="mini" style="width: 100%">
            <el-table-column
              prop="statusText"
              label="订单状态"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="order_count"
              label="订单数量"
              align="center"
            ></el-table-column>
            <el-table-column label="占比" align="center">
              <template slot-scope="scope">
                <el-progress
                  :percentage="getOrderStatusPercentage(scope.row.order_count)"
                  :show-text="true"
                  size="mini"
                ></el-progress>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>

      <el-card
        class="chart-card"
        shadow="never"
        :body-style="{ padding: '12px' }"
      >
        <div slot="header" class="card-header">
          <span
            ><span>彩种分布</span
            ><span>{{ totalGameCategoryCount }}</span></span
          >
        </div>
        <div class="chart-container">
          <el-table :data="gameCategoryData" size="mini" style="width: 100%">
            <el-table-column
              prop="categoryText"
              label="彩种"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="gc_count"
              label="订单数量"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="gc_bet_amount"
              label="投注金额"
              align="center"
            >
              <template slot-scope="scope"
                >¥{{ scope.row.gc_bet_amount }}</template
              >
            </el-table-column>
          </el-table>
        </div>
      </el-card>

      <el-card
        class="chart-card"
        shadow="never"
        :body-style="{ padding: '12px' }"
      >
        <div slot="header" class="card-header">
          <span
            ><span>转出明细</span><span>{{ totalTransferOutCount }}</span></span
          >
        </div>
        <div class="chart-container">
          <el-table
            :data="transferOutDetailsData"
            size="mini"
            style="width: 100%"
          >
            <el-table-column
              prop="game_category_name"
              label="彩种"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="total_count"
              label="转出订单数"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="total_amount"
              label="转出金额"
              align="center"
            >
              <template slot-scope="scope"
                >¥{{ scope.row.total_amount }}</template
              >
            </el-table-column>
            <el-table-column
              prop="total_win_amount"
              label="中奖金额"
              align="center"
            ></el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>

    <!-- 组织统计表格 -->
    <el-card
      class="table-card"
      shadow="never"
      :body-style="{ padding: '16px' }"
      style="margin-bottom: 20px"
      v-if="userInfo.perm['host'] && this.summaryData.tenant_stats != null"
    >
      <div slot="header" class="card-header">
        <span>组织统计</span>
      </div>
      <div class="table-container">
        <el-table :data="tenantStatsData" size="small" style="width: 100%">
          <el-table-column
            prop="name"
            label="组织名称"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="total_bet_amount"
            label="总投注金额"
            align="center"
          >
            <template slot-scope="scope"
              >¥{{ scope.row.total_bet_amount }}</template
            >
          </el-table-column>

          <el-table-column
            prop="total_win_amount"
            label="总中奖金额"
            align="center"
          >
            <template slot-scope="scope"
              >¥{{ scope.row.total_win_amount }}</template
            >
          </el-table-column>

          <el-table-column label="福彩 投注 / 中奖" align="center">
            <template slot-scope="scope"
              >¥{{ scope.row.fc_total_bet_amount }} /
              <span class="winam">¥{{ scope.row.fc_total_win_amount }}</span>
            </template>
          </el-table-column>

          <el-table-column label="体彩 投注 / 中奖" align="center">
            <template slot-scope="scope"
              >¥{{ scope.row.tc_total_bet_amount }} /
              <span class="winam">¥{{ scope.row.tc_total_win_amount }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="total_commission"
            label="总佣金"
            align="center"
          >
            <template slot-scope="scope"
              >¥{{ scope.row.total_commission }}</template
            >
          </el-table-column>

          <el-table-column prop="total_profit" label="总利润" align="center">
            <template slot-scope="scope"
              >¥{{ scope.row.total_profit }}</template
            >
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 会话统计表格 -->
    <el-card
      class="table-card"
      shadow="never"
      :body-style="{ padding: '16px' }"
      style="margin-bottom: 20px"
    >
      <div slot="header" class="card-header">
        <span>会话统计</span>
      </div>
      <div class="table-container">
        <el-table :data="sessionStatsData" size="small" style="width: 100%">
          <!-- <el-table-column
            prop="session_id"
            label="会话ID"
            align="center"
          ></el-table-column> -->
          <el-table-column
            prop="nick_name"
            label="会话名称"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="total_bet_amount"
            label="总投注金额"
            align="center"
          >
            <template slot-scope="scope"
              >¥{{ scope.row.total_bet_amount }}</template
            >
          </el-table-column>

          <el-table-column
            prop="total_win_amount"
            label="总中奖金额"
            align="center"
          >
            <template slot-scope="scope"
              >¥{{ scope.row.total_win_amount }}</template
            >
          </el-table-column>

          <el-table-column label="福彩 投注 / 中奖" align="center">
            <template slot-scope="scope"
              >¥{{ scope.row.fc_total_bet_amount }} /
              <span class="winam">¥{{ scope.row.fc_total_win_amount }}</span>
            </template>
          </el-table-column>

          <el-table-column label="体彩 投注 / 中奖" align="center">
            <template slot-scope="scope"
              >¥{{ scope.row.tc_total_bet_amount }} /
              <span class="winam">¥{{ scope.row.tc_total_win_amount }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="total_commission"
            label="总佣金"
            align="center"
          >
            <template slot-scope="scope"
              >¥{{ scope.row.total_commission }}</template
            >
          </el-table-column>

          <el-table-column prop="total_profit" label="总利润" align="center">
            <template slot-scope="scope"
              >¥{{ scope.row.total_profit }}</template
            >
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 玩法统计表格 -->
    <el-card
      class="table-card"
      shadow="never"
      :body-style="{ padding: '16px' }"
      style="margin-bottom: 20px"
    >
      <div slot="header" class="card-header">
        <span>玩法统计</span>
      </div>
      <div class="table-container">
        <el-table :data="gameTypeData" size="small" style="width: 100%">
          <el-table-column
            prop="game_type"
            label="玩法ID"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="typeText"
            label="玩法名称"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="gt_count"
            label="订单数量"
            align="center"
          ></el-table-column>
          <el-table-column prop="gt_bet_amount" label="投注金额" align="center">
            <template slot-scope="scope"
              >¥{{ scope.row.gt_bet_amount }}</template
            >
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getFcgOrderSummary } from "@/api/fcgame/fcg_order";

export default {
  name: "DashboardPage",
  data() {
    return {
      summaryData: {
        issue_no: "",
        sessions: [],
        session_stats: [],
        order_status_count: [],
        game_type_stats: [],
        game_category_stats: [],
        transferout_total: null,
        transferout_details: [],
      },
      loading: false,
      searchInfo: {},
      lotteryIssues: [],
      selectedIssue: "",
    };
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
    ...mapGetters("common", ["siteInfo"]),
    // 总投注金额
    totalBetAmount() {
      return this.summaryData.session_stats
        .reduce((sum, item) => {
          return sum + parseFloat(item.total_bet_amount || 0);
        }, 0)
        .toFixed(2);
    },
    // 总佣金
    totalCommission() {
      return this.summaryData.session_stats
        .reduce((sum, item) => {
          return sum + parseFloat(item.total_commission || 0);
        }, 0)
        .toFixed(2);
    },
    // 总中奖金额
    totalWinAmount() {
      return this.summaryData.session_stats
        .reduce((sum, item) => {
          return sum + parseFloat(item.total_win_amount || 0);
        }, 0)
        .toFixed(2);
    },
    // 总转出金额
    totalTransferOutAmount() {
      return this.summaryData.transferout_total
        ? parseFloat(
            this.summaryData.transferout_total.total_amount || 0
          ).toFixed(2)
        : "0.00";
    },
    // 总转出金额
    totalWinferOutAmount() {
      return this.summaryData.transferout_total
        ? parseFloat(
            this.summaryData.transferout_total.total_win_amount || 0
          ).toFixed(2)
        : "0.00";
    },
    // 总转出水钱
    totalTransferOutWaterAmount() {
      return this.summaryData.transferout_total
        ? parseFloat(
            this.summaryData.transferout_total.total_water_amount || 0
          ).toFixed(2)
        : "0.00";
    },
    // 总利润 = 总投注金额 - 总佣金 - 总中奖金额 - 总转出金额
    totalProfit() {
      const totalBet = parseFloat(this.totalBetAmount);
      const totalCommission = parseFloat(this.totalCommission);
      const totalWin = parseFloat(this.totalWinAmount);
      const totalTransferOut = parseFloat(this.totalTransferOutAmount);
      const totalWinferOutAmount = parseFloat(this.totalWinferOutAmount);
      const totalTransferOutWaterAmount = parseFloat(
        this.totalTransferOutWaterAmount
      );
      const profit =
        totalBet -
        totalCommission -
        totalWin -
        totalTransferOut +
        totalTransferOutWaterAmount +
        totalWinferOutAmount;
      return profit.toFixed(2);
    },
    // 订单状态数据
    orderStatusData() {
      const statusMap = {
        0: "待识别",
        1: "识别失败",
        2: "识别成功",
        3: "未中奖",
        4: "已中奖",
      };
      return (this.summaryData.order_status_count || []).map((item) => {
        return {
          ...item,
          statusText:
            statusMap[item.order_status] || `状态${item.order_status}`,
        };
      });
    },
    // 订单状态总数合计
    totalOrderCount() {
      return (this.summaryData.order_status_count || []).reduce((sum, item) => {
        return sum + item.order_count;
      }, 0);
    },
    // 彩种数据
    gameCategoryData() {
      const categoryMap = {
        1: "福彩",
        2: "体彩",
        3: "排列三",
      };
      return (this.summaryData.game_category_stats || []).map((item) => {
        return {
          ...item,
          categoryText:
            categoryMap[item.game_category] || `彩种${item.game_category}`,
        };
      });
    },
    // 彩种分布总数合计
    totalGameCategoryCount() {
      return (this.summaryData.game_category_stats || []).reduce(
        (sum, item) => {
          return sum + item.gc_count;
        },
        0
      );
    },
    // 玩法数据
    gameTypeData() {
      const typeMap = {
        1: "单选",
        2: "组三(对子)",
        3: "组六(无重复)",
        4: "组六四码",
        5: "组六五码",
        6: "组六六码",
        7: "组六七码",
        8: "组六八码",
        9: "组三四码",
        10: "组三五码",
        11: "组三六码",
        12: "组三七码",
        13: "组三八码",
        14: "独胆",
        15: "一码不定位",
        16: "一码定位",
        17: "两码不定位(双飞)",
        18: "两码定位",
        19: "复试重复号",
        20: "复试(三不同号)",
        21: "包对子",
        22: "包对一",
        23: "豹子",
      };
      return (this.summaryData.game_type_stats || []).map((item) => {
        return {
          ...item,
          typeText: typeMap[item.game_type] || `玩法${item.game_type}`,
        };
      });
    },
    tenantStatsData() {
      return this.summaryData.tenant_stats || [];
    },
    // 会话统计数据
    sessionStatsData() {
      return this.summaryData.session_stats || [];
    },
    // 转出明细数据
    transferOutDetailsData() {
      return this.summaryData.transferout_details || [];
    },
    // 转出明细总数合计
    totalTransferOutCount() {
      return this.summaryData.transferout_total
        ? this.summaryData.transferout_total.total_count || 0
        : 0;
    },
    // 转出明细总数合计
    totalTransferWaterAmount() {
      return this.summaryData.transferout_total
        ? this.summaryData.transferout_total.total_water_amount || 0
        : 0;
    },
  },
  methods: {
    changeSelect() {
      this.loadData();
    },
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
        all: "", // 全部订单不需要传递状态参数
        pending: "0", // 待识别
        failed: "1", // 识别失败
        success: "2", // 识别成功
        notWin: "3", // 未中奖
        win: "4", // 已中奖
      };

      // 跳转到订单页面，根据状态传递参数
      const query = {};
      if (status !== "all") {
        query.status = statusMap[status];
      }

      this.$router.push({
        name: "fcg_order",
        query: query,
      });
    },
    queryOrderByIssue() {
      if (!this.searchInfo.issue_no) {
        this.$message.warning("请先选择彩票期号");
        return;
      }
      this.loadData();
    },
    // 获取订单状态占比
    getOrderStatusPercentage(count) {
      const totalCount = this.summaryData.order_status_count.reduce(
        (sum, item) => {
          return sum + item.order_count;
        },
        0
      );
      if (totalCount === 0) return 0;
      return parseFloat(((count / totalCount) * 100).toFixed(1));
    },
    // 加载数据
    async loadData() {
      try {
        this.loading = true;
        const res = await getFcgOrderSummary(this.searchInfo);
        if (res.code === 0) {
          this.summaryData = res.data || {
            issue_no: "",
            sessions: [],
            session_stats: [],
            order_status_count: [],
            game_type_stats: [],
            game_category_stats: [],
            transferout_total: null,
            transferout_details: [],
          };
        } else {
          this.$message.error(res.msg || "获取数据失败");
        }
      } catch (error) {
        this.$message.error("获取数据异常");
        console.error("Error loading summary data:", error);
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style scoped lang="scss">
.dashboard-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.welcome-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
}

.welcome-info h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 600;
}

.welcome-info p {
  margin: 0;
  opacity: 0.9;
}

.quick-nav .el-button {
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.4);
  }
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.stat-value.profit {
  color: #f56c6c;
}
.winam {
  color: #f56c6c;
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card,
.table-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  font-weight: 600;
  border-bottom: 1px solid #ebeef5;
}

.card-header > span {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header > span > span:last-child {
  text-align: right;
}

.chart-container,
.table-container {
  padding: 16px 0;
}

/* 响应式布局 */
@media screen and (max-width: 1200px) {
  .stat-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-row {
    grid-template-columns: 1fr 1fr;
  }
}

@media screen and (max-width: 768px) {
  .dashboard-container {
    padding: 10px;
  }

  .welcome-card {
    flex-direction: column;
    text-align: center;

    .quick-nav {
      margin-top: 15px;
    }
  }

  .stat-cards {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>

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
          <div
            class="stat-value profit"
            :style="{ color: getProfitColor(totalProfit) }"
          >
            ¥{{ totalProfit }}
          </div>
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
              label="数量"
              align="center"
            ></el-table-column>
            <el-table-column label="占比" align="left" width="200">
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
            <template slot-scope="scope">
              <span :style="{ color: getProfitColor(scope.row.total_profit) }"
                >¥{{ scope.row.total_profit }}</span
              >
            </template>
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
            <template slot-scope="scope">
              <span :style="{ color: getProfitColor(scope.row.total_profit) }"
                >¥{{ scope.row.total_profit }}</span
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 玩法统计可视化 -->
    <el-card
      class="table-card"
      shadow="never"
      :body-style="{ padding: '16px' }"
      style="margin-bottom: 20px"
    >
      <div slot="header" class="card-header">
        <span>游戏统计</span>
        <div class="header-actions">
          <el-radio-group v-model="gameStatsView" size="mini">
            <el-radio-button label="chart">图表视图</el-radio-button>
            <el-radio-button label="table">表格视图</el-radio-button>
            <el-radio-button label="both">综合视图</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <!-- 关键指标卡片 -->
      <div class="game-stats-cards" v-if="gameStatsView !== 'table'">
        <div class="stat-card-item">
          <div
            class="stat-icon"
            style="background-color: rgba(64, 158, 255, 0.1)"
          >
            <i class="el-icon-s-data" style="color: #409eff"></i>
          </div>
          <div class="stat-content">
            <div class="stat-title">总订单数</div>
            <div class="stat-value">{{ totalGameTypeOrders }}</div>
          </div>
        </div>
        <div class="stat-card-item">
          <div
            class="stat-icon"
            style="background-color: rgba(103, 194, 58, 0.1)"
          >
            <i class="el-icon-coin" style="color: #67c23a"></i>
          </div>
          <div class="stat-content">
            <div class="stat-title">总投注金额</div>
            <div class="stat-value">¥{{ totalGameTypeBetAmount }}</div>
          </div>
        </div>
        <div class="stat-card-item">
          <div
            class="stat-icon"
            style="background-color: rgba(245, 108, 108, 0.1)"
          >
            <i class="el-icon-medal" style="color: #f56c6c"></i>
          </div>
          <div class="stat-content">
            <div class="stat-title">总中奖金额</div>
            <div class="stat-value">¥{{ totalGameTypeWinAmount }}</div>
          </div>
        </div>
        <div class="stat-card-item">
          <div
            class="stat-icon"
            style="background-color: rgba(230, 162, 60, 0.1)"
          >
            <i class="el-icon-pie-chart" style="color: #e6a23c"></i>
          </div>
          <div class="stat-content">
            <div class="stat-title">平均中奖率</div>
            <div class="stat-value">{{ averageWinRate }}%</div>
          </div>
        </div>
      </div>

      <!-- 图表视图 -->
      <div class="game-stats-charts" v-if="gameStatsView !== 'table'">
        <div class="chart-row">
          <div class="chart-item">
            <div class="chart-title">订单数量分布</div>
            <div class="chart-content" ref="gameTypeCountChart"></div>
          </div>
          <div class="chart-item">
            <div class="chart-title">投注金额分布</div>
            <div class="chart-content" ref="gameTypeBetChart"></div>
          </div>
        </div>
        <div class="chart-row">
          <div class="chart-item full-width">
            <div class="chart-title">投注与中奖对比</div>
            <div class="chart-content" ref="gameTypeCompareChart"></div>
          </div>
        </div>
      </div>

      <!-- 表格视图 -->
      <div
        class="table-container game-table-container"
        v-if="gameStatsView !== 'chart'"
      >
        <el-table
          :data="sortedGameTypeData"
          size="small"
          style="width: 100%"
          :default-sort="{ prop: 'gt_count', order: 'descending' }"
        >
          <el-table-column
            prop="typeText"
            label="游戏类型"
            align="center"
            min-width="150"
          ></el-table-column>
          <el-table-column
            prop="gt_count"
            label="订单数量"
            align="center"
            sortable
            min-width="100"
          >
            <template slot-scope="scope">
              <el-tag :type="getCountTagType(scope.row.gt_count)" size="mini">
                {{ scope.row.gt_count }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="gt_bet_amount"
            label="投注金额"
            align="center"
            sortable
            min-width="120"
          >
            <template slot-scope="scope">
              <span class="amount-text">¥{{ scope.row.gt_bet_amount }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="gt_win_amount"
            label="中奖金额"
            align="center"
            sortable
            min-width="120"
          >
            <template slot-scope="scope">
              <span class="amount-text win-amount"
                >¥{{ scope.row.gt_win_amount }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="中奖率" align="left" width="250">
            <template slot-scope="scope">
              <el-progress
                :percentage="getWinRate(scope.row)"
                :color="getWinRateColor(getWinRate(scope.row))"
                :show-text="true"
                size="mini"
                :stroke-width="4"
              ></el-progress>
            </template>
          </el-table-column>
          <el-table-column label="占比" align="left" width="250">
            <template slot-scope="scope">
              <el-progress
                :percentage="getBetAmountPercentage(scope.row.gt_bet_amount)"
                :show-text="true"
                size="mini"
                :stroke-width="4"
              ></el-progress>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getFcgOrderSummary } from "@/api/fcgame/fcg_order";
import * as echarts from "echarts";

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
      gameStatsView: "both", // chart, table, both
      charts: {
        countChart: null,
        betChart: null,
        compareChart: null,
      },
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
        24: "组三两码",
        25: "组三三码",
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
    // 玩法统计相关计算属性
    totalGameTypeOrders() {
      return (this.summaryData.game_type_stats || []).reduce((sum, item) => {
        return sum + (item.gt_count || 0);
      }, 0);
    },
    totalGameTypeBetAmount() {
      return (this.summaryData.game_type_stats || [])
        .reduce((sum, item) => {
          return sum + parseFloat(item.gt_bet_amount || 0);
        }, 0)
        .toFixed(2);
    },
    totalGameTypeWinAmount() {
      return (this.summaryData.game_type_stats || [])
        .reduce((sum, item) => {
          return sum + parseFloat(item.gt_win_amount || 0);
        }, 0)
        .toFixed(2);
    },
    averageWinRate() {
      const totalBet = parseFloat(this.totalGameTypeBetAmount);
      const totalWin = parseFloat(this.totalGameTypeWinAmount);
      if (totalBet === 0) return "0.00";
      return ((totalWin / totalBet) * 100).toFixed(2);
    },
    sortedGameTypeData() {
      return [...(this.summaryData.game_type_stats || [])].map((item) => ({
        ...item,
        typeText: this.getGameTypeText(item.game_type),
      }));
    },
  },
  methods: {
    // 获取游戏类型文本
    getGameTypeText(gameType) {
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
        24: "组三两码",
        25: "组三三码",
      };
      return typeMap[gameType] || `玩法${gameType}`;
    },
    // 获取订单数量标签类型
    getCountTagType(count) {
      if (count >= 100) return "danger";
      if (count >= 50) return "warning";
      if (count >= 10) return "success";
      return "info";
    },
    // 获取中奖率
    getWinRate(item) {
      const betAmount = parseFloat(item.gt_bet_amount || 0);
      const winAmount = parseFloat(item.gt_win_amount || 0);
      if (betAmount === 0) return 0;
      return parseFloat(((winAmount / betAmount) * 100).toFixed(2));
    },
    // 获取中奖率颜色
    getWinRateColor(rate) {
      if (rate >= 80) return "#67C23A";
      if (rate >= 50) return "#E6A23C";
      if (rate >= 20) return "#F56C6C";
      return "#909399";
    },
    // 获取投注金额占比
    getBetAmountPercentage(amount) {
      const total = parseFloat(this.totalGameTypeBetAmount);
      if (total === 0) return 0;
      return parseFloat(((parseFloat(amount) / total) * 100).toFixed(2));
    },
    // 获取利润颜色
    getProfitColor(profit) {
      const profitValue = parseFloat(profit);
      if (profitValue > 0) {
        return "#67c23a"; // 绿色
      } else if (profitValue < 0) {
        return "#f56c6c"; // 红色
      }
      return "#303133"; // 默认颜色
    },
    // 初始化图表
    initCharts() {
      this.$nextTick(() => {
        if (this.gameStatsView === "table") return;

        // 初始化订单数量饼图
        if (this.$refs.gameTypeCountChart) {
          this.charts.countChart = echarts.init(this.$refs.gameTypeCountChart);
          this.updateCountChart();
        }

        // 初始化投注金额饼图
        if (this.$refs.gameTypeBetChart) {
          this.charts.betChart = echarts.init(this.$refs.gameTypeBetChart);
          this.updateBetChart();
        }

        // 初始化投注与中奖对比柱状图
        if (this.$refs.gameTypeCompareChart) {
          this.charts.compareChart = echarts.init(
            this.$refs.gameTypeCompareChart
          );
          this.updateCompareChart();
        }

        // 监听窗口大小变化
        window.addEventListener("resize", this.handleResize);
      });
    },
    // 更新订单数量饼图
    updateCountChart() {
      if (!this.charts.countChart) return;

      const data = (this.summaryData.game_type_stats || [])
        .filter((item) => item.gt_count > 0)
        .map((item) => ({
          name: this.getGameTypeText(item.game_type),
          value: item.gt_count,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10); // 只显示前10个

      const option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          type: "scroll",
        },
        series: [
          {
            name: "订单数量",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "16",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: data,
          },
        ],
      };

      this.charts.countChart.setOption(option);
    },
    // 更新投注金额饼图
    updateBetChart() {
      if (!this.charts.betChart) return;

      const data = (this.summaryData.game_type_stats || [])
        .filter((item) => parseFloat(item.gt_bet_amount) > 0)
        .map((item) => ({
          name: this.getGameTypeText(item.game_type),
          value: parseFloat(item.gt_bet_amount),
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10); // 只显示前10个

      const option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: ¥{c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          type: "scroll",
        },
        series: [
          {
            name: "投注金额",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "16",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: data,
          },
        ],
      };

      this.charts.betChart.setOption(option);
    },
    // 更新投注与中奖对比柱状图
    updateCompareChart() {
      if (!this.charts.compareChart) return;

      const data = (this.summaryData.game_type_stats || [])
        .filter((item) => parseFloat(item.gt_bet_amount) > 0)
        .map((item) => ({
          name: this.getGameTypeText(item.game_type),
          betAmount: parseFloat(item.gt_bet_amount),
          winAmount: parseFloat(item.gt_win_amount),
        }))
        .sort((a, b) => b.betAmount - a.betAmount)
        .slice(0, 10); // 只显示前10个

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: function (params) {
            let result = params[0].name + "<br/>";
            params.forEach((param) => {
              result +=
                param.marker + param.seriesName + ": ¥" + param.value + "<br/>";
            });
            return result;
          },
        },
        legend: {
          data: ["投注金额", "中奖金额"],
          top: "3%",
          right: "6%",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: data.map((item) => item.name),
          axisLabel: {
            interval: 0,
            rotate: 45,
          },
        },
        series: [
          {
            name: "投注金额",
            type: "bar",
            data: data.map((item) => item.betAmount),
            itemStyle: {
              color: "#67C23A",
            },
          },
          {
            name: "中奖金额",
            type: "bar",
            data: data.map((item) => item.winAmount),
            itemStyle: {
              color: "rgb(245, 108, 108)",
            },
          },
        ],
      };

      this.charts.compareChart.setOption(option);
    },
    // 处理窗口大小变化
    handleResize() {
      Object.values(this.charts).forEach((chart) => {
        if (chart) {
          chart.resize();
        }
      });
    },
    // 销毁图表
    destroyCharts() {
      Object.values(this.charts).forEach((chart) => {
        if (chart) {
          chart.dispose();
        }
      });
      this.charts = {
        countChart: null,
        betChart: null,
        compareChart: null,
      };
      window.removeEventListener("resize", this.handleResize);
    },
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
  watch: {
    gameStatsView(newVal) {
      if (newVal === "table") {
        this.destroyCharts();
      } else {
        this.$nextTick(() => {
          this.initCharts();
        });
      }
    },
    "summaryData.game_type_stats"() {
      if (this.gameStatsView !== "table") {
        this.$nextTick(() => {
          this.updateCountChart();
          this.updateBetChart();
          this.updateCompareChart();
        });
      }
    },
  },
  created() {
    this.loadData();
  },
  mounted() {
    this.initCharts();
  },
  beforeDestroy() {
    this.destroyCharts();
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

/* 玩法统计可视化样式 */
.header-actions {
  display: flex;
  align-items: center;
}

.game-stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;

  i {
    font-size: 24px;
  }
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.game-stats-charts {
  margin-top: 20px;
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.chart-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &.full-width {
    grid-column: 1 / -1;
  }
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.chart-content {
  height: 300px;
  width: 100%;
}

.amount-text {
  font-weight: 500;

  &.win-amount {
    color: #f56c6c;
  }
}

.game-table-container {
  width: 100%;

  .el-table {
    width: 100% !important;

    .el-table__body-wrapper {
      width: 100% !important;
    }

    .el-table__header-wrapper {
      width: 100% !important;
    }

    table {
      width: 100% !important;
    }

    // 确保进度条列的样式正确
    .el-progress {
      width: 100%;
      min-width: 120px; // 设置最小宽度，确保进度条有足够空间
      white-space: nowrap; // 防止文本换行

      .el-progress-bar {
        padding-right: 45px; // 为百分比文本预留更多空间
        margin-right: -45px; // 抵消内边距，保持总宽度一致
      }

      .el-progress__text {
        min-width: 45px; // 确保文本有足够空间
        text-align: right;
        font-size: 12px;
        white-space: nowrap; // 防止百分比文本换行
      }
    }
  }
}

// 为所有表格中的进度条添加统一样式
.el-table {
  .el-progress {
    width: 100%;
    min-width: 120px;
    white-space: nowrap;

    .el-progress-bar {
      padding-right: 45px;
      margin-right: -45px;
    }

    .el-progress__text {
      min-width: 45px;
      text-align: right;
      font-size: 12px;
      white-space: nowrap;
    }
  }
}

/* 响应式布局调整 */
@media screen and (max-width: 1200px) {
  .game-stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-row {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 768px) {
  .game-stats-cards {
    grid-template-columns: 1fr;
  }

  .chart-content {
    height: 250px;
  }
}
</style>

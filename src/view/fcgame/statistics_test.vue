<template>
  <div class="statistics-test">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>期号统计数据测试</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="refreshData"
          >刷新数据</el-button
        >
      </div>

      <div v-if="loading" class="loading-container">
        <el-loading :loading="true"></el-loading>
        <p>正在加载统计数据...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <el-alert :title="error" type="error" show-icon :closable="false">
        </el-alert>
      </div>

      <div v-else-if="issueStatistics" class="data-container">
        <!-- 期号信息 -->
        <el-card class="issue-card" v-if="issueStatistics.issue">
          <div slot="header">
            <span>期号信息</span>
          </div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="期号ID">{{
              issueStatistics.issue.id
            }}</el-descriptions-item>
            <el-descriptions-item label="期号编号">{{
              issueStatistics.issue.issue_number
            }}</el-descriptions-item>
            <el-descriptions-item label="彩票类型">{{
              issueStatistics.issue.lottery_type
            }}</el-descriptions-item>
            <el-descriptions-item label="状态">{{
              issueStatistics.issue.status
            }}</el-descriptions-item>
            <el-descriptions-item label="开盘时间">{{
              issueStatistics.issue.open_time
            }}</el-descriptions-item>
            <el-descriptions-item label="截止时间">{{
              issueStatistics.issue.close_time
            }}</el-descriptions-item>
            <el-descriptions-item label="开奖时间">{{
              issueStatistics.issue.draw_time
            }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 统计数据 -->
        <el-card class="statistics-card" v-if="issueStatistics.statistics">
          <div slot="header">
            <span>统计数据</span>
          </div>

          <!-- 总体统计 -->
          <h3>总体统计</h3>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-statistic
                title="总订单数"
                :value="issueStatistics.statistics.total_order_count"
              ></el-statistic>
            </el-col>
            <el-col :span="6">
              <el-statistic
                title="总投注金额"
                :value="issueStatistics.statistics.total_bet_amount"
                precision="2"
              ></el-statistic>
            </el-col>
            <el-col :span="6">
              <el-statistic
                title="总佣金"
                :value="issueStatistics.statistics.total_commission"
                precision="2"
              ></el-statistic>
            </el-col>
            <el-col :span="6">
              <el-statistic
                title="总中奖金额"
                :value="issueStatistics.statistics.total_win_amount"
                precision="2"
              ></el-statistic>
            </el-col>
          </el-row>

          <!-- 福彩统计 -->
          <h3>福彩统计</h3>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-statistic
                title="福彩订单数"
                :value="issueStatistics.statistics.fu_cai_order_count"
              ></el-statistic>
            </el-col>
            <el-col :span="6">
              <el-statistic
                title="福彩投注金额"
                :value="issueStatistics.statistics.fu_cai_bet_amount"
                precision="2"
              ></el-statistic>
            </el-col>
            <el-col :span="6">
              <el-statistic
                title="福彩佣金"
                :value="issueStatistics.statistics.fu_cai_commission"
                precision="2"
              ></el-statistic>
            </el-col>
            <el-col :span="6">
              <el-statistic
                title="福彩中奖金额"
                :value="issueStatistics.statistics.fu_cai_win_amount"
                precision="2"
              ></el-statistic>
            </el-col>
          </el-row>

          <!-- 体彩统计 -->
          <h3>体彩统计</h3>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-statistic
                title="体彩订单数"
                :value="issueStatistics.statistics.ti_cai_order_count"
              ></el-statistic>
            </el-col>
            <el-col :span="6">
              <el-statistic
                title="体彩投注金额"
                :value="issueStatistics.statistics.ti_cai_bet_amount"
                precision="2"
              ></el-statistic>
            </el-col>
            <el-col :span="6">
              <el-statistic
                title="体彩佣金"
                :value="issueStatistics.statistics.ti_cai_commission"
                precision="2"
              ></el-statistic>
            </el-col>
            <el-col :span="6">
              <el-statistic
                title="体彩中奖金额"
                :value="issueStatistics.statistics.ti_cai_win_amount"
                precision="2"
              ></el-statistic>
            </el-col>
          </el-row>
        </el-card>
      </div>

      <div v-else class="no-data-container">
        <el-empty description="暂无数据"></el-empty>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "StatisticsTest",
  data() {
    return {
      testIssueId: "",
    };
  },
  computed: {
    ...mapGetters("statistics", [
      "issueStatistics",
      "statisticsLoading",
      "statisticsError",
    ]),
    loading() {
      return this.statisticsLoading;
    },
    error() {
      return this.statisticsError;
    },
  },
  methods: {
    ...mapActions("statistics", [
      "fetchLatestIssueStatistics",
      "fetchIssueStatisticsById",
    ]),
    async refreshData() {
      try {
        if (this.testIssueId) {
          await this.fetchIssueStatisticsById(this.testIssueId);
        } else {
          await this.fetchLatestIssueStatistics();
        }
        this.$message.success("数据刷新成功");
      } catch (error) {
        this.$message.error("数据刷新失败: " + error.message);
      }
    },
  },
  mounted() {
    // 页面加载时刷新数据
    this.refreshData();
  },
};
</script>

<style scoped>
.statistics-test {
  padding: 20px;
}

.loading-container,
.error-container,
.no-data-container {
  text-align: center;
  padding: 40px 0;
}

.issue-card,
.statistics-card {
  margin-bottom: 20px;
}

h3 {
  margin: 20px 0 10px 0;
  color: #303133;
  border-bottom: 2px solid #409eff;
  padding-bottom: 5px;
}
</style>

<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="5" @search="getChartData">
        <el-form-item label="彩期">
          <IssueSelect
            v-model="chartIssueId"
            placeholder="请选择彩期"
            clearable
          ></IssueSelect>
        </el-form-item>

        <el-form-item label="所属组织">
          <TenantSelect
            v-model="tenant_id"
            placeholder="请选择组织"
            :autoSelectFirst="false"
            clearable
          ></TenantSelect>
        </el-form-item>

        <el-form-item label="福彩开奖号码">
          <el-input
            v-model="fc_draw_number"
            placeholder="请输入福彩模拟开奖号码"
          ></el-input>
        </el-form-item>

        <el-form-item label="体彩开奖号码">
          <el-input
            v-model="tc_draw_number"
            placeholder="请输入体彩模拟开奖号码"
          ></el-input>
        </el-form-item>
      </searchform>
    </div>

    <div class="rick-data-info" v-if="rickDataInfo && rickDataInfo.orders">
      <div class="total-info">
        <el-descriptions title="模拟中奖信息" :column="2" border>
          <el-descriptions-item label="中奖单量">{{
            rickDataInfo.win_order_count
          }}</el-descriptions-item>
          <el-descriptions-item label="总奖金">{{
            rickDataInfo.total_win_amount
          }}</el-descriptions-item>
          <el-descriptions-item label="福彩">
            {{ rickDataInfo.fc_winc }}单 -
            {{ rickDataInfo.fc_wina }}元</el-descriptions-item
          >
          <el-descriptions-item label="体彩">
            {{ rickDataInfo.tc_winc }}单 -
            {{ rickDataInfo.tc_wina }}元</el-descriptions-item
          >
        </el-descriptions>
      </div>
      <el-table
        :data="rickDataInfo.orders"
        style="width: 100%"
        border
        height="600"
      >
        <el-table-column
          prop="ID"
          label="订单ID"
          align="center"
          width="80"
        ></el-table-column>
        <el-table-column prop="ID" label="会话" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.message.session_name }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="ID" label="用户" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.user.nickname }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="bet_content"
          label="投注内容"
          align="center"
          width="500"
        ></el-table-column>
        <!-- <el-table-column prop="bet_amount" label="投注金额" align="center"></el-table-column> -->
        <el-table-column prop="win_amount" label="奖金" align="center">
          <template slot-scope="scope">
            <div style="color: #f56c6c">{{ scope.row.win_amount }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getFcgOrderSplitNumberList } from "@/api/fcgame/fcg_order_split_number";
import infoList from "@/mixins/infoList";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "fcg_order_split_number",
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
    // 创建双向绑定的计算属性
    alpha: {
      get() {
        return this.$store.state.common.alpha;
      },
      set(value) {
        this.setAlpha(value);
      },
    },
    beta: {
      get() {
        return this.$store.state.common.beta;
      },
      set(value) {
        this.setBeta(value);
      },
    },
  },
  data() {
    return {
      listApi: getFcgOrderSplitNumberList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      chartIssueId: 0,
      tenant_id: null,
      game_category: 1, // 默认福彩
      maxValue: 0,
      // 期号列表
      lotteryIssueList: [],
      rickDataInfo: {},
      fc_draw_number: "",
      tc_draw_number: "",
    };
  },
  methods: {
    ...mapMutations("common", ["setAlpha", "setBeta"]),

    // 获取图表数据
    async getChartData() {
      if (this.chartIssueId == 0) {
        this.$message.warning("请输入期号");
        return;
      }
      this.chartLoading = true;
      try {
        const res = await getFcgOrderSplitNumberList({
          action: "simulate_winning",
          // game_category: this.game_category,
          issue_id: this.chartIssueId,
          tenant_id: this.tenant_id,
          fc_draw_number: this.fc_draw_number,
          tc_draw_number: this.tc_draw_number,
        });
        if (res.code === 0 && res.data) {
          this.rickDataInfo = res.data;
        } else {
          this.chartData = null;
          this.$message.error(res.msg || "获取数据失败");
        }
      } finally {
        this.chartLoading = false;
      }
    },
  },

  async created() {
    await this.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0));
    // await this.getLotteryIssueList();
  },
};
</script>

<style scoped>
.split-tag {
  color: #ee4445;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  width: 100%;
}

.chart-container {
  margin: 20px 0;
}

.chart {
  width: 100%;
  min-height: 400px;
}

.issue-selector {
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 20px;
}

.data-summary {
  margin: 20px 0;
}

.summary-item {
  text-align: center;
  padding: 10px 0;
}

.summary-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.summary-value {
  font-size: 18px;
  font-weight: bold;
}

.risk-level-YELLOW {
  color: #ffd700;
  font-weight: bold;
}

.risk-level-RED {
  color: #ff0000;
  font-weight: bold;
}

.risk-level-ORANGE {
  color: #ffa500;
  font-weight: bold;
}

.total-info {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
</style>

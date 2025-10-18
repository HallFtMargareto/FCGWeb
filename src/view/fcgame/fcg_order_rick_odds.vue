<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="6" @search="getChartData">
        <el-form-item label="期号">
          <el-select
            v-model="chartIssueId"
            placeholder="请选择期号"
            @change="getChartData"
            clearable
          >
            <el-option
              v-for="item in lotteryIssueList"
              :key="item.ID"
              :label="item.issue_no"
              :value="item.ID"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="彩票类型">
          <el-select v-model="game_category" placeholder="彩票类型">
            <el-option label="福彩" :value="1"></el-option>
            <el-option label="体彩" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="预亏损金额">
          <el-input
            v-model="ks_amount"
            placeholder="请输入预赔付金额"
          ></el-input>
        </el-form-item>

        <el-form-item label=" ">
          <el-button type="success" @click="generateContent"
            >生成内容</el-button
          >
        </el-form-item>
        <!-- <el-form-item label="阈值比例">
                    <el-input v-model="alpha" :min="0" :max="1" :step="0.1" placeholder="请输入阈值比例"></el-input>
                </el-form-item>

                <el-form-item label="目标线比例">
                    <el-input v-model="beta" :min="0" :max="1" :step="0.1" placeholder="请输入目标线比例"></el-input>
                </el-form-item> -->

        <!-- <el-form-item label="添加时间">
          <datepicker v-model="searchInfo.startTime" type="datetime" />
        </el-form-item>
        <el-form-item label="结束时间">
          <datepicker v-model="searchInfo.endTime" type="datetime" />
        </el-form-item> -->
      </searchform>
      <!-- <el-form size="mini" :inline="true" class="btn-form-inline">
        <el-button v-if="userInfo.perm['system.create']" @click="createRow" icon="el-icon-plus"
          type="primary">新增</el-button>
        <el-button v-if="userInfo.perm['system.batch_delete'] && multipleSelection.length > 0"
          @click="handleCommand('remove')" icon="el-icon-delete" type="danger" plain>批量删除</el-button>
        <el-button v-if="userInfo.perm['system.import']" @click="importExcel" icon="el-icon-sell">导入</el-button>
        <el-button v-if="userInfo.perm['system.export']" @click="exportExcel" icon="el-icon-sold-out">导出</el-button>
      </el-form> -->
    </div>

    <div
      class="rick-data-info"
      v-if="
        rickDataInfo &&
        rickDataInfo.rick_order &&
        rickDataInfo.rick_order.length > 0
      "
    >
      <div class="total-info">
        <el-descriptions title="风控信息" :column="3" border>
          <el-descriptions-item label="总投注">{{
            rickDataInfo.total_info.totalBet
          }}</el-descriptions-item>
          <el-descriptions-item label="总佣金">{{
            rickDataInfo.total_info.totalCommission
          }}</el-descriptions-item>
          <el-descriptions-item label="净盘值">
            {{ rickDataInfo.total_info.netBank }}
          </el-descriptions-item>

          <el-descriptions-item label="总数量">{{
            rickDataInfo.total_info.totalCount
          }}</el-descriptions-item>
          <el-descriptions-item label="转出单量">{{
            rickDataInfo.total_info.totalOutOrder
          }}</el-descriptions-item>
          <el-descriptions-item label="转出总金额">{{
            rickDataInfo.total_info.totalOutOrderAmount
          }}</el-descriptions-item>
          <!-- <el-descriptions-item label="阈值">{{ rickDataInfo.total_info.threshold }}</el-descriptions-item> -->
          <!-- <el-descriptions-item label="目标线">{{ rickDataInfo.total_info.targetLimit }}</el-descriptions-item> -->
          <!-- <el-descriptions-item label="总转移赔付">{{ rickDataInfo.total_info.totalTransferPayout
                    }}</el-descriptions-item>
                    <el-descriptions-item label="总转投金额">{{ rickDataInfo.total_info.totaltransferStake
                    }}</el-descriptions-item> -->
        </el-descriptions>
      </div>
      <el-table
        :data="rickDataInfo.rick_order"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          prop="split_number"
          label="拆单号码"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="split_count"
          label="号码数量"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="exposure_amount"
          label="风险金额"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="potential_payout"
          label="中奖赔付"
          align="center"
        >
          <template slot-scope="scope">
            -{{ scope.row.potential_payout }}
          </template>
        </el-table-column>
        <el-table-column prop="ks_amount" label="预亏损金额" align="center">
          <template slot-scope="scope"> -{{ scope.row.ks_amount }} </template>
        </el-table-column>
        <el-table-column
          prop="risk_ratio"
          label="风险比例"
          align="center"
        ></el-table-column>
        <!-- <el-table-column prop="threshold" label="阈值"></el-table-column> -->
        <!-- <el-table-column prop="target_limit" label="目标限额"></el-table-column> -->
        <!-- <el-table-column prop="transfer_payout" label="转移赔付额度" align="center"></el-table-column>
                <el-table-column prop="transfer_stake_hint" label="建议转投金额" align="center"></el-table-column> -->
        <!-- <el-table-column prop="avg_odds" label="平均赔率" align="center"></el-table-column> -->
        <el-table-column
          prop="trans_count"
          label="转出单量"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="trans_amount"
          label="转出金额"
          align="center"
        ></el-table-column>
        <el-table-column prop="risk_level" label="风险等级" align="center">
          <template slot-scope="scope">
            <span :class="'risk-level-' + scope.row.risk_level">{{
              scope.row.risk_level
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="bet_content"
          label="转出内容"
          align="center"
          width="250"
        >
          <template slot="header">
            <span>转出内容</span>
            <i
              class="el-icon-document-copy"
              style="margin-left: 5px; cursor: pointer"
              @click="copyColumn"
            ></i>
          </template>
          <template slot-scope="scope">
            <span>{{ scope.row.bet_content }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getFcgOrderSplitNumberList } from "@/api/fcgame/fcg_order_split_number";
import { getFcgLotteryIssueList } from "@/api/fcgame/fcg_lottery_issue";
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
      multipleSelection: [],
      chartIssueId: 0,
      game_category: 1, // 默认福彩
      maxValue: 0,
      // 期号列表
      lotteryIssueList: [],
      rickDataInfo: {},
      ks_amount: undefined,
    };
  },
  methods: {
    ...mapMutations("common", ["setAlpha", "setBeta"]),
    // 获取期号列表
    async getLotteryIssueList() {
      try {
        const res = await getFcgLotteryIssueList({ page: 1, pageSize: 100 });
        if (res.code === 0 && res.data && res.data.list) {
          this.lotteryIssueList = res.data.list;
          // 获取到列表后默认取第一条期号作为参数
          if (this.lotteryIssueList.length > 0) {
            this.chartIssueId = this.lotteryIssueList[0].ID;
            console.log(this.chartIssueId);
            this.getChartData();
          }
        }
      } catch (error) {
        console.error("获取期号列表失败:", error);
        this.$message.error("获取期号列表失败");
      }
    },

    // 获取图表数据
    async getChartData() {
      if (this.chartIssueId == 0) {
        this.$message.warning("请输入期号");
        return;
      }
      this.chartLoading = true;
      try {
        const res = await getFcgOrderSplitNumberList({
          action: "rick_odds",
          game_category: this.game_category,
          issue_id: this.chartIssueId,
          // alpha: this.alpha,
          // beta: this.beta,
          ks_amount: this.ks_amount,
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

    onQuery() {
      this.summary = {};
      this.showSummary = false;

      this.page = 1;
      this.pageSize = 10;
      this.getTableData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 生成内容按钮点击事件
    generateContent() {
      // 判断是否有选择数据
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择数据");
        return;
      }

      // 按照规则定开头文字
      let prefix = this.game_category === 1 ? "福" : "体";

      // 遍历选中的数据，生成 bet_content
      this.multipleSelection.forEach((item) => {
        // item.bet_content = `${prefix} ${item.split_number} ${item.trans_count}单`;
        this.$set(
          item,
          "bet_content",
          `${prefix} ${item.split_number} ${item.trans_count}单`
        );
      });
    },

    // 复制内容按钮点击事件
    copyColumn() {
      // 过滤掉 bet_content 为空的数据
      const validData = this.multipleSelection.filter(
        (item) => item.bet_content
      );

      // 如果没有有效数据，提示用户
      if (validData.length === 0) {
        this.$message.warning("没有可复制的内容");
        return;
      }

      // 拼接所有有效的 bet_content
      const contentToCopy = validData
        .map((item) => item.bet_content)
        .join("\n");

      // 复制到剪贴板 - 使用兼容的方法
      if (navigator.clipboard && window.isSecureContext) {
        // 在安全上下文中使用现代 clipboard API
        navigator.clipboard
          .writeText(contentToCopy)
          .then(() => {
            this.$message.success("复制成功");
          })
          .catch((err) => {
            this.$message.error("复制失败");
            console.error("复制失败:", err);
          });
      } else {
        // 兼容旧浏览器或非安全上下文的实现
        try {
          const textarea = document.createElement("textarea");
          textarea.value = contentToCopy;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
          this.$message.success("复制成功");
        } catch (err) {
          this.$message.error("复制失败");
          console.error("复制失败:", err);
        }
      }
    },
  },

  async created() {
    await this.getLotteryIssueList();
  },
};
</script>

<style scoped>
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

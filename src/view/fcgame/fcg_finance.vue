<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="3" @search="onQuery">
        <el-form-item label="期号">
          <IssueSelect v-model="searchInfo.issue_id" placeholder="请选择期号" clearable></IssueSelect>
        </el-form-item>

        <template v-if="userInfo.perm['host']">
          <el-form-item label="所属组织">
            <TenantSelect v-model="searchInfo.tenant_id" placeholder="请选择组织" :autoSelectFirst="false" :multiple="false"
              clearable></TenantSelect>
          </el-form-item>
        </template>

        <!--  0-未结算, 1-部分结算, 2-已结清, 3-有争议 -->
        <!-- <el-form-item label="结算状态:" prop="settlement_status">
          <el-select v-model="searchInfo.settlement_status" placeholder="请选择">
            <el-option key="true" label="是" value="true"></el-option>
            <el-option key="false" label="否" value="false"></el-option>
          </el-select>
        </el-form-item> -->

        <!-- 0-正常, 1-冻结(停止核算) -->
        <!-- <el-form-item label="是否冻结:" prop="is_frozen">
          <el-select v-model="searchInfo.is_frozen" placeholder="请选择">
            <el-option key="true" label="是" value="true"></el-option>
            <el-option key="false" label="否" value="false"></el-option>
          </el-select>
        </el-form-item> -->

        <!-- <el-form-item label="核对人ID">
          <el-input v-model.number="searchInfo.reconciliation_user_id" placeholder="请输入" clearable></el-input>
        </el-form-item> -->

        <!-- <el-form-item label="添加时间">
          <datepicker v-model="searchInfo.startTime" type="datetime" />
        </el-form-item>
        <el-form-item label="结束时间">
          <datepicker v-model="searchInfo.endTime" type="datetime" />
        </el-form-item> -->
      </searchform>
    </div>

    <!-- 财务概览卡片 -->
    <el-card shadow="never" style="margin-bottom: 20px;">
      <div slot="header" class="clearfix">
        <span>财务概览</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-label">总利润</div>
            <div class="stat-value" :style="{ color: getProfitColor(realProfit) }">¥{{ realProfit }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-label">占股比例 ({{ stakeRatio }}%)</div>
            <div class="stat-value">¥{{ shareholdingCost }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <div slot="header" class="clearfix" style="text-align: left;margin-bottom: 10px;">
      <span>会话统计</span>
    </div>
    <el-table :data="tableData" @selection-change="handleSelectionChange" @sort-change="sortChange" ref="multipleTable"
      show-summary :summary-method="getSessionSummaries" border stripe>
      <el-table-column prop="session_id" label="会话ID" align="center" width="80"></el-table-column>
      <el-table-column prop="nick_name" label="会话名称" align="center"></el-table-column>

      <el-table-column label="总计" align="center">
        <el-table-column prop="total_bet_amount" label="投注金额" align="center"></el-table-column>
        <el-table-column prop="total_commission" label="佣金" align="center"></el-table-column>
        <el-table-column prop="total_win_amount" label="中奖金额" align="center">
          <template slot-scope="scope">
            <span :style="{ color: getWinAmountColor(scope.row.total_win_amount, scope.row.total_bet_amount) }">
              {{ scope.row.total_win_amount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="total_profit" label="预计利润" align="center">
          <template slot-scope="scope">
            <span :style="{ color: getProfitColor(scope.row.total_profit) }">
              {{ scope.row.total_profit }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="福彩" align="center">
        <el-table-column prop="fc_total_bet_amount" label="投注" align="center"></el-table-column>
        <el-table-column prop="fc_total_win_amount" label="中奖" align="center">
          <template slot-scope="scope">
            <span :style="{ color: getWinAmountColor(scope.row.fc_total_win_amount, scope.row.fc_total_bet_amount) }">
              {{ scope.row.fc_total_win_amount }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="体彩" align="center">
        <el-table-column prop="tc_total_bet_amount" label="投注" align="center"></el-table-column>
        <el-table-column prop="tc_total_win_amount" label="中奖" align="center">
          <template slot-scope="scope">
            <span :style="{ color: getWinAmountColor(scope.row.tc_total_win_amount, scope.row.tc_total_bet_amount) }">
              {{ scope.row.tc_total_win_amount }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column prop="system_fee" label="系统费" align="center"></el-table-column>
      <!-- <el-table-column prop="shareholding_fees" label="占股" align="center"></el-table-column> -->
    </el-table>

    <!-- 转出统计 -->
    <div slot="header" class="clearfix" style="text-align: left;margin-bottom: 10px;">
      <span>转出统计</span>
    </div>
    <el-table :data="financeSummary.transferout_details" size="mini" style="width: 100%;" border show-summary
      :summary-method="getTransferOutSummaries">
      <el-table-column prop="game_category_name" label="彩种" align="center"></el-table-column>
      <el-table-column prop="total_count" label="转出数量" align="center"></el-table-column>
      <el-table-column prop="total_amount" label="转出金额" align="center"></el-table-column>
      <el-table-column prop="total_water_amount" label="转出佣金" align="center"></el-table-column>
      <el-table-column prop="total_win_amount" label="转出中奖金额" align="center"></el-table-column>
    </el-table>

    <!-- class="pagination-container" -->
    <div>
      <!-- 数据合计,按需求启用 -->
      <!-- <el-button v-if="userInfo.perm['system.summary']" @click="getSummaryList">合计</el-button> -->
      <!-- <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 30, 50, 100]"
        :style="{ float: 'right', padding: '20px' }" :total="total" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" background></el-pagination> -->
    </div>

  </div>
</template>

<script>
import {
  createFcgFinance,
  deleteFcgFinance,
  updateFcgFinance,
  findFcgFinance,
  getFcgFinanceList,
  batchFcgFinanceOperation,
  getFcgFinanceSummary,
} from "@/api/fcgame/fcg_finance";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
export default {
  name: "fcg_finance",
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
    // 总投注金额
    totalBetAmount() {
      return (this.financeSummary.session_stats || [])
        .reduce((sum, item) => {
          return sum + parseFloat(item.total_bet_amount || 0);
        }, 0)
        .toFixed(2);
    },
    // 总佣金
    totalCommission() {
      return (this.financeSummary.session_stats || [])
        .reduce((sum, item) => {
          return sum + parseFloat(item.total_commission || 0);
        }, 0)
        .toFixed(2);
    },
    // 总中奖金额
    totalWinAmount() {
      return (this.financeSummary.session_stats || [])
        .reduce((sum, item) => {
          return sum + parseFloat(item.total_win_amount || 0);
        }, 0)
        .toFixed(2);
    },
    // 总转出金额
    totalTransferOutAmount() {
      return this.financeSummary.transferout_total
        ? parseFloat(
          this.financeSummary.transferout_total.total_amount || 0
        ).toFixed(2)
        : "0.00";
    },
    // 总转出中奖金额
    totalTransferOutWinAmount() {
      return this.financeSummary.transferout_total
        ? parseFloat(
          this.financeSummary.transferout_total.total_win_amount || 0
        ).toFixed(2)
        : "0.00";
    },
    // 总转出佣金
    totalTransferOutWaterAmount() {
      return this.financeSummary.transferout_total
        ? parseFloat(
          this.financeSummary.transferout_total.total_water_amount || 0
        ).toFixed(2)
        : "0.00";
    },
    // 真实利润 = 总投注金额 - 总佣金 - 总中奖金额 - 总转出 + 转出佣金 + 转出中奖
    realProfit() {
      const totalBet = parseFloat(this.totalBetAmount);
      const totalCommission = parseFloat(this.totalCommission);
      const totalWin = parseFloat(this.totalWinAmount);
      const totalTransferOut = parseFloat(this.totalTransferOutAmount);
      const totalTransferOutWinAmount = parseFloat(this.totalTransferOutWinAmount);
      const totalTransferOutWaterAmount = parseFloat(
        this.totalTransferOutWaterAmount
      );
      const profit =
        totalBet -
        totalCommission -
        totalWin -
        totalTransferOut +
        totalTransferOutWaterAmount +
        totalTransferOutWinAmount;
      return profit.toFixed(2);
    },
    // 占股比例
    stakeRatio() {
      return parseFloat(this.financeSummary.fee?.stake_ratio || 0);
    },
    // 占股费用 = 真实利润 * 占股比例 / 100
    shareholdingCost() {
      const profit = parseFloat(this.realProfit);
      const ratio = this.stakeRatio;
      return ((profit * ratio) / 100).toFixed(2);
    },
  },
  data() {
    return {
      listApi: getFcgFinanceList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      financeSummary: {
        transferout_details: [],
        transferout_total: {},
        session_stats: [],
        game_category_stats: [],
        fee: {
          stake_ratio: 0,
          profit_system_fee: 0,
          loss_system_fee: 0
        }
      },
      formData: {
        issue_id: undefined,
        tenant_id: undefined,
        bet_amount: undefined,
        system_fee: undefined,
        rebate_rate: undefined,
        commission_amount: undefined,
        winning_amount: undefined,
        expected_profit_loss: undefined,
        actual_profit_loss: undefined,
        transfer_out_amount: undefined,
        transfer_rebate_rate: undefined,
        transfer_commission: undefined,
        pao_zhong_amount: undefined,
        running_water: undefined,
        system_expenditure: undefined,
        transfer_profit_loss: undefined,
        received_amount: undefined,
        paid_amount: undefined,
        unsettled_amount: undefined,
        settlement_status: true,
        is_frozen: true,
        reconciliation_user_id: undefined,
      },
      formRules: {
        issue_id: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],
        tenant_id: [{ required: true, message: "请填写数据", trigger: "blur" }],
        bet_amount: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],

        system_fee: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],

        rebate_rate: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],

        commission_amount: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],

        winning_amount: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],

        expected_profit_loss: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],

        actual_profit_loss: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],

        transfer_out_amount: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],

        transfer_rebate_rate: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],

        transfer_commission: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],

        pao_zhong_amount: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],

        running_water: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],

        system_expenditure: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],

        transfer_profit_loss: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],

        received_amount: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],

        paid_amount: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],

        unsettled_amount: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],

        settlement_status: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],

        is_frozen: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],
        reconciliation_user_id: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    onQuery() {
      this.summary = {};
      this.showSummary = false;

      this.page = 1;
      this.pageSize = 10;
      this.getTableData();
    },
    async getTableData(page = this.page, pageSize = this.pageSize) {
      const table = await getFcgFinanceList({ page, pageSize, ...this.searchInfo });
      if (table.code === 0) {
        this.financeSummary = table.data;
        this.tableData = table.data.session_stats;
        // 如果后端返回total则使用，没有的话暂时不做处理或者使用length
        // this.total = table.data.total || table.data.session_stats.length; 
        // Based on user input, there is no total field in the response structure provided.
        // Assuming pagination relies on manual handling or simple display for now.
        // However, infoList mixin uses 'total' for pagination component.
        // If the API doesn't return total count, pagination might be broken.
        // I will assume for now that I just display the data.
        if (table.data.total) {
          this.total = table.data.total
        }
        this.page = table.data.page
        this.pageSize = table.data.pageSize
      }
    },
    getProfitColor(profit) {
      const profitValue = parseFloat(profit);
      if (profitValue > 0) {
        return "#67c23a"; // 绿色
      } else if (profitValue < 0) {
        return "#f56c6c"; // 红色
      }
      return "#303133"; // 默认颜色
    },
    getWinAmountColor(winAmount, betAmount) {
      const win = parseFloat(winAmount || 0);
      const bet = parseFloat(betAmount || 0);
      if (win > bet) {
        return "#f56c6c"; // 中奖金额大于投注金额，红色
      } else if (win < bet) {
        return "#67c23a"; // 中奖金额小于投注金额，绿色
      }
      return "#303133"; // 默认颜色
    },
    createRow() {
      this.formData = {};
      this.type = "create";
      this.dialogTitle = "创建";
      this.openDialog = true;
    },
    async editRow(row) {
      this.type = "update";
      this.dialogTitle = "编辑";
      const res = await findFcgFinance({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.refcg_finance;
        this.openDialog = true;
      }
    },
    async deleteRow(row) {
      const res = await deleteFcgFinance({ ID: row.ID });
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        if (this.tableData.length == 1) {
          this.page--;
        }
        this.getTableData();
      }
    },
    async enterDialog() {
      let res;
      switch (this.type) {
        case "create":
          res = await createFcgFinance(this.formData);
          break;
        case "update":
          res = await updateFcgFinance(this.formData);
          break;
        default:
          this.$message({
            type: "error",
            message: "操作类型错误",
          });
          return false;
      }
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: "操作成功",
        });
        this.$refs.dialog.handleClose();
        this.openDialog = false;
        this.getTableData();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCommand(command) {
      this.$confirm("是否要执行批量操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const ids = [];
        if (this.multipleSelection.length == 0) {
          this.$message({
            type: "warning",
            message: "请选择需要操作的数据",
          });
          return;
        }
        this.multipleSelection &&
          this.multipleSelection.map((item) => {
            ids.push(item.ID);
          });

        const res = await batchFcgFinanceOperation({
          ids,
          command: command,
        });
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.getTableData();
        }
      });
    },
    sortChange(row) {
      //自定义排序要设置两个属性prop="field-name" sortable="custom"
      this.orderField = row.prop;
      this.orderType = this.directionMap[row.order] || "";
      this.getTableData();
    },
    async getSummaryList() {
      const res = await getFcgFinanceSummary(this.searchInfo);
      let keys = Object.keys(res.data.summary);
      for (let key of keys) {
        this.summary[key] = res.data.summary[key];
      }
      this.showSummary = true;
    },
    getSessionSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 1) {
          sums[index] = "";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          const sum = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = sum.toFixed(2);
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    getTransferOutSummaries(param) {
      const { columns } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (column.property === "total_amount") {
          sums[index] = this.financeSummary.transferout_total.total_amount;
        } else if (column.property === "total_water_amount") {
          sums[index] = this.financeSummary.transferout_total.total_water_amount;
        } else if (column.property === "total_win_amount") {
          sums[index] = this.financeSummary.transferout_total.total_win_amount;
        } else if (column.property === "total_count") {
          sums[index] = this.financeSummary.transferout_total.total_count;
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    importExcel() {
      //触发upLoad组件内部点击事件，弹出文件选择框
      this.$refs.uploadexcel.chooseFile();
    },
    async exportExcel() {
      this.searchInfo.action = "fcg_finance";
      await this.$api.getExcel(this.searchInfo);
    },
  },
  async created() {
    await this.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0));
    // await this.getTableData();
  },
};
</script>

<style scoped>
.box-card {
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 4px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}
</style>

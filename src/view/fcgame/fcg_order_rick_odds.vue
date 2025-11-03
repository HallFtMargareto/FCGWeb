<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="6" @search="getChartData">
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

        <el-form-item label="风险比例">
          <el-input v-model="prate" placeholder="请输入风险比例"></el-input>
        </el-form-item>

        <el-form-item label=" ">
          <el-button type="success" @click="generateContent" plain
            >生成内容</el-button
          >
          <el-button type="warning" @click="preLossRate" plain
            >预亏损率</el-button
          >
        </el-form-item>

        <el-form-item label="拆分单量">
          <el-input
            v-model.number="batchThreshold"
            placeholder="拆分单量"
          ></el-input>
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
      style="height: 100%"
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

          <el-descriptions-item label="号码数">{{
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
        :data="filteredRickOrder"
        style="width: 100%"
        border
        height="600px"
        highlight-current-row
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center"
          :index="indexMethod"
        >
        </el-table-column>
        <el-table-column
          prop="split_number"
          label="拆单号码"
          align="center"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
        ></el-table-column>
        <el-table-column
          prop="split_count"
          label="号码数量"
          align="center"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
        ></el-table-column>
        <el-table-column
          prop="exposure_amount"
          label="风险金额"
          align="center"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
        ></el-table-column>
        <el-table-column
          prop="potential_payout"
          label="中奖赔付"
          align="center"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
        >
          <template slot-scope="scope">
            -{{ scope.row.potential_payout }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ks_amount"
          label="预亏损金额"
          align="center"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
        >
          <template slot-scope="scope"> -{{ scope.row.ks_amount }} </template>
        </el-table-column>
        <el-table-column
          prop="risk_ratio"
          label="风险比例"
          align="center"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
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
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
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

    <!-- 预亏损率弹窗 -->
    <el-dialog
      title="预亏损率数据"
      :visible.sync="showPreLossDialog"
      width="60%"
    >
      <!-- 筛选区域 -->
      <div
        style="
          margin-bottom: 15px;
          padding: 10px;
          background-color: #f5f7fa;
          border-radius: 4px;
        "
      >
        <el-form
          ref="form"
          class="demo-form-inline"
          :inline="true"
          :label-width="labelWidth"
          size="mini"
          label-position="right"
        >
          <el-form-item label="预亏损金额">
            <el-input
              v-model="preLossAmountMinFilter"
              placeholder="预亏损金额最小值"
              clearable
              @input="handlePreLossFilter"
              style="width: 150px"
            ></el-input>
            -
            <el-input
              v-model="preLossAmountMaxFilter"
              placeholder="预亏损金额最大值"
              clearable
              @input="handlePreLossFilter"
              style="width: 150px"
            ></el-input>
          </el-form-item>

          <el-form-item label="转出总金额">
            <el-input
              v-model="transferAmountFilter"
              placeholder="转出总金额"
              clearable
              type="number"
              @input="handlePreLossFilter"
            ></el-input>
          </el-form-item>

          <el-form-item label=" ">
            <el-button @click="clearPreLossFilters">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
        :data="
          sortedPreLossData.length > 0 ? sortedPreLossData : filteredPreLossData
        "
        border
        stripe
        highlight-current-row
        max-height="400"
        @sort-change="handlePreLossSortChange"
      >
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center"
          :index="preLossIndexMethod"
        >
        </el-table-column>
        <el-table-column prop="PreLossAmount" label="预亏损金额" align="center">
          <template slot-scope="scope">
            {{ parseFloat(scope.row.PreLossAmount).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="PreLossRate" label="预亏损百分比" align="center">
          <template slot-scope="scope">
            {{ (parseFloat(scope.row.PreLossRate) * 100).toFixed(2) }}%
          </template>
        </el-table-column>

        <el-table-column
          prop="PreLossValueUnit"
          label="预亏损值单元"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="TransferAmount"
          label="转出总金额"
          align="center"
        >
          <template slot-scope="scope">
            {{ parseFloat(scope.row.TransferAmount).toFixed(2) }}
          </template>
        </el-table-column>

        <el-table-column prop="Difference" label="差值" align="center">
        </el-table-column>

        <el-table-column
          prop="GameRatio"
          label="博弈比例"
          align="center"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
        >
          <template slot-scope="scope">
            {{ (parseFloat(scope.row.GameRatio) * 100).toFixed(2) }}%
          </template>
        </el-table-column>

        <el-table-column prop="WinWaterRate" label="上水概率" align="center">
          <template slot-scope="scope">
            {{ (parseFloat(scope.row.WinWaterRate) * 100).toFixed(2) }}%
          </template>
        </el-table-column>
        <el-table-column prop="OrderCount" label="号码数" align="center">
          <template slot-scope="scope">
            {{ parseFloat(scope.row.OrderCount).toFixed(0) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="CalAmount"
          label="号码单价"
          align="center"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
        >
          <template slot-scope="scope">
            {{ parseFloat(scope.row.CalAmount).toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  getFcgOrderSplitNumberList,
  batchFcgOrderSplitNumberOperation,
} from "@/api/fcgame/fcg_order_split_number";
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
    // 过滤后的预亏损数据
    filteredPreLossData() {
      if (!this.preLossData || this.preLossData.length === 0) {
        return [];
      }

      let filteredData = this.preLossData.filter((item) => {
        const preLossAmount = parseFloat(item.PreLossAmount) || 0;
        const transferAmount = parseFloat(item.TransferAmount) || 0;

        // 预亏损金额最小值筛选
        if (this.preLossAmountMinFilter && this.preLossAmountMinFilter !== "") {
          const minValue = parseFloat(this.preLossAmountMinFilter) || 0;
          if (preLossAmount < minValue) {
            return false;
          }
        }

        // 预亏损金额最大值筛选
        if (this.preLossAmountMaxFilter && this.preLossAmountMaxFilter !== "") {
          const maxValue = parseFloat(this.preLossAmountMaxFilter) || 0;
          if (preLossAmount > maxValue) {
            return false;
          }
        }

        // 转出总金额筛选
        if (this.transferAmountFilter && this.transferAmountFilter !== "") {
          const filterValue = parseFloat(this.transferAmountFilter) || 0;
          if (transferAmount > filterValue) {
            return false;
          }
        }

        return true;
      });

      // 如果有排序条件，对过滤后的数据进行排序
      if (this.preLossSortProp && this.preLossSortOrder) {
        filteredData = [...filteredData].sort((a, b) => {
          let valueA = a[this.preLossSortProp];
          let valueB = b[this.preLossSortProp];

          // 处理数字类型的排序
          if (
            this.preLossSortProp === "PreLossAmount" ||
            this.preLossSortProp === "PreLossRate" ||
            this.preLossSortProp === "TransferAmount" ||
            this.preLossSortProp === "OrderCount" ||
            this.preLossSortProp === "CalAmount" ||
            this.preLossSortProp === "GameRatio"
          ) {
            valueA = parseFloat(valueA) || 0;
            valueB = parseFloat(valueB) || 0;
          }

          if (this.preLossSortOrder === "ascending") {
            return valueA - valueB;
          } else {
            return valueB - valueA;
          }
        });
      }

      return filteredData;
    },
    // 根据风险比例过滤后的订单数据
    filteredRickOrder() {
      if (
        !this.rickDataInfo.rick_order ||
        this.rickDataInfo.rick_order.length === 0
      ) {
        return [];
      }

      // 如果没有输入风险比例，返回所有数据
      if (!this.prate || this.prate === "") {
        return this.rickDataInfo.rick_order;
      }

      const filterValue = parseFloat(this.prate) || 0;

      return this.rickDataInfo.rick_order.filter((item) => {
        const riskRatio = parseFloat(item.risk_ratio) || 0;
        return riskRatio > filterValue;
      });
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
      tenant_id: null,
      game_category: 1, // 默认福彩
      maxValue: 0,
      // 期号列表
      lotteryIssueList: [],
      rickDataInfo: {},
      ks_amount: undefined,
      // 预亏损弹窗相关数据
      showPreLossDialog: false,
      preLossData: [],
      // 筛选相关数据
      preLossAmountMinFilter: "",
      preLossAmountMaxFilter: "",
      transferAmountFilter: "",
      // 排序相关数据
      sortProp: "",
      sortOrder: null,
      // 预亏损数据排序相关
      preLossSortProp: "",
      preLossSortOrder: null,
      sortedPreLossData: [],
      // 复制loading状态
      copyLoading: false,
      prate: null, //风险比例数字帅选
      batchThreshold: 50, // 批次拆分阈值
    };
  },
  methods: {
    ...mapMutations("common", ["setAlpha", "setBeta"]),
    // 更新排序后的预亏损数据
    updateSortedPreLossData() {
      this.sortedPreLossData = this.filteredPreLossData;
    },
    // 自定义序号方法，从1开始
    indexMethod(index) {
      return index + 1;
    },
    // 预亏损率表格的自定义序号方法，从1开始
    preLossIndexMethod(index) {
      return index + 1;
    },
    // 与亏损率
    async preLossRate() {
      const res = await getFcgOrderSplitNumberList({
        action: "pre_loss_rate",
        game_category: this.game_category,
        issue_id: this.chartIssueId,
        // alpha: this.alpha,
        // beta: this.beta,
        tenant_id: this.tenant_id,
        ks_amount: this.ks_amount,
      });
      if (res.code === 0 && res.data && res.data.pre_loss_list) {
        this.preLossData = res.data.pre_loss_list;
        // 清除之前的筛选条件
        this.clearPreLossFilters();
        this.showPreLossDialog = true;
      } else {
        this.$message.error(res.msg || "获取数据失败");
      }
    },

    // 获取图表数据
    async getChartData() {
      if (this.chartIssueId == 0) {
        this.$message.warning("请输入期号");
        return;
      }
      if (this.tenant_id == 0) {
        this.$message.warning("请选择所属组织");
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
          tenant_id: this.tenant_id,
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

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 处理表格排序变化
    handleSortChange({ prop, order }) {
      this.sortProp = prop;
      this.sortOrder = order;

      // 获取当前过滤后的数据进行排序
      const currentData = this.filteredRickOrder;

      if (!currentData || currentData.length === 0) {
        return;
      }

      // 创建数据副本进行排序
      const sortedData = [...currentData];

      if (order) {
        sortedData.sort((a, b) => {
          let valueA = a[prop];
          let valueB = b[prop];

          // 处理数字类型的排序
          if (
            prop === "exposure_amount" ||
            prop === "potential_payout" ||
            prop === "ks_amount" ||
            prop === "trans_amount" ||
            prop === "split_count" ||
            prop === "risk_ratio"
          ) {
            valueA = parseFloat(valueA) || 0;
            valueB = parseFloat(valueB) || 0;
          }

          // 处理拆单号码的排序（可能是数字或字符串）
          if (prop === "split_number") {
            // 尝试转换为数字，如果失败则按字符串排序
            const numA = parseFloat(valueA);
            const numB = parseFloat(valueB);
            if (!isNaN(numA) && !isNaN(numB)) {
              valueA = numA;
              valueB = numB;
            } else {
              // 字符串排序
              if (order === "ascending") {
                return valueA.toString().localeCompare(valueB.toString());
              } else {
                return valueB.toString().localeCompare(valueA.toString());
              }
            }
          }

          if (order === "ascending") {
            return valueA - valueB;
          } else {
            return valueB - valueA;
          }
        });
      }

      // 更新排序后的数据到原始数据，这样过滤后的数据也会保持排序
      this.$set(this.rickDataInfo, "rick_order", sortedData);
    },

    // 处理预亏损率弹窗表格排序变化
    handlePreLossSortChange({ prop, order }) {
      // 更新排序条件
      this.preLossSortProp = prop;
      this.preLossSortOrder = order;

      // 强制更新视图
      this.$forceUpdate();
    },

    // 处理预亏损数据筛选
    handlePreLossFilter() {
      // 这个方法主要用于触发计算属性的重新计算
      // 实际的筛选逻辑在 filteredPreLossData 计算属性中
    },

    // 清除预亏损数据筛选
    clearPreLossFilters() {
      this.preLossAmountMinFilter = "";
      this.preLossAmountMaxFilter = "";
      this.transferAmountFilter = "";
      // 同时清除排序条件
      this.preLossSortProp = "";
      this.preLossSortOrder = null;
      // 清空排序后的数据
      this.sortedPreLossData = [];
      // 强制更新视图
      this.$forceUpdate();
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

    // 生成批次内容
    generateBatchContent(validData) {
      let prefix = this.game_category === 1 ? "福" : "体";

      // 为每个号码计算批次信息
      const numberBatches = {};

      validData.forEach((item) => {
        const number = item.split_number;
        const totalCount = parseInt(item.trans_count) || 0;

        if (totalCount <= this.batchThreshold) {
          // 不需要拆分，直接添加到第一批次
          if (!numberBatches[1]) {
            numberBatches[1] = [];
          }
          numberBatches[1].push(`${number}/${totalCount}单`);
        } else {
          // 需要拆分
          const batchCount = Math.ceil(totalCount / this.batchThreshold);
          let remainingCount = totalCount;

          for (let batchIndex = 1; batchIndex <= batchCount; batchIndex++) {
            if (!numberBatches[batchIndex]) {
              numberBatches[batchIndex] = [];
            }

            const countInThisBatch = Math.min(
              remainingCount,
              this.batchThreshold
            );
            numberBatches[batchIndex].push(`${number}/${countInThisBatch}单`);
            remainingCount -= countInThisBatch;
          }
        }
      });

      // 生成多行内容
      const lines = [];
      const maxBatch = Math.max(...Object.keys(numberBatches).map(Number));

      for (let batchIndex = 1; batchIndex <= maxBatch; batchIndex++) {
        if (numberBatches[batchIndex] && numberBatches[batchIndex].length > 0) {
          const batchItems = numberBatches[batchIndex];
          const batchLines = [];

          // 当号码数量超过50个时换行
          for (let i = 0; i < batchItems.length; i += 50) {
            const chunk = batchItems.slice(i, i + 50);
            // 超过50个号码量换行的新行不需要拼接前缀
            batchLines.push(chunk.join(", "));
          }

          // 每个批次生成多行，每行最多50个号码
          batchLines.forEach((line) => {
            // 只有超出batchThreshold批次的那部分数据才拼接 福或者体字
            if (batchIndex > 1) {
              lines.push(`${prefix} ${line}`);
            } else {
              lines.push(" ");
              // lines.push(line);
              lines.push(`${prefix} ${line}`);
            }
          });

          // 在批次之间添加空白行（除了最后一个批次）
          if (batchIndex < maxBatch) {
            lines.push(" "); // 添加空白行
          }
        }
      }

      return lines.join("\n");
    },

    // 复制内容按钮点击事件
    async copyColumn() {
      // 防止重复点击
      if (this.copyLoading) {
        return;
      }

      // 过滤掉 bet_content 为空的数据
      const validData = this.multipleSelection.filter(
        (item) => item.bet_content
      );

      // 如果没有有效数据，提示用户
      if (validData.length === 0) {
        this.$message.warning("没有可复制的内容");
        return;
      }

      // 生成批次格式的内容
      const contentToCopy = this.generateBatchContent(validData);

      try {
        // 复制到剪贴板 - 使用兼容的方法
        if (navigator.clipboard && window.isSecureContext) {
          // 在安全上下文中使用现代 clipboard API
          await navigator.clipboard.writeText(contentToCopy);
        } else {
          // 兼容旧浏览器或非安全上下文的实现
          const textarea = document.createElement("textarea");
          textarea.value = contentToCopy;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }

        this.$message.success("复制成功");

        // 复制成功后发送数据到后台
        await this.sendTransferData(validData);
      } catch (err) {
        this.$message.error("复制失败");
        console.error("复制失败:", err);
      }
    },

    // 发送转移数据到后台
    async sendTransferData(validData) {
      try {
        this.copyLoading = true;

        // 构建transfer_list数据
        const transfer_list = validData.map((item) => ({
          split_number: item.split_number,
          trans_count: item.trans_count,
          trans_amount: item.trans_amount,
          tenant_id: this.tenant_id,
        }));

        // 构建请求数据
        const requestData = {
          game_category: this.game_category,
          ids: [this.chartIssueId],
          issue_id: this.chartIssueId,
          command: "transfer",
          transfer_list: transfer_list,
        };

        // 调用API接口
        const res = await batchFcgOrderSplitNumberOperation(requestData);

        if (res.code === 0) {
          this.$message.success("保存转出数据成功");
        } else {
          this.$message.error(res.msg || "保存转出数据失败");
        }
      } catch (error) {
        this.$message.error("保存转出数据失败");
        console.error("保存转出数据失败:", error);
      } finally {
        this.copyLoading = false;
      }
    },
  },
  watch: {
    // 监听排序条件变化，更新排序后的数据
    preLossSortProp() {
      this.updateSortedPreLossData();
    },
    preLossSortOrder() {
      this.updateSortedPreLossData();
    },
    // 监听过滤条件变化，更新排序后的数据
    preLossAmountMinFilter() {
      this.updateSortedPreLossData();
    },
    preLossAmountMaxFilter() {
      this.updateSortedPreLossData();
    },
    transferAmountFilter() {
      this.updateSortedPreLossData();
    },
    // 监听原始数据变化，更新排序后的数据
    preLossData() {
      this.updateSortedPreLossData();
    },
  },
  async created() {
    await this.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0));
    this.getChartData();
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

/* 预亏损弹窗样式 */
.dialog-footer {
  text-align: center;
  padding: 20px 0 0 0;
}

/* 表格数字格式化 */
.el-table .cell {
  font-family: "Courier New", monospace;
}

/* 弹窗表格样式优化 */
.el-dialog__body {
  padding: 20px;
}
</style>

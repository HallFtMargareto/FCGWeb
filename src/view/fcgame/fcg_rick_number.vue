<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="5" @search="getChartData">
        <el-form-item label="期号">
          <IssueSelect
            v-model="chartIssueId"
            placeholder="请选择期号"
            clearable
          ></IssueSelect>
        </el-form-item>

        <el-form-item label="所属组织" v-if="userInfo.perm['host']">
          <TenantSelect
            v-model="tenant_id"
            placeholder="请选择组织"
            :autoSelectFirst="false"
            clearable
          ></TenantSelect>
        </el-form-item>

        <el-form-item label="拆分号码">
          <el-input v-model="split_number" placeholder="拆分号码"></el-input>
        </el-form-item>

        <!-- <el-form-item label="体彩号码">
          <el-input v-model="tc_draw_number" placeholder="体彩号码"></el-input>
        </el-form-item> -->
      </searchform>
    </div>

    <div
      class="split-info"
      style="height: 100%"
      v-if="splitList && splitList.length > 0"
    >
      <el-descriptions title="号码信息" :column="3" border> </el-descriptions>
      <el-table
        ref="splitTable"
        :data="splitList"
        class="el-table"
        border
        height="700px"
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
          label="拆分号码"
          sortable
          align="center"
        ></el-table-column>
        <el-table-column
          prop="total"
          label="出现次数"
          sortable
          align="center"
        ></el-table-column>
        <el-table-column
          prop="total_amount"
          label="总投注金额"
          sortable="custom"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="fu_cai_amount"
          label="福彩投注金额"
          sortable="custom"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="ti_cai_amount"
          label="体彩投注金额"
          sortable="custom"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="fu_cai_reward"
          label="福彩预计奖金"
          sortable="custom"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="fu_cai_profit"
          label="福彩预计利润"
          sortable="custom"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="ti_cai_reward"
          label="体彩预计奖金"
          sortable="custom"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="ti_cai_profit"
          label="体彩预计利润"
          sortable="custom"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="forecast_reward"
          label="预计总奖金"
          sortable="custom"
          align="center"
        ></el-table-column>
      </el-table>
      <div style="margin-top: 10px">
        <el-button @click="toggleSelectAll">{{
          isAllSelected ? "取消全选" : "全选"
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getFcgOrderSplitNumberList } from "@/api/fcgame/fcg_order_split_number";
import infoList from "@/mixins/infoList";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "fcg_rick_number",
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
    // 获取拆分列表数据
    splitList() {
      return this.rickDataInfo.split_list || [];
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
      split_number: "",
      // 表格相关数据
      multipleSelection: [],
      isAllSelected: false,
    };
  },
  methods: {
    ...mapMutations("common", ["setAlpha", "setBeta"]),
    // 自定义序号方法，从1开始
    indexMethod(index) {
      return index + 1;
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
          action: "rick_split_num",
          // game_category: this.game_category,
          issue_id: this.chartIssueId,
          split_number: this.split_number,
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

    handleSelectionChange(selection) {
      this.multipleSelection = selection;
      // 更新全选状态
      this.isAllSelected = selection.length === this.splitList.length;
    },

    toggleSelectAll() {
      if (this.isAllSelected) {
        // 取消全选
        this.$refs.splitTable.clearSelection();
      } else {
        // 全选
        this.splitList.forEach((row) => {
          this.$refs.splitTable.toggleRowSelection(row, true);
        });
      }
      this.isAllSelected = !this.isAllSelected;
    },

    // 处理表格排序
    handleSortChange({ column, prop, order }) {
      console.log(column);
      if (order === null) {
        // 如果没有排序，恢复原始数据
        this.getChartData();
        return;
      }

      // 获取需要排序的数据
      const data = [...this.splitList];

      // 定义排序方法
      const sortMethod = (a, b) => {
        // 获取要比较的值
        const valueA = a[prop];
        const valueB = b[prop];

        // 处理数字类型的排序
        if (typeof valueA === "number" && typeof valueB === "number") {
          return order === "ascending" ? valueA - valueB : valueB - valueA;
        }

        // 处理字符串类型的排序
        if (typeof valueA === "string" && typeof valueB === "string") {
          return order === "ascending"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }

        // 其他情况，转换为字符串比较
        return order === "ascending"
          ? String(valueA).localeCompare(String(valueB))
          : String(valueB).localeCompare(String(valueA));
      };

      // 对数据进行排序
      data.sort(sortMethod);

      // 更新数据
      this.$set(this.rickDataInfo, "split_list", data);
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
.split-info {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.split-grid-header,
.split-grid-row {
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  gap: 5px;
}

.split-grid-cell {
  padding: 8px;
  text-align: center;
  border: 1px solid #ebeef5;
  background-color: #f5f7fa;
}

.split-grid-cell.header {
  font-weight: bold;
  background-color: #e4e7ed;
}
</style>

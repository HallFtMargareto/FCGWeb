<template>
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
      height="800px"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
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
      <!-- <el-table-column prop="PnLTotal" label="全场总盈亏" sortable align="center"></el-table-column>
            <el-table-column prop="PnLFuCai" label="福彩盈亏" sortable align="center"></el-table-column>
            <el-table-column prop="PnLTiCai" label="体彩盈亏" sortable align="center"></el-table-column> -->
    </el-table>
    <div style="margin-top: 10px">
      <el-button @click="toggleSelectAll">{{
        isAllSelected ? "取消全选" : "全选"
      }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "fcg_rick_number",
  props: {
    splitList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      multipleSelection: [],
      isAllSelected: false,
    };
  },
  methods: {
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
        this.$emit("reset-data");
        return;
      }

      // 获取需要排序的数据
      const data = this.splitList;

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
      this.$emit("update-data", [...data]);
    },
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

<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="3" @search="onQuery">
        <el-form-item label="彩票类型">
          <el-input
            v-model.number="searchInfo.game_category"
            placeholder="请输入"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="所属组织">
          <TenantSelect
            v-model="searchInfo.tenant_id"
            placeholder="请选择组织"
            :autoSelectFirst="false"
            clearable
          ></TenantSelect>
        </el-form-item>

        <el-form-item label="玩法类型">
          <el-input
            v-model="searchInfo.issue_no"
            placeholder="玩法分类"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="开奖日期">
          <datepicker
            v-model="searchInfo.lottery_date"
            type="datetime"
            placeholder="选择日期"
            style="width: 100%"
            clearable
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <!-- @change="handleStatusChange(scope.row)" -->
          <el-select
            v-model="searchInfo.status"
            placeholder="请选择"
            size="mini"
          >
            <el-option label="未开售" :value="0"></el-option>
            <el-option label="售卖中" :value="1"></el-option>
            <el-option label="封盘" :value="2"></el-option>
            <el-option label="已开奖" :value="3"></el-option>
            <el-option label="作废" :value="4"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="开奖结果">
          <el-input
            v-model="searchInfo.draw_number"
            placeholder="开奖结果"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="开奖来源">
          <el-input
            v-model="searchInfo.source"
            placeholder="开奖来源"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="创建时间">
          <datepicker v-model="searchInfo.startTime" type="datetime" />
        </el-form-item>
        <el-form-item label="结束时间">
          <datepicker v-model="searchInfo.endTime" type="datetime" />
        </el-form-item>
      </searchform>
    </div>

    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      ref="multipleTable"
      :show-summary="showSummary"
      :summary-method="getSummaries"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="ID" prop="ID" sortable></el-table-column>

      <el-table-column label="彩票类型" prop="game_category_name">
      </el-table-column>
      <!-- <el-table-column label="玩法类型" prop="game_type_name">
      </el-table-column> -->

      <el-table-column label="期号" prop="issue_no" show-overflow-tooltip>
      </el-table-column>

      <!-- <el-table-column label="开奖日期" prop="lottery_date">
      </el-table-column> -->

      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          {{ statusMap[scope.row.status] }}
        </template>
      </el-table-column>

      <el-table-column
        label="福彩开奖号码"
        prop="fc_draw_number"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="体彩开奖号码"
        prop="tc_draw_number"
        show-overflow-tooltip
      >
      </el-table-column>

      <!-- <el-table-column label="总下注" prop="total_bets">
      </el-table-column>

      <el-table-column label="总投金额" prop="total_amount">
      </el-table-column>

      <el-table-column label="开奖来源" prop="source" show-overflow-tooltip>
      </el-table-column> -->

      <el-table-column
        label="添加时间"
        width="160"
        prop="created_at"
        sortable="custom"
      >
        <template slot-scope="scope">{{ scope.row.created_at }}</template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="userInfo.perm['system.update']"
            @click="editRow(scope.row)"
            type="text"
            size="small"
            icon="el-icon-edit"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- class="pagination-container" -->
    <div>
      <!-- 数据合计,按需求启用 -->
      <!-- <el-button v-if="userInfo.perm['system.summary']" @click="getSummaryList">合计</el-button> -->
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="[10, 30, 50, 100]"
        :style="{ float: 'right', padding: '20px' }"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
        background
      ></el-pagination>
    </div>

    <dialogform
      :visible.sync="openDialog"
      :dialogTitle="dialogTitle"
      :formDatas="formData"
      @confirm="enterDialog"
      ref="dialog"
    >
      <!-- <el-form-item label="官方期号" prop="official_issue_no">
        <el-input v-model="formData.official_issue_no" placeholder="例如 20250909" clearable></el-input>
      </el-form-item> -->
      <el-form-item label="福彩开奖号码" prop="fc_draw_number">
        <el-input
          v-model="formData.fc_draw_number"
          placeholder="请输入开奖号码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="体彩开奖号码" prop="fc_draw_number">
        <el-input
          v-model="formData.tc_draw_number"
          placeholder="请输入开奖号码"
          clearable
        ></el-input>
      </el-form-item>
    </dialogform>

    <uploadexcel ref="uploadexcel" action="FcgLotteryIssue"></uploadexcel>
  </div>
</template>

<script>
import {
  createFcgLotteryIssue,
  deleteFcgLotteryIssue,
  updateFcgLotteryIssue,
  findFcgLotteryIssue,
  getFcgLotteryIssueList,
  batchFcgLotteryIssueOperation,
  getFcgLotteryIssueSummary,
} from "@/api/fcgame/fcg_lottery_issue";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
export default {
  name: "fcg_lottery_issue",
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      statusMap: {
        0: "未开始",
        1: "运行中",
        2: "已结束",
        3: "已开奖",
        4: "作废",
      },
      listApi: getFcgLotteryIssueList,
      openDialog: false,
      dialogTitle: "手动开奖",
      type: "",
      multipleSelection: [],
      formData: {
        game_category: undefined,
        issue_no: "",
        lottery_date: "",
        status: true,
        draw_number: "",
        total_bets: undefined,
        total_amount: undefined,
        source: "",
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
    createRow() {
      this.formData = {};
      this.type = "create";
      this.dialogTitle = "创建";
      this.openDialog = true;
    },
    async editRow(row) {
      this.type = "update";
      this.dialogTitle = "编辑";
      const res = await findFcgLotteryIssue({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.refcg_lottery_issue;
        this.openDialog = true;
      }
    },
    async deleteRow(row) {
      const res = await deleteFcgLotteryIssue({ ID: row.ID });
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
          res = await createFcgLotteryIssue(this.formData);
          break;
        case "update":
          res = await updateFcgLotteryIssue(this.formData);
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

        const res = await batchFcgLotteryIssueOperation({
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
      const res = await getFcgLotteryIssueSummary(this.searchInfo);
      let keys = Object.keys(res.data.summary);
      for (let key of keys) {
        this.summary[key] = res.data.summary[key];
      }
      this.showSummary = true;
    },
    getSummaries(param) {
      const sums = [];
      const { columns } = param;
      let that = this;
      columns.forEach((column, index) => {
        sums[index] =
          that.summary[column.property] != null
            ? that.summary[column.property]
            : null;
      });
      // sums[0] = "合计";
      return sums;
    },
    importExcel() {
      //触发upLoad组件内部点击事件，弹出文件选择框
      this.$refs.uploadexcel.chooseFile();
    },
    async exportExcel() {
      this.searchInfo.action = "fcg_lottery_issue";
      await this.$api.getExcel(this.searchInfo);
    },
  },
  async created() {
    await this.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await this.getTableData();
  },
};
</script>

<style scoped></style>

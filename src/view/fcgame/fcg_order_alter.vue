<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="3" @search="onQuery">
        <!-- <el-form-item label="来源">
          <el-input
            v-model="searchInfo.source"
            placeholder="请输入来源"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="变更内容">
          <el-input
            v-model="searchInfo.alter"
            placeholder="请输入变更内容"
            clearable
          ></el-input>
        </el-form-item> -->

        <el-form-item label="期号">
          <IssueSelect
            v-model="searchInfo.issue_id"
            placeholder="请选择期号"
            clearable
          ></IssueSelect>
        </el-form-item>

        <template v-if="userInfo.perm['host']">
          <el-form-item label="所属组织">
            <TenantSelect
              v-model="searchInfo.tenant_id"
              placeholder="请选择组织"
              :autoSelectFirst="false"
              clearable
            ></TenantSelect>
          </el-form-item>
        </template>

        <el-form-item label="订单ID">
          <el-input
            v-model="searchInfo.order_id"
            placeholder="请输入订单ID"
            clearable
          ></el-input>
        </el-form-item>

        <!-- <el-form-item label="原始投注金额">
          <el-input
            v-model="searchInfo.source_bet_amount"
            placeholder="请输入原始投注金额"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="原始中奖金额">
          <el-input
            v-model="searchInfo.source_win_amount"
            placeholder="请输入原始中奖金额"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="原始投注数量">
          <el-input
            v-model="searchInfo.source_bet_count"
            placeholder="请输入原始投注数量"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="变更后投注金额">
          <el-input
            v-model="searchInfo.alter_bet_amount"
            placeholder="请输入变更后投注金额"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="变更后中奖金额">
          <el-input
            v-model="searchInfo.alter_win_amount"
            placeholder="请输入变更后中奖金额"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="变更后投注数量">
          <el-input
            v-model="searchInfo.alter_bet_count"
            placeholder="请输入变更后投注数量"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="管理员ID">
          <el-input
            v-model.number="searchInfo.admin_id"
            placeholder="请输入管理员ID"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="会话ID">
          <el-input
            v-model.number="searchInfo.session_id"
            placeholder="请输入会话ID"
            clearable
          ></el-input>
        </el-form-item> -->

        <el-form-item label="添加时间">
          <datepicker v-model="searchInfo.startTime" type="datetime" />
        </el-form-item>
        <el-form-item label="结束时间">
          <datepicker v-model="searchInfo.endTime" type="datetime" />
        </el-form-item>
      </searchform>

      <!-- <el-form size="mini" :inline="true" class="btn-form-inline">
        <el-button
          v-if="userInfo.perm['system.create']"
          @click="createRow"
          icon="el-icon-plus"
          type="primary"
          >新增</el-button
        >
        <el-button
          v-if="
            userInfo.perm['system.batch_delete'] && multipleSelection.length > 0
          "
          @click="handleCommand('remove')"
          icon="el-icon-delete"
          type="danger"
          plain
          >批量删除</el-button
        >
        <el-button
          v-if="userInfo.perm['system.import']"
          @click="importExcel"
          icon="el-icon-sell"
          >导入</el-button
        >
        <el-button
          v-if="userInfo.perm['system.export']"
          @click="exportExcel"
          icon="el-icon-sold-out"
          >导出</el-button
        >
      </el-form> -->
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
      <!-- <el-table-column
        label="ID"
        prop="ID"
        sortable
        width="80"
      ></el-table-column> -->

      <el-table-column label="订单ID" prop="order_id" width="120">
      </el-table-column>

      <el-table-column
        label="原投注数量"
        prop="source_bet_count"
        width="120"
        align="right"
      >
      </el-table-column>

      <el-table-column
        label="原投注金额"
        prop="source_bet_amount"
        width="130"
        align="right"
      >
        <template slot-scope="scope">{{
          formatAmount(scope.row.source_bet_amount)
        }}</template>
      </el-table-column>

      <el-table-column
        label="原中奖金额"
        prop="source_win_amount"
        width="130"
        align="right"
      >
        <template slot-scope="scope">{{
          formatAmount(scope.row.source_win_amount)
        }}</template>
      </el-table-column>

      <el-table-column
        label="变更后投注数量"
        prop="alter_bet_count"
        width="120"
        align="right"
      >
      </el-table-column>

      <el-table-column
        label="变更后投注金额"
        prop="alter_bet_amount"
        width="130"
        align="right"
      >
        <template slot-scope="scope">{{
          formatAmount(scope.row.alter_bet_amount)
        }}</template>
      </el-table-column>

      <el-table-column
        label="变更后中奖金额"
        prop="alter_win_amount"
        width="130"
        align="right"
      >
        <template slot-scope="scope">{{
          formatAmount(scope.row.alter_win_amount)
        }}</template>
      </el-table-column>

      <el-table-column label="组织" prop="platform_name"> </el-table-column>
      <el-table-column label="会话" prop="contact_nick_name"> </el-table-column>
      <el-table-column label="操作用户" prop="platform_name"> </el-table-column>

      <el-table-column
        label="操作时间"
        width="160"
        prop="created_at"
        sortable="custom"
      >
        <template slot-scope="scope">{{ scope.row.created_at }}</template>
      </el-table-column>

      <!-- <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="userInfo.perm['system.update']"
            @click="editRow(scope.row)"
            type="text"
            size="small"
            icon="el-icon-edit"
            >编辑</el-button
          >

          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确定要删除吗？"
            @confirm="deleteRow(scope.row)"
            v-if="userInfo.perm['system.delete']"
          >
            <el-button
              type="text"
              size="small"
              icon="el-icon-delete"
              slot="reference"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column> -->
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
      :formRule="formRules"
      @confirm="enterDialog"
      ref="dialog"
    >
      <el-form-item label="来源" prop="source">
        <el-input
          v-model="formData.source"
          placeholder="请输入来源"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="变更内容" prop="alter">
        <el-input
          v-model="formData.alter"
          placeholder="请输入变更内容"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="订单ID" prop="order_id">
        <el-input
          v-model="formData.order_id"
          clearable
          placeholder="请输入订单ID"
        ></el-input>
      </el-form-item>
      <el-form-item label="租户ID" prop="tenant_id">
        <el-input
          v-model.number="formData.tenant_id"
          placeholder="请输入租户ID"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="原始投注金额" prop="source_bet_amount">
        <el-input
          v-model="formData.source_bet_amount"
          clearable
          placeholder="请输入原始投注金额"
        ></el-input>
      </el-form-item>
      <el-form-item label="原始中奖金额" prop="source_win_amount">
        <el-input
          v-model="formData.source_win_amount"
          clearable
          placeholder="请输入原始中奖金额"
        ></el-input>
      </el-form-item>
      <el-form-item label="原始投注数量" prop="source_bet_count">
        <el-input
          v-model="formData.source_bet_count"
          clearable
          placeholder="请输入原始投注数量"
        ></el-input>
      </el-form-item>
      <el-form-item label="变更后投注金额" prop="alter_bet_amount">
        <el-input
          v-model="formData.alter_bet_amount"
          clearable
          placeholder="请输入变更后投注金额"
        ></el-input>
      </el-form-item>
      <el-form-item label="变更后中奖金额" prop="alter_win_amount">
        <el-input
          v-model="formData.alter_win_amount"
          clearable
          placeholder="请输入变更后中奖金额"
        ></el-input>
      </el-form-item>
      <el-form-item label="变更后投注数量" prop="alter_bet_count">
        <el-input
          v-model="formData.alter_bet_count"
          clearable
          placeholder="请输入变更后投注数量"
        ></el-input>
      </el-form-item>
      <el-form-item label="管理员ID" prop="admin_id">
        <el-input
          v-model.number="formData.admin_id"
          placeholder="请输入管理员ID"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="会话ID" prop="session_id">
        <el-input
          v-model.number="formData.session_id"
          placeholder="请输入会话ID"
          clearable
        ></el-input>
      </el-form-item>
    </dialogform>

    <uploadexcel ref="uploadexcel" action="FcgOrderAlter"></uploadexcel>
  </div>
</template>

<script>
import {
  createFcgOrderAlter,
  deleteFcgOrderAlter,
  updateFcgOrderAlter,
  findFcgOrderAlter,
  getFcgOrderAlterList,
  batchFcgOrderAlterOperation,
  getFcgOrderAlterSummary,
} from "@/api/fcgame/fcg_order_alter";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
export default {
  name: "fcg_order_alter",
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      listApi: getFcgOrderAlterList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      formData: {
        source: "",
        alter: "",
        order_id: undefined,
        tenant_id: undefined,
        source_bet_amount: undefined,
        source_win_amount: undefined,
        source_bet_count: undefined,
        alter_bet_amount: undefined,
        alter_win_amount: undefined,
        alter_bet_count: undefined,
        admin_id: undefined,
        session_id: undefined,
      },
      formRules: {
        source: [{ required: true, message: "请输入来源", trigger: "blur" }],
        alter: [{ required: true, message: "请输入变更内容", trigger: "blur" }],
        order_id: [
          { required: true, message: "请输入订单ID", trigger: "blur" },
        ],
        tenant_id: [
          { required: true, message: "请输入租户ID", trigger: "blur" },
        ],
        source_bet_amount: [
          { required: true, message: "请输入原始投注金额", trigger: "blur" },
        ],

        source_win_amount: [
          { required: true, message: "请输入原始中奖金额", trigger: "blur" },
        ],

        source_bet_count: [
          { required: true, message: "请输入原始投注数量", trigger: "blur" },
        ],

        alter_bet_amount: [
          { required: true, message: "请输入变更后投注金额", trigger: "blur" },
        ],

        alter_win_amount: [
          { required: true, message: "请输入变更后中奖金额", trigger: "blur" },
        ],

        alter_bet_count: [
          { required: true, message: "请输入变更后投注数量", trigger: "blur" },
        ],
        admin_id: [
          { required: true, message: "请输入管理员ID", trigger: "blur" },
        ],
        session_id: [
          { required: true, message: "请输入会话ID", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    formatAmount(value) {
      if (value === null || value === undefined || value === "") return "-";
      return Number(value).toLocaleString("zh-CN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
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
      const res = await findFcgOrderAlter({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.refcg_order_alter;
        this.openDialog = true;
      }
    },
    async deleteRow(row) {
      const res = await deleteFcgOrderAlter({ ID: row.ID });
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
          res = await createFcgOrderAlter(this.formData);
          break;
        case "update":
          res = await updateFcgOrderAlter(this.formData);
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

        const res = await batchFcgOrderAlterOperation({
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
      const res = await getFcgOrderAlterSummary(this.searchInfo);
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
      this.searchInfo.action = "fcg_order_alter";
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

<style scoped>
/* 页面容器样式 */
.search-term {
  background: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 表格样式优化 */
.el-table {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.el-table th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

.el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: #fafafa;
}

.el-table__body tr:hover > td {
  background-color: #f5f7fa !important;
}

/* 表单标签样式优化 */
.el-form-item__label {
  font-weight: 500;
  color: #303133;
}

/* 输入框样式优化 */
.el-input__inner {
  border-radius: 4px;
  transition: all 0.3s;
}

.el-input__inner:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* 金额列样式 */
.el-table .cell {
  font-size: 13px;
}

/* 对话框样式优化 */
.el-dialog {
  border-radius: 8px;
}

.el-dialog__header {
  background: #f5f7fa;
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

.el-dialog__title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.el-dialog__body {
  padding: 20px;
}
</style>

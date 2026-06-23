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
          <IssueSelect v-model="searchInfo.issue_id" placeholder="请选择期号" clearable></IssueSelect>
        </el-form-item>

        <template v-if="userInfo.perm['host']">
          <el-form-item label="所属组织">
            <TenantSelect v-model="searchInfo.tenant_id" placeholder="请选择组织" :autoSelectFirst="false" clearable>
            </TenantSelect>
          </el-form-item>
        </template>

        <el-form-item label="订单ID">
          <el-input v-model="searchInfo.order_id" placeholder="请输入订单ID" clearable></el-input>
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

    <el-table :data="tableData" @selection-change="handleSelectionChange" @sort-change="sortChange" ref="multipleTable"
      :show-summary="showSummary" :summary-method="getSummaries">
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <!-- <el-table-column
        label="ID"
        prop="ID"
        sortable
        width="80"
      ></el-table-column> -->

      <el-table-column label="订单ID" prop="order_id" width="100" align="center" fixed="left">
        <template slot-scope="scope">
          <div class="clickable-content" @click="openOrderDetail(scope.row)">
            {{ scope.row.ID }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="投注内容" prop="source_content" min-width="150" align="left">
        <template slot-scope="scope">
          <div class="clickable-content" @click="copyOrderDetail(scope.row)">
            {{ scope.row.source_content }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="标记状态" prop="source_mark_state" sortable="custom" width="100" align="center">
        <template slot-scope="scope">
          {{ markStateMap[scope.row.source_mark_state] || scope.row.source_mark_state }}
        </template>
      </el-table-column>

      <el-table-column label="投注数量" width="120" align="center">
        <template slot-scope="scope">
          <div><span style="color: #909399; font-size: 12px;">原:</span> {{ scope.row.source_bet_count }}</div>
          <div>
            <span style="color: #F56C6C; font-size: 12px;">变:</span> {{ scope.row.alter_bet_count }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="投注金额" width="140" align="center">
        <template slot-scope="scope">
          <div><span style="color: #909399; font-size: 12px;">原:</span> {{ formatAmount(scope.row.source_bet_amount) }}
          </div>
          <div>
            <span style="color: #F56C6C; font-size: 12px;">变:</span> {{ formatAmount(scope.row.alter_bet_amount) }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="中奖金额" width="140" align="center">
        <template slot-scope="scope">
          <div><span style="color: #909399; font-size: 12px;">原:</span> {{ formatAmount(scope.row.source_win_amount) }}
          </div>
          <div>
            <span style="color: #F56C6C; font-size: 12px;">变:</span> {{ formatAmount(scope.row.alter_win_amount) }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="所属组织" prop="platform_name" width="100" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="所属会话" prop="contact_nick_name" width="120" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作用户" prop="admin_nick_name" width="100" align="center" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="操作时间" width="160" prop="created_at" sortable="custom" align="center">
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
      <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 30, 50, 100]"
        :style="{ float: 'right', padding: '20px' }" :total="total" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" background></el-pagination>
    </div>

    <dialogform :visible.sync="openDialog" :dialogTitle="dialogTitle" :formDatas="formData" :formRule="formRules"
      @confirm="enterDialog" ref="dialog">
      <el-form-item label="来源" prop="source">
        <el-input v-model="formData.source" placeholder="请输入来源" clearable></el-input>
      </el-form-item>
      <el-form-item label="变更内容" prop="alter">
        <el-input v-model="formData.alter" placeholder="请输入变更内容" clearable></el-input>
      </el-form-item>
      <el-form-item label="订单ID" prop="order_id">
        <el-input v-model="formData.order_id" clearable placeholder="请输入订单ID"></el-input>
      </el-form-item>
      <el-form-item label="租户ID" prop="tenant_id">
        <el-input v-model.number="formData.tenant_id" placeholder="请输入租户ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="原始投注金额" prop="source_bet_amount">
        <el-input v-model="formData.source_bet_amount" clearable placeholder="请输入原始投注金额"></el-input>
      </el-form-item>
      <el-form-item label="原始中奖金额" prop="source_win_amount">
        <el-input v-model="formData.source_win_amount" clearable placeholder="请输入原始中奖金额"></el-input>
      </el-form-item>
      <el-form-item label="原始投注数量" prop="source_bet_count">
        <el-input v-model="formData.source_bet_count" clearable placeholder="请输入原始投注数量"></el-input>
      </el-form-item>
      <el-form-item label="变更后投注金额" prop="alter_bet_amount">
        <el-input v-model="formData.alter_bet_amount" clearable placeholder="请输入变更后投注金额"></el-input>
      </el-form-item>
      <el-form-item label="变更后中奖金额" prop="alter_win_amount">
        <el-input v-model="formData.alter_win_amount" clearable placeholder="请输入变更后中奖金额"></el-input>
      </el-form-item>
      <el-form-item label="变更后投注数量" prop="alter_bet_count">
        <el-input v-model="formData.alter_bet_count" clearable placeholder="请输入变更后投注数量"></el-input>
      </el-form-item>
      <el-form-item label="管理员ID" prop="admin_id">
        <el-input v-model.number="formData.admin_id" placeholder="请输入管理员ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="会话ID" prop="session_id">
        <el-input v-model.number="formData.session_id" placeholder="请输入会话ID" clearable></el-input>
      </el-form-item>
    </dialogform>

    <OrderDetailDialog ref="orderDetailDialog" v-model="orderDetailDialogVisible" :gameTypes="gameTypes">
    </OrderDetailDialog>

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
import OrderDetailDialog from "./components/OrderDetailDialog.vue";
export default {
  name: "fcg_order_alter",
  mixins: [infoList],
  components: {
    OrderDetailDialog,
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      markStateMap: {
        1: "未标记",
        2: "已标记",
        3: "自动标记",
        5: "AI标记",
        10: "最近标记"
      },
      listApi: getFcgOrderAlterList,
      openDialog: false,
      orderDetailDialogVisible: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      gameTypes: [
        { value: 0, label: "全部玩法" },
        { value: 1, label: "直选" },
        { value: 14, label: "独胆" },
        { value: 23, label: "豹子" },
        { value: 2, label: "组三" },
        { value: 3, label: "组六" },
        { value: 4, label: "组六四码" },
        { value: 5, label: "组六五码" },
        { value: 6, label: "组六六码" },
        { value: 7, label: "组六七码" },
        { value: 8, label: "组六八码" },
        { value: 9, label: "组三四码" },
        { value: 24, label: "组三两码" },
        { value: 25, label: "组三三码" },
        { value: 10, label: "组三五码" },
        { value: 11, label: "组三六码" },
        { value: 12, label: "组三七码" },
        { value: 13, label: "组三八码" },
        { value: 16, label: "一码定位" },
        { value: 15, label: "一码不定位" },
        { value: 18, label: "两码定位" },
        { value: 17, label: "两码不定位(双飞)" },
        { value: 19, label: "复试-重复号" },
        { value: 20, label: "复试-不同号" },
        { value: 21, label: "包对子" },
        { value: 22, label: "包对一" },
      ],
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
    openOrderDetail(row) {
      const orderId = row.order_id || row.ID;
      if (!orderId) {
        this.$message.warning("订单ID不存在");
        return;
      }
      if (!this.userInfo.perm['host']) {
        return
      }
      this.$refs.orderDetailDialog.open(orderId);
    },
    // 复制订单详情内容到剪贴板
    copyOrderDetail(row) {
      const content = row.source_content;
      if (!content) {
        this.$message.warning("没有可复制的内容");
        return;
      }
      navigator.clipboard.writeText(content).then(() => {
        this.$message.success("复制成功");
      }).catch(() => {
        // 兼容旧浏览器
        const textArea = document.createElement("textarea");
        textArea.value = content;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          this.$message.success("复制成功");
        } catch (err) {
          this.$message.error("复制失败");
        }
        document.body.removeChild(textArea);
      });
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
    async sortChange(row) {
      this.orderField = row.prop || "";
      this.orderType = this.directionMap[row.order] || "";
      await this.getTableData();

      if (row.prop === "source_mark_state" && row.order) {
        const factor = row.order === "ascending" ? 1 : -1;
        this.tableData = [...this.tableData].sort((a, b) => {
          const valueA = Number(a.source_mark_state) || 0;
          const valueB = Number(b.source_mark_state) || 0;
          return (valueA - valueB) * factor;
        });
      }
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
  text-align: center;
}

.el-table td {
  text-align: center;
}

.el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: #fafafa;
}

.el-table__body tr:hover>td {
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

.clickable-content {
  white-space: pre-wrap;
  cursor: pointer;
  color: #409eff;
}

.clickable-content:hover {
  text-decoration: underline;
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

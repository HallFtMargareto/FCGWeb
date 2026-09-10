<template>
  <div class="fcg-transferout-split-list">
    <div class="search-term">
      <searchform size="mini" :maxShow="4" @search="onQuery">
        <el-form-item label="期号">
          <IssueSelect v-model="searchInfo.issue_id" placeholder="请选择期号" clearable></IssueSelect>
        </el-form-item>

        <el-form-item label="所属组织" v-if="userInfo.perm['host']">
          <TenantSelect v-model="searchInfo.tenant_id" placeholder="请选择组织" :autoSelectFirst="false" clearable>
          </TenantSelect>
        </el-form-item>

        <el-form-item label="游戏类型">
          <GCategory v-model.number="searchInfo.game_category" placeholder="请选择游戏类型" clearable :autoSelectFirst="false">
          </GCategory>
        </el-form-item>

        <el-form-item label=" ">
          <el-button @click="exportExcel" icon="el-icon-sold-out">导出</el-button>
          <el-button @click="ClearByIssue" type="danger" icon="el-icon-delete"
            v-if="userInfo.perm['host']">清除</el-button>
        </el-form-item>

        <el-form-item label="转出号码">
          <el-input v-model="searchInfo.split_number" placeholder="请输入转出号码" clearable></el-input>
        </el-form-item>

        <el-form-item label="交易笔数">
          <el-input v-model.number="searchInfo.trans_count" placeholder="请输入交易笔数" clearable></el-input>
        </el-form-item>

        <el-form-item label="交易金额">
          <el-input v-model="searchInfo.trans_amount" placeholder="请输入交易金额" clearable></el-input>
        </el-form-item>



        <!-- <el-form-item label="添加时间">
          <datepicker v-model="searchInfo.startTime" type="datetime" />
        </el-form-item>
        <el-form-item label="结束时间">
          <datepicker v-model="searchInfo.endTime" type="datetime" />
        </el-form-item> -->
      </searchform>


    </div>

    <!-- 汇总数据展示 -->
    <div class="summary-section" v-if="summaryData">
      <el-card class="summary-card" shadow="hover">
        <div slot="header" class="summary-header">
          <span class="summary-title">
            <i class="el-icon-data-analysis"></i>
            数据汇总
          </span>

          <div class="water-rate-setting" @click="openWaterRateDialog">
            水费设置
          </div>
        </div>

        <!-- 总计数据 -->
        <div class="total-summary" v-if="summaryData.totalSummary">
          <h4 class="summary-subtitle">总计</h4>
          <el-descriptions :column="4" border>
            <el-descriptions-item label="总交易笔数">
              <span class="summary-value">{{
                summaryData.totalSummary.totalTransCount || 0
                }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="总交易金额">
              <span class="summary-value amount">{{
                summaryData.totalSummary.totalTransAmount || 0
                }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="总中奖金额">
              <span class="summary-value amount">{{
                summaryData.totalSummary.totalWinAmount || 0
                }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="总返水金额">
              <span class="summary-value amount">{{
                summaryData.totalSummary.totalWaterAmount || 0
                }}</span>
            </el-descriptions-item>

            <el-descriptions-item label="快速转出单量">
              <span class="summary-value amount">{{
                summaryData.totalSummary.fastTransCount || 0
                }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="快速转出金额">
              <span class="summary-value amount">{{
                summaryData.totalSummary.fastTransAmount || 0
                }}</span>
            </el-descriptions-item>

            <el-descriptions-item label="复制转出单量">
              <span class="summary-value amount">{{
                summaryData.totalSummary.normalTransCount || 0
                }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="复制转出金额">
              <span class="summary-value amount">{{
                summaryData.totalSummary.normalTransAmount || 0
                }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 分组汇总 -->
        <div class="group-summary" v-if="summaryData.groupSummary && summaryData.groupSummary.length > 0">
          <h4 class="summary-subtitle">分组汇总</h4>
          <el-table :data="summaryData.groupSummary" size="small" border>
            <el-table-column label="游戏类别" prop="game_category">
              <template slot-scope="scope">
                <el-tag size="mini" type="primary">{{
                  $utils.getGameCategoryName(scope.row.game_category)
                  }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="交易笔数" prop="transCount">
              <template slot-scope="scope">
                <span class="summary-value">{{ scope.row.transCount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="交易金额" prop="transAmount">
              <template slot-scope="scope">
                <span class="summary-value amount">{{
                  scope.row.transAmount
                  }}</span>
              </template>
            </el-table-column>
            <el-table-column label="中奖金额" prop="transAmount">
              <template slot-scope="scope">
                <span class="summary-value amount">{{
                  scope.row.winAmount
                  }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>

    <el-table :data="tableData" @selection-change="handleSelectionChange" @sort-change="sortChange" ref="multipleTable"
      :show-summary="showSummary" :summary-method="getSummaries">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="ID" prop="ID" sortable></el-table-column>

      <el-table-column label="游戏类别" prop="game_category">
        <template slot-scope="scope">
          <el-tag size="mini" type="primary">{{
            $utils.getGameCategoryName(scope.row.game_category)
            }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="号码" prop="split_number" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="split-number">{{ scope.row.split_number }}</span>
        </template>
      </el-table-column>

      <el-table-column label="交易笔数" prop="trans_count">
        <template slot-scope="scope">
          <span class="trans-count">{{ scope.row.trans_count }}</span>
        </template>
      </el-table-column>

      <el-table-column label="交易金额" prop="trans_amount">
        <template slot-scope="scope">
          <span class="trans-amount">{{ scope.row.trans_amount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="中奖金额" prop="win_amount">
        <template slot-scope="scope">
          <span class="trans-amount">{{ scope.row.win_amount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="水费" prop="water_amount">
        <template slot-scope="scope">
          {{ scope.row.water_amount }}
        </template>
      </el-table-column>

      <el-table-column label="转出类型" prop="fast_trans">
        <template slot-scope="scope">
          <span v-if="scope.row.fast_trans == 1">快速转出</span>
          <span v-else-if="scope.row.fast_trans == 0 && scope.row.channel_id == 0">复制转出</span>
          <span v-else-if="scope.row.fast_trans == 0 && scope.row.channel_id > 0">渠道转单</span>
          <!-- <span v-else>普通转出</span> -->
        </template>
      </el-table-column>
      <!-- 
      <el-table-column label="租户ID" prop="tenant_id">
        <template slot-scope="scope">
          <span class="tenant-id">{{ scope.row.tenant_id }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="添加时间" width="160" prop="created_at" sortable="custom">
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

    <!-- 分页 -->
    <div style="width: 100%;">
      <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 30, 50, 100]"
        :style="{ float: 'right', padding: '20px' }" :total="total" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" background></el-pagination>
    </div>

    <dialogform :visible.sync="openDialog" :dialogTitle="dialogTitle" :formDatas="formData" :formRule="formRules"
      @confirm="enterDialog" ref="dialog">
      <el-form-item label="游戏类别" prop="game_category">
        <el-input v-model.number="formData.game_category" placeholder="请输入游戏类别" clearable></el-input>
      </el-form-item>
      <el-form-item label="分割号码" prop="split_number">
        <el-input v-model="formData.split_number" placeholder="请输入分割号码" clearable></el-input>
      </el-form-item>
      <el-form-item label="交易笔数" prop="trans_count">
        <el-input v-model.number="formData.trans_count" placeholder="请输入交易笔数" clearable></el-input>
      </el-form-item>
      <el-form-item label="交易金额" prop="trans_amount">
        <el-input v-model="formData.trans_amount" clearable placeholder="请输入交易金额"></el-input>
      </el-form-item>
      <el-form-item label="期号ID" prop="issue_id">
        <el-input v-model.number="formData.issue_id" placeholder="请输入期号ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="租户ID" prop="tenant_id">
        <el-input v-model.number="formData.tenant_id" placeholder="请输入租户ID" clearable></el-input>
      </el-form-item>
    </dialogform>

    <!-- 水费设置对话框 -->
    <el-dialog title="水费设置" :visible.sync="waterRateDialogVisible" width="30%" :close-on-click-modal="false">
      <el-form :model="waterRateForm" :rules="waterRateRules" ref="waterRateForm" label-width="80px">
        <el-form-item label="费率" prop="rate">
          <el-input v-model.number="waterRateForm.rate" placeholder="请输入费率" type="number" step="1"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="waterRateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitWaterRate">确 定</el-button>
      </span>
    </el-dialog>

    <uploadexcel ref="uploadexcel" action="FcgTransferoutSplitList"></uploadexcel>
  </div>
</template>

<script>
import {
  createFcgTransferoutSplitList,
  deleteFcgTransferoutSplitList,
  updateFcgTransferoutSplitList,
  findFcgTransferoutSplitList,
  getFcgTransferoutSplitListList,
  batchFcgTransferoutSplitListOperation,
  getFcgTransferoutSplitListSummary,
} from "@/api/fcgame/fcg_transferout_split_list";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
export default {
  name: "fcg_transferout_split_list",
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      listApi: getFcgTransferoutSplitListList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      summaryData: null, // 汇总数据
      waterRateDialogVisible: false, // 水费设置对话框可见性
      waterRateForm: {
        rate: null, // 费率
      },
      waterRateRules: {
        rate: [
          { required: true, message: "请输入费率", trigger: "blur" },
          { type: "number", message: "费率必须为数字", trigger: "blur" },
        ],
      },
      formData: {
        game_category: undefined,
        split_number: "",
        trans_count: undefined,
        trans_amount: undefined,
        issue_id: undefined,
        tenant_id: undefined,
      },
      formRules: {
        game_category: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        split_number: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        trans_count: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        trans_amount: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],
        issue_id: [{ required: true, message: "请填写数据", trigger: "blur" }],
        tenant_id: [{ required: true, message: "请填写数据", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 重写getTableData方法来处理summary数据
    async getTableData(
      page = this.page,
      pageSize = 30,
      orderField = this.orderField,
      orderType = this.orderType
    ) {
      const table = await this.listApi({
        page,
        pageSize,
        orderField,
        orderType,
        ...this.searchInfo,
      });
      if (table.code == 0) {
        this.tableData = table.data.list;
        this.total = table.data.total;
        this.page = table.data.page;
        this.pageSize = table.data.pageSize;

        // 处理summary数据
        if (table.data.summary) {
          this.summaryData = table.data.summary;
        } else {
          this.summaryData = null;
        }
      }
    },
    onQuery() {
      this.summary = {};
      this.showSummary = false;
      this.summaryData = null; // 清空汇总数据

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
      const res = await findFcgTransferoutSplitList({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.refcg_transferout_split_list;
        this.openDialog = true;
      }
    },
    async deleteRow(row) {
      const res = await deleteFcgTransferoutSplitList({ ID: row.ID });
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
          res = await createFcgTransferoutSplitList(this.formData);
          break;
        case "update":
          res = await updateFcgTransferoutSplitList(this.formData);
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

        const res = await batchFcgTransferoutSplitListOperation({
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
      const res = await getFcgTransferoutSplitListSummary(this.searchInfo);
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
      this.searchInfo.action = "fcg_transferout_split_list";
      await this.$api.getExcel(this.searchInfo);
    },
    async ClearByIssue() {
      this.$confirm("确定要清除本期数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const ids = [0];
        const res = await batchFcgTransferoutSplitListOperation({
          ids,
          command: "clear_issue_tenant",
          ...this.searchInfo,
        });
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "清除成功",
          });
          this.getTableData();
        }
      });
    },
    // 打开水费设置对话框
    openWaterRateDialog() {
      this.waterRateForm.rate = null;
      this.waterRateDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.waterRateForm && this.$refs.waterRateForm.clearValidate();
      });
    },
    // 提交水费设置
    async submitWaterRate() {
      this.$refs.waterRateForm.validate(async (valid) => {
        if (valid) {
          if (!this.searchInfo.issue_id) {
            this.$message({
              type: "error",
              message: "请先选择期号",
            });
            return;
          }

          const data = {
            issue_id: this.searchInfo.issue_id,
            water_rate: this.waterRateForm.rate,
          };

          try {
            const res = await updateFcgTransferoutSplitList(data);
            if (res.code === 0) {
              this.$message({
                type: "success",
                message: "水费设置成功",
              });
              this.waterRateDialogVisible = false;
              // 刷新数据
              this.getTableData();
            } else {
              this.$message({
                type: "error",
                message: res.msg || "水费设置失败",
              });
            }
          } catch (error) {
            this.$message({
              type: "error",
              message: "水费设置失败",
            });
          }
        }
      });
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
.fcg-transferout-split-list {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 汇总数据样式 */
.summary-section {
  margin-bottom: 12px;
}

.summary-card {
  border-radius: 6px;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.08);
}

.summary-card /deep/ .el-card__body {
  padding: 12px;
}

.summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: #303133;
  padding-bottom: 8px;
}

.water-rate-setting {
  color: #409eff;
  cursor: pointer;
  font-size: 14px;
  font-weight: normal;
}

.water-rate-setting:hover {
  color: #66b1ff;
  text-decoration: underline;
}

.summary-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.summary-title i {
  margin-right: 6px;
  color: #409eff;
  font-size: 14px;
}

.summary-subtitle {
  margin: 10px 0 8px 0;
  font-size: 13px;
  font-weight: 600;
  color: #606266;
  border-left: 3px solid #409eff;
  padding-left: 6px;
}

.total-summary {
  margin-bottom: 12px;
}

.group-summary {
  margin-top: 12px;
}

.summary-value {
  font-weight: 600;
  color: #409eff;
  font-size: 13px;
}

.summary-value.amount {
  color: #67c23a;
  font-size: 14px;
}

/* 汇总表格样式优化 */
.summary-section /deep/ .el-descriptions {
  font-size: 13px;
}

.summary-section /deep/ .el-descriptions__label {
  font-size: 13px;
}

.summary-section /deep/ .el-descriptions__content {
  font-size: 13px;
}

.summary-section /deep/ .el-table {
  font-size: 13px;
}

.summary-section /deep/ .el-table th {
  padding: 8px 0;
  font-size: 13px;
}

.summary-section /deep/ .el-table td {
  padding: 6px 0;
  font-size: 13px;
}

/* 搜索区域样式 */
.search-term {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.btn-form-inline {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

/* 表格样式 */
.el-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.el-table th {
  background-color: #fafafa;
  color: #606266;
  font-weight: 600;
}

.split-number {
  font-family: "Courier New", monospace;
  font-weight: 600;
  color: #e6a23c;
}

.trans-count {
  font-weight: 600;
  color: #909399;
}

.trans-amount {
  font-weight: 600;
  color: #67c23a;
}

.issue-id {
  color: #606266;
}

.tenant-id {
  color: #909399;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .fcg-transferout-split-list {
    padding: 10px;
  }

  .search-term {
    padding: 15px;
  }

  .summary-card {
    margin-bottom: 15px;
  }
}
</style>

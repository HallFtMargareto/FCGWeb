<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="3" @search="onQuery">
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

        <el-form-item label="投注内容">
          <el-input
            v-model.number="searchInfo.bet_content"
            placeholder="请输入"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="添加时间">
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
      <el-table-column
        label="ID"
        prop="ID"
        width="100"
        sortable
      ></el-table-column>

      <el-table-column label="订单ID" prop="order_id" width="100">
      </el-table-column>

      <!-- <el-table-column label="msg_id" prop="msg_id"> </el-table-column> -->

      <el-table-column label="投注内容" prop="bet_content"> </el-table-column>

      <!-- <el-table-column label="tenant_id" prop="tenant_id"> </el-table-column> -->

      <!-- <el-table-column label="admin_id" prop="admin_id"> </el-table-column> -->

      <el-table-column
        label="撤单时间"
        width="160"
        prop="created_at"
        sortable="custom"
      >
        <template slot-scope="scope">{{ scope.row.created_at }}</template>
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
      :formRule="formRules"
      @confirm="enterDialog"
      ref="dialog"
    >
      <el-form-item label="order_id" prop="order_id">
        <el-input
          v-model="formData.order_id"
          clearable
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="msg_id" prop="msg_id">
        <el-input
          v-model.number="formData.msg_id"
          placeholder="请输入"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="bet_content" prop="bet_content">
        <el-input
          v-model.number="formData.bet_content"
          placeholder="请输入"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="tenant_id" prop="tenant_id">
        <el-input
          v-model.number="formData.tenant_id"
          placeholder="请输入"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="admin_id" prop="admin_id">
        <el-input
          v-model.number="formData.admin_id"
          placeholder="请输入"
          clearable
        ></el-input>
      </el-form-item>
    </dialogform>

    <uploadexcel ref="uploadexcel" action="FcgOrderCancel"></uploadexcel>
  </div>
</template>

<script>
import {
  createFcgOrderCancel,
  deleteFcgOrderCancel,
  updateFcgOrderCancel,
  findFcgOrderCancel,
  getFcgOrderCancelList,
  batchFcgOrderCancelOperation,
  getFcgOrderCancelSummary,
} from "@/api/fcgame/fcg_order_cancel";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
export default {
  name: "fcg_order_cancel",
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      listApi: getFcgOrderCancelList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      formData: {
        order_id: undefined,
        msg_id: undefined,
        bet_content: undefined,
        tenant_id: undefined,
        admin_id: undefined,
      },
      formRules: {
        order_id: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],
        msg_id: [{ required: true, message: "请填写数据", trigger: "blur" }],
        bet_content: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        tenant_id: [{ required: true, message: "请填写数据", trigger: "blur" }],
        admin_id: [{ required: true, message: "请填写数据", trigger: "blur" }],
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
      const res = await findFcgOrderCancel({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.refcg_order_cancel;
        this.openDialog = true;
      }
    },
    async deleteRow(row) {
      const res = await deleteFcgOrderCancel({ ID: row.ID });
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
          res = await createFcgOrderCancel(this.formData);
          break;
        case "update":
          res = await updateFcgOrderCancel(this.formData);
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

        const res = await batchFcgOrderCancelOperation({
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
      const res = await getFcgOrderCancelSummary(this.searchInfo);
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
      this.searchInfo.action = "fcg_order_cancel";
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
</style>

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
            v-model="searchInfo.source_content"
            placeholder=""
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
        width="160"
        sortable
      ></el-table-column>

      <!-- <el-table-column label="order_id" prop="order_id"> </el-table-column> -->

      <el-table-column label="投注内容" prop="source_content">
        <template slot-scope="scope">
          <div style="white-space: pre-wrap; word-break: break-all">
            {{ scope.row.source_content }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="调整内容" prop="new_content">
        <template slot-scope="scope">
          <div style="white-space: pre-wrap; word-break: break-all">
            {{ scope.row.new_content }}
          </div>
        </template>
      </el-table-column>

      <!-- <el-table-column label="issue_id" prop="issue_id"> </el-table-column>

      <el-table-column label="tenant_id" prop="tenant_id"> </el-table-column> -->

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
      <el-form-item label="order_id" prop="order_id">
        <el-input
          v-model="formData.order_id"
          clearable
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="source_content" prop="source_content">
        <el-input
          v-model="formData.source_content"
          placeholder="请输入"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="new_content" prop="new_content">
        <el-input
          v-model="formData.new_content"
          placeholder="请输入"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="issue_id" prop="issue_id">
        <el-input
          v-model.number="formData.issue_id"
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
    </dialogform>

    <uploadexcel ref="uploadexcel" action="FcgOrderReidentify"></uploadexcel>
  </div>
</template>

<script>
import {
  createFcgOrderReidentify,
  deleteFcgOrderReidentify,
  updateFcgOrderReidentify,
  findFcgOrderReidentify,
  getFcgOrderReidentifyList,
  batchFcgOrderReidentifyOperation,
  getFcgOrderReidentifySummary,
} from "@/api/fcgame/fcg_order_reidentify";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
export default {
  name: "fcg_order_reidentify",
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      listApi: getFcgOrderReidentifyList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      formData: {
        order_id: undefined,
        source_content: "",
        new_content: "",
        issue_id: undefined,
        tenant_id: undefined,
      },
      formRules: {
        order_id: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],
        source_content: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        new_content: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        issue_id: [{ required: true, message: "请填写数据", trigger: "blur" }],
        tenant_id: [{ required: true, message: "请填写数据", trigger: "blur" }],
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
      const res = await findFcgOrderReidentify({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.refcg_order_reidentify;
        this.openDialog = true;
      }
    },
    async deleteRow(row) {
      const res = await deleteFcgOrderReidentify({ ID: row.ID });
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
          res = await createFcgOrderReidentify(this.formData);
          break;
        case "update":
          res = await updateFcgOrderReidentify(this.formData);
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

        const res = await batchFcgOrderReidentifyOperation({
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
      const res = await getFcgOrderReidentifySummary(this.searchInfo);
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
      this.searchInfo.action = "fcg_order_reidentify";
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

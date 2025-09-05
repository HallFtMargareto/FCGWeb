<template>
  <div>
    <div class="search-term">
      <el-form
        :inline="true"
        class="demo-form-inline"
        size="mini"
        label-width="120px"
        label-position="right"
        :model="searchInfo"
      >
        <el-row :gutter="24">
          <el-col :span="20">
            <div>
              <el-form-item label="号码段">
                <el-input
                  placeholder="号码段"
                  v-model="searchInfo.mobile_number"
                ></el-input>
              </el-form-item>

              <el-form-item label="归属地">
                <el-input
                  placeholder="归属地"
                  v-model="searchInfo.mobile_area"
                ></el-input>
              </el-form-item>

              <el-form-item label="运营商">
                <el-input
                  placeholder="运营商"
                  v-model="searchInfo.mobile_type"
                ></el-input>
              </el-form-item>

              <el-form-item label="区号">
                <el-input
                  placeholder="区号"
                  v-model="searchInfo.area_code"
                ></el-input>
              </el-form-item>

              <el-form-item label="邮政编码">
                <el-input
                  placeholder="邮政编码"
                  v-model="searchInfo.post_code"
                ></el-input>
              </el-form-item>

              <el-form-item label="开始时间">
                <datepicker v-model="searchInfo.startTime" type="datetime" />
              </el-form-item>
              <el-form-item label="结束时间">
                <datepicker v-model="searchInfo.endTime" type="datetime" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="form-search-btn">
              <el-button @click="onQuery" type="primary">查询</el-button>
              <el-button @click="$bus.$emit('reload')">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <el-form size="mini" :inline="true" class="btn-form-inline">
        <el-button
          v-if="userInfo.perm['system.create']"
          @click="createRow"
          class="btn-info"
          >新增</el-button
        >
        <el-button
          v-if="userInfo.perm['system.batch_delete']"
          @click="handleCommand('remove')"
          class="btn-info"
          >批量删除</el-button
        >
        <el-button
          v-if="userInfo.perm['system.summary']"
          @click="getSummaryList"
          class="btn-info"
          >合计</el-button
        >
        <el-button
          v-if="userInfo.perm['system.import']"
          @click="importExcel"
          icon="el-icon-upload2"
          class="btn-info"
          >导入</el-button
        >
        <el-button
          v-if="userInfo.perm['system.export']"
          @click="exportExcel"
          icon="el-icon-download"
          class="btn-info"
          >导出</el-button
        >
      </el-form>
    </div>

    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      ref="multipleTable"
      style="width: 100%"
      tooltip-effect="dark"
      :show-summary="showSummary"
      :summary-method="getSummaries"
      border
      stripe
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="ID" prop="ID" sortable></el-table-column>
      <el-table-column
        label="日期"
        width="160"
        prop="created_at"
        sortable="custom"
      >
        <template slot-scope="scope">{{
          scope.row.created_at | formatDate
        }}</template>
      </el-table-column>

      <el-table-column
        label="号码段"
        prop="mobile_number"
        show-overflow-tooltip
      >
      </el-table-column>

      <el-table-column label="归属地" prop="mobile_area" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="运营商" prop="mobile_type" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="区号" prop="area_code" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="邮政编码" prop="post_code" show-overflow-tooltip>
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
          <el-button
            v-if="userInfo.perm['system.delete']"
            @click="deleteRow(scope.row)"
            type="text"
            size="small"
            icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

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

    <el-dialog
      @close="closeDialog"
      :visible.sync="dialogFormVisible"
      :title="dialogTitle"
      width="25%"
    >
      <el-form
        :model="formData"
        :rules="formDataRules"
        ref="ruleForm"
        size="mini"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="号码段" prop="mobile_number">
          <el-input
            v-model="formData.mobile_number"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="归属地" prop="mobile_area">
          <el-input
            v-model="formData.mobile_area"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="运营商" prop="mobile_type">
          <el-input
            v-model="formData.mobile_type"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="区号" prop="area_code">
          <el-input
            v-model="formData.area_code"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" prop="post_code">
          <el-input
            v-model="formData.post_code"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogFormVisible = !dialogFormVisible"
          >取 消</el-button
        >
        <el-button @click="enterDialog" type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <uploadexcel ref="uploadexcel" action="SysCommonMobileInfo"></uploadexcel>
  </div>
</template>

<script>
import {
  createSysCommonMobileInfo,
  deleteSysCommonMobileInfo,
  updateSysCommonMobileInfo,
  findSysCommonMobileInfo,
  getSysCommonMobileInfoList,
  batchSysCommonMobileInfoOperation,
  getSysCommonMobileInfoSummary,
} from "@/api/common/common_mobile_info";
import { getExcel } from "@/api/common";
import infoList from "@/mixins/infoList";
import datepicker from "@/components/datepicker";
import uploadexcel from "@/components/uploadexcel";
import { mapGetters } from "vuex";
export default {
  name: "SysCommonMobileInfo",
  mixins: [infoList],
  components: {
    datepicker,
    uploadexcel,
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      listApi: getSysCommonMobileInfoList,
      dialogFormVisible: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      formData: {
        mobile_number: "",
        mobile_area: "",
        mobile_type: "",
        area_code: "",
        post_code: "",
      },
      formDataRules: {
        mobile_number: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        mobile_area: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        mobile_type: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        area_code: [{ required: true, message: "请填写数据", trigger: "blur" }],
        post_code: [{ required: true, message: "请填写数据", trigger: "blur" }],
      },
      miniDataList: [],
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
      this.type = "create";
      this.dialogTitle = "创建";
      this.dialogFormVisible = true;
    },
    async editRow(row) {
      this.type = "update";
      this.dialogTitle = "编辑";
      const res = await findSysCommonMobileInfo({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.recommon_mobile_info;
        this.dialogFormVisible = true;
      }
    },
    deleteRow(row) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteSysCommonMobileInfo(row);
      });
    },
    async deleteSysCommonMobileInfo(row) {
      const res = await deleteSysCommonMobileInfo({ ID: row.ID });
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
    closeDialog() {
      this.$refs["ruleForm"].resetFields();
      this.formData = {
        mobile_number: "",
        mobile_area: "",
        mobile_type: "",
        area_code: "",
        post_code: "",
      };
      this.dialogFormVisible = false;
    },
    async enterDialog() {
      //数据校验
      const valid = await new Promise((resolve) => {
        this.$refs["ruleForm"].validate((valid) => {
          resolve(valid);
        });
      });
      if (!valid) {
        this.$message({
          type: "error",
          message: "请填写正确数据",
        });
        return false;
      }

      let res;
      switch (this.type) {
        case "create":
          res = await createSysCommonMobileInfo(this.formData);
          break;
        case "update":
          res = await updateSysCommonMobileInfo(this.formData);
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
        this.closeDialog();
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

        const res = await batchSysCommonMobileInfoOperation({
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
      const res = await getSysCommonMobileInfoSummary(this.searchInfo);
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
      this.searchInfo.action = "SysCommonMobileInfo";
      await getExcel(this.searchInfo);
    },
  },
  async created() {
    await this.getTableData();
  },
};
</script>

<style>
</style>

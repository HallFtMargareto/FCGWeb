<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="3" @search="onQuery">
        <el-form-item label="企业名称">
          <el-input v-model="searchInfo.name" placeholder="企业名称" clearable></el-input>
        </el-form-item>

        <el-form-item label="英文名称">
          <el-input v-model="searchInfo.name_en" placeholder="英文名称" clearable></el-input>
        </el-form-item>

        <el-form-item label="简称">
          <el-input v-model="searchInfo.short_name" placeholder="简称" clearable></el-input>
        </el-form-item>

        <el-form-item label="信用代码">
          <el-input v-model="searchInfo.usci" placeholder="信用代码" clearable></el-input>
        </el-form-item>

        <el-form-item label="注册币种">
          <el-input v-model="searchInfo.registered_currency" placeholder="注册币种" clearable></el-input>
        </el-form-item>

        <el-form-item label="注册资本">
          <el-input v-model="searchInfo.registered_capital" placeholder="注册资本" clearable></el-input>
        </el-form-item>

        <el-form-item label="法人">
          <el-input v-model="searchInfo.legal_person" placeholder="法人" clearable></el-input>
        </el-form-item>

        <el-form-item label="成立时间">
          <datepicker v-model="formData.establishing_time" type="datetime" placeholder="选择日期" style="width: 100%"
            clearable />
        </el-form-item>

        <el-form-item label="企业性质">
          <el-input v-model="searchInfo.business_nature" placeholder="企业性质" clearable></el-input>
        </el-form-item>

        <el-form-item label="所属行业">
          <el-input v-model="searchInfo.industry_involved" placeholder="所属行业" clearable></el-input>
        </el-form-item>

        <el-form-item label="注册地址">
          <el-input v-model="searchInfo.registered_address" placeholder="注册地址" clearable></el-input>
        </el-form-item>

        <el-form-item label="经营范围">
          <el-input v-model="searchInfo.business_scope" placeholder="经营范围" clearable></el-input>
        </el-form-item>

        <el-form-item label="员工数">
          <el-input v-model="searchInfo.staff_number" placeholder="员工数" clearable></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-input v-model="searchInfo.state" placeholder="状态" clearable></el-input>
        </el-form-item>

        <el-form-item label="是否删除" prop="deleted">
          <el-select v-model="searchInfo.deleted" placeholder="请选择">
            <el-option key="true" label="是" value="true"></el-option>
            <el-option key="false" label="否" value="false"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="开始时间">
          <datepicker v-model="searchInfo.startTime" type="datetime" />
        </el-form-item>
        <el-form-item label="结束时间">
          <datepicker v-model="searchInfo.endTime" type="datetime" />
        </el-form-item>
      </searchform>

      <el-form size="mini" :inline="true" class="btn-form-inline">
        <el-button v-if="userInfo.perm['system.create']" @click="createRow" icon="el-icon-plus"
          type="primary">新增</el-button>
        <el-button v-if="
          userInfo.perm['system.batch_delete'] && multipleSelection.length > 0
        " @click="handleCommand('remove')" icon="el-icon-delete" type="danger" plain>批量删除</el-button>
        <el-button v-if="userInfo.perm['system.import']" @click="importExcel" icon="el-icon-sell">导入</el-button>
        <el-button v-if="userInfo.perm['system.export']" @click="exportExcel" icon="el-icon-sold-out">导出</el-button>
      </el-form>
    </div>

    <el-table :data="tableData" @selection-change="handleSelectionChange" @sort-change="sortChange" ref="multipleTable"
      :show-summary="showSummary" :summary-method="getSummaries" border stripe>
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="ID" prop="ID" sortable></el-table-column>

      <el-table-column label="企业名称" prop="name" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="英文名称" prop="name_en" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="简称" prop="short_name" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="信用代码" prop="usci" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="注册币种" prop="registered_currency" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="注册资本" prop="registered_capital" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="法人" prop="legal_person" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="成立时间" prop="establishing_time">
      </el-table-column>

      <el-table-column label="企业性质" prop="business_nature" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="所属行业" prop="industry_involved" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="注册地址" prop="registered_address" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="经营范围" prop="business_scope" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="员工数" prop="staff_number" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="状态" prop="state" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="删除状态" prop="deleted">
        <template slot-scope="scope">{{
          scope.row.deleted | formatBoolean
        }}</template>
      </el-table-column>

      <el-table-column label="日期" width="160" prop="created_at" sortable="custom">
        <template slot-scope="scope">{{ scope.row.created_at }}</template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button v-if="userInfo.perm['system.update']" @click="editRow(scope.row)" type="text" size="small"
            icon="el-icon-edit">编辑</el-button>
          <el-button v-if="userInfo.perm['system.delete']" @click="deleteRow(scope.row)" type="text" size="small"
            icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- class="pagination-container" -->
    <div>
      <!-- 数据合计,按需求启用 -->
      <!-- <el-button v-if="userInfo.perm['system.summary']" @click="getSummaryList">合计</el-button> -->
      <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 30, 50, 100]"
        :style="{ float: 'right', padding: '20px' }" :total="total" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" background></el-pagination>
    </div>

    <el-dialog @close="closeDialog" :visible.sync="openDialog" :title="dialogTitle" width="25%">
      <el-form :model="formData" :rules="formDataRules" ref="ruleForm" size="mini" label-position="right"
        label-width="80px">
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="name_en">
          <el-input v-model="formData.name_en" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="简称" prop="short_name">
          <el-input v-model="formData.short_name" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="usci">
          <el-input v-model="formData.usci" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="注册币种" prop="registered_currency">
          <el-input v-model="formData.registered_currency" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="注册资本" prop="registered_capital">
          <el-input v-model="formData.registered_capital" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="法人" prop="legal_person">
          <el-input v-model="formData.legal_person" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="成立时间" prop="establishing_time">
          <datepicker placeholder="选择日期" v-model="formData.establishing_time" type="datetime" style="width: 100%"
            clearable />
        </el-form-item>
        <el-form-item label="企业性质" prop="business_nature">
          <el-input v-model="formData.business_nature" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属行业" prop="industry_involved">
          <el-input v-model="formData.industry_involved" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="注册地址" prop="registered_address">
          <el-input v-model="formData.registered_address" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="经营范围" prop="business_scope">
          <el-input v-model="formData.business_scope" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="员工数" prop="staff_number">
          <el-input v-model="formData.staff_number" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-input v-model="formData.state" placeholder="请输入" clearable></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="openDialog = !openDialog">取 消</el-button>
        <el-button @click="enterDialog" type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <uploadexcel ref="uploadexcel" action="SysEnterprise"></uploadexcel>
  </div>
</template>

<script>
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
export default {
  name: "enterprise",
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      listApi: this.$api.getSysEnterpriseList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      formData: {
        name: "",
        name_en: "",
        short_name: "",
        usci: "",
        registered_currency: "",
        registered_capital: "",
        legal_person: "",
        business_nature: "",
        industry_involved: "",
        registered_address: "",
        business_scope: "",
        staff_number: "",
        state: "",
        deleted: true,
      },
      formDataRules: {
        name: [{ required: true, message: "请填写数据", trigger: "blur" }],
        name_en: [{ required: true, message: "请填写数据", trigger: "blur" }],
        short_name: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        usci: [{ required: true, message: "请填写数据", trigger: "blur" }],
        registered_currency: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        registered_capital: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        legal_person: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        establishing_time: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],
        business_nature: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        industry_involved: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        registered_address: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        business_scope: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        staff_number: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        state: [{ required: true, message: "请填写数据", trigger: "blur" }],
        deleted: [{ required: true, message: "请选择项目", trigger: "change" }],
      },
      reslist: {},
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
      this.openDialog = true;
    },
    async editRow(row) {
      this.type = "update";
      this.dialogTitle = "编辑";
      const res = await this.$api.findSysEnterprise({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.reenterprise;
        this.openDialog = true;
      }
    },
    deleteRow(row) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteSysEnterprise(row);
      });
    },
    async deleteSysEnterprise(row) {
      const res = await this.$api.deleteSysEnterprise({ ID: row.ID });
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
      this.formData = {};
      this.openDialog = false;
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
          res = await this.$api.createSysEnterprise(this.formData);
          break;
        case "update":
          res = await this.$api.updateSysEnterprise(this.formData);
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

        const res = await this.$api.batchSysEnterpriseOperation({
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
      const res = await this.$api.getSysEnterpriseSummary(this.searchInfo);
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
      this.searchInfo.action = "enterprise";
      await this.$utils.getExcel(this.searchInfo);
    },
  },
  async created() {
    await this.getTableData();
  },
};
</script>

<style></style>

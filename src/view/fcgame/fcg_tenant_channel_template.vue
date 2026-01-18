<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="3" @search="onQuery">
        <el-form-item label="模板名称">
          <el-input
            v-model="searchInfo.name"
            placeholder="模板名称"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="供应商">
          <el-select
            v-model="searchInfo.provider_id"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in providerList"
              :key="item.ID"
              :label="item.name"
              :value="item.ID"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="state">
          <el-select v-model="searchInfo.state" placeholder="请选择">
            <el-option key="true" label="是" value="true"></el-option>
            <el-option key="false" label="否" value="false"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="平台名称">
          <el-input
            v-model="searchInfo.plat_name"
            placeholder="平台名称"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="平台版本">
          <el-input
            v-model="searchInfo.plat_version"
            placeholder="平台版本"
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

      <el-form size="mini" :inline="true" class="btn-form-inline">
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
        <!-- <el-button
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
        > -->
      </el-form>
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

      <el-table-column label="模板名称" prop="name" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="供应商" prop="provider_id"> </el-table-column>

      <el-table-column label="备注" prop="remark" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="控制器" prop="logic_class" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="命名空间" prop="namespace" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="平台名称" prop="plat_name" show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        label="平台版本"
        prop="plat_version"
        show-overflow-tooltip
      >
      </el-table-column>

      <el-table-column label="状态" prop="state">
        <template slot-scope="scope">
          <booltag
            :tagState="scope.row.state"
            true-text="启用"
            false-text="禁用"
          ></booltag>
        </template>
      </el-table-column>

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
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" name="first">
          <el-form-item label="模板名称" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="供应商">
            <el-select
              v-model.number="formData.provider_id"
              placeholder="请选择"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in providerList"
                :key="item.ID"
                :label="item.name"
                :value="item.ID"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="控制器" prop="logic_class">
            <el-input
              v-model="formData.logic_class"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="命名空间" prop="namespace">
            <el-input
              v-model="formData.namespace"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="产品类型ID" prop="type_id">
            <el-input
              v-model.number="formData.type_id"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item> -->

          <el-form-item label="平台名称" prop="plat_name">
            <el-input
              v-model="formData.plat_name"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="平台版本" prop="plat_version">
            <el-input
              v-model="formData.plat_version"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="formData.remark"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-switch
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="是"
              inactive-text="否"
              v-model="formData.state"
            ></el-switch>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="模板参数" name="second">
          <el-form-item label="模板参数:">
            <dynamicform v-model="formData.params"></dynamicform>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </dialogform>

    <uploadexcel
      ref="uploadexcel"
      action="SysRechargeChannelTemplate"
    ></uploadexcel>
  </div>
</template>

<script>
import {
  createFcgTenantChannelTemplate,
  deleteFcgTenantChannelTemplate,
  updateFcgTenantChannelTemplate,
  findFcgTenantChannelTemplate,
  getFcgTenantChannelTemplateList,
  batchFcgTenantChannelTemplateOperation,
  getFcgTenantChannelTemplateSummary,
} from "@/api/fcgame/fcg_tenant_channel_template";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
export default {
  name: "recharge_channel_template",
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      activeName: "first",
      listApi: getFcgTenantChannelTemplateList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      providerList: [],
      formData: {
        name: "",
        provider_id: undefined,
        params: [],
        remark: "",
        logic_class: "",
        namespace: "",
        type_id: undefined,
        state: true,
        plat_name: "",
        plat_version: "",
      },
      formRules: {
        name: [{ required: true, message: "请填写数据", trigger: "blur" }],
        provider_id: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        logic_class: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        namespace: [{ required: true, message: "请填写数据", trigger: "blur" }],
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
      const res = await findFcgTenantChannelTemplate({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.refcg_tenant_channel_template || {};
        if (this.formData.params == null) {
          this.formData.params = [];
        }
        this.openDialog = true;
      }
    },
    async deleteRow(row) {
      const res = await deleteFcgTenantChannelTemplate({ ID: row.ID });
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
          res = await createFcgTenantChannelTemplate(this.formData);
          break;
        case "update":
          res = await updateFcgTenantChannelTemplate(this.formData);
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

        const res = await batchFcgTenantChannelTemplateOperation({
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
      const res = await getFcgTenantChannelTemplateSummary(this.searchInfo);
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
      this.searchInfo.action = "recharge_channel_template";
      await this.$api.getExcel(this.searchInfo);
    },
  },
  async created() {
    await this.getTableData();
  },
};
</script>

<style>
</style>

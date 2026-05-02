<template>
  <div>
    <div class="search-term">
      <!-- 条件搜索 -->
      <searchform size="mini" :maxShow="3" @search="onQuery">
        <!-- <el-form-item label="组织标识-租户编码">
          <el-input v-model="searchInfo.organization" placeholder="组织标识-租户编码" clearable></el-input>
        </el-form-item> -->

        <!-- <el-form-item label="企业名称">
          <el-input v-model="searchInfo.enterprise_name" placeholder="企业名称" clearable></el-input>
        </el-form-item> -->

        <el-form-item label="组织名称">
          <el-input v-model="searchInfo.platform_name" placeholder="组织名称" clearable></el-input>
        </el-form-item>

        <el-form-item label="联系人">
          <el-input v-model="searchInfo.contact" placeholder="联系人" clearable></el-input>
        </el-form-item>

        <el-form-item label="账号">
          <el-input v-model="searchInfo.account" placeholder="账号" clearable></el-input>
        </el-form-item>

        <el-form-item label="手机">
          <el-input v-model="searchInfo.phone" placeholder="手机" clearable></el-input>
        </el-form-item>

        <el-form-item label="APP标识">
          <el-input v-model="searchInfo.application" placeholder="APP标识" clearable></el-input>
        </el-form-item>

        <el-form-item label="微信标识">
          <el-input v-model="searchInfo.wxid" placeholder="微信标识" clearable></el-input>
        </el-form-item>

        <!-- <el-form-item label="企业ID">
          <el-input v-model="searchInfo.enterprise_id" placeholder="企业ID" clearable></el-input>
        </el-form-item> -->

        <el-form-item label="域名">
          <el-input v-model="searchInfo.domain" placeholder="域名" clearable></el-input>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="searchInfo.email" placeholder="邮箱" clearable></el-input>
        </el-form-item>

        <!-- <el-form-item label="租户套餐">
          <el-input v-model="searchInfo.package_id" placeholder="租户套餐" clearable></el-input>
        </el-form-item> -->

        <el-form-item label="到期时间">
          <datepicker v-model="searchInfo.expires" type="datetime" placeholder="选择日期" style="width: 100%" clearable />
        </el-form-item>

        <el-form-item label="用户数量">
          <el-input v-model="searchInfo.user_quantity" placeholder="用户数量(-1:=不限制)" clearable></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="enabled">
          <el-select v-model="searchInfo.enabled" placeholder="请选择">
            <el-option key="true" label="启用）" value="true"></el-option>
            <el-option key="false" label="禁用" value="false"></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="是否删除（0:=未删除;null:=已删除）" prop="deleted">
          <el-select v-model="searchInfo.deleted" placeholder="请选择">
            <el-option key="true" label="是" value="true"></el-option>
            <el-option key="false" label="否" value="false"></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="备注">
          <el-input v-model="searchInfo.remark" placeholder="备注" clearable></el-input>
        </el-form-item>

        <el-form-item label="创建人">
          <el-input v-model="searchInfo.create_by" placeholder="创建人" clearable></el-input>
        </el-form-item>

        <el-form-item label="更新人">
          <el-input v-model="searchInfo.update_by" placeholder="更新人" clearable></el-input>
        </el-form-item>

        <el-form-item label="添加时间">
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
      :show-summary="showSummary" :summary-method="getSummaries" style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="ID" prop="ID" sortable width="80"></el-table-column>

      <el-table-column label="组织名称" prop="platform_name"> </el-table-column>

      <!-- <el-table-column label="APP标识" prop="application" width="100">
      </el-table-column>

      <el-table-column label="联系人" prop="contact" width="100">
      </el-table-column>

      <el-table-column label="手机" prop="phone" width="120"> </el-table-column> -->

      <el-table-column label="备注" prop="remark" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="状态" prop="enabled" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.enabled ? 'success' : 'danger'" size="mini">
            {{ scope.row.enabled ? "启用" : "禁用" }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="快速转单" prop="fast_trans" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.fast_trans ? 'success' : 'info'" size="mini">
            {{ scope.row.fast_trans ? "启用" : "禁用" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="渠道转单" prop="channel_trans" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.channel_trans ? 'success' : 'info'" size="mini">
            {{ scope.row.channel_trans ? "启用" : "禁用" }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="复制转单" prop="copy_trans" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.copy_trans ? 'success' : 'info'" size="mini">
            {{ scope.row.copy_trans ? "启用" : "禁用" }}
          </el-tag>
        </template>
      </el-table-column>



      <el-table-column prop="created_at" label="创建时间" sortable="custom" width="200">
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

    <el-dialog @close="closeDialog" :visible.sync="dialogFormVisible" :title="dialogTitle" width="25%">
      <el-form :model="formData" :rules="formDataRules" ref="ruleForm" size="mini" label-position="right"
        label-width="85px">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基础信息" name="base">
            <el-form-item label="组织名称" prop="platform_name">
              <el-input v-model="formData.platform_name" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="APP标识" prop="application">
              <el-input v-model="formData.application" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="formData.contact" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input v-model="formData.phone" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="到期时间" prop="expires">
              <datepicker v-model="formData.expires" type="datetime" />
            </el-form-item>
            <el-form-item label="用户数量" prop="user_quantity">
              <el-input v-model.number="formData.user_quantity" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="enabled">
              <el-switch active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="禁用"
                v-model="formData.enabled" clearable></el-switch>
            </el-form-item>
            <el-form-item label="快速转单" prop="fast_trans">
              <el-switch active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="禁用"
                v-model="formData.fast_trans" clearable></el-switch>
            </el-form-item>
            <el-form-item label="渠道转单" prop="channel_trans">
              <el-switch active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="禁用"
                v-model="formData.channel_trans" clearable></el-switch>
            </el-form-item>
            <el-form-item label="复制转单" prop="copy_trans">
              <el-switch active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="禁用"
                v-model="formData.copy_trans" clearable></el-switch>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="formData.remark" clearable placeholder="请输入"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="费率配置" name="fee">
            <el-form-item label="盈利系统费" prop="fee.profit_system_fee">
              <el-input v-model="formData.fee.profit_system_fee" clearable placeholder="请输入">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="亏损系统费" prop="fee.loss_system_fee">
              <el-input v-model="formData.fee.loss_system_fee" clearable placeholder="请输入">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="占股比例" prop="fee.stake_ratio">
              <el-input v-model="formData.fee.stake_ratio" clearable placeholder="请输入">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="API设置" name="api">
            <el-form-item label="提交接口" prop="api.submit">
              <el-switch active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="禁用"
                v-model="formData.api.submit"></el-switch>
            </el-form-item>
            <el-form-item label="查询接口" prop="api.query">
              <el-switch active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="禁用"
                v-model="formData.api.query"></el-switch>
            </el-form-item>
            <el-form-item label="IP白名单" prop="api.ip_list">
              <el-input type="textarea" :rows="3" v-model="formData.api.ip_list" placeholder="多个IP使用逗号或换行分隔"></el-input>
            </el-form-item>
            <el-form-item label="API密钥" prop="api.api_key">
              <el-input v-model="formData.api.api_key" clearable placeholder="请输入API密钥"></el-input>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogFormVisible = !dialogFormVisible">取 消</el-button>
        <el-button @click="enterDialog" type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <uploadexcel ref="uploadexcel" action="SysTenant"></uploadexcel>
  </div>
</template>

<script>
import infoList from "@/mixins/infoList";
import datepicker from "@/components/datepicker";
import uploadexcel from "@/components/uploadexcel";
import { mapGetters } from "vuex";
export default {
  name: "SysTenant",
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
      listApi: this.$api.getSysTenantList,
      dialogFormVisible: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      activeTab: "base",
      formData: {
        organization: "",
        application: "",
        enterprise_id: undefined,
        enterprise_name: "",
        platform_name: "",
        admin_id: undefined,
        contact: "",
        account: "",
        phone: "",
        domain: "",
        email: "",
        package_id: undefined,
        user_quantity: 10,
        enabled: true,
        fast_trans: false,
        channel_trans: false,
        copy_trans: false,
        remark: "",
        create_by: "",
        update_by: "",
        fee: {
          profit_system_fee: "0",
          loss_system_fee: "0",
          stake_ratio: "0",
        },
        api: {
          submit: false,
          query: false,
          ip_list: "",
          api_key: "",
        },
      },
      formDataRules: {
        platform_name: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        // application: [
        //   { required: true, message: "请填写数据", trigger: "blur" },
        // ],
        // contact: [{ required: true, message: "请填写数据", trigger: "blur" }],
        // phone: [{ required: true, message: "请填写数据", trigger: "blur" }],
        // expires: [{ required: true, message: "请选择项目", trigger: "change" }],
        // user_quantity: [
        //   { required: true, message: "请填写数据", trigger: "change" },
        // ],
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
      const res = await this.$api.findSysTenant({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.retenant;
        this.$set(this.formData, "api", res.data.api || {
          submit: false,
          query: false,
          ip_list: "",
          api_key: "",
        });
        this.$set(this.formData, "fee", res.data.fee || {
          profit_system_fee: "0",
          loss_system_fee: "0",
          stake_ratio: "0",
        });
        this.dialogFormVisible = true;
      }
    },
    deleteRow(row) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteSysTenant(row);
      });
    },
    async deleteSysTenant(row) {
      const res = await this.$api.deleteSysTenant({ ID: row.ID });
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
        organization: "",
        application: "",
        enterprise_id: undefined,
        enterprise_name: "",
        platform_name: "",
        admin_id: undefined,
        contact: "",
        account: "",
        phone: "",
        domain: "",
        email: "",
        package_id: undefined,
        user_quantity: 10,
        enabled: true,
        fast_trans: false,
        channel_trans: false,
        copy_trans: false,
        remark: "",
        create_by: "",
        update_by: "",
        fee: {
          profit_system_fee: "0",
          loss_system_fee: "0",
          stake_ratio: "0",
        },
        api: {
          submit: false,
          query: false,
          ip_list: "",
          api_key: "",
        },
      };
      this.activeTab = "base";
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
          res = await this.$api.createSysTenant(this.formData);
          break;
        case "update":
          res = await this.$api.updateSysTenant(this.formData);
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

        const res = await this.$api.batchSysTenantOperation({
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
      const res = await this.$api.getSysTenantSummary(this.searchInfo);
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
      this.searchInfo.action = "SysTenant";
      await this.$api.getExcel(this.searchInfo);
    },
  },
  async created() {
    await this.getTableData();
  },
};
</script>

<style></style>

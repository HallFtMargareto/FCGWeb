<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="3" @search="onQuery">
        <el-form-item label="通道名称">
          <el-input v-model="searchInfo.name" placeholder="通道名称" clearable></el-input>
        </el-form-item>

        <el-form-item label="通道编码">
          <el-input v-model="searchInfo.code" placeholder="通道编码" clearable></el-input>
        </el-form-item>

        <el-form-item label="优先级">
          <el-input v-model.number="searchInfo.priority" placeholder="请输入" clearable></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="is_activity">
          <el-select v-model="searchInfo.is_activity" placeholder="请选择">
            <el-option key="true" label="启用" value="true"></el-option>
            <el-option key="false" label="禁用" value="false"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="开启查询" prop="is_query">
          <el-select v-model="searchInfo.is_query" placeholder="请选择">
            <el-option key="true" label="是" value="true"></el-option>
            <el-option key="false" label="否" value="false"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="发送消息" prop="is_message">
          <el-select v-model="searchInfo.is_message" placeholder="请选择">
            <el-option key="true" label="是" value="true"></el-option>
            <el-option key="false" label="否" value="false"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="通道回调地址">
          <el-input v-model="searchInfo.callback_url" placeholder="通道回调地址" clearable></el-input>
        </el-form-item>

        <el-form-item label="添加时间">
          <datepicker v-model="searchInfo.startTime" type="datetime" />
        </el-form-item>
        <el-form-item label="结束时间">
          <datepicker v-model="searchInfo.endTime" type="datetime" />
        </el-form-item>
      </searchform>

      <el-form size="mini" :inline="true" class="btn-form-inline">
        <el-button @click="createRow" icon="el-icon-plus" type="primary">新增</el-button>
        <el-button v-if="
          userInfo.perm['system.batch_delete'] && multipleSelection.length > 0
        " @click="handleCommand('remove')" icon="el-icon-delete" type="danger" plain>批量删除</el-button>
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

    <el-table :data="tableData" @selection-change="handleSelectionChange" @sort-change="sortChange" ref="multipleTable"
      :show-summary="showSummary" :summary-method="getSummaries">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="ID" prop="ID" sortable></el-table-column>

      <el-table-column label="通道名称" prop="name" show-overflow-tooltip>
      </el-table-column>

      <!-- <el-table-column label="通道类型" prop="type_id"> </el-table-column> -->
      <!-- <el-table-column label="通道编码" prop="code" show-overflow-tooltip>
      </el-table-column> -->

      <el-table-column label="通道水费" prop="water_amount"> </el-table-column>

      <el-table-column label="通道回调地址" width="300">
        <template slot-scope="scope">{{ scope.row.callback_url }}
          <i v-if="scope.row.callback_url" class="el-icon-document-copy"
            @click="onCopy(scope.row.callback_url)"></i></template>
      </el-table-column>

      <!-- <el-table-column label="开启查询" prop="is_query">
        <template slot-scope="scope">
          <booltag :tagState="scope.row.is_query" true-text="是" false-text="否"></booltag>
        </template>
      </el-table-column>

      <el-table-column label="发送消息" prop="is_message">
        <template slot-scope="scope">
          <booltag :tagState="scope.row.is_message" true-text="是" false-text="否"></booltag>
        </template>
      </el-table-column>

      <el-table-column label="负利润通道" prop="water_amount">
        <template slot-scope="scope">
          <booltag :tagState="scope.row.negative_profit" true-text="是" false-text="否"></booltag>
        </template>
      </el-table-column> -->

      <el-table-column label="状态" prop="is_activity">
        <template slot-scope="scope">
          <booltag :tagState="scope.row.is_activity" true-text="启用" false-text="禁用"></booltag>
        </template>
      </el-table-column>

      <el-table-column label="描述(备注)" prop="remark" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="添加时间" width="160" prop="created_at" sortable="custom">
        <template slot-scope="scope">{{ scope.row.created_at }}</template>
      </el-table-column>

      <!-- <el-table-column label="产品" prop="state">
        <template slot-scope="scope">
          <el-button @click="setProd(scope.row)" type="text" size="small"
            >产品配置</el-button
          >
        </template>
      </el-table-column> -->

      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button v-if="userInfo.perm['system.update']" @click="editRow(scope.row)" type="text" size="small"
            icon="el-icon-edit">编辑</el-button>

          <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
            title="确定要删除吗？" @confirm="deleteRow(scope.row)" v-if="userInfo.perm['system.delete']">
            <el-button type="text" size="small" icon="el-icon-delete" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <!-- 数据合计,按需求启用 -->
      <!-- <el-button v-if="userInfo.perm['system.summary']" @click="getSummaryList">合计</el-button> -->
      <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 30, 50, 100]"
        :style="{ float: 'right', padding: '20px' }" :total="total" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" background></el-pagination>
    </div>

    <dialogform :visible.sync="openDialog" :dialogTitle="dialogTitle" :formDatas="formData" :formRule="formRules"
      @confirm="enterDialog" ref="dialog">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" name="first">
          <el-form-item label="通道名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入" clearable></el-input>
          </el-form-item>

          <el-form-item label="通道水费" prop="water_amount">
            <el-input v-model="formData.water_amount" clearable placeholder="请输入"></el-input>
          </el-form-item>

          <!-- <el-form-item label="所属上游" prop="provider_id">
            <el-select
              v-model="formData.provider_id"
              placeholder="请选择"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in providerList"
                :key="item.ID"
                :label="item.name"
                :value="item.ID"
              ></el-option>
            </el-select>
          </el-form-item> -->

          <!-- <el-form-item label="低消" prop="mincost">
            <el-input
              v-model="formData.mincost"
              clearable
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="优先级" prop="priority">
            <el-input
              v-model.number="formData.priority"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item> -->

          <!-- <el-form-item label="发送消息" prop="is_message">
            <el-switch
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="是"
              inactive-text="否"
              v-model="formData.is_message"
            ></el-switch>
          </el-form-item>
          <el-form-item
            label="消息模板"
            prop="msg_template_id"
            v-if="formData.is_message"
          >
            <el-input
              v-model.number="formData.msg_template_id"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item> -->

          <el-form-item label="开启查询" prop="is_query">
            <el-switch active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否"
              v-model="formData.is_query"></el-switch>
          </el-form-item>
          <el-form-item label="查询次数" prop="query_count" v-if="formData.is_query">
            <el-input v-model.number="formData.query_count" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="查询间隔" prop="query_interval" v-if="formData.is_query">
            <el-input v-model.number="formData.query_interval" placeholder="请输入" clearable>
              <template slot="append">分钟</template>
            </el-input>
          </el-form-item>

          <!-- <el-form-item label="负利润" prop="negative_profit">
            <el-switch
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="是"
              inactive-text="否"
              v-model="formData.negative_profit"
            ></el-switch>
          </el-form-item> -->

          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" placeholder="请输入" clearable></el-input>
          </el-form-item>

          <el-form-item label="状态" prop="is_activity">
            <el-switch active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="禁用"
              v-model="formData.is_activity"></el-switch>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="通道参数" name="second">
          <el-form-item label="通道模板" prop="template_id">
            <el-select v-model="formData.template_id" @change="changeChannelTemplate" placeholder="请选择" clearable
              style="width: 100%">
              <el-option v-for="item in templateList" :key="item.ID" :label="item.name" :value="item.ID"></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="通道类型" prop="type_id">
            <el-input
              v-model.number="formData.type_id"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item> -->

          <el-form-item label="参数信息:">
            <dynamicform v-model="formData.params"></dynamicform>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </dialogform>

    <!-- 配置产品窗口 -->
    <div>
      <Product ref="product"></Product>
    </div>

    <uploadexcel ref="uploadexcel" action="SysRechargeChannel"></uploadexcel>
  </div>
</template>

<script>
import {
  createFcgTenantChannel,
  deleteFcgTenantChannel,
  updateFcgTenantChannel,
  findFcgTenantChannel,
  getFcgTenantChannelList,
  batchFcgTenantChannelOperation,
  getFcgTenantChannelSummary,
} from "@/api/fcgame/fcg_tenant_channel";

import {
  findFcgTenantChannelTemplate,
  getFcgTenantChannelTemplateList,
} from "@/api/fcgame/fcg_tenant_channel_template";

import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";

import Vue from "vue";
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);

export default {
  name: "recharge_channel",
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      providerList: [],
      templateList: [],
      listApi: getFcgTenantChannelList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      activeName: "first",
      formData: {
        owner_id: undefined,
        type_id: undefined,
        provider_id: undefined,
        template_id: undefined,
        name: "",
        code: "",
        // mincost: undefined,
        // priority: undefined,
        is_query: true,
        query_count: true,
        query_interval: undefined,
        is_activity: true,
        total_expense: undefined,
        total_order: undefined,
        params: "",
        remark: "",
        is_message: true,
        msg_template_id: undefined,
        callback_url: "",
        negative_profit: true,
      },
      formRules: {
        type_id: [{ required: true, message: "请填写数据", trigger: "blur" }],
        // provider_id: [
        //   { required: true, message: "请填写数据", trigger: "blur" },
        // ],
        template_id: [
          { required: true, message: "请选择模板", trigger: "blur" },
        ],
        name: [{ required: true, message: "请填写数据", trigger: "blur" }],
      },
    };
  },
  methods: {
    setProd(row) {
      this.$refs.product.settingProd(row);
    },
    onCopy(url) {
      this.$copyText(url);
      this.$notify.success("复制成功");
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
      this.formData.params = [];
      this.type = "create";
      this.dialogTitle = "创建";
      this.openDialog = true;
    },
    async editRow(row) {
      this.type = "update";
      this.dialogTitle = "编辑";
      const res = await findFcgTenantChannel({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.refcg_tenant_channel;
        this.openDialog = true;
      }
    },
    async deleteRow(row) {
      const res = await deleteFcgTenantChannel({ ID: row.ID });
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
          res = await createFcgTenantChannel(this.formData);
          updateFcgTenantChannel;
          break;
        case "update":
          res = await updateFcgTenantChannel(this.formData);
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

        const res = await batchFcgTenantChannelOperation({
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
      const res = await getFcgTenantChannelSummary(this.searchInfo);
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
      this.searchInfo.action = "recharge_channel";
      await this.$api.getExcel(this.searchInfo);
    },
    async changeChannelTemplate() {
      const res = await findFcgTenantChannelTemplate({
        ID: this.formData.template_id,
      });
      this.formData.params.splice(0); // 清空数组
      console.log("resparam", res.data.refcg_tenant_channel_template.params);
      if (
        res.code == 0 &&
        res.data.refcg_tenant_channel_template.params != null
      ) {
        //不能直接赋值, 要响应式更新数据
        for (
          let i = 0;
          i < res.data.refcg_tenant_channel_template.params.length;
          i++
        ) {
          this.formData.params.push(
            res.data.refcg_tenant_channel_template.params[i]
          );
        }
        // this.formData.params = res.data.rerecharge_channel_template.params;
      }
    },
  },
  async created() {
    await this.getTableData();

    const res = await getFcgTenantChannelTemplateList({
      page: 1,
      pageSize: 999,
      filter: "mini",
    });
    if (res.code == 0) {
      this.templateList = res.data.list;
    }
  },
};
</script>

<style></style>

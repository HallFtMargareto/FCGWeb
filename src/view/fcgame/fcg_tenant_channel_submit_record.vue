<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="3" @search="onQuery">
        <el-form-item label="租户ID">
          <el-input v-model.number="searchInfo.tenant_id" placeholder="请输入" clearable></el-input>
        </el-form-item>

        <el-form-item label="期号">
          <el-input v-model.number="searchInfo.issue_id" placeholder="请输入" clearable></el-input>
        </el-form-item>

        <el-form-item label="游戏分类ID">
          <el-input v-model.number="searchInfo.game_category" placeholder="请输入" clearable></el-input>
        </el-form-item>

        <el-form-item label="注数">
          <el-input v-model="searchInfo.trans_count" placeholder="" clearable></el-input>
        </el-form-item>

        <el-form-item label="金额">
          <el-input v-model="searchInfo.trans_amount" placeholder="" clearable></el-input>
        </el-form-item>

        <el-form-item label="结果">
          <el-input v-model="searchInfo.result" placeholder="" clearable></el-input>
        </el-form-item>

        <el-form-item label="渠道ID">
          <el-input v-model.number="searchInfo.channel_id" placeholder="请输入" clearable></el-input>
        </el-form-item>




        <el-form-item label="添加时间">
          <datepicker v-model="searchInfo.startTime" type="datetime" />
        </el-form-item>
        <el-form-item label="结束时间">
          <datepicker v-model="searchInfo.endTime" type="datetime" />
        </el-form-item>
      </searchform>

      <!-- <el-form size="mini" :inline="true" class="btn-form-inline">
        <el-button v-if="userInfo.perm['system.create']" @click="createRow" icon="el-icon-plus"
          type="primary">新增</el-button>
        <el-button v-if="userInfo.perm['system.batch_delete'] && multipleSelection.length > 0"
          @click="handleCommand('remove')" icon="el-icon-delete" type="danger" plain>批量删除</el-button>
        <el-button v-if="userInfo.perm['system.import']" @click="importExcel" icon="el-icon-sell">导入</el-button>
        <el-button v-if="userInfo.perm['system.export']" @click="exportExcel" icon="el-icon-sold-out">导出</el-button>
      </el-form> -->
    </div>

    <el-table :data="tableData" @selection-change="handleSelectionChange" @sort-change="sortChange" ref="multipleTable"
      :show-summary="showSummary" :summary-method="getSummaries">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="ID" prop="ID" sortable></el-table-column>

      <el-table-column label="租户" prop="tenant_id" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.tenant_name || scope.row.tenant_id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="期号" prop="issue_id">
      </el-table-column>

      <el-table-column label="游戏分类" prop="game_category" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.game_category_name || scope.row.game_category }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单量" prop="trans_count">
      </el-table-column>

      <el-table-column label="总金额" prop="trans_amount">
      </el-table-column>

      <el-table-column label="结果" prop="result" min-width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.result">
            <el-tag :type="getResultType(scope.row.result)">
              {{ getResultText(scope.row.result) }}
            </el-tag>
            <el-popover placement="top-start" width="400" trigger="hover">
              <div style="word-break: break-all; max-height: 300px; overflow: auto;">
                {{ scope.row.result }}
              </div>
              <i slot="reference" class="el-icon-info" style="margin-left: 5px; color: #909399; cursor: pointer;"></i>
            </el-popover>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="渠道" prop="channel_id" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.channel_name || scope.row.channel_id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="添加时间" width="160" prop="created_at" sortable="custom">
        <template slot-scope="scope">{{ scope.row.created_at }}</template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="200" v-if="userInfo.perm['host']">
        <template slot-scope="scope">
          <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
            title="确定要删除吗？" @confirm="deleteRow(scope.row)" v-if="userInfo.perm['system.delete']">
            <el-button type="text" size="small" icon="el-icon-delete" slot="reference">删除</el-button>
          </el-popconfirm>
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

    <dialogform :visible.sync="openDialog" :dialogTitle="dialogTitle" :formDatas="formData" :formRule="formRules"
      @confirm="enterDialog" ref="dialog">
      <el-form-item label="租户ID" prop="tenant_id">
        <el-input v-model.number="formData.tenant_id" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="期号" prop="issue_id">
        <el-input v-model.number="formData.issue_id" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="游戏分类ID" prop="game_category">
        <el-input v-model.number="formData.game_category" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="注数" prop="trans_count">
        <el-input v-model="formData.trans_count" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="金额" prop="trans_amount">
        <el-input v-model="formData.trans_amount" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="结果" prop="result">
        <el-input v-model="formData.result" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="渠道ID" prop="channel_id">
        <el-input v-model.number="formData.channel_id" placeholder="请输入" clearable></el-input>
      </el-form-item>
    </dialogform>

    <uploadexcel ref="uploadexcel" action="FcgTenantChannelSubmitRecord"></uploadexcel>
  </div>
</template>

<script>
import {
  createFcgTenantChannelSubmitRecord,
  deleteFcgTenantChannelSubmitRecord,
  updateFcgTenantChannelSubmitRecord,
  findFcgTenantChannelSubmitRecord,
  getFcgTenantChannelSubmitRecordList,
  batchFcgTenantChannelSubmitRecordOperation,
  getFcgTenantChannelSubmitRecordSummary,
} from "@/api/fcgame/fcg_tenant_channel_submit_record";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
export default {
  name: "fcg_tenant_channel_submit_record",
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      listApi: getFcgTenantChannelSubmitRecordList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      formData: {
        tenant_id: undefined,
        issue_id: undefined,
        game_category: undefined,
        trans_count: undefined,
        trans_amount: undefined,
        result: "",
        channel_id: undefined,

      },
      formRules: {
        tenant_id: [{ required: true, message: "请填写数据", trigger: "blur" }], issue_id: [{ required: true, message: "请填写数据", trigger: "blur" }], game_category: [{ required: true, message: "请填写数据", trigger: "blur" }],
        trans_count: [{ required: true, message: "请选择项目", trigger: "change" }],

        trans_amount: [{ required: true, message: "请选择项目", trigger: "change" }],
        result: [{ required: true, message: "请填写数据", trigger: "blur" }], channel_id: [{ required: true, message: "请填写数据", trigger: "blur" }],
      },
    };
  },
  methods: {
    getResultType(resultStr) {
      try {
        const res = JSON.parse(resultStr);
        return res.success ? 'success' : 'danger';
      } catch (e) {
        return 'info';
      }
    },
    getResultText(resultStr) {
      try {
        const res = JSON.parse(resultStr);
        return res.success ? '成功' : '失败';
      } catch (e) {
        return '解析异常';
      }
    },
    onQuery() {
      this.summary = {};
      this.showSummary = false;

      this.page = 1
      this.pageSize = 10
      this.getTableData()
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
      const res = await findFcgTenantChannelSubmitRecord({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.refcg_tenant_channel_submit_record;
        this.openDialog = true;
      }
    },
    async deleteRow(row) {
      const res = await deleteFcgTenantChannelSubmitRecord({ ID: row.ID });
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: "删除成功"
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
          res = await createFcgTenantChannelSubmitRecord(this.formData);
          break;
        case "update":
          res = await updateFcgTenantChannelSubmitRecord(this.formData);
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
          message: "操作成功"
        })
        this.$refs.dialog.handleClose();
        this.openDialog = false;
        this.getTableData();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCommand(command) {
      this.$confirm('是否要执行批量操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const ids = [];
        if (this.multipleSelection.length == 0) {
          this.$message({
            type: "warning",
            message: "请选择需要操作的数据",
          });
          return;
        }
        this.multipleSelection && this.multipleSelection.map((item) => {
          ids.push(item.ID);
        });

        const res = await batchFcgTenantChannelSubmitRecordOperation({
          ids,
          'command': command
        });
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.getTableData();
        }
      })
    },
    sortChange(row) {
      //自定义排序要设置两个属性prop="field-name" sortable="custom"
      this.orderField = row.prop;
      this.orderType = this.directionMap[row.order] || "";
      this.getTableData();
    },
    async getSummaryList() {
      const res = await getFcgTenantChannelSubmitRecordSummary(this.searchInfo);
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
      this.searchInfo.action = "fcg_tenant_channel_submit_record";
      await this.$api.getExcel(this.searchInfo);
    },
  },
  async created() {
    await this.getTableData();
  }
};
</script>

<style scoped></style>

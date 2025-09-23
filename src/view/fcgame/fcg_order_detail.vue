<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="3" @search="onQuery">
        <el-form-item label="所属投注批次ID">
          <el-input v-model="searchInfo.batch_id" placeholder="所属投注批次ID" clearable></el-input>
        </el-form-item>

        <el-form-item label="所属订单ID">
          <el-input v-model="searchInfo.order_id" placeholder="所属订单ID" clearable></el-input>
        </el-form-item>

        <el-form-item label="玩家ID (冗余)">
          <el-input v-model="searchInfo.user_id" placeholder="玩家ID (冗余)" clearable></el-input>
        </el-form-item>


        <el-form-item label="奖期号 (冗余)">
          <el-input v-model="searchInfo.issue_number" placeholder="奖期号 (冗余)" clearable></el-input>
        </el-form-item>



        <el-form-item label="拆分后的3位数直选组合 (如: 318, 005)">
          <el-input v-model="searchInfo.bet_combination" placeholder="拆分后的3位数直选组合 (如: 318, 005)" clearable></el-input>
        </el-form-item>



        <el-form-item label="原始玩法编码 (冗余, 用于区分奖金)">
          <el-input v-model="searchInfo.game_type_code" placeholder="原始玩法编码 (冗余, 用于区分奖金)" clearable></el-input>
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
        <el-button v-if="userInfo.perm['system.batch_delete'] && multipleSelection.length > 0"
          @click="handleCommand('remove')" icon="el-icon-delete" type="danger" plain>批量删除</el-button>
        <el-button v-if="userInfo.perm['system.import']" @click="importExcel" icon="el-icon-sell">导入</el-button>
        <el-button v-if="userInfo.perm['system.export']" @click="exportExcel" icon="el-icon-sold-out">导出</el-button>
      </el-form>
    </div>

    <el-table :data="tableData" @selection-change="handleSelectionChange" @sort-change="sortChange" ref="multipleTable"
      :show-summary="showSummary" :summary-method="getSummaries">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="ID" prop="ID" sortable></el-table-column>


      <el-table-column label="所属投注批次ID" prop="batch_id">
      </el-table-column>


      <el-table-column label="所属订单ID" prop="order_id">
      </el-table-column>


      <el-table-column label="玩家ID (冗余)" prop="user_id">
      </el-table-column>


      <el-table-column label="奖期号 (冗余)" prop="issue_number" show-overflow-tooltip>
      </el-table-column>


      <el-table-column label="拆分后的3位数直选组合 (如: 318, 005)" prop="bet_combination" show-overflow-tooltip>
      </el-table-column>


      <el-table-column label="原始玩法编码 (冗余, 用于区分奖金)" prop="game_type_code" show-overflow-tooltip>
      </el-table-column>



      <el-table-column label="添加时间" width="160" prop="created_at" sortable="custom">
        <template slot-scope="scope">{{ scope.row.created_at }}</template>
      </el-table-column>

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
      <el-form-item label="所属投注批次ID" prop="batch_id">
        <el-input v-model="formData.batch_id" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="所属订单ID" prop="order_id">
        <el-input v-model="formData.order_id" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="玩家ID (冗余)" prop="user_id">
        <el-input v-model="formData.user_id" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="奖期号 (冗余)" prop="issue_number">
        <el-input v-model="formData.issue_number" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="拆分后的3位数直选组合 (如: 318, 005)" prop="bet_combination">
        <el-input v-model="formData.bet_combination" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="原始玩法编码 (冗余, 用于区分奖金)" prop="game_type_code">
        <el-input v-model="formData.game_type_code" placeholder="请输入" clearable></el-input>
      </el-form-item>
    </dialogform>

    <uploadexcel ref="uploadexcel" action="FcgOrderDetail"></uploadexcel>
  </div>
</template>

<script>
import {
  createFcgOrderDetail,
  deleteFcgOrderDetail,
  updateFcgOrderDetail,
  findFcgOrderDetail,
  getFcgOrderDetailList,
  batchFcgOrderDetailOperation,
  getFcgOrderDetailSummary,
} from "@/api/fcgame/fcg_order_detail";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
export default {
  name: "fcg_order_detail",
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      listApi: getFcgOrderDetailList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      formData: {
        batch_id: undefined,
        order_id: undefined,
        user_id: undefined,
        issue_number: "",
        bet_combination: "",
        game_type_code: "",

      },
      formRules: {

        batch_id: [{ required: true, message: "请选择项目", trigger: "change" }],

        order_id: [{ required: true, message: "请选择项目", trigger: "change" }],

        user_id: [{ required: true, message: "请选择项目", trigger: "change" }],
        issue_number: [{ required: true, message: "请填写数据", trigger: "blur" }], bet_combination: [{ required: true, message: "请填写数据", trigger: "blur" }], game_type_code: [{ required: true, message: "请填写数据", trigger: "blur" }],
      },
    };
  },
  methods: {
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
      const res = await findFcgOrderDetail({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.refcg_order_detail;
        this.openDialog = true;
      }
    },
    async deleteRow(row) {
      const res = await deleteFcgOrderDetail({ ID: row.ID });
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
          res = await createFcgOrderDetail(this.formData);
          break;
        case "update":
          res = await updateFcgOrderDetail(this.formData);
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

        const res = await batchFcgOrderDetailOperation({
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
      const res = await getFcgOrderDetailSummary(this.searchInfo);
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
      this.searchInfo.action = "fcg_order_detail";
      await this.$api.getExcel(this.searchInfo);
    },
  },
  async created() {
    await this.getTableData();
  }
};
</script>

<style scoped></style>
<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="3" @search="onQuery">
        <el-form-item label="账号">
          <el-input v-model="searchInfo.username" placeholder="账号" clearable></el-input>
        </el-form-item>

        <el-form-item label="昵称">
          <el-input v-model="searchInfo.nickname" placeholder="昵称" clearable></el-input>
        </el-form-item>

        <el-form-item label="账户状态">
          <el-input v-model="searchInfo.status" placeholder="账户状态" clearable></el-input>

        </el-form-item>



        <el-form-item label="风控等级">
          <el-input v-model="searchInfo.risk_level" placeholder="风控等级" clearable></el-input>
        </el-form-item>


        <el-form-item label="备注">
          <el-input v-model="searchInfo.remarks" placeholder="备注" clearable></el-input>
        </el-form-item>



        <el-form-item label="上级代理">
          <el-input v-model="searchInfo.agent_id" placeholder="上级代理" clearable></el-input>
        </el-form-item>

        <el-form-item label="注册渠道">
          <el-input v-model="searchInfo.channel_code" placeholder="注册渠道" clearable></el-input>
        </el-form-item>


        <el-form-item label="添加时间">
          <datepicker v-model="searchInfo.startTime" type="datetime" />
        </el-form-item>
        <el-form-item label="结束时间">
          <datepicker v-model="searchInfo.endTime" type="datetime" />
        </el-form-item>
      </searchform>

      <el-form size="mini" :inline="true" class="btn-form-inline">
        <el-button v-if="userInfo.perm['system.export']" @click="exportExcel" icon="el-icon-sold-out">导出</el-button>
      </el-form>
    </div>

    <el-table :data="tableData" @selection-change="handleSelectionChange" @sort-change="sortChange" ref="multipleTable"
      :show-summary="showSummary" :summary-method="getSummaries">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="ID" prop="ID" sortable></el-table-column>


      <el-table-column label="账号" prop="username" show-overflow-tooltip>
      </el-table-column>
      <!-- <el-table-column label="玩家头像URL" prop="avatar_url" show-overflow-tooltip>
      </el-table-column> -->


      <el-table-column label="昵称" prop="nickname" show-overflow-tooltip>
      </el-table-column>





      <!-- <el-table-column label="加密后的密码 (禁止明文存储)" prop="password_hash" show-overflow-tooltip>
      </el-table-column>


      <el-table-column label="加密后的资金密码 (用于提现等操作)" prop="fund_password_hash" show-overflow-tooltip>
      </el-table-column> -->


      <el-table-column label="两步验证" prop="is_two_factor_enabled">
        <template slot-scope="scope">
          <booltag :tagState="scope.row.is_two_factor_enabled" true-text="启用" false-text="禁用"></booltag>
        </template>
      </el-table-column>

      <!-- <el-table-column label="两步验证密钥" prop="two_factor_secret" show-overflow-tooltip>
      </el-table-column> -->


      <el-table-column label="余额" prop="balance">
      </el-table-column>


      <el-table-column label="冻结金额" prop="frozen_balance">
      </el-table-column>


      <!-- <el-table-column label="货币单位 (默认为CNY)" prop="currency" show-overflow-tooltip>
      </el-table-column> -->


      <el-table-column label="累计充值" prop="total_deposit_amount">
      </el-table-column>


      <el-table-column label="累计提现" prop="total_withdrawal_amount">
      </el-table-column>


      <el-table-column label="累计投注" prop="total_bet_count">
      </el-table-column>


      <el-table-column label="投注总金额" prop="total_bet_amount">
      </el-table-column>


      <el-table-column label="中奖总金额" prop="total_win_amount">
      </el-table-column>


      <el-table-column label="累计盈亏" prop="profit_loss">
      </el-table-column>


      <el-table-column label="账户状态" prop="status" show-overflow-tooltip>
      </el-table-column>


      <el-table-column label="风控等级" prop="risk_level" show-overflow-tooltip>
      </el-table-column>


      <el-table-column label="VIP账号" prop="user_level">
        <template slot-scope="scope">
          <booltag :tagState="scope.row.user_level" true-text="启用" false-text="禁用"></booltag>
        </template>
      </el-table-column>

      <el-table-column label="备注" prop="remarks" show-overflow-tooltip>
      </el-table-column>


      <el-table-column label="上级代理" prop="agent_id">
      </el-table-column>


      <el-table-column label="注册渠道" prop="channel_code" show-overflow-tooltip>
      </el-table-column>


      <!-- <el-table-column label="注册时IP地址" prop="registration_ip" show-overflow-tooltip>
      </el-table-column> -->


      <!-- <el-table-column label="最后一次登录时间" prop="last_login_at">
      </el-table-column> -->

      <!-- 
      <el-table-column label="最后一次登录IP地址" prop="last_login_ip" show-overflow-tooltip>
      </el-table-column> -->


      <!-- <el-table-column label="最后一次下注时间" prop="last_bet_at">
      </el-table-column> -->



      <el-table-column label="添加时间" width="160" prop="created_at" sortable="custom">
        <template slot-scope="scope">{{ scope.row.created_at }}</template>
      </el-table-column>

      <!-- <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button v-if="userInfo.perm['system.update']" @click="editRow(scope.row)" type="text" size="small"
            icon="el-icon-edit">编辑</el-button>

          <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
            title="确定要删除吗？" @confirm="deleteRow(scope.row)" v-if="userInfo.perm['system.delete']">
            <el-button type="text" size="small" icon="el-icon-delete" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column> -->


    </el-table>

    <!-- class="pagination-container" -->
    <div>
      <!-- 数据合计,按需求启用 -->
      <!-- <el-button v-if="userInfo.perm['system.summary']" @click="getSummaryList">合计</el-button> -->
      <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 30, 50, 100]"
        :style="{ float: 'right', padding: '20px' }" :total="total" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" background></el-pagination>
    </div>

    <uploadexcel ref="uploadexcel" action="FcgUser"></uploadexcel>
  </div>
</template>

<script>
import {
  createFcgUser,
  deleteFcgUser,
  updateFcgUser,
  findFcgUser,
  getFcgUserList,
  batchFcgUserOperation,
  getFcgUserSummary,
} from "@/api/fcgame/fcg_user";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
export default {
  name: "fcg_user",
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      listApi: getFcgUserList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      formData: {
        username: "",
        nickname: "",
        avatar_url: "",
        password_hash: "",
        fund_password_hash: "",
        is_two_factor_enabled: true,
        two_factor_secret: "",
        balance: undefined,
        frozen_balance: undefined,
        currency: "",
        total_deposit_amount: undefined,
        total_withdrawal_amount: undefined,
        total_bet_count: undefined,
        total_bet_amount: undefined,
        total_win_amount: undefined,
        profit_loss: undefined,
        status: "",
        risk_level: "",
        user_level: true,
        remarks: "",
        agent_id: undefined,
        channel_code: "",
        registration_ip: "",
        last_login_at: "",
        last_login_ip: "",
        last_bet_at: "",

      }
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
      const res = await findFcgUser({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.refcg_user;
        this.openDialog = true;
      }
    },
    async deleteRow(row) {
      const res = await deleteFcgUser({ ID: row.ID });
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
          res = await createFcgUser(this.formData);
          break;
        case "update":
          res = await updateFcgUser(this.formData);
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

        const res = await batchFcgUserOperation({
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
      const res = await getFcgUserSummary(this.searchInfo);
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
      this.searchInfo.action = "fcg_user";
      await this.$api.getExcel(this.searchInfo);
    },
  },
  async created() {
    await this.getTableData();
  }
};
</script>

<style scoped></style>

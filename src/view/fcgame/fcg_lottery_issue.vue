<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="3" @search="onQuery">
              <el-form-item label="奖期号, 如: 2025245">
              <el-input v-model="searchInfo.issue_number" placeholder="奖期号, 如: 2025245" clearable></el-input>
          
              </el-form-item> 
          
          
      
              <el-form-item label="本期开始销售时间">
              <datepicker v-model="searchInfo.start_time" type="datetime" placeholder="选择日期" style="width: 100%" clearable/>
              </el-form-item> 
          
          
      
              <el-form-item label="本期截止销售时间">
              <datepicker v-model="searchInfo.end_time" type="datetime" placeholder="选择日期" style="width: 100%" clearable/>
              </el-form-item> 
          
          
      
              <el-form-item label="官方开奖时间">
              <datepicker v-model="searchInfo.draw_time" type="datetime" placeholder="选择日期" style="width: 100%" clearable/>
              </el-form-item> 
          
          
      
              <el-form-item label="开奖号码, 如: 3,1,8">
              <el-input v-model="searchInfo.winning_numbers" placeholder="开奖号码, 如: 3,1,8" clearable></el-input>
          
              </el-form-item> 
          
          
      
              <el-form-item label="奖期状态 (1:销售中, 2:已截止, 3:开奖中, 4:已开奖, 5:已派奖)" prop="status">
                <el-select v-model="searchInfo.status" placeholder="请选择">
                  <el-option key="true" label="是" value="true"></el-option>
                  <el-option key="false" label="否" value="false"></el-option>
                </el-select>
              </el-form-item>
          
      

      <el-form-item label="添加时间">
          <datepicker v-model="searchInfo.startTime" type="datetime" />
      </el-form-item>
      <el-form-item label="结束时间">
          <datepicker v-model="searchInfo.endTime" type="datetime" />
      </el-form-item>
      </searchform>

      <el-form size="mini" :inline="true" class="btn-form-inline">
        <el-button v-if="userInfo.perm['system.create']" @click="createRow" icon="el-icon-plus" type="primary">新增</el-button>
        <el-button v-if="userInfo.perm['system.batch_delete'] && multipleSelection.length > 0" @click="handleCommand('remove')" icon="el-icon-delete" type="danger" plain>批量删除</el-button>
        <el-button v-if="userInfo.perm['system.import']" @click="importExcel" icon="el-icon-sell">导入</el-button>
        <el-button v-if="userInfo.perm['system.export']" @click="exportExcel" icon="el-icon-sold-out">导出</el-button>
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
    
      
          <el-table-column label="奖期号, 如: 2025245" prop="issue_number" show-overflow-tooltip>
          </el-table-column> 
        
      
          <el-table-column label="本期开始销售时间" prop="start_time">
          </el-table-column> 
        
      
          <el-table-column label="本期截止销售时间" prop="end_time">
          </el-table-column> 
        
      
          <el-table-column label="官方开奖时间" prop="draw_time">
          </el-table-column> 
        
      
          <el-table-column label="开奖号码, 如: 3,1,8" prop="winning_numbers" show-overflow-tooltip>
          </el-table-column> 
        
      
            <el-table-column label="奖期状态 (1:销售中, 2:已截止, 3:开奖中, 4:已开奖, 5:已派奖)" prop="status">
              <template slot-scope="scope">
                <booltag
                  :tagState="scope.row.status"
                  true-text="启用"
                  false-text="禁用"
                ></booltag>
              </template>
            </el-table-column>
      

      <el-table-column label="添加时间" width="160" prop="created_at" sortable="custom">
        <template slot-scope="scope">{{scope.row.created_at}}</template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button v-if="userInfo.perm['system.update']" @click="editRow(scope.row)" type="text" size="small" icon="el-icon-edit">编辑</el-button>
          
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
        :style="{float:'right',padding:'20px'}"
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
        <el-form-item label="奖期号, 如: 2025245" prop="issue_number">
                  <el-input v-model="formData.issue_number" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="本期开始销售时间" prop="start_time">
                    <datepicker placeholder="选择日期" v-model="formData.start_time" type="datetime" style="width: 100%" clearable/>
        </el-form-item>
        <el-form-item label="本期截止销售时间" prop="end_time">
                    <datepicker placeholder="选择日期" v-model="formData.end_time" type="datetime" style="width: 100%" clearable/>
        </el-form-item>
        <el-form-item label="官方开奖时间" prop="draw_time">
                    <datepicker placeholder="选择日期" v-model="formData.draw_time" type="datetime" style="width: 100%" clearable/>
        </el-form-item>
        <el-form-item label="开奖号码, 如: 3,1,8" prop="winning_numbers">
                  <el-input v-model="formData.winning_numbers" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="奖期状态 (1:销售中, 2:已截止, 3:开奖中, 4:已开奖, 5:已派奖)" prop="status">
                  <el-switch active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否" v-model="formData.status"></el-switch>
        </el-form-item>
    </dialogform>

    <uploadexcel ref="uploadexcel" action="FcgLotteryIssue"></uploadexcel>
  </div>
</template>

<script>
import {
    createFcgLotteryIssue,
    deleteFcgLotteryIssue,
    updateFcgLotteryIssue,
    findFcgLotteryIssue,
    getFcgLotteryIssueList,
    batchFcgLotteryIssueOperation,
    getFcgLotteryIssueSummary,
} from "@/api/fcgame/fcg_lottery_issue";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
export default {
  name: "fcg_lottery_issue",
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      listApi: getFcgLotteryIssueList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      formData: {
            issue_number:"",
            winning_numbers:"",
            status:true,
            
      },
      formRules: {
        issue_number: [{ required: true, message: "请填写数据", trigger: "blur" }],
            start_time: [{ required: true, message: "请选择项目", trigger: "change" }],
          
            end_time: [{ required: true, message: "请选择项目", trigger: "change" }],
          
            draw_time: [{ required: true, message: "请选择项目", trigger: "change" }],
          winning_numbers: [{ required: true, message: "请填写数据", trigger: "blur" }],
            status: [{ required: true, message: "请选择项目", trigger: "change" }],
          
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
      const res = await findFcgLotteryIssue({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.refcg_lottery_issue;
        this.openDialog = true;
      }
    },
    async deleteRow(row) {
     const res = await deleteFcgLotteryIssue({ ID: row.ID });
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
          res = await createFcgLotteryIssue(this.formData);
          break;
        case "update":
          res = await updateFcgLotteryIssue(this.formData);
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
          type:"success",
          message:"操作成功"
        })
        this.$refs.dialog.handleClose();
        this.openDialog = false;
        this.getTableData();
      }
    },
    handleSelectionChange(val) {
        this.multipleSelection = val
    },
    handleCommand(command){
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

            const res = await batchFcgLotteryIssueOperation({
                 ids,
                 'command':command
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
      const res = await getFcgLotteryIssueSummary(this.searchInfo);
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
      this.searchInfo.action = "fcg_lottery_issue";
      await this.$api.getExcel(this.searchInfo);
    },
  },
  async created() {
    await this.getTableData();
  }
};
</script>

<style scoped>
</style>
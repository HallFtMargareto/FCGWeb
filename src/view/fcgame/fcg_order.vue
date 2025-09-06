<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="3" @search="onQuery">
              <el-form-item label="订单唯一编号 (业务ID)">
              <el-input v-model="searchInfo.order_number" placeholder="订单唯一编号 (业务ID)" clearable></el-input>
          
              </el-form-item> 
          
          
      
              <el-form-item label="所属投注批次ID">
              <el-input v-model="searchInfo.batch_id" placeholder="所属投注批次ID" clearable></el-input>
          
              </el-form-item> 
          
          
      
              <el-form-item label="玩家ID (冗余字段, 方便查询)">
              <el-input v-model="searchInfo.user_id" placeholder="玩家ID (冗余字段, 方便查询)" clearable></el-input>
          
              </el-form-item> 
          
          
      
              <el-form-item label="投注奖期号 (冗余字段, 方便查询)">
              <el-input v-model="searchInfo.issue_number" placeholder="投注奖期号 (冗余字段, 方便查询)" clearable></el-input>
          
              </el-form-item> 
          
          
      
              <el-form-item label="玩法编码">
              <el-input v-model="searchInfo.game_type_code" placeholder="玩法编码" clearable></el-input>
          
              </el-form-item> 
          
          
      
              <el-form-item label="玩法名称 (如: 单选, 组三, 组六五码)">
              <el-input v-model="searchInfo.game_type_name" placeholder="玩法名称 (如: 单选, 组三, 组六五码)" clearable></el-input>
          
              </el-form-item> 
          
          
      
              <el-form-item label="投注内容 (单选/组选为号码, 胆拖/复式为组合)">
              <el-input v-model="searchInfo.bet_content" placeholder="投注内容 (单选/组选为号码, 胆拖/复式为组合)" clearable></el-input>
          
              </el-form-item> 
          
          
      
              <el-form-item label="注数 (例如组六五码复式是10注)">
              <el-input v-model.number="searchInfo.bet_count" placeholder="请输入" clearable></el-input>
              </el-form-item> 
          
          
      
              <el-form-item label="每注单价 (如: 2.0000)">
              <el-input v-model="searchInfo.unit_price" placeholder="每注单价 (如: 2.0000)" clearable></el-input>
          
              </el-form-item> 
          
          
      
              <el-form-item label="倍数">
              <el-input v-model.number="searchInfo.multiplier" placeholder="请输入" clearable></el-input>
              </el-form-item> 
          
          
      
              <el-form-item label="订单总金额 (bet_count * unit_price * multiplier)">
              <el-input v-model="searchInfo.total_amount" placeholder="订单总金额 (bet_count * unit_price * multiplier)" clearable></el-input>
          
              </el-form-item> 
          
          
      
              <el-form-item label="订单状态 (0:待开奖, 1:未中奖, 2:已中奖, 3:已撤单)" prop="status">
                <el-select v-model="searchInfo.status" placeholder="请选择">
                  <el-option key="true" label="是" value="true"></el-option>
                  <el-option key="false" label="否" value="false"></el-option>
                </el-select>
              </el-form-item>
          
      
              <el-form-item label="中奖金额">
              <el-input v-model="searchInfo.win_amount" placeholder="中奖金额" clearable></el-input>
          
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
    
      
          <el-table-column label="订单唯一编号 (业务ID)" prop="order_number" show-overflow-tooltip>
          </el-table-column> 
        
      
          <el-table-column label="所属投注批次ID" prop="batch_id">
          </el-table-column> 
        
      
          <el-table-column label="玩家ID (冗余字段, 方便查询)" prop="user_id">
          </el-table-column> 
        
      
          <el-table-column label="投注奖期号 (冗余字段, 方便查询)" prop="issue_number" show-overflow-tooltip>
          </el-table-column> 
        
      
          <el-table-column label="玩法编码" prop="game_type_code" show-overflow-tooltip>
          </el-table-column> 
        
      
          <el-table-column label="玩法名称 (如: 单选, 组三, 组六五码)" prop="game_type_name" show-overflow-tooltip>
          </el-table-column> 
        
      
          <el-table-column label="投注内容 (单选/组选为号码, 胆拖/复式为组合)" prop="bet_content" show-overflow-tooltip>
          </el-table-column> 
        
      
          <el-table-column label="注数 (例如组六五码复式是10注)" prop="bet_count">
          </el-table-column> 
        
      
          <el-table-column label="每注单价 (如: 2.0000)" prop="unit_price">
          </el-table-column> 
        
      
          <el-table-column label="倍数" prop="multiplier">
          </el-table-column> 
        
      
          <el-table-column label="订单总金额 (bet_count * unit_price * multiplier)" prop="total_amount">
          </el-table-column> 
        
      
            <el-table-column label="订单状态 (0:待开奖, 1:未中奖, 2:已中奖, 3:已撤单)" prop="status">
              <template slot-scope="scope">
                <booltag
                  :tagState="scope.row.status"
                  true-text="启用"
                  false-text="禁用"
                ></booltag>
              </template>
            </el-table-column>
      
          <el-table-column label="中奖金额" prop="win_amount">
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
        <el-form-item label="订单唯一编号 (业务ID)" prop="order_number">
                  <el-input v-model="formData.order_number" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属投注批次ID" prop="batch_id">
                    <el-input v-model="formData.batch_id" clearable placeholder="请输入" ></el-input>
        </el-form-item>
        <el-form-item label="玩家ID (冗余字段, 方便查询)" prop="user_id">
                    <el-input v-model="formData.user_id" clearable placeholder="请输入" ></el-input>
        </el-form-item>
        <el-form-item label="投注奖期号 (冗余字段, 方便查询)" prop="issue_number">
                  <el-input v-model="formData.issue_number" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="玩法编码" prop="game_type_code">
                  <el-input v-model="formData.game_type_code" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="玩法名称 (如: 单选, 组三, 组六五码)" prop="game_type_name">
                  <el-input v-model="formData.game_type_name" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="投注内容 (单选/组选为号码, 胆拖/复式为组合)" prop="bet_content">
                  <el-input v-model="formData.bet_content" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="注数 (例如组六五码复式是10注)" prop="bet_count">
                  <el-input v-model.number="formData.bet_count" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="每注单价 (如: 2.0000)" prop="unit_price">
                    <el-input v-model="formData.unit_price" clearable placeholder="请输入" ></el-input>
        </el-form-item>
        <el-form-item label="倍数" prop="multiplier">
                  <el-input v-model.number="formData.multiplier" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="订单总金额 (bet_count * unit_price * multiplier)" prop="total_amount">
                    <el-input v-model="formData.total_amount" clearable placeholder="请输入" ></el-input>
        </el-form-item>
        <el-form-item label="订单状态 (0:待开奖, 1:未中奖, 2:已中奖, 3:已撤单)" prop="status">
                  <el-switch active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否" v-model="formData.status"></el-switch>
        </el-form-item>
        <el-form-item label="中奖金额" prop="win_amount">
                    <el-input v-model="formData.win_amount" clearable placeholder="请输入" ></el-input>
        </el-form-item>
    </dialogform>

    <uploadexcel ref="uploadexcel" action="FcgOrder"></uploadexcel>
  </div>
</template>

<script>
import {
    createFcgOrder,
    deleteFcgOrder,
    updateFcgOrder,
    findFcgOrder,
    getFcgOrderList,
    batchFcgOrderOperation,
    getFcgOrderSummary,
} from "@/api/fcgame/fcg_order";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
export default {
  name: "fcg_order",
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      listApi: getFcgOrderList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      formData: {
            order_number:"",
            batch_id:undefined,
            user_id:undefined,
            issue_number:"",
            game_type_code:"",
            game_type_name:"",
            bet_content:"",
            bet_count:undefined,
            unit_price:undefined,
            multiplier:undefined,
            total_amount:undefined,
            status:true,
            win_amount:undefined,
            
      },
      formRules: {
        order_number: [{ required: true, message: "请填写数据", trigger: "blur" }],
            batch_id: [{ required: true, message: "请选择项目", trigger: "change" }],
          
            user_id: [{ required: true, message: "请选择项目", trigger: "change" }],
          issue_number: [{ required: true, message: "请填写数据", trigger: "blur" }],game_type_code: [{ required: true, message: "请填写数据", trigger: "blur" }],game_type_name: [{ required: true, message: "请填写数据", trigger: "blur" }],bet_content: [{ required: true, message: "请填写数据", trigger: "blur" }],bet_count: [{ required: true, message: "请填写数据", trigger: "blur" }],
            unit_price: [{ required: true, message: "请选择项目", trigger: "change" }],
          multiplier: [{ required: true, message: "请填写数据", trigger: "blur" }],
            total_amount: [{ required: true, message: "请选择项目", trigger: "change" }],
          
            status: [{ required: true, message: "请选择项目", trigger: "change" }],
          
            win_amount: [{ required: true, message: "请选择项目", trigger: "change" }],
          
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
      const res = await findFcgOrder({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.refcg_order;
        this.openDialog = true;
      }
    },
    async deleteRow(row) {
     const res = await deleteFcgOrder({ ID: row.ID });
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
          res = await createFcgOrder(this.formData);
          break;
        case "update":
          res = await updateFcgOrder(this.formData);
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

            const res = await batchFcgOrderOperation({
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
      const res = await getFcgOrderSummary(this.searchInfo);
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
      this.searchInfo.action = "fcg_order";
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

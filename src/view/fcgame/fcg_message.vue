<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="3" @search="onQuery">
              <el-form-item label="租户ID">
              <el-input v-model.number="searchInfo.tenant_id" placeholder="请输入" clearable></el-input>
              </el-form-item> 
          
          
      
              <el-form-item label="发送者">
              <el-input v-model="searchInfo.user_name" placeholder="发送者" clearable></el-input>
          
              </el-form-item> 
          
          
      
              <el-form-item label="用户名称">
              <el-input v-model="searchInfo.nick_name" placeholder="用户名称" clearable></el-input>
          
              </el-form-item> 
          
          
      
              <el-form-item label="本地消息ID">
              <el-input v-model="searchInfo.local_id" placeholder="本地消息ID" clearable></el-input>
          
              </el-form-item> 
          
          
      
              <el-form-item label="排序序列">
              <el-input v-model="searchInfo.sort_seq" placeholder="排序序列" clearable></el-input>
          
              </el-form-item> 
          
          
      
              <el-form-item label="服务器消息ID">
              <el-input v-model="searchInfo.server_id" placeholder="服务器消息ID" clearable></el-input>
          
              </el-form-item> 
          
          
      
              <el-form-item label="本地消息类型">
              <el-input v-model.number="searchInfo.local_type" placeholder="请输入" clearable></el-input>
              </el-form-item> 
          
          
      
              <el-form-item label="消息创建时间（时间戳）">
              <el-input v-model="searchInfo.create_time" placeholder="消息创建时间（时间戳）" clearable></el-input>
          
              </el-form-item> 
          
          
      
              <el-form-item label="真实发送者 rowid">
              <el-input v-model="searchInfo.real_sender_id" placeholder="真实发送者 rowid" clearable></el-input>
          
              </el-form-item> 
          
          
      
              <el-form-item label="消息内容">
              <el-input v-model="searchInfo.message_content" placeholder="消息内容" clearable></el-input>
          
              </el-form-item> 
          
          
      
              <el-form-item label="消息状态">
              <el-input v-model.number="searchInfo.status" placeholder="请输入" clearable></el-input>
              </el-form-item> 
          
          
      
              <el-form-item label="识别状态：0未识别，1识别中，2识别完成，3识别失败" prop="recognition_status">
                <el-select v-model="searchInfo.recognition_status" placeholder="请选择">
                  <el-option key="true" label="是" value="true"></el-option>
                  <el-option key="false" label="否" value="false"></el-option>
                </el-select>
              </el-form-item>
          
      
              <el-form-item label="消息编号（业务唯一编号）">
              <el-input v-model="searchInfo.message_no" placeholder="消息编号（业务唯一编号）" clearable></el-input>
          
              </el-form-item> 
          
          
      
              <el-form-item label="任务列表（JSON 格式存储多个任务）">
              <el-input v-model="searchInfo.task_list" placeholder="任务列表（JSON 格式存储多个任务）" clearable></el-input>
          
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
    
      
          <el-table-column label="租户ID" prop="tenant_id">
          </el-table-column> 
        
      
          <el-table-column label="发送者" prop="user_name" show-overflow-tooltip>
          </el-table-column> 
        
      
          <el-table-column label="用户名称" prop="nick_name" show-overflow-tooltip>
          </el-table-column> 
        
      
          <el-table-column label="本地消息ID" prop="local_id">
          </el-table-column> 
        
      
          <el-table-column label="排序序列" prop="sort_seq">
          </el-table-column> 
        
      
          <el-table-column label="服务器消息ID" prop="server_id">
          </el-table-column> 
        
      
          <el-table-column label="本地消息类型" prop="local_type">
          </el-table-column> 
        
      
          <el-table-column label="消息创建时间（时间戳）" prop="create_time">
          </el-table-column> 
        
      
          <el-table-column label="真实发送者 rowid" prop="real_sender_id">
          </el-table-column> 
        
      
          <el-table-column label="消息内容" prop="message_content" show-overflow-tooltip>
          </el-table-column> 
        
      
          <el-table-column label="消息状态" prop="status">
          </el-table-column> 
        
      
            <el-table-column label="识别状态：0未识别，1识别中，2识别完成，3识别失败" prop="recognition_status">
              <template slot-scope="scope">
                <booltag
                  :tagState="scope.row.recognition_status"
                  true-text="启用"
                  false-text="禁用"
                ></booltag>
              </template>
            </el-table-column>
      
          <el-table-column label="消息编号（业务唯一编号）" prop="message_no" show-overflow-tooltip>
          </el-table-column> 
        
      
          <el-table-column label="任务列表（JSON 格式存储多个任务）" prop="task_list">
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
        <el-form-item label="租户ID" prop="tenant_id">
                  <el-input v-model.number="formData.tenant_id" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="发送者" prop="user_name">
                  <el-input v-model="formData.user_name" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户名称" prop="nick_name">
                  <el-input v-model="formData.nick_name" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="本地消息ID" prop="local_id">
                    <el-input v-model="formData.local_id" clearable placeholder="请输入" ></el-input>
        </el-form-item>
        <el-form-item label="排序序列" prop="sort_seq">
                    <el-input v-model="formData.sort_seq" clearable placeholder="请输入" ></el-input>
        </el-form-item>
        <el-form-item label="服务器消息ID" prop="server_id">
                    <el-input v-model="formData.server_id" clearable placeholder="请输入" ></el-input>
        </el-form-item>
        <el-form-item label="本地消息类型" prop="local_type">
                  <el-input v-model.number="formData.local_type" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="消息创建时间（时间戳）" prop="create_time">
                    <el-input v-model="formData.create_time" clearable placeholder="请输入" ></el-input>
        </el-form-item>
        <el-form-item label="真实发送者 rowid" prop="real_sender_id">
                    <el-input v-model="formData.real_sender_id" clearable placeholder="请输入" ></el-input>
        </el-form-item>
        <el-form-item label="消息内容" prop="message_content">
                  <el-input v-model="formData.message_content" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="消息状态" prop="status">
                  <el-input v-model.number="formData.status" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="识别状态：0未识别，1识别中，2识别完成，3识别失败" prop="recognition_status">
                  <el-switch active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否" v-model="formData.recognition_status"></el-switch>
        </el-form-item>
        <el-form-item label="消息编号（业务唯一编号）" prop="message_no">
                  <el-input v-model="formData.message_no" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="任务列表（JSON 格式存储多个任务）" prop="task_list">
                    <el-input v-model="formData.task_list" clearable placeholder="请输入" ></el-input>
        </el-form-item>
    </dialogform>

    <uploadexcel ref="uploadexcel" action="FcgMessage"></uploadexcel>
  </div>
</template>

<script>
import {
    createFcgMessage,
    deleteFcgMessage,
    updateFcgMessage,
    findFcgMessage,
    getFcgMessageList,
    batchFcgMessageOperation,
    getFcgMessageSummary,
} from "@/api/fcgame/fcg_message";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
export default {
  name: "fcg_message",
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      listApi: getFcgMessageList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      formData: {
            tenant_id:undefined,
            user_name:"",
            nick_name:"",
            local_id:undefined,
            sort_seq:undefined,
            server_id:undefined,
            local_type:undefined,
            create_time:undefined,
            real_sender_id:undefined,
            message_content:"",
            status:undefined,
            recognition_status:true,
            message_no:"",
            
      },
      formRules: {
        tenant_id: [{ required: true, message: "请填写数据", trigger: "blur" }],user_name: [{ required: true, message: "请填写数据", trigger: "blur" }],nick_name: [{ required: true, message: "请填写数据", trigger: "blur" }],
            local_id: [{ required: true, message: "请选择项目", trigger: "change" }],
          
            sort_seq: [{ required: true, message: "请选择项目", trigger: "change" }],
          
            server_id: [{ required: true, message: "请选择项目", trigger: "change" }],
          local_type: [{ required: true, message: "请填写数据", trigger: "blur" }],
            create_time: [{ required: true, message: "请选择项目", trigger: "change" }],
          
            real_sender_id: [{ required: true, message: "请选择项目", trigger: "change" }],
          message_content: [{ required: true, message: "请填写数据", trigger: "blur" }],status: [{ required: true, message: "请填写数据", trigger: "blur" }],
            recognition_status: [{ required: true, message: "请选择项目", trigger: "change" }],
          message_no: [{ required: true, message: "请填写数据", trigger: "blur" }],
            task_list: [{ required: true, message: "请选择项目", trigger: "change" }],
          
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
      const res = await findFcgMessage({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.refcg_message;
        this.openDialog = true;
      }
    },
    async deleteRow(row) {
     const res = await deleteFcgMessage({ ID: row.ID });
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
          res = await createFcgMessage(this.formData);
          break;
        case "update":
          res = await updateFcgMessage(this.formData);
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

            const res = await batchFcgMessageOperation({
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
      const res = await getFcgMessageSummary(this.searchInfo);
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
      this.searchInfo.action = "fcg_message";
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

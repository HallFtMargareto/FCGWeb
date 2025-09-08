<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="4" @search="onQuery">

        <el-form-item label="发送者">
          <el-input v-model="searchInfo.user_name" placeholder="发送者用户名" clearable></el-input>
        </el-form-item>

        <el-form-item label="用户名称">
          <el-input v-model="searchInfo.nick_name" placeholder="用户显示名称" clearable></el-input>
        </el-form-item>

        <!-- <el-form-item label="本地消息ID">
          <el-input v-model="searchInfo.local_id" placeholder="本地消息标识" clearable></el-input>
        </el-form-item>

        <el-form-item label="消息ID">
          <el-input v-model="searchInfo.server_id" placeholder="服务器消息ID" clearable></el-input>
        </el-form-item> -->

        <!-- <el-form-item label="消息类型">
          <el-input v-model.number="searchInfo.local_type" placeholder="请输入消息类型" clearable></el-input>
        </el-form-item> -->

        <el-form-item label="发送时间">
          <el-input v-model="searchInfo.create_time" placeholder="创建时间戳" clearable></el-input>
        </el-form-item>

        <el-form-item label="消息内容">
          <el-input v-model="searchInfo.message_content" placeholder="消息文本内容" clearable></el-input>
        </el-form-item>
        <!-- 
        <el-form-item label="消息状态">
          <el-input v-model.number="searchInfo.status" placeholder="请输入消息状态" clearable></el-input>
        </el-form-item> -->

        <el-form-item label="识别状态">
          <el-select v-model="searchInfo.recognition_status" placeholder="请选择识别状态" clearable>
            <el-option label="未识别" :value="0"></el-option>
            <el-option label="识别中" :value="1"></el-option>
            <el-option label="识别完成" :value="2"></el-option>
            <el-option label="识别失败" :value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="消息编号">
          <el-input v-model="searchInfo.message_no" placeholder="业务唯一编号" clearable></el-input>
        </el-form-item>

        <el-form-item label="任务列表">
          <el-input v-model="searchInfo.task_list" placeholder="JSON格式任务列表" clearable></el-input>
        </el-form-item>

        <el-form-item label="添加时间">
          <datepicker v-model="searchInfo.startTime" type="datetime" placeholder="开始时间" />
        </el-form-item>
        <el-form-item label="结束时间">
          <datepicker v-model="searchInfo.endTime" type="datetime" placeholder="结束时间" />
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



      <!-- <el-table-column label="发送者" prop="user_name" show-overflow-tooltip>
      </el-table-column> -->


      <el-table-column label="用户名称" prop="nick_name" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="消息内容" prop="message_content" width="500">
      </el-table-column>

      <el-table-column label="发送时间" prop="create_time" width="160">
        <template slot-scope="scope">
          {{ formatTimestamp(scope.row.create_time) }}
        </template>
      </el-table-column>


      <!-- <el-table-column label="本地消息ID" prop="local_id">
      </el-table-column> -->


      <el-table-column label="排序序号" prop="sort_seq">
      </el-table-column>


      <el-table-column label="消息ID" prop="server_id" width="200">
      </el-table-column>


      <!-- <el-table-column label="消息类型" prop="local_type">
      </el-table-column> -->





      <!-- <el-table-column label="真实发送者" prop="real_sender_id">
      </el-table-column> -->





      <!-- <el-table-column label="消息状态" prop="status">
      </el-table-column> -->


      <el-table-column label="识别状态" prop="recognition_status" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.recognition_status === 0" type="info" size="mini">未识别</el-tag>
          <el-tag v-else-if="scope.row.recognition_status === 1" type="warning" size="mini">识别中</el-tag>
          <el-tag v-else-if="scope.row.recognition_status === 2" type="success" size="mini">识别完成</el-tag>
          <el-tag v-else-if="scope.row.recognition_status === 3" type="danger" size="mini">识别失败</el-tag>
          <span v-else>未识别</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="消息编号" prop="message_no" show-overflow-tooltip>
      </el-table-column> -->


      <el-table-column label="任务列表" prop="task_list" show-overflow-tooltip>
      </el-table-column>



      <el-table-column label="添加时间" width="160" prop="created_at" sortable="custom">
        <template slot-scope="scope">
          {{ formatTimestamp(scope.row.created_at) }}
        </template>
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

    <dialogform :visible.sync="openDialog" :dialogTitle="dialogTitle" :formDatas="formData" :formRule="formRules"
      @confirm="enterDialog" ref="dialog">
      <el-form-item label="租户ID" prop="tenant_id">
        <el-input v-model.number="formData.tenant_id" placeholder="请输入租户ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="发送者" prop="user_name">
        <el-input v-model="formData.user_name" placeholder="请输入发送者" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户名称" prop="nick_name">
        <el-input v-model="formData.nick_name" placeholder="请输入用户名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="本地消息ID" prop="local_id">
        <el-input v-model.number="formData.local_id" placeholder="请输入本地消息ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="排序序列" prop="sort_seq">
        <el-input v-model.number="formData.sort_seq" placeholder="请输入排序序列" clearable></el-input>
      </el-form-item>
      <el-form-item label="消息ID" prop="server_id">
        <el-input v-model.number="formData.server_id" placeholder="请输入消息ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="消息类型" prop="local_type">
        <el-input v-model.number="formData.local_type" placeholder="请输入消息类型" clearable></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="create_time">
        <el-input v-model.number="formData.create_time" placeholder="请输入创建时间戳" clearable></el-input>
      </el-form-item>
      <el-form-item label="真实发送者ID" prop="real_sender_id">
        <el-input v-model.number="formData.real_sender_id" placeholder="请输入真实发送者ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="消息内容" prop="message_content">
        <el-input v-model="formData.message_content" type="textarea" :rows="3" placeholder="请输入消息内容"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="消息状态" prop="status">
        <el-input v-model.number="formData.status" placeholder="请输入消息状态" clearable></el-input>
      </el-form-item>
      <el-form-item label="识别状态" prop="recognition_status">
        <el-select v-model="formData.recognition_status" placeholder="请选择识别状态">
          <el-option label="未识别" :value="0"></el-option>
          <el-option label="识别中" :value="1"></el-option>
          <el-option label="识别完成" :value="2"></el-option>
          <el-option label="识别失败" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消息编号" prop="message_no">
        <el-input v-model="formData.message_no" placeholder="请输入消息编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="任务列表" prop="task_list">
        <el-input v-model="formData.task_list" type="textarea" :rows="3" placeholder="请输入JSON格式的任务列表"
          clearable></el-input>
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
import { formatTimeToStr } from "@/utils/date";
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
        tenant_id: undefined,
        user_name: "",
        nick_name: "",
        local_id: undefined,
        sort_seq: undefined,
        server_id: undefined,
        local_type: undefined,
        create_time: undefined,
        real_sender_id: undefined,
        message_content: "",
        status: undefined,
        recognition_status: 0,
        message_no: "",
        task_list: "",
      },
      formRules: {
        tenant_id: [{ required: true, message: "请填写租户ID", trigger: "blur" }],
        user_name: [{ required: true, message: "请填写发送者", trigger: "blur" }],
        nick_name: [{ required: true, message: "请填写用户名称", trigger: "blur" }],
        message_content: [{ required: true, message: "请填写消息内容", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 格式化时间戳为标准时间格式
    formatTimestamp(timestamp) {
      if (!timestamp) return '';
      // 如果是时间戳（数字），转换为毫秒
      const time = typeof timestamp === 'number' ? timestamp * 1000 : timestamp;
      return formatTimeToStr(time, "yyyy-MM-dd hh:mm:ss");
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

        const res = await batchFcgMessageOperation({
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
.search-term {
  padding: 20px;
  background-color: #f5f7fa;
  margin-bottom: 20px;
  border-radius: 4px;
}

.btn-form-inline {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e4e7ed;
}

.el-table {
  border-radius: 4px;
  overflow: hidden;
}

.el-pagination {
  margin-top: 20px;
}

/* 搜索表单样式优化 */
.search-term .el-form-item {
  margin-bottom: 15px;
}

.search-term .el-form-item__label {
  font-weight: 600;
  color: #606266;
}

/* 表格头部样式 */
.el-table th {
  background-color: #fafafa;
  color: #606266;
  font-weight: 600;
}

/* 操作按钮样式 */
.el-table .el-button--text {
  padding: 0;
  margin: 0 5px;
}

/* 识别状态标签样式 */
.el-tag {
  border-radius: 12px;
}
</style>

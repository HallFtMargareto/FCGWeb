<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="4" @search="onQuery">
        <!-- <el-form-item label="租户ID">
          <el-input v-model.number="searchInfo.tenant_id" placeholder="请输入租户ID" clearable></el-input>
        </el-form-item> -->

        <el-form-item label="用户标识">
          <el-input v-model="searchInfo.username" placeholder="用户标识" clearable></el-input>
        </el-form-item>

        <el-form-item label="昵称">
          <el-input v-model="searchInfo.nick_name" placeholder="用户昵称" clearable></el-input>
        </el-form-item>

        <el-form-item label="别名">
          <el-input v-model="searchInfo.alias" placeholder="用户别名" clearable></el-input>
        </el-form-item>

        <!-- <el-form-item label="本地类型">
          <el-input v-model.number="searchInfo.local_type" placeholder="本地类型" clearable></el-input>
        </el-form-item> -->

        <el-form-item label="备注">
          <el-input v-model="searchInfo.remark" placeholder="备注信息" clearable></el-input>
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="searchInfo.description" placeholder="描述信息" clearable></el-input>
        </el-form-item>

        <el-form-item label="msg_hash">
          <el-input v-model="searchInfo.hash" placeholder="消息哈希值" clearable></el-input>
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


      <!-- <el-table-column label="租户ID" prop="tenant_id">
      </el-table-column> -->


      <el-table-column label="用户标识" prop="user_name" width="300">
      </el-table-column>


      <el-table-column label="昵称" prop="nick_name" show-overflow-tooltip>
      </el-table-column>


      <el-table-column label="别名" prop="alias" show-overflow-tooltip>
      </el-table-column>


      <!-- <el-table-column label="本地类型" prop="local_type">
      </el-table-column> -->


      <el-table-column label="拼音" prop="pin_yin_initial" show-overflow-tooltip>
      </el-table-column>


      <el-table-column label="全拼" prop="quan_pin" show-overflow-tooltip>
      </el-table-column>


      <!-- <el-table-column label="大头像" prop="big_head_url" show-overflow-tooltip>
      </el-table-column> -->


      <el-table-column label="小头像" prop="small_head_url" show-overflow-tooltip>
      </el-table-column>


      <el-table-column label="备注" prop="remark" show-overflow-tooltip>
      </el-table-column>


      <el-table-column label="描述" prop="description" show-overflow-tooltip>
      </el-table-column>


      <el-table-column label="msg_hash" prop="hash" show-overflow-tooltip>
      </el-table-column>


      <el-table-column label="添加时间" width="160" prop="created_at" sortable="custom">
        <template slot-scope="scope">
          {{ formatTimestamp(scope.row.created_at) }}
        </template>
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

    <uploadexcel ref="uploadexcel" action="FcgContact"></uploadexcel>
  </div>
</template>

<script>
import {
  createFcgContact,
  deleteFcgContact,
  updateFcgContact,
  findFcgContact,
  getFcgContactList,
  batchFcgContactOperation,
  getFcgContactSummary,
} from "@/api/fcgame/fcg_contact";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
import { formatTimeToStr } from "@/utils/date";
export default {
  name: "fcg_contact",
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      listApi: getFcgContactList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      formData: {
        tenant_id: undefined,
        username: "",
        nick_name: "",
        alias: "",
        local_type: undefined,
        pin_yin_initial: "",
        quan_pin: "",
        big_head_url: "",
        small_head_url: "",
        remark: "",
        description: "",
        hash: "",

      },
      formRules: {
        tenant_id: [{ required: true, message: "请填写数据", trigger: "blur" }], username: [{ required: true, message: "请填写数据", trigger: "blur" }], nick_name: [{ required: true, message: "请填写数据", trigger: "blur" }], alias: [{ required: true, message: "请填写数据", trigger: "blur" }], local_type: [{ required: true, message: "请填写数据", trigger: "blur" }], pin_yin_initial: [{ required: true, message: "请填写数据", trigger: "blur" }], quan_pin: [{ required: true, message: "请填写数据", trigger: "blur" }], big_head_url: [{ required: true, message: "请填写数据", trigger: "blur" }], small_head_url: [{ required: true, message: "请填写数据", trigger: "blur" }], remark: [{ required: true, message: "请填写数据", trigger: "blur" }], description: [{ required: true, message: "请填写数据", trigger: "blur" }], hash: [{ required: true, message: "请填写数据", trigger: "blur" }],
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
      const res = await findFcgContact({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.refcg_contact;
        this.openDialog = true;
      }
    },
    async deleteRow(row) {
      const res = await deleteFcgContact({ ID: row.ID });
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
          res = await createFcgContact(this.formData);
          break;
        case "update":
          res = await updateFcgContact(this.formData);
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

        const res = await batchFcgContactOperation({
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
      const res = await getFcgContactSummary(this.searchInfo);
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
      this.searchInfo.action = "fcg_contact";
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
</style>

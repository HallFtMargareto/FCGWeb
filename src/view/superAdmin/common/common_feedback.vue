<template>
  <div class="feedback-container">

    <div class="search-term">
      <el-form size="mini" :inline="true" class="btn-form-inline">
        <el-button v-if="userInfo.perm['system.create']" @click="createRow" class="btn-info">新增</el-button>
      </el-form>
    </div>

    <!-- 留言列表区域 -->
    <div class="feedback-list">
      <el-card class="feedback-card" shadow="never" v-for="item in tableData" :key="item.ID">
        <div class="feedback-header">

          <div class="feedback-info">
            <!-- <span class="feedback-id">ID: {{ item.ID }}</span> -->
            <span class="feedback-time">{{ item.created_at | formatDate }}</span>
            <!-- <span class="feedback-ip">IP: {{ item.ip }}</span>
            <span class="feedback-mobile">手机号: {{ item.mobile }}</span> -->
          </div>
          <div class="feedback-actions">

          </div>
        </div>
        <div class="feedback-content">
          <div class="message-content">
            <div v-html="renderMarkdown(item.message)"></div>
          </div>
          <!-- <div v-if="item.remark" class="feedback-remark">
            <span class="remark-label">备注:</span>
            <span class="remark-content">{{ item.remark }}</span>
          </div>
          <div v-if="item.follow === 1 && item.follow_employe" class="follow-info">
            <span class="follow-label">回访员工:</span>
            <span class="follow-content">{{ item.follow_employe }}</span>
          </div> -->
        </div>
      </el-card>

      <!-- 空状态 -->
      <el-empty v-if="tableData.length === 0" description="暂无反馈数据"></el-empty>
    </div>

    <!-- 分页 -->
    <div class="pagination-section" v-if="tableData.length > 0">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
        :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total" background>
      </el-pagination>
    </div>

    <!-- 编辑/新增对话框 -->
    <el-dialog :visible.sync="dialogFormVisible" width="70%" :before-close="closeDialog">
      <el-form :model="formData" :rules="formDataRules" ref="ruleForm" label-width="100px" size="small">
        <el-form-item label="更新内容" prop="message">
          <mavon-editor v-model="formData.message" :subfield="false" :placeholder="placeholder" :shortCut="true"
            :autofocus="true" style="height: 100%"></mavon-editor>

          <div class="markdown-tip">支持 Markdown 格式</div>
        </el-form-item>
        <!-- <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="2" v-model="formData.remark" placeholder="请输入备注信息">
          </el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="enterDialog">确 定</el-button>
      </div>
    </el-dialog>

    <uploadexcel ref="uploadexcel" action="SysCommonFeedback"></uploadexcel>
  </div>
</template>

<script>
import {
  createSysCommonFeedback,
  deleteSysCommonFeedback,
  updateSysCommonFeedback,
  findSysCommonFeedback,
  getSysCommonFeedbackList,
  batchSysCommonFeedbackOperation,
  getSysCommonFeedbackSummary,
} from "@/api/common/common_feedback";
import { mavonEditor } from "mavon-editor";
import { getExcel } from "@/api/common";
import infoList from "@/mixins/infoList";
import uploadexcel from "@/components/uploadexcel";
import { mapGetters } from "vuex";
// 引入markdown-it库
import MarkdownIt from "markdown-it";

// 初始化markdown-it实例
const md = new MarkdownIt({
  html: false,        // 禁用HTML标签
  xhtmlOut: false,    // 禁用XHTML输出
  breaks: true,       // 转换 \n 为 <br>
  linkify: true,      // 自动转换链接
  typographer: true,  // 启用替换符号
  quotes: '""\'\''    // 引号样式
});
export default {
  name: "SysCommonFeedback",
  mixins: [infoList],
  components: {
    uploadexcel,
    mavonEditor
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      listApi: getSysCommonFeedbackList,
      dialogFormVisible: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      searchTime: [],
      formData: {
        message: "",
        mobile: "",
        images: "",
        ip: "",
        follow: undefined,
        follow_employe: "",
        remark: "",
      },
      formDataRules: {
        message: [{ required: false, message: "请输入留言内容", trigger: "blur" }],
        mobile: [{ required: false, message: "请输入手机号", trigger: "blur" }],
        ip: [{ required: false, message: "请输入IP地址", trigger: "blur" }],
        follow: [{ required: false, message: "请选择回访状态", trigger: "change" }],
      },
      miniDataList: [],
    };
  },
  watch: {
    searchTime(newVal) {
      if (newVal && newVal.length === 2) {
        this.searchInfo.startTime = newVal[0];
        this.searchInfo.endTime = newVal[1];
      } else {
        this.searchInfo.startTime = "";
        this.searchInfo.endTime = "";
      }
    }
  },
  methods: {
    // 渲染markdown内容
    renderMarkdown(content) {
      if (!content) return '';
      return md.render(content);
    },
    resetSearch() {
      this.searchInfo = {};
      this.searchTime = [];
      this.onQuery();
    },
    onQuery() {
      this.summary = {};
      this.showSummary = false;

      this.page = 1;
      this.pageSize = 10;
      this.getTableData();
    },
    createRow() {
      this.type = "create";
      this.dialogTitle = "新增内容";
      this.formData = {
        message: "",
        mobile: "",
        images: "",
        ip: "",
        follow: undefined,
        follow_employe: "",
        remark: "",
      };
      this.dialogFormVisible = true;
    },
    async editRow(row) {
      this.type = "update";
      this.dialogTitle = "编辑内容";
      const res = await findSysCommonFeedback({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.recommon_feedback;
        this.dialogFormVisible = true;
      }
    },
    deleteRow(row) {
      this.$confirm("确定要删除这条反馈吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteSysCommonFeedback(row);
      });
    },
    async deleteSysCommonFeedback(row) {
      const res = await deleteSysCommonFeedback({ ID: row.ID });
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
        message: "",
        mobile: "",
        images: "",
        ip: "",
        follow: undefined,
        follow_employe: "",
        remark: "",
      };
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
          res = await createSysCommonFeedback(this.formData);
          break;
        case "update":
          res = await updateSysCommonFeedback(this.formData);
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
      this.$confirm(`是否要删除选中的 ${this.multipleSelection.length} 条反馈?`, "提示", {
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

        const res = await batchSysCommonFeedbackOperation({
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
      const res = await getSysCommonFeedbackSummary(this.searchInfo);
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
      this.searchInfo.action = "SysCommonFeedback";
      await getExcel(this.searchInfo);
    },
  },
  async created() {
    await this.getTableData();
  },
};
</script>

<style scoped>
.feedback-container {
  /* background-color: #f5f7fa; */
  min-height: calc(100vh - 84px);
}

.search-section {
  margin-bottom: 20px;
}

.search-card {
  border: none;
  border-radius: 8px;
}

.search-card ::v-deep .el-card__header {
  padding: 12px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ebeef5;
  border-radius: 8px 8px 0 0;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.toolbar-section {
  margin-bottom: 20px;
}

.feedback-list {
  margin-bottom: 20px;
}

.feedback-card {
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  transition: box-shadow 0.3s;
}

.feedback-card:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.feedback-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.feedback-info span {
  margin-right: 15px;
  font-size: 13px;
  color: #909399;
}

.feedback-id {
  font-weight: bold;
  color: #303133;
}

.feedback-actions {
  display: flex;
  align-items: center;
}

.feedback-actions .el-tag {
  margin-right: 10px;
}

.feedback-content {
  padding: 20px;
}

.message-content {
  margin: 0;
  line-height: 1.6;
  color: #606266;
  white-space: pre-wrap;
  word-break: break-all;
}

.message-content ::v-deep p {
  margin: 0 0 10px 0;
}

.message-content ::v-deep h1,
.message-content ::v-deep h2,
.message-content ::v-deep h3,
.message-content ::v-deep h4,
.message-content ::v-deep h5,
.message-content ::v-deep h6 {
  margin: 10px 0 5px 0;
  color: #303133;
}

.message-content ::v-deep h1 {
  font-size: 20px;
}

.message-content ::v-deep h2 {
  font-size: 18px;
}

.message-content ::v-deep h3 {
  font-size: 16px;
}

.message-content ::v-deep ul,
.message-content ::v-deep ol {
  padding-left: 20px;
  margin: 10px 0;
}

.message-content ::v-deep li {
  margin-bottom: 5px;
}

.message-content ::v-deep code {
  background-color: #f5f7fa;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: monospace;
  color: #e5535c;
}

.message-content ::v-deep pre {
  background-color: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  overflow: auto;
}

.message-content ::v-deep pre code {
  background-color: transparent;
  padding: 0;
  color: inherit;
}

.message-content ::v-deep blockquote {
  margin: 10px 0;
  padding: 10px 15px;
  border-left: 4px solid #dcdfe6;
  background-color: #f5f7fa;
  color: #909399;
}

.message-content ::v-deep a {
  color: #409eff;
  text-decoration: none;
}

.message-content ::v-deep a:hover {
  text-decoration: underline;
}

.message-content ::v-deep hr {
  margin: 15px 0;
  border: 0;
  border-top: 1px solid #ebeef5;
}

.feedback-remark,
.follow-info {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #ebeef5;
}

.remark-label,
.follow-label {
  font-weight: bold;
  color: #909399;
  margin-right: 10px;
}

.pagination-section {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.dialog-footer {
  text-align: right;
}

.markdown-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

::v-deep .el-dialog {
  border-radius: 8px;
}

::v-deep .el-dialog__header {
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ebeef5;
  border-radius: 8px 8px 0 0;
}

::v-deep .el-dialog__body {
  padding: 20px;
}
</style>
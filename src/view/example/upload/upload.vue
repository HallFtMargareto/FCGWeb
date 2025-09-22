<template>
  <div class="upload-container">

    <!-- 文件列表 -->
    <el-card class="file-list-card" shadow="never">
      <div class="file-grid">
        <div v-for="file in tableData" :key="file.ID" class="file-item" :class="{ 'selected': isSelected(file) }"
          @click="toggleSelection(file)">
          <div class="file-checkbox">
            <el-checkbox :value="isSelected(file)" @click.native.stop @change="handleFileSelect(file)">
            </el-checkbox>
          </div>
          <div class="file-preview">
            <div v-if="isImage(file.url)" class="image-preview">
              <el-image :src="file.fullurl" fit="cover" :preview-src-list="[file.fullurl]" lazy>
                <div slot="error" class="image-error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
            <div v-else class="file-icon">
              <i class="el-icon-document"></i>
            </div>
          </div>
          <div class="file-info">
            <div class="file-name" :title="file.name">{{ file.name }}</div>
            <div class="file-tag" v-if="file.tag">
              <el-tag size="mini">{{ file.tag }}</el-tag>
            </div>
            <div class="file-meta">
              <span class="file-key">{{ file.key }}</span>
              <span class="file-date">{{ formatDate(file.created_at) }}</span>
            </div>
          </div>
          <div class="file-actions">
            <el-link :href="file.fullurl" target="_blank" :underline="false" class="action-btn">
              <i class="el-icon-view"></i>
            </el-link>
            <el-button v-if="userInfo.perm['system.update']" type="text" size="small" icon="el-icon-edit"
              @click.stop="editRow(file)" class="action-btn">
            </el-button>
            <el-button v-if="userInfo.perm['system.delete']" type="text" size="small" icon="el-icon-delete"
              @click.stop="deleteRow(file)" class="action-btn">
            </el-button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty v-if="tableData.length === 0" description="暂无文件数据"></el-empty>
    </el-card>

    <!-- 分页 -->
    <div class="pagination-section" v-if="tableData.length > 0">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
        :page-sizes="[12, 24, 36, 48]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total" background>
      </el-pagination>
    </div>

    <!-- 编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="500px" :before-close="closeDialog">
      <el-form :model="formData" :rules="formDataRules" ref="ruleForm" label-width="100px" size="small">
        <el-form-item label="文件名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入文件名"></el-input>
        </el-form-item>
        <el-form-item label="文件地址" prop="url">
          <el-input v-model="formData.url" placeholder="请输入文件地址"></el-input>
        </el-form-item>
        <el-form-item label="文件标签" prop="tag">
          <el-input v-model="formData.tag" placeholder="请输入文件标签"></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="key">
          <el-input v-model="formData.key" placeholder="请输入编号"></el-input>
        </el-form-item>
        <el-form-item label="租户ID" prop="tenant_id">
          <el-input-number v-model="formData.tenant_id" placeholder="请输入租户ID" style="width: 100%;" :min="0">
          </el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="enterDialog">确 定</el-button>
      </div>
    </el-dialog>

    <uploadexcel ref="uploadexcel" action="SysUpload"></uploadexcel>
  </div>
</template>

<script>
import infoList from "@/mixins/infoList";
import uploadexcel from "@/components/uploadexcel";
import { mapGetters } from "vuex";

export default {
  name: "upload",
  mixins: [infoList],
  components: {
    uploadexcel,
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      listApi: this.$api.getFileList,
      dialogFormVisible: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      searchTime: [],
      formData: {
        name: "",
        url: "",
        tag: "",
        key: "",
        tenant_id: undefined,
      },
      formDataRules: {
        name: [{ required: true, message: "请输入文件名", trigger: "blur" }],
        url: [{ required: true, message: "请输入文件地址", trigger: "blur" }],
        tag: [{ required: true, message: "请输入文件标签", trigger: "blur" }],
        key: [{ required: true, message: "请输入编号", trigger: "blur" }],
        tenant_id: [{ required: true, message: "请输入租户ID", trigger: "blur" }],
      },
      reslist: {},
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
    // 判断文件是否为图片
    isImage(url) {
      if (!url) return false;
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
      const ext = url.split('.').pop().toLowerCase();
      return imageExtensions.includes(ext);
    },

    // 格式化日期
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    },

    // 重置搜索
    resetSearch() {
      this.searchInfo = {};
      this.searchTime = [];
      this.onQuery();
    },

    // 判断文件是否被选中
    isSelected(file) {
      return this.multipleSelection.some(item => item.ID === file.ID);
    },

    // 切换文件选择状态
    toggleSelection(file) {
      this.handleFileSelect(file);
    },

    // 处理文件选择
    handleFileSelect(file) {
      const index = this.multipleSelection.findIndex(item => item.ID === file.ID);
      if (index > -1) {
        // 已选中，取消选中
        this.multipleSelection.splice(index, 1);
      } else {
        // 未选中，添加选中
        this.multipleSelection.push(file);
      }
    },

    onQuery() {
      this.summary = {};
      this.showSummary = false;

      this.page = 1;
      this.pageSize = 30;
      this.getTableData();
    },
    createRow() {
      this.type = "create";
      this.dialogTitle = "新增文件";
      this.formData = {
        name: "",
        url: "",
        tag: "",
        key: "",
        tenant_id: undefined,
      };
      this.dialogFormVisible = true;
    },
    async editRow(row) {
      this.type = "update";
      this.dialogTitle = "编辑文件";
      const res = await this.$api.findSysUpload({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.reupload;
        this.dialogFormVisible = true;
      }
    },
    deleteRow(row) {
      this.$confirm(`确定要删除文件 "${row.name}" 吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteSysUpload(row);
      });
    },
    async deleteSysUpload(row) {
      const res = await this.$api.deleteSysUpload({ ID: row.ID });
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
        name: "",
        url: "",
        tag: "",
        key: "",
        tenant_id: undefined,
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
          res = await this.$api.createSysUpload(this.formData);
          break;
        case "update":
          res = await this.$api.updateSysUpload(this.formData);
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
      this.$confirm(`是否要删除选中的 ${this.multipleSelection.length} 个文件?`, "提示", {
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

        const res = await this.$api.batchSysUploadOperation({
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
      const res = await this.$api.getSysUploadSummary(this.searchInfo);
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
      this.searchInfo.action = "upload";
      await this.$api.getExcel(this.searchInfo);
    },
  },
  async created() {
    this.pageSize = 30;
    await this.getTableData();
  },
};
</script>

<style scoped>
.upload-container {
  padding: 10px;
  /* background-color: #f5f7fa; */
  min-height: calc(100vh - 84px);
}

.search-card {
  border: none;
  border-radius: 8px;
  margin-bottom: 20px;
}

.search-card ::v-deep .el-card__header {
  padding: 12px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ebeef5;
  border-radius: 8px 8px 0 0;
}

.search-actions {
  text-align: right;
}

.toolbar-section {
  margin-bottom: 20px;
}

.file-list-card {
  border: none;
  border-radius: 8px;
}

.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.file-item {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  position: relative;
  background-color: #fff;
  cursor: pointer;
}

.file-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.file-item.selected {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.file-checkbox {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
}

.file-preview {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ebeef5;
}

.image-preview {
  width: 100%;
  height: 100%;
}

.image-preview ::v-deep .el-image {
  width: 100%;
  height: 100%;
}

.image-preview ::v-deep .el-image__inner {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #c0c4cc;
  font-size: 24px;
}

.file-icon {
  font-size: 48px;
  color: #c0c4cc;
}

.file-info {
  padding: 15px;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-tag {
  margin-bottom: 8px;
}

.file-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.file-key {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-date {
  flex-shrink: 0;
}

.file-actions {
  display: flex;
  justify-content: flex-end;
  padding: 0 15px 15px;
  opacity: 0;
  transition: opacity 0.3s;
}

.file-item:hover .file-actions {
  opacity: 1;
}

.action-btn {
  margin-left: 10px;
  padding: 5px;
  font-size: 16px;
  color: #909399;
}

.action-btn:hover {
  color: #409eff;
}

.pagination-section {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  margin-top: 20px;
}

.dialog-footer {
  text-align: right;
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
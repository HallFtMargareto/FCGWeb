<template>
  <div>
    <!-- 组件外部显示区域 - 优化的预览区 -->
    <div v-if="showchoose" class="preview-container">
      <div v-if="imageUrl.length === 0" class="empty-preview">
        <i class="el-icon-picture-outline"></i>
        <span>暂无选择的图片</span>
      </div>
      <div v-else class="preview-images">
        <div v-for="(img, index) in imageUrl" :key="index" class="preview-item">
          <el-image :src="img.fullurl" class="preview-img" fit="cover" :preview-src-list="[img.fullurl]">
            <div slot="error" class="image-error">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="preview-overlay">
            <i class="el-icon-zoom-in preview-icon" @click="previewImage(img.fullurl)"></i>
          </div>
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="visible" title="图片选择器" append-to-body width="80%" :close-on-click-modal="false"
      class="image-selector-dialog">
      <div v-loading.fullscreen.lock="fullscreenLoading">
        <!-- 优化的上传区域 -->
        <div class="upload-section">
          <div class="upload-container">
            <el-upload :action="`${path}/fileUploadAndDownload/upload`" :before-upload="checkFile"
              :headers="{ 'x-token': token }" :on-error="uploadError" :on-success="uploadSuccess"
              :show-file-list="false" :limit="10" multiple drag class="upload-dragger">
              <div class="upload-content">
                <i class="el-icon-upload upload-icon"></i>
                <div class="upload-text">
                  <div class="upload-title">点击或拖拽上传图片</div>
                  <div class="upload-hint">支持 JPG、PNG 格式，单个文件不超过 10MB</div>
                </div>
              </div>
            </el-upload>
          </div>
        </div>

        <!-- 图片选择区域 -->
        <div class="selection-section">
          <div class="section-header">
            <h3 class="section-title">
              <i class="el-icon-picture"></i>
              图片库
              <span class="image-count">({{ total }} 张)</span>
            </h3>
            <div class="selection-info" v-if="limit > 1">
              已选择 <span class="selected-count">{{ chooseId.length }}</span> / {{ limit }} 张
            </div>
          </div>

          <div class="image-grid" v-if="tableData.length > 0">
            <div v-for="img in tableData" :key="img.ID" class="image-item"
              :class="{ 'selected': chooseId.includes(img.ID) }" @click="checkImg(img)">
              <div class="image-wrapper">
                <el-image :src="img.fullurl" :alt="img.name" class="grid-image" fit="cover">
                  <div slot="error" class="image-error">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>

                <!-- 选中状态覆盖层 -->
                <div class="selection-overlay" v-if="chooseId.includes(img.ID)">
                  <div class="check-mark">
                    <i class="el-icon-check"></i>
                  </div>
                  <div class="selection-number">{{ chooseId.indexOf(img.ID) + 1 }}</div>
                </div>

                <!-- 悬停操作 -->
                <div class="hover-actions">
                  <el-button type="primary" icon="el-icon-zoom-in" size="mini" circle
                    @click.stop="previewImage(img.fullurl)"></el-button>
                </div>
              </div>

              <div class="image-info">
                <div class="image-name" :title="img.name">{{ img.name }}</div>
                <div class="image-size">{{ formatFileSize(img.size) }}</div>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <i class="el-icon-picture-outline"></i>
            <p>暂无图片</p>
            <el-button type="primary" size="small" @click="getTableData">刷新</el-button>
          </div>

          <!-- 分页 -->
          <div class="pagination-wrapper" v-if="total > 0">
            <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[12, 24, 48, 96]" :total="total"
              @current-change="handleCurrentChange" @size-change="handleSizeChange"
              layout="total, sizes, prev, pager, next, jumper" background></el-pagination>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <div class="footer-info">
          <span v-if="chooseId.length > 0" class="selection-summary">
            已选择 {{ chooseId.length }} 张图片
          </span>
        </div>
        <div class="footer-actions">
          <el-button @click="visible = false" size="medium">取消</el-button>
          <el-button @click="enterDialog" type="primary" size="medium" :disabled="chooseId.length === 0">
            确认选择 ({{ chooseId.length }})
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const path = process.env.VUE_APP_BASE_API;
import { mapGetters } from "vuex";
import infoList from "@/mixins/infoList";
import { getFileList, deleteFile } from "@/api/fileUploadAndDownload";
export default {
  name: "selectimg",
  mixins: [infoList],
  props: {
    value: {
      type: [Array, String],  // 允许传入 Array 或 String
      required: true,
      default: () => []       // 默认为空数组
    },
    show: {
      // 弹窗是否展示
      type: Boolean,
      default: false,
    },
    showchoose: {
      // 是否显示选择的图片
      type: Boolean,
      default: true,
    },
    limit: {
      type: Number,
      default: 1,
    },
    restype: {
      type: Number,
      default: 1,
    }
  },
  data() {
    return {
      fullscreenLoading: false,
      listApi: getFileList,
      path: path,
      imageList: [],
      imageUrl: [],
      chooseId: [], // 改为数组
      init: false,
      pageSize: 12, // 默认每页显示12张图片
    };
  },
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
    visible: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit("update:show", val);
      },
    },
    // value: {
    //   get() {
    //     return this.value;
    //   },
    //   set(newValue) {
    //     this.$emit("input", newValue);
    //   },
    // },
  },
  watch: {
    visible(val) {
      // 在此做显示与隐藏的交互
      if (val === false) {
        // 重置操作
      } else {
        // 展示时操作
      }
    },
    show(val) {
      if (val === true && !this.init) {
        this.getTableData();
        this.init = true;
      }
    },
  },
  filters: {
    formatDate: function (time) {
      if (time != null && time != "") {
        var date = new Date(time);
        return this.$utils.formatTimeToStr(date, "yyyy-MM-dd hh:mm:ss");
      } else {
        return "";
      }
    },
  },
  methods: {
    // 预览图片
    previewImage(url) {
      // 使用 Element UI 的图片预览功能
      this.$imageViewer = this.$imageViewer || [];
      this.$imageViewer.push(url);
    },

    // 格式化文件大小
    formatFileSize(bytes) {
      if (!bytes) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    },
    async deleteFile(row) {
      this.$confirm("此操作将永久文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deleteFile(row);
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            if (this.tableData.length == 1) {
              this.page--;
            }
            this.getTableData();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    checkFile(file) {
      this.fullscreenLoading = true;
      const isJPG = file.type === "image/jpeg";
      const isPng = file.type === "image/png";
      const isWebp = file.type === "image/webp";
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJPG && !isPng && !isWebp) {
        this.$message.error("上传图片只能是 JPG、PNG 或 WebP 格式!");
        this.fullscreenLoading = false;
        return false;
      }
      if (!isLt10M) {
        this.$message.error("上传图片大小不能超过 10MB!");
        this.fullscreenLoading = false;
        return false;
      }
      return (isPng || isJPG || isWebp) && isLt10M;
    },
    uploadSuccess(res) {
      this.fullscreenLoading = false;
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: "上传成功",
        });
        if (res.code == 0) {
          this.getTableData();
        }
      } else {
        this.$message({
          type: "warning",
          message: res.msg,
        });
      }
    },
    uploadError() {
      this.$message({
        type: "error",
        message: "上传失败",
      });
      this.fullscreenLoading = false;
    },
    downloadFile(row) {
      this.$utils.downloadImage(row.url, row.name);
    },
    mergeImageList() {
      for (let i = 0; i < this.tableData.length; i++) {
        this.imageList.push(this.tableData[i].url);
      }
    },
    checkImg(img) {
      // if (this.chooseId.includes(img.ID)) {
      //   // 已选中，取消
      //   this.chooseId = this.chooseId.filter(id => id !== img.ID);
      // } else {
      //   if (this.chooseId.length >= this.limit) {
      //     this.$message.warning(`最多只能选择 ${this.limit} 张图片`);
      //     return;
      //   }
      //   this.chooseId.push(img.ID);
      // }

      // this.imageUrl = this.tableData.filter(item => this.chooseId.includes(item.ID));
      const index = this.chooseId.indexOf(img.ID);

      if (index > -1) {
        // 已选中，取消
        this.chooseId.splice(index, 1);
        this.imageUrl.splice(index, 1);
      } else {
        if (this.chooseId.length >= this.limit) {
          this.$message.warning(`最多只能选择 ${this.limit} 张图片`);
          return;
        }
        this.chooseId.push(img.ID);
        this.imageUrl.push(img);
      }
    },
    enterDialog() {
      console.log(typeof this.value);
      if (typeof this.value === 'string') {
        this.$emit('input', this.imageUrl[0].fullurl);
      } else {
        //restype==1时返回图片素材完整地址
        if (this.restype == 1) {
          let imglist = [];
          for (let i = 0; i < this.imageUrl.length; i++) {
            imglist.push(this.imageUrl[i].fullurl)
          }
          this.$emit('input', imglist); // 使用 $emit 更新 v-model
        }

        //restype==2时返回整个素材结构
        if (this.restype == 2) {
          let imglist = [];
          for (let i = 0; i < this.imageUrl.length; i++) {
            imglist.push(this.imageUrl[i])
          }
          this.$emit('input', imglist);
        }
      }
      this.visible = false;
    },
  },
  created() {
    this.imageUrl = [];
    this.chooseId = [];
    //this.getTableData();
    // this.getTableData().then(() => {
    //   // 数据加载完成后执行
    //   this.mergeImageList();
    // });
  },
};
</script>

<style scoped>
/* =============  预览区域样式 ============= */
.preview-container {
  margin-bottom: 16px;
}

.empty-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  color: #909399;
  background-color: #fafafa;
}

.empty-preview i {
  font-size: 32px;
  margin-bottom: 8px;
}

.preview-images {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.preview-item {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.preview-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.preview-img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.preview-item:hover .preview-overlay {
  opacity: 1;
}

.preview-icon {
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
}

/* ============= 对话框样式 ============= */
.image-selector-dialog .el-dialog {
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.image-selector-dialog .el-dialog__header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  padding: 20px 24px;
}

.image-selector-dialog .el-dialog__title {
  font-size: 18px;
  font-weight: 600;
}

.image-selector-dialog .el-dialog__body {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

/* ============= 上传区域样式 ============= */
.upload-section {
  margin-bottom: 24px;
}

.upload-container .upload-dragger {
  width: 100%;
}

.upload-container .el-upload-dragger {
  width: 100%;
  height: 140px;
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  background-color: #fafafa;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.upload-container .el-upload-dragger:hover {
  border-color: #409eff;
  background-color: #f5f7fa;
}

.upload-container .el-upload-dragger.is-dragover {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* height: 100%; */
  padding: 20px;
}

.upload-icon {
  font-size: 48px;
  color: #409eff;
  margin-bottom: 16px;
}

.upload-text {
  text-align: center;
}

.upload-title {
  font-size: 16px;
  color: #303133;
  margin-bottom: 8px;
  font-weight: 500;
}

.upload-hint {
  font-size: 14px;
  color: #909399;
  line-height: 1.5;
}

/* ============= 选择区域样式 ============= */
.selection-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #ebeef5;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.section-title {
  margin: 0;
  font-size: 18px;
  color: #303133;
  display: flex;
  align-items: center;
  font-weight: 600;
}

.section-title i {
  margin-right: 8px;
  color: #409eff;
}

.image-count {
  font-weight: normal;
  color: #909399;
  font-size: 14px;
}

.selection-info {
  color: #606266;
  font-size: 14px;
}

.selected-count {
  color: #409eff;
  font-weight: 600;
}

/* ============= 图片网格样式 ============= */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  min-height: 200px;
}

.image-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
}

.image-item:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.image-item.selected {
  box-shadow: 0 0 0 3px #409eff;
  transform: translateY(-2px);
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.grid-image {
  width: 100%;
  height: 100%;
  border-radius: 0;
}

.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #f5f7fa;
  color: #c0c4cc;
}

.image-error i {
  font-size: 32px;
}

/* 选中覆盖层 */
.selection-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(64, 158, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.check-mark {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: #67c23a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.selection-number {
  font-size: 24px;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.5);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 悬停操作 */
.hover-actions {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-item:hover .hover-actions {
  opacity: 1;
}

.image-item.selected .hover-actions {
  opacity: 0;
}

/* 图片信息 */
.image-info {
  padding: 12px;
  background: white;
}

.image-name {
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.image-size {
  font-size: 12px;
  color: #909399;
}

/* ============= 空状态样式 ============= */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #909399;
}

.empty-state i {
  font-size: 64px;
  margin-bottom: 16px;
  color: #c0c4cc;
}

.empty-state p {
  font-size: 16px;
  margin-bottom: 16px;
}

/* ============= 分页样式 ============= */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

/* ============= 底部样式 ============= */
.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #fafafa;
  border-top: 1px solid #ebeef5;
  border-radius: 0 0 12px 12px;
}

.footer-info {
  flex: 1;
}

.selection-summary {
  color: #409eff;
  font-weight: 500;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

.footer-actions .el-button {
  min-width: 100px;
}

/* ============= 响应式设计 ============= */
@media (max-width: 768px) {
  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }

  .preview-item {
    width: 80px;
    height: 80px;
  }

  .image-selector-dialog .el-dialog {
    width: 95% !important;
    margin: 5vh auto;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

/* ============= 动画效果 ============= */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.image-item {
  animation: fadeIn 0.3s ease;
}

/* ============= 滚动条样式 ============= */
.el-dialog__body::-webkit-scrollbar {
  width: 6px;
}

.el-dialog__body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.el-dialog__body::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.el-dialog__body::-webkit-scrollbar-thumb:hover {
  background: #909399;
}
</style>
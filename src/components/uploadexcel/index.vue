<template>
  <div>
    <!-- 隐藏的el-upload组件 -->
    <el-upload
      :action="uploadUrl"
      :headers="{ 'x-token': token }"
      :data="data"
      ref="upload"
      :limit="1"
      :multiple="false"
      :show-file-list="false"
      style="display: none"
      :on-success="handleSuccess"
      :on-error="handleError"
      accept=".xls, .xlsx"
    ></el-upload>
  </div>
</template>

<script>
const path = process.env.VUE_APP_BASE_API;
import { mapGetters } from "vuex";
export default {
  props: {
    action: {
      type: String,
      default: "",
    },
    // 额外的GET参数
    extraParams: {
      type: Object,
      default: () => ({}),
    },
    // 自定义上传路径，如果不提供则使用默认路径
    customUploadUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      path: path,
      data: {
        action: this.action,
      },
    };
  },
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
    // 构建完整的上传URL，包含额外的GET参数
    uploadUrl() {
      let baseUrl = this.customUploadUrl || `${this.path}/common/uploadexcel`;
      
      // 如果有额外的GET参数，将其添加到URL中
      if (this.extraParams && Object.keys(this.extraParams).length > 0) {
        const params = new URLSearchParams();
        Object.keys(this.extraParams).forEach(key => {
          if (this.extraParams[key] !== undefined && this.extraParams[key] !== null) {
            params.append(key, this.extraParams[key]);
          }
        });
        
        const paramString = params.toString();
        if (paramString) {
          baseUrl += (baseUrl.includes('?') ? '&' : '?') + paramString;
        }
      }
      
      return baseUrl;
    },
  },
  methods: {
    // 公开方法，用于外部调用以触发文件选择对话框
    chooseFile() {
      this.$refs["upload"].$refs["upload-inner"].handleClick();
    },
    handleSuccess(response) {
      this.$refs.upload.clearFiles();

      if (response.code != 0) {
        this.$message.error(response.msg);
        return;
      }
      this.$message.success("上传成功");
    },
    handleError(response, file) {
      this.$refs.upload.clearFiles();

      console.log(response, file, "handleError");
      this.$message.error("上传失败");
    },
  },
};
</script>

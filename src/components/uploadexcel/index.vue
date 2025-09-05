<template>
  <div>
    <!-- 隐藏的el-upload组件 -->
    <el-upload
      :action="`${path}/common/uploadexcel`"
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
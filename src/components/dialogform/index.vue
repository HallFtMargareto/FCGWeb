<template>
  <el-dialog :close-on-click-modal="outClickClose" :visible.sync="computedVisible" :title="dialogTitle" :width="width"
    @close="handleClose">
    <el-form :model="formDatas" :rules="formRule" ref="formRef" size="mini" :label-position="labelPosition"
      :label-width="labelWidth">
      <slot></slot>
      <!-- Allow dynamic content injection -->
    </el-form>
    <div class="dialog-footer" slot="footer" v-if="visfooter">
      <el-button @click="handleClose">取消</el-button>
      <el-button @click="confirmDialog" type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "DialogComponent",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: "Dialog Title",
    },
    formDatas: {
      type: Object,
    },
    formRule: {
      type: Object,
    },
    width: {
      type: String,
      default: "25%",
    },
    labelPosition: {
      type: String,
      default: "right",
    },
    labelWidth: {
      type: String,
      default: "100px",
    },
    //点击外部关闭弹窗
    outClickClose: {
      type: Boolean,
      default: true,
    },
    visfooter: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    // 使用计算属性来处理 visible 的值
    computedVisible: {
      get() {
        return this.visible;
      },
      set(newVal) {
        this.$emit("update:visible", newVal); // 触发父组件更新
      },
    },
  },
  methods: {
    // 提供一个方法用于触发验证
    validate(callback) {
      this.$refs.formRef.validate(callback);
    },
    async confirmDialog() {
      // const valid = await new Promise((resolve) => {
      //   this.$refs.formRef.validate((valid) => {
      //     resolve(valid);
      //   });
      // });
      // if (!valid) {
      //   this.$message({
      //     type: "error",
      //     message: "请填写正确数据",
      //   });
      //   return false;
      // }
      // this.$emit("confirm", this.formDatas);
      // this.handleClose();

      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$emit("confirm", this.formDatas);
        } else {
          this.$message.error("请填写正确数据");
          return false;
        }
      });
    },
    openDialog() { },
    handleClose() {
      this.$refs.formRef.resetFields();
      this.computedVisible = false;
    },
  },
};
</script>

<style scoped></style>
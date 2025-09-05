<template>
  <div>
    <el-form
      ref="elForm"
      :model="passSetting"
      :rules="rules"
      size="medium"
      label-width="100px"
    >
      <el-row type="flex" align="top">
        <el-col :span="12">
          <el-row>
            <el-form-item label="当前密码" prop="currentPassword">
              <el-input
                v-model="passSetting.currentPassword"
                placeholder="请输入当前密码"
                clearable
                show-password
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="passSetting.newPassword"
                placeholder="请输入新密码"
                clearable
                show-password
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
            <el-form-item size="large">
              <el-button @click="resetForm">重置</el-button>
              <el-button type="primary" @click="submitForm">提交</el-button>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
  
  <script>
import { changePassword } from "@/api/admin";
import { mapGetters } from "vuex";
export default {
  name: "PasswordSettingForm", // 给组件一个名称
  data() {
    return {
      passSetting: {
        currentPassword: undefined,
        newPassword: undefined,
      },
      rules: {
        currentPassword: [
          {
            required: true,
            message: "请输入当前密码",
            trigger: "blur",
          },
        ],
        newPassword: [
          {
            required: true,
            message: "请输入新密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
  },
  methods: {
    submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) {
          return;
        }
        changePassword({
          username: this.userInfo.userName,
          password: this.passSetting.currentPassword,
          newPassword: this.passSetting.newPassword,
        }).then((res) => {
          if (res.code == 0) {
            this.$message.success("修改密码成功！");
            this.resetForm();
          }
          this.showPassword = false;
        });
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
  },
};
</script>
  
<style scoped>
/* 可以在这里添加特定于该组件的样式 */
</style>
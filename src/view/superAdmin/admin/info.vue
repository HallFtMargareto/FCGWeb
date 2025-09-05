<template>
  <div>
    <el-form
      ref="elForm"
      :model="formSettings"
      :rules="rules"
      size="medium"
      label-width="100px"
    >
      <el-row type="flex" align="top">
        <el-col :span="12">
          <el-row>
            <el-form-item label="头像" prop="avatar">
              <selectimg
                :value="image_list"
                :show.sync="show_imgc"
                :limit="1"
                :showchoose="true"
              ></selectimg>
              <el-button
                size="small"
                type="primary"
                icon="el-icon-upload"
                @click="show_imgc = !show_imgc"
                >选择图片</el-button
              >
            </el-form-item>
            <el-form-item label="姓名" prop="display_name">
              <el-input
                v-model="formSettings.display_name"
                placeholder="请输入姓名"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="formSettings.email"
                placeholder="请输入邮箱"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input
                v-model="formSettings.phone"
                placeholder="请输入手机号码"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="formSettings.gender" size="medium">
                <el-radio
                  v-for="(item, index) in genderOptions"
                  :key="index"
                  :label="item.value"
                  :disabled="item.disabled"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item label="联系地址" prop="address">
              <el-input
                v-model="formSettings.address"
                type="textarea"
                placeholder="请输入联系地址"
                :autosize="{ minRows: 4, maxRows: 4 }"
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
import selectimg from "@/components/selectimg";
import { setUserInfo, getLoginInfo } from "@/api/admin";
export default {
  name: "UserFormComponent",
  props: [],
  components: {
    selectimg,
  },
  data() {
    return {
      show_imgc: false,
      image_list: [],
      formSettings: {
        avatar: undefined,
        display_name: undefined,
        email: undefined,
        phone: undefined,
        gender: 0,
        address: undefined,
      },
      rules: {
        display_name: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],
        "email.email": [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号码",
            trigger: "blur",
          },
        ],
        gender: [
          {
            required: true,
            message: "性别不能为空",
            trigger: "change",
          },
        ],
        address: [
          {
            required: true,
            message: "请输入联系地址",
            trigger: "blur",
          },
        ],
      },
      genderOptions: [
        {
          label: "男",
          value: 1,
        },
        {
          label: "女",
          value: 2,
        },
        {
          label: "保密",
          value: 0,
        },
      ],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getinfo();
  },
  mounted() {},
  methods: {
    async submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;

        if (this.image_list.length > 0) {
          this.formSettings.avatar = this.image_list[0].fullurl;
        }
        let res = setUserInfo(this.formSettings, {
          key: "user_info_setting",
        });
        res.then((res) => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: "保存成功",
              showClose: true,
            });
          }
        });
      });
    },
    async getinfo() {
      let res = await getLoginInfo();
      this.formSettings = res.data.userInfo;
      if (this.formSettings.avatar != "") {
        this.image_list.push({ fullurl: this.formSettings.avatar });
      }
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
  },
};
</script>
  
  <style>
.el-upload__tip {
  line-height: 1.2;
}
</style>
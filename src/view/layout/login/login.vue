<template>
  <div id="userLayout" class="user-layout-wrapper">
    <div class="container" v-if="oldLogin">
      <!-- :class="{ mb: mobile }" -->
      <div>
        <div class="top">
          <div class="header">
            <a href="/">
              <!-- <img src="~@/assets/logo.png" class="logo" alt="logo" /> -->
              <span class="title">系统登录</span>
            </a>
          </div>
        </div>
        <div class="main">
          <el-form
            :model="loginForm"
            :rules="rules"
            ref="loginForm"
            @keyup.enter.native="submitForm"
          >
            <el-form-item prop="username">
              <el-input placeholder="请输入用户名" v-model="loginForm.username">
                <i class="el-input__icon el-icon-user" slot="suffix"></i
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                :type="lock === 'lock' ? 'password' : 'text'"
                placeholder="请输入密码"
                v-model="loginForm.password"
              >
                <i
                  :class="'el-input__icon el-icon-' + lock"
                  @click="changeLock"
                  slot="suffix"
                ></i>
              </el-input>
            </el-form-item>
            <el-form-item style="position: relative">
              <el-input
                v-model="loginForm.captcha"
                name="logVerify"
                placeholder="请输入验证码"
                style="width: 60%"
              />
              <div class="vPic">
                <img
                  v-if="picPath"
                  :src="picPath"
                  width="100%"
                  height="100%"
                  alt="请输入验证码"
                  @click="loginVefify()"
                />
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm" style="width: 100%"
                >登 录</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { captcha, getOauthLink } from "@/api/base";
export default {
  name: "Login",
  data() {
    const checkUsername = (rule, value, callback) => {
      if (value.length < 1 || value.length > 32) {
        return callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const checkPassword = (rule, value, callback) => {
      if (value.length < 2 || value.length > 32) {
        return callback(new Error("请输入正确的密码"));
      } else {
        callback();
      }
    };
    return {
      mobile: false,
      curYear: 0,
      lock: "lock",
      loginForm: {
        username: "",
        password: "",
        captcha: "",
        captchaId: "",
      },
      rules: {
        username: [{ validator: checkUsername, trigger: "blur" }],
        password: [{ validator: checkPassword, trigger: "blur" }],
      },
      logVerify: "",
      picPath: "",
      oldLogin: false,
    };
  },
  created() {
    // 判断是否为第三方登录
    const code = this.$route.query.code;
    if (code != undefined && code != "") {
      const state = this.$route.query.state;
      const result = this.OauthLogin(code, state);
      result.then((res) => {
        if (!res) {
          this.$message({
            type: "error",
            message: "第三方登录失败",
            showClose: true,
          });
          this.oldLogin = true;
        }
      });
      console.log(result);
    } else {
      this.getOauthLink();
    }

    if (this.oldLogin) {
      // 原有登录方式
      this.loginVefify();
      this.curYear = new Date().getFullYear();
    }

    if (
      /AppleWebKit.*Mobile/i.test(navigator.userAgent) ||
      /Android/i.test(navigator.userAgent) ||
      /BlackBerry/i.test(navigator.userAgent) ||
      /IEMobile/i.test(navigator.userAgent) ||
      /MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(
        navigator.userAgent
      )
    ) {
      this.mobile = true;
      /*
      if (/iPad/i.test(navigator.userAgent)) {
        console.log("mobile", this.mobile);
      } else {
        this.$notify({
          title: "提示",
          message:
            "平台暂不适配移动端页面， 如确定使用手机操作建议使用横屏进行操作。 竖屏无法显示完整内容",
          type: "warning",
          duration: 0,
        });
      }
      */
    }
  },
  methods: {
    ...mapActions("user", ["LoginIn", "OauthLogin"]),
    ...mapGetters("common", ["siteInfo"]),
    async login() {
      return await this.LoginIn(this.loginForm);
    },
    async submitForm() {
      this.$refs.loginForm.validate(async (v) => {
        if (v) {
          const flag = await this.login();
          if (!flag) {
            this.loginVefify();
          }
        } else {
          this.$message({
            type: "error",
            message: "请正确填写登录信息",
            showClose: true,
          });
          this.loginVefify();
          return false;
        }
      });
    },
    changeLock() {
      this.lock === "lock" ? (this.lock = "unlock") : (this.lock = "lock");
    },
    loginVefify() {
      captcha({}).then((ele) => {
        this.picPath = ele.data.picPath;
        this.loginForm.captchaId = ele.data.captchaId;
      });
    },
    getOauthLink() {
      const resp = getOauthLink({ action: "get_link" });
      resp.then((res) => {
        if (res.code == 0 && res.data.link != "") {
          window.location.href = res.data.link;
        } else {
          this.oldLogin = true;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/style/login.scss";

.mb {
  float: left;
  margin-left: 100px;
}
</style>

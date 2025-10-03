<template>
  <div>
    <el-tabs tab-position="left" @tab-click="handleTabClick" :value="activeTab">
      <el-tab-pane label="网站配置" name="site" v-if="init">
        <el-form ref="site" :model="config.site" :rules="site_rules" size="medium" label-width="150px"
          label-position="left">
          <el-col :span="12">
            <el-row class="el-row-cnf">
              <el-col :span="24">
                <el-form-item label="网站名称" prop="site_name">
                  <el-input v-model="config.site.site_name" placeholder="请输入网站名称" clearable
                    :style="{ width: '100%' }"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="网站地址" prop="site_url">
                  <el-input v-model="config.site.site_url" placeholder="请输入网站地址" clearable
                    :style="{ width: '100%' }"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="WEBSOCKET地址" prop="web_socket">
                  <el-input v-model="config.site.web_socket" placeholder="请输入WEBSOCKET地址" clearable
                    :style="{ width: '100%' }"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="网站LOGO" prop="site_logo">
                  <selectimg :limit="5" v-model="config.site.logo_action" :show.sync="show_imgc">
                  </selectimg>
                  <el-button size="small" type="primary" icon="el-icon-upload" @click="show_imgc = !show_imgc">选择图片
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="开启访问" prop="open_state">
                  <el-switch v-model="config.site.open_state"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="网站关闭提示" prop="site_remark">
                  <el-input v-model="config.site.site_remark" type="textarea" placeholder="请输入网站关闭提示"
                    :autosize="{ minRows: 4, maxRows: 4 }" :style="{ width: '100%' }"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item size="large">
                  <el-button type="primary" @click="submitForm('site')">提交</el-button>
                  <!-- <el-button @click="resetForm">重置</el-button> -->
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

        </el-form>
      </el-tab-pane>
      <el-tab-pane label="福彩配置" name="fcgame">
        <el-form ref="site" :model="config.fcgame" :rules="site_rules" size="medium" label-width="150px"
          label-position="left">
          <el-row class="el-row-cnf">
            <el-col :span="24">
              <el-form-item label="开盘时间">
                <time-range-picker :start-time.sync="config.fcgame.market_start_time"
                  :end-time.sync="config.fcgame.market_end_time">
                </time-range-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="自动开奖" prop="open_state">
                <el-switch v-model="config.fcgame.auto_award"></el-switch>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="24">
              <el-form-item label="全局状态" prop="open_state">
                <el-switch v-model="config.fcgame.global_state"></el-switch>
              </el-form-item>
            </el-col> -->
            <el-col :span="24">
              <el-form-item size="large">
                <el-button type="primary" @click="submitForm('site')">提交</el-button>
                <!-- <el-button @click="resetForm">重置</el-button> -->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="体彩配置" name="tcgame">
        <el-form ref="site" :model="config.tcgame" :rules="site_rules" size="medium" label-width="150px"
          label-position="left">
          <el-row class="el-row-cnf">
            <el-col :span="24">
              <el-form-item label="开盘时间">
                <time-range-picker :start-time.sync="config.tcgame.market_start_time"
                  :end-time.sync="config.tcgame.market_end_time">
                </time-range-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="自动开奖" prop="open_state">
                <el-switch v-model="config.tcgame.auto_award"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item size="large">
                <el-button type="primary" @click="submitForm('site')">提交</el-button>
                <!-- <el-button @click="resetForm">重置</el-button> -->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="模型配置" name="llm">
        <el-form ref="llm" :model="config.llm_model" size="medium" label-width="150px" label-position="left">
          <el-col :span="12">
            <el-row class="el-row-cnf">
              <el-col :span="24">
                <el-form-item label="API Key" prop="api_key">
                  <el-input v-model="config.llm_model.api_key" placeholder="请输入API Key" clearable
                    :style="{ width: '100%' }"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="API Key环境变量" prop="api_key_env_var">
                  <el-input v-model="config.llm_model.api_key_env_var" placeholder="请输入API Key环境变量名称" clearable
                    :style="{ width: '100%' }"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="API Base URL" prop="api_base_url">
                  <el-input v-model="config.llm_model.api_base_url" placeholder="请输入API Base URL" clearable
                    :style="{ width: '100%' }"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="模型名称" prop="model_name">
                  <el-input v-model="config.llm_model.model_name" placeholder="请输入使用的模型名称" clearable
                    :style="{ width: '100%' }"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="默认系统提示词" prop="default_system_prompt">
                  <el-input v-model="config.llm_model.default_system_prompt" type="textarea" placeholder="请输入默认系统提示词"
                    :autosize="{ minRows: 4, maxRows: 6 }" :style="{ width: '100%' }"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="最大重试次数" prop="max_retries">
                  <el-input-number v-model="config.llm_model.max_retries" :min="0" :max="10" controls-position="right"
                    :style="{ width: '100%' }"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="请求超时时间(秒)" prop="request_timeout">
                  <el-input-number v-model="config.llm_model.request_timeout" :min="1" :max="300"
                    controls-position="right" :style="{ width: '100%' }"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="Content-Type" prop="content_type">
                  <el-input v-model="config.llm_model.content_type" placeholder="请输入Content-Type" clearable
                    :style="{ width: '100%' }"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="Authorization前缀" prop="auth_prefix">
                  <el-input v-model="config.llm_model.auth_prefix" placeholder="请输入请求头Authorization前缀" clearable
                    :style="{ width: '100%' }"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="默认温度参数" prop="default_temperature">
                  <el-slider v-model="config.llm_model.default_temperature" :min="0" :max="1" :step="0.1"
                    show-input></el-slider>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="默认TopP参数" prop="default_top_p">
                  <el-slider v-model="config.llm_model.default_top_p" :min="0" :max="1" :step="0.1"
                    show-input></el-slider>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="最大Token数" prop="max_tokens">
                  <el-input-number v-model="config.llm_model.max_tokens" :min="1" :max="10000" controls-position="right"
                    :style="{ width: '100%' }"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="Response_Format" prop="response_format">
                  <el-input v-model="config.llm_model.response_format" placeholder="请输入Response_Format" clearable
                    :style="{ width: '100%' }"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="思考模式" prop="thinking_mode">
                  <el-input v-model="config.llm_model.thinking_mode" placeholder="请输入思考模式" clearable
                    :style="{ width: '100%' }"></el-input>
                  <div class="el-form-item__tip">
                    disabled：强制关闭深度思考能力，模型不输出思维链内容 <br>
                    enabled：强制开启深度思考能力，模型强制输出思维链内容。<br>
                    auto：模型自行判断是否需要进行深度思考(部分模型支持)。
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item size="large">
                  <el-button type="primary" @click="submitForm('llm')">提交</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="邮件设置" name="email">
        <el-form ref="email" :model="config.email" :rules="email_rules" size="medium" label-width="150px"
          label-position="left">
          <el-col :span="12">
            <el-row class="el-row-cnf">
              <el-col :span="24">
                <el-form-item label="SMTP服务器" prop="email_host">
                  <el-input v-model="config.email.email_host" placeholder="请输入SMTP服务器" clearable
                    :style="{ width: '100%' }"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="SMTP用户名" prop="stmp_user">
                  <el-input v-model="config.email.stmp_user" placeholder="请输入SMTP用户名" clearable
                    :style="{ width: '100%' }"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="SMTP密码" prop="stmp_pwd">
                  <el-input v-model="config.email.stmp_pwd" placeholder="请输入SMTP密码" clearable
                    :style="{ width: '100%' }"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="端口" prop="email_port">
                  <el-input v-model="config.email.email_port" placeholder="请输入端口" clearable
                    :style="{ width: '100%' }"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="发件人名称" prop="send_name">
                  <el-input v-model="config.email.send_name" placeholder="请输入发件人名称" clearable
                    :style="{ width: '100%' }"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="管理员邮箱" prop="admin_email">
                  <el-input v-model="config.email.admin_email" placeholder="请输入管理员邮箱" clearable
                    :style="{ width: '100%' }"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="状态" prop="state" required>
                  <el-switch v-model="config.email.state"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item size="large">
                  <el-button type="primary" @click="submitForm('email')">提交</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="充值设置" name="charge">
        <el-form ref="charge" :model="config.charge" size="medium" label-width="150px" label-position="left">
          <el-col :span="12">
            <el-row class="el-row-cnf">
              <el-col :span="24">
                <el-form-item label="允许转网提交" prop="transfer_state">
                  <el-switch v-model="config.charge.transfer_state"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="校验IP" prop="valid_ip">
                  <el-switch v-model="config.charge.valid_ip"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="API超时时间" prop="max_req_time_out">
                  <el-input v-model="config.charge.max_req_time_out" placeholder="超时时间,单位秒" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item size="large">
                  <el-button type="primary" @click="submitForm('charge')">提交</el-button>
                  <!-- <el-button @click="resetForm">重置</el-button> -->
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="系统信息" name="info">
        <Info ref="info" class="tab_content"></Info>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>

import Info from "./info.vue";
import { getSystemConfig, setSystemConfig } from "@/api/system";
import TimeRangePicker from "@/components/timepicker";

export default {
  components: {
    Info,
    TimeRangePicker,
  },
  data() {
    return {
      init: false,
      value1: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      show_imgc: false,
      image_list: [],
      load: false,
      tabPosition: "left",
      activeTab: "site",
      config: {},
      site_rules: {
        site_name: [
          {
            required: true,
            message: "请输入网站名称",
            trigger: "blur",
          },
        ],
      },
      email_rules: {
        email_host: [
          {
            required: true,
            message: "请输入SMTP服务器",
            trigger: "blur",
          },
        ],
        stmp_user: [
          {
            required: true,
            message: "请输入SMTP用户名",
            trigger: "blur",
          },
        ],
        stmp_pwd: [
          {
            required: true,
            message: "请输入SMTP密码",
            trigger: "blur",
          },
        ],
        email_port: [
          {
            required: true,
            message: "请输入端口",
            trigger: "blur",
          },
        ],
        send_name: [
          {
            required: true,
            message: "请输入发件人名称",
            trigger: "blur",
          },
        ],
        admin_email: [
          {
            required: true,
            message: "请输入管理员邮箱",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    // this.$refs.config.sites.fetchData();
  },
  methods: {
    handleTabClick() {
      // const activeTabName = tab.name;
    },
    submitForm(key) {
      this.$refs[key].validate((valid) => {
        if (!valid) return;
        // TODO 提交表单
        console.log(this.config)
        let res = setSystemConfig(this.config);
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
    site_logoBeforeUpload(file) {
      const isRightSize = file.size / 1024 / 1024 < 2;
      if (!isRightSize) {
        this.$message.error("文件大小超过 2MB");
      }
      return isRightSize;
    },
  },
  async created() {
    let res = await getSystemConfig({ key: "" });
    if (res.data && res.data.config) {
      this.config = { ...this.config, ...res.data.config }; // 合并默认值与接口返回值
    }

    if (this.config.site.logo_action != "") {
      this.image_list.push({ fullurl: this.config.site.logo_action });
    }
    this.init = true;
  },
};
</script>

<style scoped>
.el-tabs__header {
  margin-left: 50px !important;
}

.el-row-cnf {
  /* padding-left: 20px; */
  margin-left: 50px
}
</style>
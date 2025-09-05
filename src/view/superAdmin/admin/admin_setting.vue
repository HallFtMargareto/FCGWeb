<template>
  <div>
    <el-tabs tab-position="left">
      <el-tab-pane label="基本信息">
        <InfoSettings class="tab_content"></InfoSettings>
      </el-tab-pane>
      <el-tab-pane label="修改密码">
        <PassSettings class="tab_content"></PassSettings>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import InfoSettings from "./info.vue";
import PassSettings from "./pass.vue";

export default {
  components: {
    InfoSettings,
    PassSettings,
  },
  data() {
    return {
      tabPosition: "left",
    };
  },
};
</script>
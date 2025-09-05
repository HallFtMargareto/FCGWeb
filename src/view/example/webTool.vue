<template>
  <div id="editor">
    <!-- 工具栏 -->
    <el-button
      icon="el-icon-delete"
      style="position: absolute; right: 2%"
      @click="clear"
    ></el-button>

    <div style="margin-bottom: 1rem">
      <el-radio-group v-model="radio" @change="change">
        <el-radio-button label="MD5"></el-radio-button>
        <el-radio-button label="SHA1"></el-radio-button>
        <el-radio-button label="SHA256"></el-radio-button>
        <el-radio-button label="SHA512"></el-radio-button>
        <el-radio-button label="BASE64-DE"></el-radio-button>
        <el-radio-button label="BASE64-EN"></el-radio-button>
        <el-radio-button label="TIME"></el-radio-button>
      </el-radio-group>
    </div>

    <div style="margin-bottom: 1rem">
      <el-radio-group v-model="localRadio" @change="localChange">
        <el-radio-button label="JSON-FORMAT"></el-radio-button>
      </el-radio-group>
    </div>

    <!-- subfield	Boolean	true	true： 双栏(编辑预览同屏)， false： 单栏(编辑预览分屏) -->
    <!-- placeholder	String	开始编辑...	输入框为空时默认提示文本 -->
    <!-- shortCut	Boolean	true	是否启用快捷键 -->
    <!-- autofocus	Boolean	true	自动聚焦到文本框 -->
    <mavon-editor
      v-model="content"
      :subfield="false"
      :placeholder="placeholder"
      :shortCut="true"
      :autofocus="true"
      @change="change"
      style="height: 100%"
    ></mavon-editor>
    <p v-if="length > 0" class="font_length">
      当前文字数量
      <strong class="font_length__strong">{{ this.length }}</strong>
    </p>

    <div>
      <p class="result_list" :key="index" v-for="(rs, index) in result">
        {{ rs }}
      </p>
    </div>

    <!-- vue-json-pretty -->
    <el-dialog
      :before-close="closeDialog"
      :visible.sync="dialogFormVisible"
      title="JSON-PRETTY"
    >
      <el-form label-position="right" label-width="80px">
        <vue-json-pretty
          :deep="5"
          :show-line="true"
          :path="'res'"
          :data="jsonData"
        ></vue-json-pretty>
      </el-form>

      <div class="dialog-footer" slot="footer">
        <el-button @click="closeDialog" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// https://github.com/hinesboy/mavonEditor
// Local Registration
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";

//vue-json-pretty
//https://github.com/leezng/vue-json-pretty
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

export default {
  name: "editor",
  data() {
    return {
      dialogFormVisible: false,
      placeholder: "...",
      length: 0,
      content: "",

      //第一项工具栏
      radio: "",
      encryptType: "",
      result: [],

      //第二项工具栏
      localRadio: "",
      jsonData: {},
    };
  },
  watch: {
    content: function (val) {
      if (val.length == 0) {
        this.clear();
      }
    },
  },
  components: {
    mavonEditor,
    VueJsonPretty,
  },
  methods: {
    change() {
      if (this.content == "") {
        this.clear();
        return;
      }

      if (this.radio != "") {
        this.encryptChange();
      }
    },
    async encryptChange() {
      // const params = {
      //   type: this.radio,
      //   content: this.content,
      // };
      // const res = await encryptContent(params);
      // if (res.code !== 0) {
      //   this.$message({
      //     type: "error",
      //     message: res.msg,
      //   });
      // }
      // this.result = res.data.content;
    },
    localChange() {
      if (this.content == "") {
        this.localRadio = "";
        return;
      }

      if (this.localRadio == "JSON-FORMAT") {
        this.jsonData = JSON.parse(this.content);
        this.openDialog();
      }
    },
    //弹窗控制
    closeDialog() {
      this.localRadio = "";
      this.dialogFormVisible = false;
    },
    openDialog() {
      this.dialogFormVisible = true;
    },
    clear() {
      this.radio = "";
      this.encryptType = "";
      this.result = [];
      this.content = "";
      this.length = 0;

      this.localRadio = "";
      this.jsonData = {};
    },
  },
  created() {
    //this.$store.dispatch("product/updateProductList");
    // console.log(this.$store.state.product.productTypeList);
    // console.log("getters", this.$store.getters["product/getProdTypeList"]);
  },
};
</script>
<style scoped>
#editor {
  margin: auto;
  width: 100%;
  height: 480px;
}

.result_list {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 1rem 0;
}

.font_length {
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #999;
}
</style>

<template>
  <el-dialog
    title="导入订单"
    :visible.sync="visible"
    width="50%"
    top="10vh"
  >
    <el-form label-width="100px">
      <el-form-item label="选择会话" required>
        <el-select
          v-model="uploadExtraParams.contactId"
          placeholder="请选择会话"
          style="width: 100%"
          filterable
        >
          <el-option
            v-for="item in contactList"
            :key="item.ID"
            :label="item.nick_name || item.user_name"
            :value="item.ID"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="选择文件">
        <el-button @click="loadFile" icon="el-icon-sell">导入</el-button>
      </el-form-item>

      <uploadexcel
        ref="uploadexcel"
        action="FcgMessage"
        :extraParams="uploadExtraParams"
      ></uploadexcel>
    </el-form>
  </el-dialog>
</template>

<script>
import { getFcgContactList } from "@/api/fcgame/fcg_contact.js";

export default {
  name: "ImportOrderDialog",
  props: {
    // 控制弹窗显示/隐藏
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadExtraParams: {
        contactId: "", // 选中的会话ID
      },
      contactList: [], // 会话数据列表
    };
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
  methods: {
    // 打开弹窗并加载数据
    async open() {
      await this.loadContactList();
      this.visible = true;
    },
    
    // 加载文件
    loadFile() {
      this.$refs.uploadexcel.chooseFile();
    },
    
    // 加载会话数据列表
    async loadContactList() {
      try {
        const res = await getFcgContactList({ state: 1, pageSize: 10000 });
        if (res.code === 0) {
          this.contactList = res.data.list || [];
        } else {
          this.$message.error("获取会话数据失败");
        }
      } catch (error) {
        console.error("获取会话数据异常:", error);
        this.$message.error("获取会话数据异常");
      }
    },
  },
};
</script>

<style scoped>
/* 导入订单弹窗样式可以在这里添加 */
</style>
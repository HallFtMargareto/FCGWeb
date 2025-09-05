<template>
  <div>
    <div class="clearflex" style="margin: 18px 0">
      <el-button @click="all(true)" class="fl-left" size="small"
        >全选</el-button
      >
      <el-button @click="all(false)" class="fl-left" size="small"
        >全部取消</el-button
      >

      <el-button @click="uproles" class="fl-right" size="small" type="primary"
        >更新</el-button
      >
    </div>

    <div class="cbx">
      <el-checkbox
        v-for="item in pems"
        :label="item.describe"
        :key="item.id"
        v-model="item.accept"
      ></el-checkbox>
    </div>
  </div>
</template>
<script>
import {
  getSysAdminPermissionList,
  batchSysAdminPermissionOperation,
} from "@/api/sysAdminPermission";
import { mapGetters } from "vuex";
export default {
  name: "Datas",
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
  },
  data() {
    return {
      authoritys: [],
      dataAuthorityId: [],
      needConfirm: false,
      pems: [],
    };
  },
  props: {
    row: {
      default: function () {
        return {};
      },
      type: Object,
    },
  },
  methods: {
    enterAndNext() {
      this.uproles();
    },
    async uproles() {
      const res = await batchSysAdminPermissionOperation({
        ids: [],
        command: "uproles",
        list: this.pems,
        role: this.row.role,
      });
      if (res.code == 0) {
        this.$message({ type: "success", message: "资源设置成功" });
      }
    },
    all(state) {
      this.pems.forEach((element, index) => {
        this.pems[index].accept = state;
      });
    },
  },
  async created() {
    const param = {};
    param.page = 1;
    param.pageSize = 1000;
    param.role = this.row.role;
    const res = await getSysAdminPermissionList(param);
    if (res.code == 0) {
      this.pems = res.data.list;
    }
  },
};
</script>
<style lang="less">
</style>

<style scoped>
.cbx .el-checkbox {
  display: block;
  height: 30px;
}
</style>
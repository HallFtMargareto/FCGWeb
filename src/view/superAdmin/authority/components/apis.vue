<template>
  <div>
    <div class="clearflex" style="margin-bottom: 20px">
      <el-button-group>
        <el-button @click="expandAll">全部展开</el-button>
        <el-button @click="collapseAll">全部折叠</el-button>
        <el-button @click="selectAll">全选</el-button>
        <el-button @click="clearAll">取消全选</el-button>
      </el-button-group>

      <el-button
        @click="authApiEnter"
        class="fl-right"
        size="small"
        type="primary"
        >确 定</el-button
      >
    </div>
    <el-tree
      :data="apis"
      :default-checked-keys="apiTreeIds"
      :props="apiDefaultProps"
      @check="nodeChange"
      :default-expand-all="false"
      highlight-current
      node-key="ID"
      ref="apiTree"
      show-checkbox
    ></el-tree>
  </div>
</template>
<script>
import { UpdateCasbin, getPolicyPathByAuthorityId } from "@/api/casbin";
export default {
  name: "Apis",
  props: {
    row: {
      default: function () {
        return {};
      },
      type: Object,
    },
    apis: {
      default: function () {
        return [];
      },
      type: Array,
    },
  },
  data() {
    return {
      apiTreeData: [],
      apiTreeIds: [],
      needConfirm: false,
      apiDefaultProps: {
        children: "children",
        label: "apiGroup",
      },
      expandedKeys: [],
    };
  },
  methods: {
    nodeChange() {
      this.needConfirm = true;
    },
    // 暴露给外层使用的切换拦截统一方法
    enterAndNext() {
      this.authApiEnter();
    },
    // 创建api树方法
    buildApiTree(apis) {
      const apiObj = new Object();
      apis.map((item) => {
        // item.onlyId = "p:" + item.path + "m:" + item.method;
        if (Object.prototype.hasOwnProperty.call(apiObj, item.apiGroup)) {
          apiObj[item.apiGroup].push(item);
        } else {
          Object.assign(apiObj, { [item.apiGroup]: [item] });
        }
      });
      const apiTree = [];
      for (const key in apiObj) {
        const treeNode = {
          ID: key,
          description: key,
          children: apiObj[key],
        };
        apiTree.push(treeNode);
      }
      return apiTree;
    },
    // 关联关系确定
    async authApiEnter() {
      const checkArr = this.$refs.apiTree.getCheckedNodes(true);
      var checkIds = [];
      checkArr.map((item) => {
        checkIds.push(item.ID);
      });
      console.log(checkArr);
      console.log(checkIds);

      const res = await UpdateCasbin({
        authorityId: this.activeUserId,
        checkIds,
      });
      if (res.code == 0) {
        this.$message({ type: "success", message: "api设置成功" });
      }
      return;
    },
    selectAll() {
      this.$refs.apiTree.setCheckedNodes(this.apis);
    },
    // 取消全选
    clearAll() {
      this.$refs.apiTree.setCheckedNodes([]);
    },
    // 全部展开
    expandAll() {
      for (var i = 0; i < this.$refs.apiTree.store._getAllNodes().length; i++) {
        this.$refs.apiTree.store._getAllNodes()[i].expanded = true;
      }
    },
    // 全部折叠
    collapseAll() {
      for (var i = 0; i < this.$refs.apiTree.store._getAllNodes().length; i++) {
        this.$refs.apiTree.store._getAllNodes()[i].expanded = false;
      }
    },
  },
  async created() {
    const res = await getPolicyPathByAuthorityId({
      authorityId: this.row.authorityId,
    });
    this.activeUserId = this.row.authorityId;
    this.apiTreeIds = res.data.ids;
  },
};
</script>
<style lang="scss">
</style>
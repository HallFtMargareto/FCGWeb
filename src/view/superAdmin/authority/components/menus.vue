<template>
  <div>
    <div class="clearflex" style="margin-bottom: 20px">
      <el-button-group>
        <el-button @click="expandAll">全部展开</el-button>
        <el-button @click="collapseAll">全部折叠</el-button>
        <el-button @click="selectAll">全选</el-button>
        <el-button @click="clearAll">取消全选</el-button>
      </el-button-group>

      <el-button @click="relation" class="fl-right" size="small" type="primary"
        >确 定</el-button
      >
    </div>
    <el-tree
      :data="menuTreeData"
      :default-checked-keys="menuTreeIds"
      :default-expanded-keys="menuparentIds"
      :props="menuDefaultProps"
      @check="nodeChange"
      :default-expand-all="expand"
      highlight-current
      node-key="ID"
      ref="menuTree"
      show-checkbox
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            :style="{
              color: row.defaultRouter == data.name ? '#E6A23C' : '#85ce61',
            }"
            :disabled="!node.checked"
            @click="() => setDefault(data)"
          >
            {{ row.defaultRouter == data.name ? "首页" : "设为首页" }}
          </el-button>
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
import { getMenuAuthority, addMenuAuthority } from "@/api/menu";
import { updateAuthority } from "@/api/authority";
export default {
  name: "Menus",
  props: {
    row: {
      default: function () {
        return {};
      },
      type: Object,
    },
    menuTreeData: {
      default: function () {
        return [];
      },
      type: Array,
    },
  },
  data() {
    return {
      menuparentIds: [],
      menuTreeIds: [],
      needConfirm: false,
      expand: false,
      menuDefaultProps: {
        children: "children",
        label: function (data) {
          return data.meta.title;
        },
      },
    };
  },
  methods: {
    async setDefault(data) {
      const res = await updateAuthority({
        authorityId: this.row.authorityId,
        AuthorityName: this.row.authorityName,
        parentId: this.row.parentId,
        defaultRouter: data.name,
      });
      if (res.code == 0) {
        this.$message({ type: "success", message: "设置成功" });
        this.row.defaultRouter = res.data.authority.defaultRouter;
      }
    },
    nodeChange() {
      this.needConfirm = true;
    },
    // 暴露给外层使用的切换拦截统一方法
    enterAndNext() {
      this.relation();
    },
    // 关联树 确认方法
    async relation() {
      const checkArr = this.$refs.menuTree.getCheckedNodes(false, true);
      const res = await addMenuAuthority({
        menus: checkArr,
        authorityId: this.row.authorityId,
      });
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: "菜单设置成功!",
        });
      }
    },
    selectAll() {
      this.$refs.menuTree.setCheckedNodes(this.menuTreeData);
    },
    // 取消全选
    clearAll() {
      this.$refs.menuTree.setCheckedNodes([]);
    },
    // 全部展开
    expandAll() {
      for (
        var i = 0;
        i < this.$refs.menuTree.store._getAllNodes().length;
        i++
      ) {
        this.$refs.menuTree.store._getAllNodes()[i].expanded = true;
      }
    },
    // 全部折叠
    collapseAll() {
      for (
        var i = 0;
        i < this.$refs.menuTree.store._getAllNodes().length;
        i++
      ) {
        this.$refs.menuTree.store._getAllNodes()[i].expanded = false;
      }
    },
  },
  async created() {
    const res1 = await getMenuAuthority({ authorityId: this.row.authorityId });
    const menus = res1.data.menus;
    if (menus == null) {
      return;
    }
    const arr = [];
    menus.map((item) => {
      //父级节点
      this.menuparentIds.push(Number(item.ID));

      //默认选中子节点
      if (item.children != null && item.children.length > 0) {
        item.children.map((child) => {
          arr.push(Number(child.ID));
        });
      } else {
        arr.push(Number(item.ID));
      }
    });
    this.menuTreeIds = arr;
  },
};
</script>
<style lang="scss">
</style>
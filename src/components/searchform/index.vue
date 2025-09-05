<template>
  <el-form
    ref="form"
    class="demo-form-inline"
    :inline="true"
    :label-width="labelWidth"
    :size="size"
    label-position="right"
  >
    <div id="searchFilter">
      <slot></slot>

      <el-form-item label=" ">
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="text" @click="shiftCollapsiable">
          <span>
            {{ fold ? "展开" : "收起" }}
            <i :class="fold ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
          </span>
        </el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
export default {
  name: "SearchFilter",
  props: {
    maxShow: {
      type: Number,
      default: 3,
    },
    labelWidth: {
      type: String,
      default: "120px",
    },
    size: {
      type: String,
      default: "mini",
    },
  },
  data() {
    return {
      collapsiable: false,
      fold: true,
      visibleItems: [], // 控制哪些表单项是可见的
    };
  },
  mounted() {
    // 在组件挂载后，获取所有的表单项并控制显示/隐藏
    this.updateVisibleItems();
  },
  updated() {
    // 如果组件更新，重新计算显示的表单项
    this.updateVisibleItems();
  },
  methods: {
    shiftCollapsiable() {
      this.fold = !this.fold;
      this.updateVisibleItems(); // 更新显示的表单项
    },
    // 获取 DOM 元素并根据 `maxShow` 控制显示/隐藏
    updateVisibleItems() {
      const group = window.document.querySelectorAll(
        `#searchFilter .el-form-item.el-form-item--${this.size}`
      );
      const len = group.length - 1;
      // 如果 maxShow 小于元素个数，才需要处理折叠/展开
      if (this.maxShow < len) {
        this.collapsiable = true;
        // 显示前 maxShow 个项，其他项根据折叠状态决定
        group.forEach((item, index) => {
          if (index >= this.maxShow && index < len) {
            item.style.display = this.fold ? "none" : "";
          } else {
            item.style.display = "";
          }
        });
      } else {
        this.collapsiable = false;
        // 如果元素总数小于或等于 maxShow，全部显示
        group.forEach((item) => {
          item.style.display = "";
        });
      }
    },
    handleQuery() {
      this.$emit("search");
    },
    handleReset() {
      this.$bus.$emit("reload");
    },
    reload() {
      this.$nextTick(() => {
        this.updateVisibleItems(); // 重新更新显示项
      });
    },
  },
};
</script>
<template>
  <el-select
    v-model="selectedValue"
    :placeholder="placeholder"
    :size="size"
    :disabled="disabled"
    :clearable="clearable"
    :filterable="filterable"
    @change="handleChange"
    @clear="handleClear"
    @focus="handleFocus"
  >
    <el-option
      v-for="issue in issues"
      :key="issue.ID"
      :label="issue.issue_no"
      :value="issue.ID"
    >
      <span>{{ issue.issue_no }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "IssueSelect",
  props: {
    // v-model绑定的值
    value: {
      type: [Number, String],
      default: null,
    },
    // 占位符
    placeholder: {
      type: String,
      default: "请选择期号",
    },
    // 尺寸
    size: {
      type: String,
      default: "mini",
      validator: (value) => ["mini", "small", "medium"].includes(value),
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: true,
    },
    // 是否可搜索
    filterable: {
      type: Boolean,
      default: true,
    },
    // 是否自动选择第一条记录
    autoSelectFirst: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selectedValue: this.value,
      isInitialized: false,
    };
  },
  computed: {
    ...mapGetters("gameInfo", ["issues"]),
    // 获取第一条期号记录
    firstIssue() {
      return this.issues && this.issues.length > 0 ? this.issues[0] : null;
    },
    // 是否有期号数据
    hasIssues() {
      return this.issues && this.issues.length > 0;
    },
  },
  watch: {
    // 监听外部value变化
    value: {
      handler(newVal) {
        this.selectedValue = newVal;
      },
      immediate: true,
    },
    // 监听期号数据变化
    issues: {
      handler(newVal) {
        if (
          this.autoSelectFirst &&
          newVal &&
          newVal.length > 0 &&
          !this.selectedValue
        ) {
          this.selectFirstIssue();
        }
      },
      immediate: true,
    },
    // 监听选中值变化，同步到外部
    selectedValue: {
      handler(newVal) {
        this.$emit("input", newVal);
      },
      immediate: true,
    },
  },
  mounted() {
    this.initializeSelection();
  },
  methods: {
    /**
     * 初始化选择逻辑
     */
    initializeSelection() {
      // 如果已有选中值，不需要自动选择
      if (this.selectedValue) {
        this.isInitialized = true;
        return;
      }

      // 如果不自动选择第一条，直接返回
      if (!this.autoSelectFirst) {
        this.isInitialized = true;
        return;
      }

      // 如果store中已有数据，立即选择第一条
      if (this.hasIssues) {
        this.selectFirstIssue();
        this.isInitialized = true;
      } else {
        // 如果没有数据，先标记为已初始化，让watch来处理后续数据加载
        this.isInitialized = true;
      }
    },

    /**
     * 选择第一条期号记录
     */
    selectFirstIssue() {
      if (this.firstIssue) {
        this.selectedValue = this.firstIssue.ID;
        this.$emit("input", this.firstIssue.ID);
        this.$emit("change", this.firstIssue.ID, this.firstIssue);
      }
    },

    /**
     * 处理选择变化
     */
    handleChange(value) {
      const selectedIssue = this.issues.find((issue) => issue.ID === value);
      this.$emit("change", value, selectedIssue);
    },

    /**
     * 处理清空选择
     */
    handleClear() {
      this.selectedValue = null;
      this.$emit("input", null);
      this.$emit("clear");
    },

    /**
     * 处理焦点事件
     */
    handleFocus() {
      // 仅处理焦点事件，不加载数据
    },

    /**
     * 获取当前选中的期号信息
     */
    getSelectedIssue() {
      if (!this.selectedValue) return null;
      return (
        this.issues.find((issue) => issue.ID === this.selectedValue) || null
      );
    },

    /**
     * 刷新数据 - 仅重新检查现有数据
     */
    refresh() {
      if (this.autoSelectFirst && this.hasIssues && !this.selectedValue) {
        this.selectFirstIssue();
      }
    },
  },
};
</script>

<style scoped>
/* 可以根据需要添加自定义样式 */
</style>

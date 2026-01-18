<template>
  <el-select
    v-model="selectedValue"
    :placeholder="placeholder"
    :size="size"
    :disabled="disabled"
    :clearable="clearable"
    :filterable="filterable"
    :multiple="multiple"
    @change="handleChange"
    @clear="handleClear"
    @focus="handleFocus"
  >
    <el-option
      v-for="tenant in tenants"
      :key="tenant.ID"
      :label="tenant.platform_name"
      :value="tenant.ID"
    >
      <span>{{ tenant.platform_name }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TenantSelect",
  props: {
    // v-model绑定的值
    value: {
      type: [Number, String, Array],
      default: null,
    },
    // 是否启用多选
    multiple: {
      type: Boolean,
      default: false,
    },
    // 占位符
    placeholder: {
      type: String,
      default: "请选择组织",
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
      selectedValue: this.multiple ? [] : this.value,
      isInitialized: false,
    };
  },
  computed: {
    ...mapGetters("gameInfo", ["tenants"]),
    // 获取第一条租户记录
    firstTenant() {
      return this.tenants && this.tenants.length > 0 ? this.tenants[0] : null;
    },
    // 是否有租户数据
    hasTenants() {
      return this.tenants && this.tenants.length > 0;
    },
  },
  watch: {
    // 监听外部value变化
    value: {
      handler(newVal) {
        if (this.multiple) {
          // 多选模式：将逗号分隔的字符串转换为数组
          if (typeof newVal === "string" && newVal) {
            this.selectedValue = newVal
              .split(",")
              .map((id) => Number(id.trim()))
              .filter((id) => !isNaN(id));
          } else {
            this.selectedValue = [];
          }
        } else {
          // 单选模式：直接使用值
          this.selectedValue = newVal;
        }
      },
      immediate: true,
    },
    // 监听租户数据变化
    tenants: {
      handler(newVal) {
        if (
          this.autoSelectFirst &&
          newVal &&
          newVal.length > 0 &&
          !this.selectedValue
        ) {
          this.selectFirstTenant();
        }
      },
      immediate: true,
    },
    // 监听选中值变化，同步到外部
    selectedValue: {
      handler(newVal) {
        if (this.multiple) {
          // 多选模式：将数组转换为逗号分隔的字符串
          const valueStr = Array.isArray(newVal) ? newVal.join(",") : "";
          this.$emit("input", valueStr);
        } else {
          // 单选模式：直接使用值
          this.$emit("input", newVal);
        }
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
      if (this.hasTenants) {
        this.selectFirstTenant();
        this.isInitialized = true;
      } else {
        // 如果没有数据，先标记为已初始化，让watch来处理后续数据加载
        this.isInitialized = true;
      }
    },

    /**
     * 选择第一条租户记录
     */
    selectFirstTenant() {
      if (this.firstTenant) {
        if (this.multiple) {
          this.selectedValue = [this.firstTenant.ID];
          this.$emit("input", String(this.firstTenant.ID));
          this.$emit("change", String(this.firstTenant.ID), [this.firstTenant]);
        } else {
          this.selectedValue = this.firstTenant.ID;
          this.$emit("input", this.firstTenant.ID);
          this.$emit("change", this.firstTenant.ID, this.firstTenant);
        }
      }
    },

    /**
     * 处理选择变化
     */
    handleChange(value) {
      if (this.multiple) {
        // 多选模式：返回逗号分隔的ID字符串和租户数组
        const valueStr = Array.isArray(value) ? value.join(",") : "";
        const selectedTenants = value
          .map((id) => this.tenants.find((tenant) => tenant.ID === id))
          .filter(Boolean);
        this.$emit("change", valueStr, selectedTenants);
      } else {
        // 单选模式：返回单个租户
        const selectedTenant = this.tenants.find(
          (tenant) => tenant.ID === value
        );
        this.$emit("change", value, selectedTenant);
      }
    },

    /**
     * 处理清空选择
     */
    handleClear() {
      this.selectedValue = this.multiple ? [] : null;
      this.$emit("input", this.multiple ? "" : null);
      this.$emit("clear");
    },

    /**
     * 处理焦点事件
     */
    handleFocus() {
      // 仅处理焦点事件，不加载数据
    },

    /**
     * 获取当前选中的租户信息
     */
    getSelectedTenant() {
      if (!this.selectedValue) return null;

      if (this.multiple) {
        // 多选模式：返回租户数组
        if (
          !Array.isArray(this.selectedValue) ||
          this.selectedValue.length === 0
        ) {
          return [];
        }
        return this.selectedValue
          .map((id) => this.tenants.find((tenant) => tenant.ID === id))
          .filter(Boolean);
      } else {
        // 单选模式：返回单个租户
        return (
          this.tenants.find((tenant) => tenant.ID === this.selectedValue) ||
          null
        );
      }
    },

    /**
     * 刷新数据 - 仅重新检查现有数据
     */
    refresh() {
      if (this.autoSelectFirst && this.hasTenants && !this.selectedValue) {
        this.selectFirstTenant();
      }
    },
  },
};
</script>

<style scoped>
/* 可以根据需要添加自定义样式 */
</style>

<template>
  <el-select
    v-model="selectedValue"
    :placeholder="placeholder"
    :size="size"
    :disabled="disabled"
    :clearable="clearable"
    :filterable="filterable"
    :loading="loading"
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
      type: [Number, String],
      default: null,
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
    // 是否等待数据加载完成后再自动选择
    waitForData: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selectedValue: this.value,
      loading: false,
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
        this.selectedValue = newVal;
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
          !this.selectedValue &&
          !this.isInitialized
        ) {
          this.selectFirstTenant();
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
  async mounted() {
    await this.initializeSelection();
  },
  methods: {
    /**
     * 初始化选择逻辑
     */
    async initializeSelection() {
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
        return;
      }

      // 如果需要等待数据加载
      if (this.waitForData) {
        await this.loadTenantData();
        if (this.autoSelectFirst && this.hasTenants && !this.selectedValue) {
          this.selectFirstTenant();
        }
        this.isInitialized = true;
      } else {
        this.isInitialized = true;
      }
    },

    /**
     * 加载租户数据
     */
    async loadTenantData() {
      try {
        this.loading = true;
        await this.$store.dispatch("gameInfo/fetchGameInfo");
      } catch (error) {
        console.error("加载租户数据失败:", error);
        this.$message.error("加载组织数据失败");
      } finally {
        this.loading = false;
      }
    },

    /**
     * 选择第一条租户记录
     */
    selectFirstTenant() {
      if (this.firstTenant) {
        this.selectedValue = this.firstTenant.ID;
        this.$emit("input", this.firstTenant.ID);
        this.$emit("change", this.firstTenant.ID, this.firstTenant);
      }
    },

    /**
     * 处理选择变化
     */
    handleChange(value) {
      const selectedTenant = this.tenants.find((tenant) => tenant.ID === value);
      this.$emit("change", value, selectedTenant);
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
    async handleFocus() {
      // 如果没有数据且不在加载中，尝试加载数据
      if (!this.hasTenants && !this.loading && this.waitForData) {
        await this.loadTenantData();
      }
    },

    /**
     * 获取当前选中的租户信息
     */
    getSelectedTenant() {
      if (!this.selectedValue) return null;
      return (
        this.tenants.find((tenant) => tenant.ID === this.selectedValue) || null
      );
    },

    /**
     * 刷新数据
     */
    async refresh() {
      await this.loadTenantData();
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

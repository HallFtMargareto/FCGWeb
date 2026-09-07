<template>
  <div>
    <el-select v-model="selectedValue" :placeholder="placeholder" :size="size" :disabled="disabled"
      :clearable="clearable" :filterable="filterable" :loading="loading" :multiple="multiple"
      :collapse-tags="multiple" style="width: 100%" @change="handleChange" @clear="handleClear">
      <el-option v-for="item in contactList" :key="item.ID" :label="item.nick_name" :value="item.ID" />
    </el-select>
  </div>
</template>

<script>
import { getFcgContactList } from "@/api/fcgame/fcg_contact.js";

export default {
  name: "FcgContactSelect",
  props: {
    value: {
      type: [String, Number, Array],
      default: undefined,
    },
    // 是否开启多选模式，开启后 v-model 为数组
    multiple: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "请选择会话",
    },
    size: {
      type: String,
      default: "mini",
      validator: (value) => ["mini", "small", "medium"].includes(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    filterable: {
      type: Boolean,
      default: true,
    },
    state: {
      type: [Boolean, Number, String],
      default: true,
    },
    pageSize: {
      type: Number,
      default: 10000,
    },
    tenantId: {
      type: [String, Number],
      default: undefined,
    },
    tenantIds: {
      type: [Array, String],
      default: () => [],
    },
    cacheKeyPrefix: {
      type: String,
      default: "fcg_contact_list",
    },
    bypassCacheOnReload: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      loading: false,
      contactList: [],
      selectedValue: this.value,
      // 缓存上一次的 tenantSignature
      lastTenantSignature: null,
    };
  },
  computed: {
    tenantSignature() {
      if (
        this.tenantId !== undefined &&
        this.tenantId !== null &&
        this.tenantId !== ""
      ) {
        return String(this.tenantId);
      }
      // 解析并排序 tenantIds，确保相同的组合产生相同的签名
      let ids = [];
      if (Array.isArray(this.tenantIds)) {
        ids = this.tenantIds;
      } else if (typeof this.tenantIds === "string" && this.tenantIds) {
        ids = this.tenantIds
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id !== "");
      }
      if (ids.length > 0) {
        // 排序 ID，确保顺序不影响签名
        return ids.map((item) => String(item)).sort().join(",");
      }
      return "all";
    },
    normalizedTenantIds() {
      if (Array.isArray(this.tenantIds)) {
        return this.tenantIds;
      }
      if (typeof this.tenantIds === "string" && this.tenantIds) {
        return this.tenantIds
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id !== "");
      }
      return [];
    },
    cacheKey() {
      return `${this.cacheKeyPrefix}_${this.tenantSignature}`;
    },
    reloadFlagKey() {
      return `${this.cacheKeyPrefix}_reload_handled`;
    },
    requestParams() {
      const params = {
        state: this.state,
        pageSize: this.pageSize,
      };
      if (
        this.tenantId !== undefined &&
        this.tenantId !== null &&
        this.tenantId !== ""
      ) {
        params.tenant_id = this.tenantId;
      } else if (this.normalizedTenantIds.length > 0) {
        params.tenant_ids = this.normalizedTenantIds.join(",");
      }
      return params;
    },
  },
  watch: {
    value: {
      handler(newVal) {
        this.selectedValue = newVal;
      },
      immediate: true,
    },
    selectedValue(newVal) {
      this.$emit("input", newVal);
    },
    // 监听 tenantSignature 变化
    tenantSignature(newSignature) {
      // 只有当签名真正不同时才重新加载
      if (newSignature !== this.lastTenantSignature) {
        this.lastTenantSignature = newSignature;
        this.loadContactList();
      }
    },
  },
  created() {
    this.lastTenantSignature = this.tenantSignature;
    this.loadContactList();
  },
  methods: {
    handleChange(value) {
      const selectedItem = this.contactList.find((item) => item.ID === value) || null;
      this.$emit("change", value, selectedItem);
    },
    handleClear() {
      // 多选模式清空为数组，单选模式清空为 null
      this.selectedValue = this.multiple ? [] : null;
      this.$emit("clear");
    },
    shouldBypassCache() {
      if (!this.bypassCacheOnReload) {
        return false;
      }
      const [navigationEntry] = performance.getEntriesByType("navigation");
      const isReloadByEntry =
        navigationEntry && navigationEntry.type
          ? navigationEntry.type === "reload"
          : false;
      const isReloadByLegacy = performance.navigation
        ? performance.navigation.type === 1
        : false;
      const isReload = isReloadByEntry || isReloadByLegacy;
      if (!isReload) {
        return false;
      }
      if (!window.__fcgContactSelectReloadFlags) {
        window.__fcgContactSelectReloadFlags = {};
      }
      if (window.__fcgContactSelectReloadFlags[this.reloadFlagKey]) {
        return false;
      }
      window.__fcgContactSelectReloadFlags[this.reloadFlagKey] = true;
      return true;
    },
    loadContactListFromCache() {
      try {
        const cacheData = localStorage.getItem(this.cacheKey);
        if (!cacheData) {
          return null;
        }
        const parsedData = JSON.parse(cacheData);
        if (Array.isArray(parsedData)) {
          return parsedData;
        }
      } catch (error) {
        console.error("从localStorage读取会话列表失败:", error);
      }
      return null;
    },
    saveContactListToCache(list) {
      try {
        localStorage.setItem(this.cacheKey, JSON.stringify(list || []));
      } catch (error) {
        console.error("保存会话列表到localStorage失败:", error);
      }
    },
    async loadContactList() {
      const shouldBypass = this.shouldBypassCache();
      if (!shouldBypass) {
        const cachedList = this.loadContactListFromCache();
        if (Array.isArray(cachedList)) {
          this.contactList = cachedList;
          this.$emit("loaded", cachedList);
          return;
        }
      }
      this.loading = true;
      try {
        const res = await getFcgContactList(this.requestParams);
        if (res.code === 0) {
          this.contactList = res.data.list || [];
          this.saveContactListToCache(this.contactList);
          this.$emit("loaded", this.contactList);
        } else {
          this.$message.error("获取会话列表失败");
        }
      } catch (error) {
        console.error("获取会话列表异常:", error);
        this.$message.error("获取会话列表异常");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

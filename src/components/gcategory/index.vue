<template>
  <!-- 彩种选择组件 -->
  <!-- 用法：
    <gcategory v-model="selectedLotteryId" :autoSelectFirst="false" />
  -->
  <el-select
    v-model="selectedValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :size="size"
    :clearable="clearable"
    @change="handleChange"
    @input="handleInput"
  >
    <el-option
      v-for="item in lotteryOptions"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
</template>

<script>
export default {
  name: "gcategory",
  props: {
    value: {
      type: [String, Number],
      default: null,
    },
    autoSelectFirst: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "请选择彩种",
    },
    size: {
      type: String,
      default: "mini",
    },
    clearable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selectedValue: this.value,
      lotteryOptions: [
        { id: 1, name: '福彩' },
        { id: 2, name: '体彩' }
      ]
    };
  },
  created() {
    // 如果启用了自动选择第一条数据，且当前没有选中值
    if (this.autoSelectFirst && !this.selectedValue && this.lotteryOptions.length > 0) {
      this.selectedValue = this.lotteryOptions[0].id;
      this.$emit('input', this.selectedValue);
      this.$emit('change', this.selectedValue);
    }
  },
  methods: {
    handleInput(value) {
      this.$emit("input", value);
    },
    handleChange(value) {
      this.$emit("change", value);
    },
  },
  watch: {
    value(val) {
      this.selectedValue = val;
    },
  },
};
</script>

<style scoped>
/* 可以根据需要添加自定义样式 */
</style>

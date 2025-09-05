<template>
  <!-- 用法：
    <el-form-item label="注册时间2">
      //单日期 v-model数据为日期字符串
      <datepicker v-model="searchInfo.RegeistTime" type="datetime" />

      //日期范围 v-model数据为数组
      <datepicker v-model="searchInfo.StartTime" type="datetimerange" :default-time="['00:00:00', '23:59:59']"/>
    </el-form-item>
   -->
  <el-date-picker
    v-model="selectedDate"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="handleInput"
    :clearable="clearable"
    :format="format"
    :value-format="valueFormat"
    :picker-options="pickerOptions"
    :range-separator="rangeSeparator"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
    :default-time="defaultTime"
    size="mini"
  >
  </el-date-picker>
</template>



<script>
export default {
  name: "datepicker",
  props: {
    value: {
      type: [String, Date, Array],
      default: "",
    },
    type: {
      type: String,
      default: "date",
    },
    placeholder: {
      type: String,
      default: "请选择日期",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    format: {
      type: String,
    },
    valueFormat: {
      type: String,
      default: "yyyy-MM-dd HH:mm:ss",
    },
    defaultTime: {
      type: [String, Array],
      default: "",
    },
    pickerOptions: {
      type: Object,
    },
    rangeSeparator: {
      type: String,
      default: "-",
    },
    startPlaceholder: {
      type: String,
      default: "开始日期",
    },
    endPlaceholder: {
      type: String,
      default: "结束日期",
    },
  },
  data() {
    return {
      selectedDate: this.value, // 双向绑定的值
    };
  },
  methods: {
    handleInput(value) {
      this.$emit("input", value);
    },
  },
  watch: {
    value(val) {
      this.selectedDate = val;
    },
  },
};
</script>
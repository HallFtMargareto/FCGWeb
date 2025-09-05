<template>
  <el-tag :type="tagType" :size="size">
    {{ tagText }}
  </el-tag>
</template>
  
  <script>
export default {
  name: "MyTag",
  props: {
    tagState: {
      type: Boolean,
      required: true,
    },
    trueText: {
      type: String,
      default: "启用",
    },
    falseText: {
      type: String,
      default: "禁用",
    },
    size: {
      type: String,
      default: "mini",
    },
  },
  computed: {
    tagType() {
      return this.tagState ? "success" : "danger";
    },
    tagText() {
      return this.tagState ? this.trueText : this.falseText;
    },
  },
  methods: {},
};
</script>
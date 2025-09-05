<template>
  <div class="edit-cell" @click="onFieldClick">
    <el-tooltip
      v-if="!editMode && !showInput"
      :placement="toolTipPlacement"
      :open-delay="toolTipDelay"
      :content="toolTipContent"
      style="height: 100%"
    >
      <div tabindex="0">
        <slot name="content"></slot>
      </div>
    </el-tooltip>
    <!-- @keyup.enter.native="onInputExit" -->
    <el-select
      v-if="editMode || showInput"
      ref="input"
      v-model="model"
      placeholder="请选择"
      @change="onInputChange"
      @focus="onFieldClick"
      @keyup.enter.native="onInputExit"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: "sold",
  inheritAttrs: false,
  props: {
    value: {
      type: Number,
      default: 1,
    },
    toolTipContent: {
      type: String,
      default: "点击编辑",
    },
    toolTipDelay: {
      type: Number,
      default: 500,
    },
    toolTipPlacement: {
      type: String,
      default: "top-start",
    },
    showInput: {
      type: Boolean,
      default: false,
    },
    editableComponent: {
      type: String,
      default: "el-input",
    },
    closeEvent: {
      type: String,
      default: "blur",
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      editMode: false,
      options: [
        {
          value: 1,
          label: "上架",
        },
        {
          value: 0,
          label: "下架",
        },
      ],
    };
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    listeners() {
      return {
        [this.closeEvent]: this.onInputExit,
        ...this.$listeners,
      };
    },
  },
  methods: {
    onFieldClick() {
      this.editMode = true;
      this.$nextTick(() => {
        let inputRef = this.$refs.input;
        if (inputRef) {
          inputRef.focus();
        }
      });
    },
    onInputExit() {
      this.editMode = false;
      return;
    },
    onInputChange(val) {
      this.$emit("input", val);
      this.editMode = false;
      this.$emit("changeProd", this.index);
      return;
    },
  },
};
</script>
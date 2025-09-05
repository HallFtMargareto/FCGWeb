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
    <component
      v-if="editMode || showInput"
      :is="editableComponent"
      ref="input"
      @focus="onFieldClick"
      @keyup.enter.native="onInputExit"
      v-on="listeners"
      v-bind="$attrs"
      v-model="model"
    >
      <slot name="edit-component-slot"></slot>
    </component>
  </div>
</template>
<script>
export default {
  name: "editable-cell",
  inheritAttrs: false,
  props: {
    value: {
      // type: String,
      type: [String, Number],
      default: "",
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
        //[this.closeEvent]: this.onInputExit,
        [this.closeEvent]: this.onClose,
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
      this.showInput = false;
      this.$emit("changeProd", this.index);
      return;
    },
    onInputChange(val) {
      this.$emit("input", val);
    },
    onClose() {
      if (this.editMode == false) {
        return;
      }
      this.editMode = false;
      this.showInput = false;

      this.$emit("changeProd", this.index);
      return;
    },
  },
};
</script>
<template>
  <div>
    <el-form ref="dynamicForm" size="mini" label-width="60px">
      <el-row v-for="(item, index) in extend_param" :key="index" style="
          border-bottom: 1px solid #f0f0f0;
          padding: 10px 0;
          margin-bottom: 10px;
        ">
        <el-col :span="20">
          <el-form-item label="参数名">
            <el-input v-model="item.key" placeholder="请输入参数名" />
          </el-form-item>

          <el-form-item label="默认值">
            <el-input v-model="item.val" placeholder="请输入参数默认值" />
          </el-form-item>

          <el-form-item label="描述">
            <el-input type="textarea" :rows="2" v-model.trim="item.desc" clearable placeholder="请输入描述"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4" class="fr">
          <el-button type="text" @click="removeRow(index)">删除</el-button>
        </el-col>
      </el-row>

      <el-row>
        <el-button type="primary" @click="addRow">新增参数</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "DynamicForm",
  props: {
    //自定义组件，v-model 默认会绑定 value 属性，并监听 input 事件
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      extend_param: this.value,
    };
  },
  watch: {
    value: {
      handler(newVal) {
        this.extend_param = newVal;
      },
      deep: true,
    },
  },
  methods: {
    addRow() {
      this.extend_param.push({ key: "", val: "", desc: "" });

      //当子组件内部数据变化时，通过 $emit('input', newValue) 将新值传递给父组件，从而实现双向绑定
      this.$emit("input", this.extend_param);
    },
    removeRow(index) {
      this.extend_param.splice(index, 1);
      this.$emit("input", this.extend_param);
    },
  },
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 5px;
  /* 增加输入框之间的间隔 */
}

.fr {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
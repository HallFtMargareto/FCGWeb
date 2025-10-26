<template>
  <div style="padding: 20px;">
    <h2>彩种选择组件测试</h2>
    
    <div style="margin-bottom: 20px;">
      <h3>基础用法（自动选择第一条）</h3>
      <gcategory v-model="selectedLottery1" />
      <p>选中的彩种ID: {{ selectedLottery1 }}</p>
    </div>

    <div style="margin-bottom: 20px;">
      <h3>不自动选择第一条</h3>
      <gcategory v-model="selectedLottery2" :autoSelectFirst="false" />
      <p>选中的彩种ID: {{ selectedLottery2 }}</p>
    </div>

    <div style="margin-bottom: 20px;">
      <h3>禁用状态</h3>
      <gcategory v-model="selectedLottery3" :disabled="true" />
      <p>选中的彩种ID: {{ selectedLottery3 }}</p>
    </div>

    <div style="margin-bottom: 20px;">
      <h3>自定义占位符</h3>
      <gcategory v-model="selectedLottery4" 
                 placeholder="请选择您喜欢的彩种" 
                 :autoSelectFirst="false" />
      <p>选中的彩种ID: {{ selectedLottery4 }}</p>
    </div>

    <div style="margin-bottom: 20px;">
      <h3>不同尺寸</h3>
      <div style="margin-bottom: 10px;">
        <label>Mini尺寸：</label>
        <gcategory v-model="selectedLottery5" size="mini" />
      </div>
      <div style="margin-bottom: 10px;">
        <label>Small尺寸：</label>
        <gcategory v-model="selectedLottery6" size="small" />
      </div>
      <div style="margin-bottom: 10px;">
        <label>Medium尺寸：</label>
        <gcategory v-model="selectedLottery7" size="medium" />
      </div>
    </div>

    <div style="margin-bottom: 20px;">
      <h3>不可清空</h3>
      <gcategory v-model="selectedLottery8" :clearable="false" />
      <p>选中的彩种ID: {{ selectedLottery8 }}</p>
    </div>

    <div style="margin-bottom: 20px;">
      <h3>监听变化事件</h3>
      <gcategory v-model="selectedLottery9" @change="handleLotteryChange" />
      <p>选中的彩种ID: {{ selectedLottery9 }}</p>
      <p>变化日志: {{ changeLog }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'gcategory-demo',
  data() {
    return {
      selectedLottery1: null,
      selectedLottery2: null,
      selectedLottery3: 1,
      selectedLottery4: null,
      selectedLottery5: null,
      selectedLottery6: null,
      selectedLottery7: null,
      selectedLottery8: null,
      selectedLottery9: null,
      changeLog: []
    }
  },
  methods: {
    handleLotteryChange(value) {
      const timestamp = new Date().toLocaleTimeString();
      this.changeLog.push(`${timestamp}: 彩种变更为 ${value}`);
      // 保持日志最多5条
      if (this.changeLog.length > 5) {
        this.changeLog.shift();
      }
    }
  }
}
</script>

<style scoped>
h2 {
  color: #409EFF;
  margin-bottom: 20px;
}

h3 {
  color: #606266;
  margin-bottom: 10px;
}

p {
  margin: 5px 0;
  color: #909399;
}

label {
  display: inline-block;
  width: 100px;
  color: #606266;
}
</style>

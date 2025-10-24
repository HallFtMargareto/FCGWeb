# IssueSelect 期号选择组件

## 功能特性

- 🔄 自动从 Vuex store 获取期号数据
- 🎯 支持自动选择第一条记录作为默认值
- 📝 完整的 v-model 双向绑定支持
- 🔍 支持搜索过滤功能
- 🔄 响应式数据更新
- ⚡ 确保外部组件 created() 生命周期能获取到正确的 ID

## 基本用法

```vue
<template>
  <div>
    <!-- 基本使用 -->
    <issue-select v-model="selectedIssueId" />
    
    <!-- 带事件监听 -->
    <issue-select 
      v-model="selectedIssueId" 
      @change="handleIssueChange"
      placeholder="请选择期号"
    />
    
    <!-- 自定义属性 -->
    <issue-select 
      v-model="selectedIssueId" 
      size="small"
      :clearable="false"
      :auto-select-first="false"
    />
  </div>
</template>

<script>
import IssueSelect from '@/components/issues/index.vue'
import { mapGetters } from 'vuex'

export default {
  components: { IssueSelect },
  data() {
    return {
      selectedIssueId: null
    }
  },
  computed: {
    ...mapGetters("gameInfo", ["issues"])
  },
  async created() {
    // 组件会自动选择第一条记录，这里 selectedIssueId 可能已经有值了
    
    // 方案1：使用 watch 监听变化（推荐）
    // 详见下面的完整示例
    
    // 方案2：等待下一个 tick
    this.$nextTick(() => {
      if (this.selectedIssueId) {
        this.loadDataWithIssue(this.selectedIssueId)
      }
    })
  },
  methods: {
    handleIssueChange(issueId, issue) {
      console.log('选中的期号ID:', issueId)
      console.log('选中的期号对象:', issue)
    },
    async loadDataWithIssue(issueId) {
      // 使用 issueId 请求接口
      console.log('使用期号ID请求接口:', issueId)
      // await this.$api.getSomeData({ issueId })
    }
  }
}
</script>
```

## 完整使用示例

```vue
<template>
  <div>
    <h2>期号管理</h2>
    
    <!-- 期号选择器 -->
    <div class="issue-selector">
      <label>选择期号：</label>
      <issue-select 
        v-model="currentIssueId"
        @change="onIssueChange"
        placeholder="请选择要管理的期号"
      />
      
      <!-- 手动刷新按钮 -->
      <el-button 
        size="mini" 
        @click="refreshIssues"
        :loading="loading"
      >
        刷新期号列表
      </el-button>
    </div>
    
    <!-- 当前选中的期号信息 -->
    <div v-if="currentIssue" class="issue-info">
      <h3>当前期号信息</h3>
      <p>期号ID: {{ currentIssue.ID }}</p>
      <p>期号: {{ currentIssue.issue_no }}</p>
      <p>彩票类型: {{ currentIssue.game_category_name }}</p>
      <p>状态: {{ statusMap[currentIssue.status] }}</p>
    </div>
    
    <!-- 期号相关数据 -->
    <div v-if="currentIssueId" class="issue-data">
      <h3>期号相关数据</h3>
      <el-table :data="issueData" border>
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="order_no" label="订单号" />
        <el-table-column prop="amount" label="金额" />
        <el-table-column prop="created_at" label="创建时间" />
      </el-table>
    </div>
  </div>
</template>

<script>
import IssueSelect from '@/components/issues/index.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'IssueManagement',
  components: { IssueSelect },
  data() {
    return {
      currentIssueId: null,
      issueData: [],
      loading: false,
      statusMap: {
        0: "未开始",
        1: "运行中",
        2: "已结束",
        3: "已开奖",
        4: "作废",
      }
    }
  },
  computed: {
    ...mapGetters("gameInfo", ["issues"]),
    currentIssue() {
      if (!this.currentIssueId) return null
      return this.issues.find(issue => issue.ID === this.currentIssueId)
    }
  },
  watch: {
    // 监听期号ID变化，自动加载数据
    currentIssueId: {
      handler(newIssueId) {
        if (newIssueId) {
          this.loadIssueData(newIssueId)
        } else {
          this.issueData = []
        }
      },
      immediate: true // 组件创建时立即执行
    }
  },
  methods: {
    // 期号变化事件
    onIssueChange(issueId, issue) {
      console.log('期号切换:', issueId, issue)
      // 可以在这里添加额外的逻辑，比如清除缓存等
    },
    
    // 加载期号相关数据
    async loadIssueData(issueId) {
      try {
        this.loading = true
        // 这里调用实际的API
        // const res = await this.$api.getIssueData({ issueId })
        // this.issueData = res.data.list || []
        
        // 模拟数据
        this.issueData = [
          { id: 1, order_no: `ORDER${issueId}001`, amount: 100, created_at: '2023-01-01' },
          { id: 2, order_no: `ORDER${issueId}002`, amount: 200, created_at: '2023-01-02' }
        ]
      } catch (error) {
        console.error('加载期号数据失败:', error)
        this.$message.error('加载数据失败')
      } finally {
        this.loading = false
      }
    },
    
    // 刷新期号列表
    async refreshIssues() {
      try {
        this.loading = true
        // 调用组件的刷新方法
        await this.$refs.issueSelect.refresh()
        this.$message.success('期号列表已刷新')
      } catch (error) {
        console.error('刷新失败:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.issue-selector {
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.issue-info {
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.issue-data {
  margin-top: 20px;
}
</style>
```

## API 文档

### Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value / v-model | 绑定值 | number / string | — | — |
| placeholder | 占位符文本 | string | — | 请选择期号 |
| size | 尺寸 | string | mini / small / medium | mini |
| disabled | 是否禁用 | boolean | — | false |
| clearable | 是否可清空 | boolean | — | true |
| filterable | 是否可搜索 | boolean | — | true |
| autoSelectFirst | 是否自动选择第一条记录 | boolean | — | true |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| input | 绑定值变化时触发 | (value: number \| string) |
| change | 选择项变化时触发 | (value: number \| string, issue: object) |
| clear | 清空选择时触发 | — |

### Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| getSelectedIssue | 获取当前选中的期号信息 | — |
| refresh | 刷新期号数据 | — |

## 数据结构

### Issue 对象结构

```javascript
{
  ID: 1,                    // 期号ID
  issue_no: "20250101",      // 期号
  game_category: 1,          // 彩票类型ID
  game_category_name: "福彩", // 彩票类型名称
  status: 1,                 // 状态
  lottery_date: "2023-01-01", // 开奖日期
  fc_draw_number: "01,02,03", // 福彩开奖号码
  tc_draw_number: "04,05,06", // 体彩开奖号码
  created_at: "2023-01-01 10:00:00", // 创建时间
  updated_at: "2023-01-01 10:00:00"  // 更新时间
}
```

### 状态说明

| 状态值 | 说明 |
|--------|------|
| 0 | 未开始 |
| 1 | 运行中 |
| 2 | 已结束 |
| 3 | 已开奖 |
| 4 | 作废 |

## 注意事项

1. **数据源**: 组件自动从 `gameInfo/issues` 获取数据，确保 store 中有对应的数据
2. **自动选择**: 默认会自动选择第一条记录，可通过 `autoSelectFirst` 控制
3. **生命周期**: 组件确保在父组件 `created()` 后、`mounted()` 前完成自动选择
4. **数据加载**: 如果 store 中没有数据，组件会等待数据加载完成后再进行自动选择
5. **错误处理**: 组件内置了错误处理机制，数据加载失败时会显示错误提示

## 常见问题

### Q: 为什么在 created() 中 selectedIssueId 是 null？
A: 可能是数据还在加载中，建议使用 watch 监听 selectedIssueId 的变化。

### Q: 如何禁用自动选择第一条记录？
A: 设置 `:auto-select-first="false"` 即可。

### Q: 如何手动刷新期号列表？
A: 调用组件的 `refresh()` 方法，或者给组件添加 ref 后调用 `this.$refs.issueSelect.refresh()`。

### Q: 组件支持多选吗？
A: 当前版本不支持多选，如需多选功能可以扩展组件实现。

### Q: 期号数据从哪里来？
A: 期号数据来源于 `gameInfo` 模块的 `issues` 数组，通常通过 `fcg_info/get` 接口获取。

### Q: 如何获取完整的期号信息？
A: 可以通过 `getSelectedIssue()` 方法获取当前选中的完整期号对象，或者在 change 事件的回调参数中获取。

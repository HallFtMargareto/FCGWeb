# 期号统计数据API使用说明

## 概述

根据API文档 `docs/api/fcg_stat_getIssueStatistics.md` 实现的期号统计数据功能，包括API调用、数据存储和组件展示。

## 文件结构

```
src/
├── api/fcgame/
│   ├── fcg_stat.js                    # API接口定义
│   └── README_statistics.md           # 本说明文档
├── store/module/
│   └── statistics.js                  # Vuex store模块
├── components/statistics/
│   └── StatisticsDisplay.vue          # 统计数据展示组件
├── view/fcgame/
│   └── statistics_test.vue            # 测试页面
└── view/layout/
    └── index.vue                      # 主布局页面（已集成API调用）
```

## API接口

### getIssueStatistics

获取期号统计数据接口。

```javascript
import { getIssueStatistics } from '@/api/fcgame/fcg_stat'

// 获取最新期号统计数据
const result = await getIssueStatistics()

// 获取指定期号统计数据
const result = await getIssueStatistics({ issueId: '123' })
```

**参数：**
- `issueId` (可选): 期号ID，不传则查询最新一期

**响应：**
```javascript
{
  code: 0,
  data: {
    issue: {
      id: 123,
      issue_number: "20251018001",
      lottery_type: "fucai",
      status: "open",
      open_time: "2025-10-18 10:00:00",
      close_time: "2025-10-18 22:00:00",
      draw_time: "2025-10-18 22:30:00",
      created_at: "2025-10-18 09:50:00",
      updated_at: "2025-10-18 10:00:00"
    },
    statistics: {
      total_order_count: 100,
      total_bet_amount: "10000.00",
      total_commission: "500.00",
      total_win_amount: "2000.00",
      total_win_order_count: 20,
      fu_cai_order_count: 60,
      fu_cai_bet_amount: "6000.00",
      fu_cai_commission: "300.00",
      fu_cai_win_amount: "1200.00",
      fu_cai_win_order_count: 12,
      ti_cai_order_count: 40,
      ti_cai_bet_amount: "4000.00",
      ti_cai_commission: "200.00",
      ti_cai_win_amount: "800.00",
      ti_cai_win_order_count: 8
    }
  },
  msg: "操作成功"
}
```

## Store模块

### State

```javascript
state: {
  issueStatistics: {
    issue: null,        // 期号信息
    statistics: null    // 统计数据
  },
  loading: false,       // 加载状态
  error: null          // 错误信息
}
```

### Actions

```javascript
// 获取期号统计数据
await dispatch('statistics/fetchIssueStatistics', { issueId: '123' })

// 获取最新期号统计数据
await dispatch('statistics/fetchLatestIssueStatistics')

// 根据期号ID获取统计数据
await dispatch('statistics/fetchIssueStatisticsById', '123')
```

### Getters

```javascript
// 获取完整的期号统计数据
const issueStatistics = this.$store.getters['statistics/issueStatistics']

// 获取当前期号信息
const currentIssue = this.$store.getters['statistics/currentIssue']

// 获取当前统计数据
const currentStatistics = this.$store.getters['statistics/currentStatistics']

// 获取加载状态
const loading = this.$store.getters['statistics/statisticsLoading']

// 获取错误信息
const error = this.$store.getters['statistics/statisticsError']
```

## 组件使用

### 1. 在组件中使用统计数据

```vue
<template>
  <div>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <p>期号: {{ currentIssue.issue_number }}</p>
      <p>总订单数: {{ statistics.total_order_count }}</p>
      <p>总投注金额: {{ statistics.total_bet_amount }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('statistics', [
      'currentIssue',
      'currentStatistics',
      'statisticsLoading',
      'statisticsError'
    ]),
    loading() {
      return this.statisticsLoading
    },
    error() {
      return this.statisticsError
    },
    currentIssue() {
      return this.currentIssue
    },
    statistics() {
      return this.currentStatistics
    }
  },
  methods: {
    ...mapActions('statistics', [
      'fetchLatestIssueStatistics',
      'fetchIssueStatisticsById'
    ]),
    async refreshData() {
      try {
        await this.fetchLatestIssueStatistics()
      } catch (error) {
        console.error('获取统计数据失败:', error)
      }
    }
  },
  mounted() {
    this.refreshData()
  }
}
</script>
```

### 2. 使用统计展示组件

```vue
<template>
  <div>
    <StatisticsDisplay />
  </div>
</template>

<script>
import StatisticsDisplay from '@/components/statistics/StatisticsDisplay.vue'

export default {
  components: {
    StatisticsDisplay
  }
}
</script>
```

## 自动加载

在主布局页面 (`src/view/layout/index.vue`) 中已经集成了自动加载功能，页面刷新时会自动获取最新的期号统计数据并保存到store中。

```javascript
mounted() {
  // 其他初始化代码...
  
  // 获取期号统计数据
  this.$store.dispatch("statistics/fetchLatestIssueStatistics").catch(error => {
    console.warn('获取期号统计数据失败:', error);
  });
}
```

## 错误处理

API调用失败时，错误信息会保存到store的`error`字段中，可以通过以下方式获取：

```javascript
const error = this.$store.getters['statistics/statisticsError']
if (error) {
  console.error('统计数据错误:', error)
}
```

## 测试页面

项目包含一个测试页面 `src/view/fcgame/statistics_test.vue`，可以用来测试API功能和数据展示。该页面包含：

- 期号信息展示
- 统计数据展示（总体、福彩、体彩）
- 错误处理
- 手动刷新功能

## 注意事项

1. 该API需要用户登录认证
2. 金额字段使用字符串格式，需要时可以转换为数字
3. 页面刷新时会自动获取最新数据
4. 数据会保存在Vuex store中，页面间共享
5. 建议在需要使用统计数据的组件中检查loading和error状态

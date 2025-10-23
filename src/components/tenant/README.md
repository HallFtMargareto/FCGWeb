# TenantSelect 组织选择组件

## 功能特性

- 🔄 自动从 Vuex store 获取组织数据
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
    <tenant-select v-model="selectedTenantId" />
    
    <!-- 带事件监听 -->
    <tenant-select 
      v-model="selectedTenantId" 
      @change="handleTenantChange"
      placeholder="请选择组织"
    />
    
    <!-- 自定义属性 -->
    <tenant-select 
      v-model="selectedTenantId" 
      size="small"
      :clearable="false"
      :auto-select-first="false"
    />
  </div>
</template>

<script>
import TenantSelect from '@/components/tenant/index.vue'
import { mapGetters } from 'vuex'

export default {
  components: { TenantSelect },
  data() {
    return {
      selectedTenantId: null
    }
  },
  computed: {
    ...mapGetters("gameInfo", ["tenants"])
  },
  async created() {
    // 组件会自动选择第一条记录，这里 selectedTenantId 可能已经有值了
    
    // 方案1：使用 watch 监听变化（推荐）
    // 详见下面的完整示例
    
    // 方案2：等待下一个 tick
    this.$nextTick(() => {
      if (this.selectedTenantId) {
        this.loadDataWithTenant(this.selectedTenantId)
      }
    })
  },
  methods: {
    handleTenantChange(tenantId, tenant) {
      console.log('选中的组织ID:', tenantId)
      console.log('选中的组织对象:', tenant)
    },
    async loadDataWithTenant(tenantId) {
      // 使用 tenantId 请求接口
      console.log('使用租户ID请求接口:', tenantId)
      // await this.$api.getSomeData({ tenantId })
    }
  }
}
</script>
```

## 完整使用示例

```vue
<template>
  <div>
    <h2>组织管理</h2>
    
    <!-- 组织选择器 -->
    <div class="tenant-selector">
      <label>选择组织：</label>
      <tenant-select 
        v-model="currentTenantId"
        @change="onTenantChange"
        placeholder="请选择要管理的组织"
      />
      
      <!-- 手动刷新按钮 -->
      <el-button 
        size="mini" 
        @click="refreshTenants"
        :loading="loading"
      >
        刷新组织列表
      </el-button>
    </div>
    
    <!-- 当前选中的组织信息 -->
    <div v-if="currentTenant" class="tenant-info">
      <h3>当前组织信息</h3>
      <p>组织ID: {{ currentTenant.ID }}</p>
      <p>平台名称: {{ currentTenant.platform_name }}</p>
      <p>企业名称: {{ currentTenant.enterprise_name }}</p>
    </div>
    
    <!-- 组织相关数据 -->
    <div v-if="currentTenantId" class="tenant-data">
      <h3>组织相关数据</h3>
      <el-table :data="tenantData" border>
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="created_at" label="创建时间" />
      </el-table>
    </div>
  </div>
</template>

<script>
import TenantSelect from '@/components/tenant/index.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'TenantManagement',
  components: { TenantSelect },
  data() {
    return {
      currentTenantId: null,
      tenantData: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters("gameInfo", ["tenants"]),
    currentTenant() {
      if (!this.currentTenantId) return null
      return this.tenants.find(tenant => tenant.ID === this.currentTenantId)
    }
  },
  watch: {
    // 监听租户ID变化，自动加载数据
    currentTenantId: {
      handler(newTenantId) {
        if (newTenantId) {
          this.loadTenantData(newTenantId)
        } else {
          this.tenantData = []
        }
      },
      immediate: true // 组件创建时立即执行
    }
  },
  methods: {
    // 租户变化事件
    onTenantChange(tenantId, tenant) {
      console.log('租户切换:', tenantId, tenant)
      // 可以在这里添加额外的逻辑，比如清除缓存等
    },
    
    // 加载租户相关数据
    async loadTenantData(tenantId) {
      try {
        this.loading = true
        // 这里调用实际的API
        // const res = await this.$api.getTenantData({ tenantId })
        // this.tenantData = res.data.list || []
        
        // 模拟数据
        this.tenantData = [
          { id: 1, name: `租户${tenantId}的数据1`, created_at: '2023-01-01' },
          { id: 2, name: `租户${tenantId}的数据2`, created_at: '2023-01-02' }
        ]
      } catch (error) {
        console.error('加载租户数据失败:', error)
        this.$message.error('加载数据失败')
      } finally {
        this.loading = false
      }
    },
    
    // 刷新组织列表
    async refreshTenants() {
      try {
        this.loading = true
        // 调用组件的刷新方法
        await this.$refs.tenantSelect.refresh()
        this.$message.success('组织列表已刷新')
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
.tenant-selector {
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tenant-info {
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.tenant-data {
  margin-top: 20px;
}
</style>
```

## API 文档

### Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value / v-model | 绑定值 | number / string | — | — |
| placeholder | 占位符文本 | string | — | 请选择组织 |
| size | 尺寸 | string | mini / small / medium | mini |
| disabled | 是否禁用 | boolean | — | false |
| clearable | 是否可清空 | boolean | — | true |
| filterable | 是否可搜索 | boolean | — | true |
| autoSelectFirst | 是否自动选择第一条记录 | boolean | — | true |
| waitForData | 是否等待数据加载完成后再自动选择 | boolean | — | true |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| input | 绑定值变化时触发 | (value: number \| string) |
| change | 选择项变化时触发 | (value: number \| string, tenant: object) |
| clear | 清空选择时触发 | — |

### Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| getSelectedTenant | 获取当前选中的租户信息 | — |
| refresh | 刷新组织数据 | — |

## 注意事项

1. **数据源**: 组件自动从 `gameInfo/tenants` 获取数据，确保 store 中有对应的数据
2. **自动选择**: 默认会自动选择第一条记录，可通过 `autoSelectFirst` 控制
3. **生命周期**: 组件确保在父组件 `created()` 后、`mounted()` 前完成自动选择
4. **数据加载**: 如果 store 中没有数据，组件会自动调用 `gameInfo/fetchGameInfo` 加载数据
5. **错误处理**: 组件内置了错误处理机制，数据加载失败时会显示错误提示

## 常见问题

### Q: 为什么在 created() 中 selectedTenantId 是 null？
A: 可能是数据还在加载中，建议使用 watch 监听 selectedTenantId 的变化。

### Q: 如何禁用自动选择第一条记录？
A: 设置 `:auto-select-first="false"` 即可。

### Q: 如何手动刷新组织列表？
A: 调用组件的 `refresh()` 方法，或者给组件添加 ref 后调用 `this.$refs.tenantSelect.refresh()`。

### Q: 组件支持多选吗？
A: 当前版本不支持多选，如需多选功能可以扩展组件实现。

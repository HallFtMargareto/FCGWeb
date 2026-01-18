# 渠道选择组件实现计划

## 需求概述
在 `fcg_order_rick_odds.vue` 页面中，当点击"渠道转单"按钮时，弹出一个渠道选择组件。该组件需要：
1. 弹窗打开时自动获取组织通道列表（调用 `getFcgTenantChannelTemplateList` API）
2. 显示通道列表供用户选择
3. 选中指定通道后保存该通道ID，等待其他方法调用

## 组件设计

### 1. 组件文件结构
```
src/view/fcgame/components/ChannelSelectDialog.vue
```

### 2. 组件功能说明

#### Props
- `value` (Boolean): 控制弹窗显示/隐藏，支持 v-model 双向绑定

#### Events
- `input`: 弹窗显示状态变化时触发
- `confirm`: 用户确认选择通道时触发，返回选中的通道ID
- `cancel`: 用户取消选择时触发

#### Data
- `visible`: 弹窗显示状态
- `channelList`: 通道列表数据
- `selectedChannelId`: 选中的通道ID
- `loading`: 加载状态

#### Methods
- `open()`: 打开弹窗并加载通道列表
- `loadChannelList()`: 调用 API 获取通道列表
- `handleConfirm()`: 确认选择，触发 confirm 事件
- `handleCancel()`: 取消选择，关闭弹窗

### 3. 组件模板结构

```vue
<template>
  <el-dialog
    title="选择渠道"
    :visible.sync="visible"
    width="50%"
    :close-on-click-modal="false"
    @open="loadChannelList"
  >
    <div v-loading="loading">
      <el-radio-group v-model="selectedChannelId" v-if="channelList.length > 0">
        <el-radio
          v-for="channel in channelList"
          :key="channel.ID"
          :label="channel.ID"
          class="channel-radio"
        >
          <div class="channel-info">
            <span class="channel-name">{{ channel.name }}</span>
            <span class="channel-provider">供应商: {{ channel.provider_id }}</span>
            <span class="channel-state" :class="{ 'active': channel.state }">
              {{ channel.state ? '启用' : '禁用' }}
            </span>
          </div>
        </el-radio>
      </el-radio-group>
      <el-empty v-else description="暂无可用渠道"></el-empty>
    </div>
    
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm" :disabled="!selectedChannelId">
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>
```

### 4. 组件脚本结构

```javascript
<script>
import { getFcgTenantChannelTemplateList } from "@/api/fcgame/fcg_tenant_channel_template";

export default {
  name: "ChannelSelectDialog",
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      channelList: [],
      selectedChannelId: null,
      loading: false
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
  methods: {
    // 打开弹窗
    open() {
      this.visible = true;
      this.selectedChannelId = null;
      this.loadChannelList();
    },
    
    // 加载通道列表
    async loadChannelList() {
      this.loading = true;
      try {
        const res = await getFcgTenantChannelTemplateList({
          page: 1,
          pageSize: 1000,
          state: true  // 只获取启用的通道
        });
        if (res.code === 0 && res.data && res.data.list) {
          this.channelList = res.data.list;
        } else {
          this.$message.error(res.msg || "获取通道列表失败");
          this.channelList = [];
        }
      } catch (error) {
        console.error("获取通道列表异常:", error);
        this.$message.error("获取通道列表异常");
        this.channelList = [];
      } finally {
        this.loading = false;
      }
    },
    
    // 确认选择
    handleConfirm() {
      if (!this.selectedChannelId) {
        this.$message.warning("请选择渠道");
        return;
      }
      this.$emit('confirm', this.selectedChannelId);
      this.visible = false;
    },
    
    // 取消选择
    handleCancel() {
      this.$emit('cancel');
      this.visible = false;
    }
  }
};
</script>
```

### 5. 组件样式

```css
<style scoped>
.channel-radio {
  display: block;
  margin-bottom: 15px;
  width: 100%;
}

.channel-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.channel-name {
  font-weight: bold;
  font-size: 14px;
  color: #303133;
}

.channel-provider {
  font-size: 12px;
  color: #909399;
}

.channel-state {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: #f56c6c;
  color: #fff;
}

.channel-state.active {
  background-color: #67c23a;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
```

## 集成到 fcg_order_rick_odds.vue

### 1. 导入组件

```javascript
import ChannelSelectDialog from "@/view/fcgame/components/ChannelSelectDialog.vue";
```

### 2. 注册组件

```javascript
components: {
  ChannelSelectDialog
}
```

### 3. 添加模板

在模板中添加组件：

```vue
<channel-select-dialog
  v-model="showChannelSelectDialog"
  @confirm="handleChannelConfirm"
  @cancel="handleChannelCancel"
></channel-select-dialog>
```

### 4. 添加数据

```javascript
data() {
  return {
    // ... 其他数据
    showChannelSelectDialog: false,
    selectedChannelId: null,
  };
}
```

### 5. 实现方法

```javascript
// 点击渠道转单按钮
async handleChannelTransfer() {
  if (this.multipleSelection.length === 0) {
    this.$message.warning("请选择数据");
    return;
  }
  this.showChannelSelectDialog = true;
  // 通过 ref 调用组件的 open 方法
  this.$nextTick(() => {
    this.$refs.channelSelectDialog.open();
  });
},

// 确认选择通道
handleChannelConfirm(channelId) {
  this.selectedChannelId = channelId;
  this.$message.success(`已选择通道ID: ${channelId}`);
  // 这里可以调用其他方法进行后续处理
  // 例如：执行渠道转单操作
  this.executeChannelTransfer();
},

// 取消选择通道
handleChannelCancel() {
  this.selectedChannelId = null;
  this.$message.info("已取消选择");
},

// 执行渠道转单操作
async executeChannelTransfer() {
  try {
    this.fastTransferLoading = true;
    
    // 构建请求数据
    const transfer_list = this.multipleSelection.map((item) => ({
      split_number: item.split_number,
      trans_count: item.trans_count,
      trans_amount: item.trans_amount,
      tenant_id: this.tenant_id,
    }));

    const requestData = {
      game_category: this.game_category,
      ids: [this.chartIssueId],
      issue_id: this.chartIssueId,
      command: "channel_transfer",
      transfer_list: transfer_list,
      channel_id: this.selectedChannelId,  // 添加选中的通道ID
    };

    // 调用API接口（需要确认具体的API接口）
    const res = await batchFcgOrderSplitNumberOperation(requestData);

    if (res.code === 0) {
      this.$message.success("渠道转单成功");
      // 刷新数据
      this.getChartData();
    } else {
      this.$message.error(res.msg || "渠道转单失败");
    }
  } catch (error) {
    this.$message.error("渠道转单失败");
    console.error("渠道转单失败:", error);
  } finally {
    this.fastTransferLoading = false;
  }
}
```

## API 接口说明

### getFcgTenantChannelTemplateList
- **路径**: `/fcg_tenant_channel_template/getList`
- **方法**: GET
- **参数**:
  - `page`: 页码
  - `pageSize`: 每页数量
  - `state`: 状态（true/false）
- **返回数据结构**:
```javascript
{
  code: 0,
  data: {
    list: [
      {
        ID: 1,
        name: "通道名称",
        provider_id: "供应商ID",
        state: true,
        remark: "备注",
        plat_name: "平台名称",
        plat_version: "平台版本"
      }
    ],
    total: 10
  },
  msg: "success"
}
```

## 实现步骤

1. ✅ 分析现有代码结构和API接口
2. ⏳ 创建渠道选择组件 `ChannelSelectDialog.vue`
3. ⏳ 在 `fcg_order_rick_odds.vue` 中集成该组件
4. ⏳ 实现弹窗打开时获取通道列表数据
5. ⏳ 实现选择通道后保存ID的功能
6. ⏳ 测试组件功能是否正常

## 注意事项

1. 组件需要支持 v-model 双向绑定
2. 弹窗打开时自动加载通道列表
3. 只显示启用的通道（state: true）
4. 用户必须选择通道后才能确认
5. 确认后通过事件将通道ID传递给父组件
6. 父组件接收到通道ID后，可以调用其他方法进行后续处理
7. 需要处理加载状态和错误提示
8. 组件样式需要与项目整体风格保持一致

## 测试要点

1. 点击"渠道转单"按钮，弹窗是否正常打开
2. 弹窗打开时是否自动加载通道列表
3. 通道列表是否正确显示
4. 选择通道后点击确定，是否正确触发 confirm 事件
5. 取消选择时是否正确关闭弹窗
6. 没有选择通道时点击确定，是否有提示
7. 通道列表为空时是否显示空状态
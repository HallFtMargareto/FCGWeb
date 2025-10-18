# 数据统计服务文档

## 概述

数据统计服务 (`StatisticsService`) 提供了基于期号 (`FcgLotteryIssue.ID`) 统计当期模拟数据 (`FcgOrderDetail`) 的功能，包括总订单、总投注金额、福彩和体彩的数量、金额及佣金统计。

## 功能特性

### 核心统计功能

1. **单期号统计** - 根据期号ID统计当期所有订单信息
2. **批量期号统计** - 根据期号ID列表批量统计多个期号
3. **用户期号统计** - 根据期号ID和用户ID统计特定用户的订单信息

### 统计维度

- **总订单数**: 当期所有订单总数
- **总投注金额**: 当期所有订单投注金额总和
- **福彩统计**:
  - 订单数量
  - 投注金额
  - 代理佣金
- **体彩统计**:
  - 订单数量
  - 投注金额
  - 代理佣金

## 数据结构

### IssueStatistics - 期号统计结果
```go
type IssueStatistics struct {
    IssueID     uint64            `json:"issue_id"`     // 期号ID
    TotalOrders int64             `json:"total_orders"` // 总订单数
    TotalAmount decimal.Decimal   `json:"total_amount"` // 总投注金额
    
    // 福彩统计
    FuCaiStatistics CategoryStatistics `json:"fucai_statistics"`
    
    // 体彩统计
    TiCaiStatistics CategoryStatistics `json:"ticai_statistics"`
}
```

### CategoryStatistics - 分类统计结果
```go
type CategoryStatistics struct {
    CategoryName    string          `json:"category_name"`    // 分类名称
    OrderCount      int64           `json:"order_count"`      // 订单数量
    TotalAmount     decimal.Decimal `json:"total_amount"`     // 总金额
    TotalCommission decimal.Decimal `json:"total_commission"` // 总佣金
}
```

## 使用方法

### 1. 创建统计服务实例

```go
import "rtpsystem/internal/pkg/services"

// 创建统计服务 (需要传入数据库连接)
service := services.NewStatisticsService(db)
```

### 2. 单期号统计

```go
// 统计期号ID为12345的订单信息
stats, err := service.GetIssueStatistics(12345)
if err != nil {
    log.Printf("获取期号统计失败: %v", err)
    return
}

// 打印统计结果
fmt.Printf("期号 %d 统计结果:\n", stats.IssueID)
fmt.Printf("总订单数: %d\n", stats.TotalOrders)
fmt.Printf("总投注金额: %s 分\n", stats.TotalAmount.String())
```

### 3. 批量期号统计

```go
// 批量统计多个期号
issueIDs := []uint64{12345, 12346, 12347}
statsList, err := service.GetIssueStatisticsList(issueIDs)
if err != nil {
    log.Printf("批量获取期号统计失败: %v", err)
    return
}

for _, stats := range statsList {
    fmt.Printf("期号 %d: 总订单=%d, 总金额=%s\n", 
        stats.IssueID, stats.TotalOrders, stats.TotalAmount.String())
}
```

### 4. 用户期号统计

```go
// 统计用户ID为123在期号12345的订单信息
userStats, err := service.GetUserIssueStatistics(12345, 123)
if err != nil {
    log.Printf("获取用户期号统计失败: %v", err)
    return
}

fmt.Printf("用户统计结果: 订单数=%d, 金额=%s\n", 
    userStats.TotalOrders, userStats.TotalAmount.String())
```

## API 方法详解

### GetIssueStatistics(issueID uint64) (*IssueStatistics, error)

**功能**: 根据期号ID统计当期所有订单详情信息

**参数**:
- `issueID`: 期号ID (FcgLotteryIssue.ID)

**返回值**:
- `*IssueStatistics`: 统计结果
- `error`: 错误信息

**统计内容**:
- 总订单数和总投注金额
- 福彩数据 (GameCategory = 1)
- 体彩数据 (GameCategory = 2)

### GetIssueStatisticsList(issueIDs []uint64) ([]*IssueStatistics, error)

**功能**: 根据期号ID列表批量统计多个期号

**参数**:
- `issueIDs`: 期号ID列表

**返回值**:
- `[]*IssueStatistics`: 统计结果列表
- `error`: 错误信息

**特点**: 使用批量查询优化性能，减少数据库查询次数

### GetUserIssueStatistics(issueID uint64, userID uint) (*IssueStatistics, error)

**功能**: 根据期号ID和用户ID统计特定用户的订单信息

**参数**:
- `issueID`: 期号ID
- `userID`: 用户ID

**返回值**:
- `*IssueStatistics`: 用户统计结果
- `error`: 错误信息

## 数据库查询逻辑

### 查询语句示例

```sql
-- 总统计
SELECT COUNT(*) as total_orders, 
       COALESCE(SUM(bet_amount), 0) as total_amount,
       COALESCE(SUM(commission), 0) as total_commission
FROM fcg_order_detail 
WHERE issue_id = ?;

-- 福彩统计 (GameCategory = 1)
SELECT COUNT(*) as order_count, 
       COALESCE(SUM(bet_amount), 0) as total_amount,
       COALESCE(SUM(commission), 0) as total_commission
FROM fcg_order_detail 
WHERE issue_id = ? AND game_category = 1;

-- 体彩统计 (GameCategory = 2)
SELECT COUNT(*) as order_count, 
       COALESCE(SUM(bet_amount), 0) as total_amount,
       COALESCE(SUM(commission), 0) as total_commission
FROM fcg_order_detail 
WHERE issue_id = ? AND game_category = 2;
```

## 游戏分类说明

根据 `gamekernel.GameCategory` 定义:

- `FuCai3DCategory (1)`: 福彩3D
- `TiCaiCategory (2)`: 体彩
- `PaiLie3DCategory (3)`: 排列3
- `ShuangSeQiuCategory (4)`: 双色球
- `KaiLe8Category (5)`: 快乐8
- `QiCaiLeCategory (6)`: 七彩乐

## 金额单位

所有金额字段均以**分**为单位存储和计算:
- `BetAmount`: 投注金额 (分)
- `Commission`: 代理佣金 (分)
- `TotalAmount`: 总金额 (分)

## 性能优化

1. **批量查询**: `GetIssueStatisticsList` 方法使用批量查询减少数据库往返
2. **索引建议**: 建议在 `fcg_order_detail` 表的以下字段上创建索引:
   - `issue_id` (期号ID)
   - `game_category` (游戏分类)
   - `user_id` (用户ID)

## 错误处理

所有方法都返回错误信息，建议在使用时进行错误检查:

```go
stats, err := service.GetIssueStatistics(issueID)
if err != nil {
    // 处理错误
    log.Printf("统计失败: %v", err)
    return
}
// 使用统计结果
```

## 测试

项目包含完整的单元测试 (`statistics_test.go`)，覆盖所有主要功能:

```bash
# 运行测试
go test ./internal/pkg/services -v
```

测试包括:
- 单期号统计测试
- 用户期号统计测试
- 批量期号统计测试

## 示例代码

完整的使用示例请参考 `statistics_example.go` 文件，包含:
- 基本使用方法
- 结果格式化打印
- 数据验证辅助函数

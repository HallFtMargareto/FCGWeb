# 获取期号统计数据接口

## 接口概述

获取指定期号或最新期号的统计数据，包括总订单数、投注金额、佣金、中奖金额等详细信息。

## 接口信息

- **接口路径**: `/fcg_stat/getIssueStatistics`
- **请求方法**: `GET`
- **接口描述**: 获取期号统计数据
- **权限要求**: 需要登录认证（CasdoorMiddleware + TenantMiddleware + CasbinHandler）

## 组织转出数据统计接口

### 接口概述

获取指定期号的统计数据，包括会话统计、订单状态统计、游戏类型统计、游戏分类统计、转出统计以及组织统计（仅管理员可见）。

### 接口信息

- **接口路径**: `/fcg_order/getSummary`
- **请求方法**: `GET`
- **接口描述**: 获取期号统计数据（包含组织转出数据统计）
- **权限要求**: 需要登录认证（CasdoorMiddleware + TenantMiddleware + CasbinHandler）

## 请求参数

### Query Parameters - getIssueStatistics

| 参数名  | 类型   | 必填 | 描述                       | 示例 |
| ------- | ------ | ---- | -------------------------- | ---- |
| issueId | string | 否   | 期号ID，不传则查询最新一期 | 123  |

### Query Parameters - getSummary（组织转出数据统计）

| 参数名    | 类型 | 必填 | 描述                                     | 示例 |
| --------- | ---- | ---- | ---------------------------------------- | ---- |
| issue_id  | int  | 是   | 期号ID                                   | 123  |
| tenant_id | int  | 否   | 组织ID，仅管理员可传，不传则查询当前组织 | 456  |

## 请求示例

### 获取最新期号统计数据
```bash
GET /fcg_stat/getIssueStatistics
```

### 获取指定期号统计数据
```bash
GET /fcg_stat/getIssueStatistics?issueId=123
```

### 获取组织转出数据统计
```bash
GET /fcg_order/getSummary?issue_id=123
```

### 管理员获取所有组织的转出数据统计
```bash
GET /fcg_order/getSummary?issue_id=123&tenant_id=0
```

## 响应格式

### 成功响应
```json
{
  "code": 0,
  "data": {
    "issue": {
      "id": 123,
      "issue_number": "20251018001",
      "lottery_type": "fucai",
      "status": "open",
      "open_time": "2025-10-18 10:00:00",
      "close_time": "2025-10-18 22:00:00",
      "draw_time": "2025-10-18 22:30:00",
      "created_at": "2025-10-18 09:50:00",
      "updated_at": "2025-10-18 10:00:00"
    },
    "statistics": {
      "total_order_count": 100,
      "total_bet_amount": "10000.00",
      "total_commission": "500.00",
      "total_win_amount": "2000.00",
      "total_win_order_count": 20,
      "fu_cai_order_count": 60,
      "fu_cai_bet_amount": "6000.00",
      "fu_cai_commission": "300.00",
      "fu_cai_win_amount": "1200.00",
      "fu_cai_win_order_count": 12,
      "ti_cai_order_count": 40,
      "ti_cai_bet_amount": "4000.00",
      "ti_cai_commission": "200.00",
      "ti_cai_win_amount": "800.00",
      "ti_cai_win_order_count": 8
    }
  },
  "msg": "操作成功"
}
```

### 错误响应

#### 期号ID参数错误
```json
{
  "code": -1,
  "data": null,
  "msg": "期号ID参数错误"
}
```

#### 期号不存在
```json
{
  "code": -1,
  "data": null,
  "msg": "期号不存在"
}
```

#### 获取最新期号失败
```json
{
  "code": -1,
  "data": null,
  "msg": "获取最新期号失败: record not found"
}
```

#### 获取统计数据失败
```json
{
  "code": -1,
  "data": null,
  "msg": "获取统计数据失败: 统计期号数据失败"
}
```

## 响应字段说明

### 根级字段

| 字段名 | 类型   | 描述                  |
| ------ | ------ | --------------------- |
| code   | int    | 响应状态码，0表示成功 |
| data   | object | 响应数据              |
| msg    | string | 响应消息              |

### data字段

| 字段名     | 类型   | 描述         |
| ---------- | ------ | ------------ |
| issue      | object | 期号详细信息 |
| statistics | object | 统计数据详情 |

### issue字段

| 字段名       | 类型   | 描述                          |
| ------------ | ------ | ----------------------------- |
| id           | uint   | 期号ID                        |
| issue_number | string | 期号编号                      |
| lottery_type | string | 彩票类型（fucai/ticai）       |
| status       | string | 期号状态（open/closed/drawn） |
| open_time    | string | 开奖时间                      |
| close_time   | string | 截止时间                      |
| draw_time    | string | 开奖时间                      |
| created_at   | string | 创建时间                      |
| updated_at   | string | 更新时间                      |

### statistics字段

| 字段名                 | 类型    | 描述           |
| ---------------------- | ------- | -------------- |
| total_order_count      | int64   | 总订单数       |
| total_bet_amount       | decimal | 总投注金额     |
| total_commission       | decimal | 总佣金         |
| total_win_amount       | decimal | 总中奖金额     |
| total_win_order_count  | int64   | 总中奖订单数   |
| fu_cai_order_count     | int64   | 福彩订单数     |
| fu_cai_bet_amount      | decimal | 福彩投注金额   |
| fu_cai_commission      | decimal | 福彩佣金       |
| fu_cai_win_amount      | decimal | 福彩中奖金额   |
| fu_cai_win_order_count | int64   | 福彩中奖订单数 |
| ti_cai_order_count     | int64   | 体彩订单数     |
| ti_cai_bet_amount      | decimal | 体彩投注金额   |
| ti_cai_commission      | decimal | 体彩佣金       |
| ti_cai_win_amount      | decimal | 体彩中奖金额   |
| ti_cai_win_order_count | int64   | 体彩中奖订单数 |

### 组织转出数据统计字段（仅管理员可见）

| 字段名                                | 类型    | 描述             |
| ------------------------------------- | ------- | ---------------- |
| tenant_stats                          | array   | 组织统计数据列表 |
| tenant_stats[].id                     | uint    | 组织ID           |
| tenant_stats[].name                   | string  | 组织名称         |
| tenant_stats[].total_bet_amount       | decimal | 总投注金额       |
| tenant_stats[].total_commission       | decimal | 总佣金           |
| tenant_stats[].total_win_amount       | decimal | 总中奖金额       |
| tenant_stats[].total_profit           | decimal | 总利润           |
| tenant_stats[].fc_total_bet_amount    | decimal | 福彩总投注金额   |
| tenant_stats[].fc_total_win_amount    | decimal | 福彩总中奖金额   |
| tenant_stats[].tc_total_bet_amount    | decimal | 体彩总投注金额   |
| tenant_stats[].tc_total_win_amount    | decimal | 体彩总中奖金额   |
| tenant_stats[].fc_total_trans_amount  | decimal | 福彩总转出金额   |
| tenant_stats[].fc_total_water_amount  | decimal | 福彩总水费       |
| tenant_stats[].fc_trans_win_amount    | decimal | 福彩转出中奖金额 |
| tenant_stats[].tc_total_trans_amount  | decimal | 体彩总转出金额   |
| tenant_stats[].tc_total_water_amount  | decimal | 体彩总水费       |
| tenant_stats[].tc_trans_win_amount    | decimal | 体彩转出中奖金额 |
| tenant_stats[].total_trans_amount     | decimal | 总转出金额       |
| tenant_stats[].total_water_amount     | decimal | 总水费           |
| tenant_stats[].total_trans_win_amount | decimal | 总转出中奖金额   |

## 业务逻辑

1. **参数处理**：
   - 检查是否传入 `issueId` 参数
   - 如果没有传入，查询最新一期数据
   - 如果有传入，验证期号ID格式和存在性

2. **数据查询**：
   - 调用 `StatisticsService.GetIssueStatistics()` 方法
   - 从 `fcg_order_detail` 表统计相关数据
   - 按游戏分类（福彩/体彩）分别统计

3. **统计维度**：
   - 总体统计：订单数、投注金额、佣金、中奖金额、中奖订单数
   - 福彩统计：福彩相关的各项数据
   - 体彩统计：体彩相关的各项数据

### 组织转出数据统计业务逻辑

1. **权限控制**：
   - 普通用户只能查看自己组织的数据
   - 管理员可以查看所有组织的数据

2. **数据查询**：
   - 根据期号获取所有组织ID和名称
   - 统计每个组织的订单数据（投注金额、佣金、中奖金额、利润）
   - 统计每个组织的游戏分类数据（福彩、体彩的投注和中奖金额）
   - 统计每个组织的转出数据（福彩、体彩的总转出、总水、中奖金额以及总计）

3. **转出数据统计维度**：
   - 福彩转出统计：总转出金额、总水费、中奖金额
   - 体彩转出统计：总转出金额、总水费、中奖金额
   - 总计统计：总转出金额、总水费、中奖金额

## 实现文件

### getIssueStatistics 接口
- **API实现**: `internal/app/fcgame/fcg_stat.go`
- **服务实现**: `internal/pkg/services/statistics.go`
- **路由注册**: `internal/app/web_router.go`
- **结构体定义**: `internal/app/fcgame/center.go`

### 组织转出数据统计接口
- **API实现**: `internal/app/fcgame/fcg_dashboard.go`
- **路由注册**: `internal/app/fcgame/fcg_order.go` (Summary方法调用DashBoard)
- **结构体定义**: `internal/app/fcgame/fcg_dashboard.go`

## 注意事项

1. 该接口需要用户登录认证
2. 金额字段使用 `decimal.Decimal` 类型，保证精度
3. 如果没有期号数据，会返回相应的错误信息
4. 统计数据基于 `fcg_order_detail` 表的 `issue_id` 字段进行分组统计

## 更新记录

- **2025-10-18**: 创建接口文档
  - 实现获取期号统计数据功能
  - 支持指定期号ID和最新期号查询
  - 添加完整的错误处理和参数验证
- **2025-10-18**: 更新接口文档
  - 修正返回数据结构：`issue` 字段现在返回完整的期号对象而不是简单的 `issue_id`
  - 更新响应示例，包含期号的详细信息
  - 完善 `issue` 对象的字段说明
- **2025-12-18**: 添加组织转出数据统计功能
  - 在 `getTenantStats` 方法中添加组织转出数据统计
  - 支持根据期号获取组织转出的数据统计（包括福、体的总转出、总水以及中奖金额）
  - 添加 `TenantTransferoutStats` 结构体用于存储转出统计数据
  - 更新接口文档，添加组织转出数据统计相关字段说明

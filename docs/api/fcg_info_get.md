# 获取游戏信息接口

## 接口概述

获取所有游戏类型、游戏分类、模拟赔率和组织列表信息，用于前端展示游戏配置、赔率数据和可选的组织信息。

## 接口信息

- **接口路径**: `/fcg_info/get`
- **请求方法**: `GET`
- **接口描述**: 获取游戏信息
- **权限要求**: 需要登录认证（CasdoorMiddleware + TenantMiddleware + CasbinHandler）

## 请求参数

该接口无需请求参数。

## 请求示例

```bash
GET /fcg_info/get
```

## 响应格式

### 成功响应
```json
{
  "code": 200,
  "data": {
    "game_types": {
      "1": "彩票",
      "2": "老虎机",
      "3": "扑克",
      "4": "棋牌"
    },
    "game_category": {
      "1": "福彩",
      "2": "体彩",
      "3": "娱乐场",
      "4": "体育"
    },
    "simulated_odds": {
      "lottery_1": 2.5,
      "lottery_2": 3.0,
      "lottery_3": 4.5,
      "slot_1": 1.8,
      "slot_2": 2.2,
      "poker_1": 3.5,
      "poker_2": 4.0
    },
    "tenants": [
      {
        "organization": "tenant001",
        "application": "game_app",
        "platform_name": "游戏平台1",
        "admin_id": 1001,
        "account": "admin001"
      },
      {
        "organization": "tenant002",
        "application": "game_app",
        "platform_name": "游戏平台2",
        "admin_id": 1002,
        "account": "admin002"
      }
    ]
  },
  "msg": "获取成功"
}
```

### 错误响应

#### 获取游戏类型失败
```json
{
  "code": 500,
  "data": null,
  "msg": "获取游戏类型失败"
}
```

#### 获取游戏分类失败
```json
{
  "code": 500,
  "data": null,
  "msg": "获取游戏分类失败"
}
```

#### 获取游戏赔率失败
```json
{
  "code": 500,
  "data": null,
  "msg": "获取游戏赔率失败"
}
```

## 响应字段说明

### 根级字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| code | int | 响应状态码，200表示成功，500表示服务器错误 |
| data | object | 响应数据 |
| msg | string | 响应消息 |

### data字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| game_types | object | 游戏类型映射，格式为 {id: name} |
| game_category | object | 游戏分类映射，格式为 {id: name} |
| simulated_odds | object | 模拟赔率映射，格式为 {game_key: odds} |
| tenants | array | 组织列表，包含启用的租户信息 |

### game_types字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| key | string | 游戏类型ID（字符串格式） |
| value | string | 游戏类型名称 |

### game_category字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| key | string | 游戏分类ID（字符串格式） |
| value | string | 游戏分类名称 |

### simulated_odds字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| key | string | 游戏标识符 |
| value | float64 | 模拟赔率值 |

### tenants字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| organization | string | 组织标识-租户编码 |
| application | string | APP标识 |
| platform_name | string | 平台名称 |
| admin_id | uint64 | 租户管理员主键 |
| account | string | 账号 |

## 业务逻辑

1. **数据查询**：
   - 从 `game_types` 表查询所有游戏类型（id, game_types_name）
   - 从 `game_category` 表查询所有游戏分类（id, game_category_name）
   - 从 `games` 表查询所有游戏的赔率信息（game_key, odds）
   - 从 `sys_tenant` 表查询启用的租户列表（organization, application, platform_name, admin_id, account），条件为 enabled = 1，按 id 降序排列

2. **数据处理**：
   - 将查询结果转换为 map 格式，便于前端使用
   - 游戏类型和分类转换为 `{id: name}` 格式
   - 赔率数据转换为 `{game_key: odds}` 格式
   - 租户列表保持数组格式，包含指定的字段信息

3. **默认数据处理**：
   - 如果 `games` 表中没有赔率数据，提供默认的模拟赔率
   - 默认赔率包括彩票、老虎机、扑克等常见游戏类型
   - 如果没有启用的租户，租户列表返回空数组

4. **错误处理**：
   - 单独处理每个数据源的查询错误
   - 任何一个数据源查询失败都会返回相应的错误信息
   - 租户查询失败不会影响其他数据的返回

## 默认模拟赔率

当数据库中没有赔率数据时，系统会提供以下默认赔率：

| 游戏标识 | 赔率值 | 游戏类型 |
|----------|--------|----------|
| lottery_1 | 2.5 | 彩票类游戏1 |
| lottery_2 | 3.0 | 彩票类游戏2 |
| lottery_3 | 4.5 | 彩票类游戏3 |
| slot_1 | 1.8 | 老虎机游戏1 |
| slot_2 | 2.2 | 老虎机游戏2 |
| poker_1 | 3.5 | 扑克游戏1 |
| poker_2 | 4.0 | 扑克游戏2 |

## 数据库表结构

### game_types 表
| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | int | 游戏类型ID |
| game_types_name | varchar | 游戏类型名称 |

### game_category 表
| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | int | 游戏分类ID |
| game_category_name | varchar | 游戏分类名称 |

### games 表（假设）
| 字段名 | 类型 | 描述 |
|--------|------|------|
| game_key | varchar | 游戏标识符 |
| odds | decimal | 赔率值 |

### sys_tenant 表
| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | bigint | 主键ID |
| organization | varchar | 组织标识-租户编码 |
| application | varchar | APP标识 |
| platform_name | varchar | 平台名称 |
| admin_id | bigint | 租户管理员主键 |
| account | varchar | 账号 |
| enabled | tinyint | 状态（0:=禁用; 1:=启用） |

## 实现文件

- **API实现**: `internal/app/fcgame/fcg_info.go`
- **路由注册**: `internal/app/web_router.go`
- **结构体定义**: `internal/app/fcgame/center.go`

## 注意事项

1. 该接口需要用户登录认证
2. 返回的数据格式为 JSON 对象，便于前端直接使用
3. 如果数据库中没有相应的数据，会返回空对象或默认数据
4. 赔率数据使用 float64 类型，可根据实际需求调整精度
5. 游戏类型和分类的 ID 在返回时会被转换为字符串格式

## 使用场景

1. **游戏大厅展示**：前端获取游戏类型和分类信息，用于游戏分类展示
2. **赔率显示**：在游戏详情页面显示当前游戏的赔率信息
3. **游戏配置**：用于前端动态配置游戏选项和过滤条件
4. **数据统计**：为其他接口提供基础的游戏分类数据
5. **组织选择**：前端获取可用的组织列表，用于用户切换或选择不同的租户环境
6. **多租户管理**：为管理员提供租户信息展示，支持多租户系统的管理功能
7. **平台标识**：用于前端显示不同平台的名称和标识信息

## 更新记录

- **2025-10-22**: 新增组织列表功能
  - 接口响应新增 tenants 字段，返回启用的租户信息
  - 支持查询租户的组织标识、APP标识、平台名称、管理员ID和账号
  - 租户列表按 ID 降序排列，只返回 enabled = 1 的租户
  - 更新接口文档，完善字段说明和使用场景

- **2025-10-18**: 创建接口文档
  - 实现获取游戏信息功能
  - 支持游戏类型、分类和赔率数据查询
  - 添加默认数据处理和错误处理
  - 完善接口文档和使用说明
